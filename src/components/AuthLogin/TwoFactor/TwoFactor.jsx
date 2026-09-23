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

  const [emailCode, setEmailCode] =
    useState("");

  const [mobileCode, setMobileCode] =
    useState("");

  const emailEnabled =
    twoFactor.methods?.email === true;

  const mobileEnabled =
    twoFactor.methods?.mobile === true;

  const requireAll =
    twoFactor.verification?.requireAll ===
    true;

  const resendEnabled =
    twoFactor.resend?.enabled === true;

  const otpLength =
    twoFactor.otp?.length || 6;

  const numericOnly =
    twoFactor.otp?.numericOnly ?? true;

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
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const getRemainingAttempts = (
    attempts
  ) => {
    return Math.max(
      maxAttempts - attempts,
      0
    );
  };

  const getDescription = () => {
    if (
      emailEnabled &&
      mobileEnabled
    ) {
      return requireAll
        ? `Enter the ${otpLength}-digit codes sent to your registered email and mobile number.`
        : `Enter the ${otpLength}-digit code sent to your registered email or mobile number.`;
    }

    if (mobileEnabled) {
      return `Enter the ${otpLength}-digit code sent to your registered mobile number.`;
    }

    return `Enter the ${otpLength}-digit code sent to your registered email.`;
  };

  const handleVerify = async () => {
    if (!canVerify || loading) {
      return;
    }

    clearError();

    onStartVerification?.();

    const result = await verify({
      challengeId:
        twoFactorData?.challengeId,

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

  const handleResend = async (
    channel
  ) => {
    if (
      !resendEnabled ||
      resendLoading
    ) {
      return;
    }

    clearError();

    await resend({
      challengeId:
        twoFactorData?.challengeId,

      channel,
    });
  };

  const getResendLabel = (
    channel
  ) => {
    const cooldown =
      channel === "email"
        ? emailCooldown
        : mobileCooldown;

    if (cooldown > 0) {
      return `Resend in ${cooldown}s`;
    }

    return texts.resendCode;
  };

  const renderStatus = ({
    expired,
    locked,
    expiresIn,
    attempts,
  }) => {
    if (expired) {
      return (
        <Typography
          variant="caption"
          color="error"
        >
          Code expired
        </Typography>
      );
    }

    if (locked) {
      return (
        <Typography
          variant="caption"
          color="error"
        >
          Maximum attempts reached
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.25,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Code expires in{" "}
          {formatTime(expiresIn)}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Attempts remaining:{" "}
          {getRemainingAttempts(
            attempts
          )}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          marginBottom: 3.5,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
            },

            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",

            color: "text.primary",

            marginBottom: 1,
          }}
        >
          Two-Factor Verification
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.6,
            fontSize: "0.84rem",
          }}
        >
          {getDescription()}
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{
            marginBottom: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Email OTP */}
      {emailEnabled && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom:
              mobileEnabled
                ? 2.5
                : 3,
          }}
        >
          {/* Show channel heading only
              when both channels exist */}
          {emailEnabled &&
            mobileEnabled && (
              <Typography
                sx={{
                  fontSize:
                    "0.84rem",

                  fontWeight: 700,

                  color:
                    "text.primary",

                  marginBottom: 1.25,
                }}
              >
                Email Verification
              </Typography>
            )}

          <OTPInput
            value={emailCode}
            onChange={(value) => {
              setEmailCode(value);
              clearError();
            }}
            length={otpLength}
            numericOnly={numericOnly}
            label="Verification Code"
            disabled={
              loading ||
              emailUnavailable
            }
            error={
              emailExpired ||
              emailLocked
            }
            autoFocus
          />

          {/* OTP Status + Resend */}
          <Box
            sx={{
              marginTop: 1.25,

              display: "flex",
              alignItems:
                "flex-start",
              justifyContent:
                "space-between",

              gap: 2,
            }}
          >
            {renderStatus({
              expired: emailExpired,
              locked: emailLocked,
              expiresIn:
                emailExpiresIn,
              attempts:
                emailAttempts,
            })}

            {resendEnabled && (
              <Button
                type="button"
                variant="text"
                onClick={() =>
                  handleResend(
                    "email"
                  )
                }
                disabled={
                  loading ||
                  resendLoading ||
                  emailCooldown > 0
                }
                sx={{
                  minWidth: "auto",
                  padding: 0,

                  fontSize:
                    "0.75rem",
                  fontWeight: 600,

                  textTransform:
                    "none",
                }}
              >
                {getResendLabel(
                  "email"
                )}
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Separator only when both are enabled */}
      {emailEnabled &&
        mobileEnabled && (
          <Divider
            sx={{
              marginBottom: 2.5,
            }}
          />
        )}

      {/* Mobile OTP */}
      {mobileEnabled && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 3,
          }}
        >
          {emailEnabled &&
            mobileEnabled && (
              <Typography
                sx={{
                  fontSize:
                    "0.84rem",

                  fontWeight: 700,

                  color:
                    "text.primary",

                  marginBottom: 1.25,
                }}
              >
                Mobile Verification
              </Typography>
            )}

          <OTPInput
            value={mobileCode}
            onChange={(value) => {
              setMobileCode(value);
              clearError();
            }}
            length={otpLength}
            numericOnly={numericOnly}
            label="Verification Code"
            disabled={
              loading ||
              mobileUnavailable
            }
            error={
              mobileExpired ||
              mobileLocked
            }
          />

          {/* OTP Status + Resend */}
          <Box
            sx={{
              marginTop: 1.25,

              display: "flex",
              alignItems:
                "flex-start",
              justifyContent:
                "space-between",

              gap: 2,
            }}
          >
            {renderStatus({
              expired:
                mobileExpired,

              locked:
                mobileLocked,

              expiresIn:
                mobileExpiresIn,

              attempts:
                mobileAttempts,
            })}

            {resendEnabled && (
              <Button
                type="button"
                variant="text"
                onClick={() =>
                  handleResend(
                    "mobile"
                  )
                }
                disabled={
                  loading ||
                  resendLoading ||
                  mobileCooldown > 0
                }
                sx={{
                  minWidth: "auto",
                  padding: 0,

                  fontSize:
                    "0.75rem",
                  fontWeight: 600,

                  textTransform:
                    "none",
                }}
              >
                {getResendLabel(
                  "mobile"
                )}
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Verify */}
      <Button
        type="button"
        variant="contained"
        fullWidth
        onClick={handleVerify}
        disabled={
          !canVerify || loading
        }
        sx={{
          height: 42,
          borderRadius: "6px",

          fontSize: "0.84rem",
          fontWeight: 700,
          textTransform: "none",

          boxShadow:
            "0 6px 14px rgba(99, 70, 229, 0.22)",

          "&:hover": {
            boxShadow:
              "0 8px 18px rgba(99, 70, 229, 0.28)",
          },
        }}
      >
        {loading
          ? "Verifying..."
          : texts.verifyButton}
      </Button>
    </Box>
  );
}

export default TwoFactor;