import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";

import OTPInput from "./OTPInput";
import useTwoFactor from "./useTwoFactor";

function TwoFactor({
  config,
  twoFactorData,
  onVerifyTwoFactor,
  onResendTwoFactor,
  onComplete,
  onStartVerification,
  onVerificationFailed,
}) {
  const {
    texts,
    twoFactor,
  } = config;

  const {
    loading,
    resendLoading,
    error,
    emailCooldown,
    mobileCooldown,
    emailExpiresIn,
    mobileExpiresIn,
    emailAttempts,
    mobileAttempts,
    verify,
    resend,
    clearError,
  } = useTwoFactor({
    onVerifyTwoFactor,
    onResendTwoFactor,
    onComplete,
    resendCooldown:
      twoFactor.resend?.cooldown || 30,
    otpExpiresIn:
      twoFactor.otp?.expiresIn || 300,
    maxAttempts:
      twoFactor.otp?.maxAttempts || 5,
  });

  const [emailCode, setEmailCode] = useState("");
  const [mobileCode, setMobileCode] = useState("");

  const emailEnabled =
    twoFactor.methods?.email === true;

  const mobileEnabled =
    twoFactor.methods?.mobile === true;

  const requireAll =
    twoFactor.verification?.requireAll === true;

  const resendEnabled =
    twoFactor.resend?.enabled === true;

  const otpLength =
    twoFactor.otp?.length || 6;

  const maxAttempts =
    twoFactor.otp?.maxAttempts || 5;

  const emailComplete =
    emailCode.length === otpLength;

  const mobileComplete =
    mobileCode.length === otpLength;

  const emailExpired =
    emailEnabled &&
    emailExpiresIn === 0;

  const mobileExpired =
    mobileEnabled &&
    mobileExpiresIn === 0;

  const emailLocked =
    emailEnabled &&
    emailAttempts >= maxAttempts;

  const mobileLocked =
    mobileEnabled &&
    mobileAttempts >= maxAttempts;

  const emailUnavailable =
    emailExpired || emailLocked;

  const mobileUnavailable =
    mobileExpired || mobileLocked;

  const canVerify = requireAll
    ? (!emailEnabled ||
        (emailComplete &&
          !emailUnavailable)) &&
      (!mobileEnabled ||
        (mobileComplete &&
          !mobileUnavailable))
    : (emailEnabled &&
        emailComplete &&
        !emailUnavailable) ||
      (mobileEnabled &&
        mobileComplete &&
        !mobileUnavailable);

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  const getRemainingAttempts = (
    attempts
  ) => {
    return Math.max(
      maxAttempts - attempts,
      0
    );
  };

  const handleVerify = async () => {
    if (!canVerify || loading) {
      return;
    }

    clearError();

    onStartVerification?.();

    const result = await verify({
      challengeId: twoFactorData?.challengeId,
      emailCode: emailEnabled
        ? emailCode
        : "",
      mobileCode: mobileEnabled
        ? mobileCode
        : "",
    });

    if (!result?.success) {
      onVerificationFailed?.();
    }
  };

  const handleResend = async (channel) => {
    if (
      !resendEnabled ||
      resendLoading
    ) {
      return;
    }

    clearError();

    await resend({
      challengeId: twoFactorData?.challengeId,
      channel,
    });
  };

  const getResendLabel = (channel) => {
    const cooldown =
      channel === "email"
        ? emailCooldown
        : mobileCooldown;

    if (cooldown > 0) {
      return `Resend in ${cooldown}s`;
    }

    return texts.resendCode;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        align="center"
      >
        Two-Factor Verification
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
      >
        Enter the verification code sent to your
        registered contact details.
      </Typography>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {emailEnabled && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="subtitle2">
            {texts.emailOtpTitle}
          </Typography>

          <OTPInput
            value={emailCode}
            onChange={(value) => {
              setEmailCode(value);
              clearError();
            }}
            length={otpLength}
            disabled={
              loading ||
              emailUnavailable
            }
            autoFocus
          />

          <Typography
            variant="caption"
            color={
              emailExpired ||
              emailLocked
                ? "error"
                : "text.secondary"
            }
            align="right"
          >
            {emailExpired
              ? "Code expired"
              : emailLocked
              ? "Maximum attempts reached"
              : `Code expires in ${formatTime(
                  emailExpiresIn
                )}`}
          </Typography>

          {!emailExpired &&
            !emailLocked && (
              <Typography
                variant="caption"
                color="text.secondary"
                align="right"
              >
                Attempts remaining:{" "}
                {getRemainingAttempts(
                  emailAttempts
                )}
              </Typography>
            )}

          {resendEnabled && (
            <Button
              type="button"
              variant="text"
              onClick={() =>
                handleResend("email")
              }
              disabled={
                loading ||
                resendLoading ||
                emailCooldown > 0
              }
              sx={{
                alignSelf: "flex-end",
              }}
            >
              {getResendLabel("email")}
            </Button>
          )}
        </Box>
      )}

      {emailEnabled && mobileEnabled && (
        <Divider />
      )}

      {mobileEnabled && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="subtitle2">
            {texts.mobileOtpTitle}
          </Typography>

          <OTPInput
            value={mobileCode}
            onChange={(value) => {
              setMobileCode(value);
              clearError();
            }}
            length={otpLength}
            disabled={
              loading ||
              mobileUnavailable
            }
          />

          <Typography
            variant="caption"
            color={
              mobileExpired ||
              mobileLocked
                ? "error"
                : "text.secondary"
            }
            align="right"
          >
            {mobileExpired
              ? "Code expired"
              : mobileLocked
              ? "Maximum attempts reached"
              : `Code expires in ${formatTime(
                  mobileExpiresIn
                )}`}
          </Typography>

          {!mobileExpired &&
            !mobileLocked && (
              <Typography
                variant="caption"
                color="text.secondary"
                align="right"
              >
                Attempts remaining:{" "}
                {getRemainingAttempts(
                  mobileAttempts
                )}
              </Typography>
            )}

          {resendEnabled && (
            <Button
              type="button"
              variant="text"
              onClick={() =>
                handleResend("mobile")
              }
              disabled={
                loading ||
                resendLoading ||
                mobileCooldown > 0
              }
              sx={{
                alignSelf: "flex-end",
              }}
            >
              {getResendLabel("mobile")}
            </Button>
          )}
        </Box>
      )}

      <Button
        type="button"
        variant="contained"
        fullWidth
        onClick={handleVerify}
        disabled={!canVerify || loading}
      >
        {loading
          ? "Verifying..."
          : texts.verifyButton}
      </Button>
    </Box>
  );
}

export default TwoFactor;