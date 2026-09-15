import { useState } from "react";

import { Box, Button, TextField } from "@mui/material";

import RememberMe from "../RememberMe";
import EmailField from "../Fields/EmailField";
import LoginError from "./LoginError";
import ForgotPassword, {
  ForgotPasswordForm,
} from "../ForgotPassword";
import Captcha from "../Captcha";
import PasswordField from "../Fields/PasswordField";
import TwoFactor from "../TwoFactor";
import useAuthFlow from "../TwoFactor/useAuthFlow";
import { AUTH_STATES } from "../TwoFactor/authStates";

function LoginForm({
  config,
  onLogin,
  onVerifyTwoFactor,
  onResendTwoFactor,
  onForgotPassword,
}) {
  const {
    fields,
    texts,
    behavior,
    login,
  } = config;

  const {
    authState,
    twoFactorData,
    startAuthentication,
    requireTwoFactor,
    startTwoFactorVerification,
    completeAuthentication,
  } = useAuthFlow();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  const validateForm = () => {
    const nextErrors = {
      email: "",
      password: "",
      form: "",
    };

    const normalizedEmail = email.trim();

    if (fields.email.enabled && fields.email.required) {
      if (!normalizedEmail) {
        nextErrors.email = "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail
        )
      ) {
        nextErrors.email = "Enter a valid email address";
      }
    }

    if (
      fields.password.enabled &&
      fields.password.required
    ) {
      if (!password) {
        nextErrors.password = "Password is required";
      }
    }

    setErrors(nextErrors);

    return (
      !nextErrors.email &&
      !nextErrors.password
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || !onLogin) {
      return;
    }

    setErrors({
      email: "",
      password: "",
      form: "",
    });

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    startAuthentication();

    try {
      const result = await onLogin({
        email: email.trim(),
        password,
        rememberMe,
        captchaToken,
      });

      if (result?.requiresTwoFactor) {
        requireTwoFactor({
          challengeId: result.challengeId,
          email: result.email || email.trim(),
          mobile: result.mobile || "",
        });

        return;
      }

      if (result?.success) {
        completeAuthentication();
        return;
      }

      if (result?.success === false) {
        setErrors({
          email: "",
          password: "",
          form:
            result.error ||
            texts.invalidCredentials,
        });

        if (behavior.clearPasswordOnError) {
          setPassword("");
        }
      }
    } catch (submissionError) {
      setErrors({
        email: "",
        password: "",
        form:
          submissionError?.message ||
          texts.invalidCredentials,
      });

      if (behavior.clearPasswordOnError) {
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    setErrors((current) => ({
      ...current,
      email: "",
      form: "",
    }));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);

    setErrors((current) => ({
      ...current,
      password: "",
      form: "",
    }));
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  const handleForgotPasswordSubmit = async (data) => {
    if (!onForgotPassword) {
      return {
        success: false,
        error: "Forgot password is not configured",
      };
    }

    return onForgotPassword(data);
  };

  const handleVerificationFailed = () => {
    if (!twoFactorData) {
      return;
    }

    requireTwoFactor(twoFactorData);
  };

  const disableSubmit =
    loading &&
    behavior.disableSubmitWhileLoading;

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        config={{
          label:
            fields.email.label || "Email",
          placeholder:
            fields.email.placeholder ||
            "Enter your email",
          submitLabel:
            texts.resetPassword ||
            "Send Reset Link",
          backLabel:
            texts.backToLogin ||
            "Back to Login",
        }}
        onSubmit={handleForgotPasswordSubmit}
        onBack={handleBackToLogin}
      />
    );
  }

 const isTwoFactorState =
  authState === AUTH_STATES.TWO_FACTOR_REQUIRED ||
  authState === AUTH_STATES.VERIFYING_2FA;

if (isTwoFactorState && twoFactorData) {
    return (
      <TwoFactor
        config={config}
        twoFactorData={twoFactorData}
        onVerifyTwoFactor={onVerifyTwoFactor}
        onResendTwoFactor={onResendTwoFactor}
        onComplete={completeAuthentication}
        onStartVerification={
          startTwoFactorVerification
        }
        onVerificationFailed={
          handleVerificationFailed
        }
      />
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <LoginError message={errors.form} />

      <EmailField
        value={email}
        onChange={handleEmailChange}
        config={fields.email}
        autoFocus={behavior.autoFocus}
        disabled={loading}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      {fields.password.enabled && (
        <>
          {login.passwordVisibility ? (
            <PasswordField
              value={password}
              onChange={handlePasswordChange}
              config={{
                ...fields.password,
                error: Boolean(errors.password),
                helperText: errors.password,
              }}
              disabled={loading}
            />
          ) : (
            <TextField
              fullWidth
              type="password"
              label={fields.password.label}
              placeholder={
                fields.password.placeholder
              }
              required={fields.password.required}
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          )}
        </>
      )}

      {login.forgotPassword && (
        <ForgotPassword
          config={{
            enabled:
              fields.forgotPassword?.enabled ??
              true,
            label: texts.forgotPassword,
          }}
          onClick={handleForgotPassword}
          disabled={loading}
        />
      )}

      <Captcha
        config={config.captcha}
        value={captchaToken}
        onChange={setCaptchaToken}
        disabled={loading}
      />

      {login.rememberMe && (
        <RememberMe
          checked={rememberMe}
          onChange={(event) =>
            setRememberMe(
              event.target.checked
            )
          }
          config={fields.rememberMe}
          disabled={loading}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={disableSubmit}
      >
        {loading
          ? "Loading..."
          : texts.loginButton}
      </Button>
    </Box>
  );
}

export default LoginForm;