import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

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

import {
  AUTH_STATES,
} from "../TwoFactor/authStates";

import AuthLanding from "../../AuthLanding/AuthLanding";

function LoginForm({
  config,
  onLogin,
  onVerifyTwoFactor,
  onResendTwoFactor,
  onRestoreSession,
  onForgotPassword,
  onLogout,
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
    authenticatedData,
    startAuthentication,
    requireTwoFactor,
    startTwoFactorVerification,
    completeAuthentication,
    resetAuthentication,
  } = useAuthFlow();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    rememberMe,
    setRememberMe,
  ] = useState(false);

  /*
   * CAPTCHA token intentionally uses a ref.
   *
   * Using state here causes LoginForm to re-render
   * when Google returns the token, which can reset
   * the reCAPTCHA checkbox.
   */

  const captchaTokenRef =
    useRef("");

  // --------------------------------------------------
  // Session restoration references
  //
  // Restore should run once when the authentication
  // UI mounts.
  //
  // Refs prevent the restore effect from being tied
  // to changing function identities during renders.
  // --------------------------------------------------

  const restoreSessionRef =
    useRef(onRestoreSession);

  const completeAuthenticationRef =
    useRef(
      completeAuthentication
    );

  restoreSessionRef.current =
    onRestoreSession;

  completeAuthenticationRef.current =
    completeAuthentication;

  const [
    restoringSession,
    setRestoringSession,
  ] = useState(
    typeof onRestoreSession ===
      "function"
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    logoutLoading,
    setLogoutLoading,
  ] = useState(false);

  const [
    showForgotPassword,
    setShowForgotPassword,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState({
    email: "",
    password: "",
    captcha: "",
    form: "",
  });

  // --------------------------------------------------
  // Restore Existing Browser Session
  //
  // The access token is intentionally memory-only,
  // so it disappears after a browser refresh.
  //
  // The HttpOnly refresh cookie may still represent
  // a valid backend session.
  //
  // onRestoreSession performs:
  //
  // refresh cookie
  //      ↓
  // new access token
  //      ↓
  // GET /me
  //      ↓
  // user + portal authorizations
  //
  // Failed restoration is intentionally silent.
  // A visitor without an existing session should
  // simply see the normal login screen.
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    const restoreHandler =
      restoreSessionRef.current;

    if (
      typeof restoreHandler !==
      "function"
    ) {
      setRestoringSession(false);

      return () => {
        active = false;
      };
    }

    const restoreSession =
      async () => {
        try {
          const result =
            await restoreHandler();

          if (!active) {
            return;
          }

          if (
            result?.success === true
          ) {
            completeAuthenticationRef
              .current({
                user:
                  result.user ||
                  null,

                authorizations:
                  result.authorizations ||
                  [],
              });
          }
        } catch {
          // ------------------------------------------
          // Do not display an error here.
          //
          // No refresh cookie / expired session is a
          // normal condition for the login screen.
          // ------------------------------------------
        } finally {
          if (active) {
            setRestoringSession(
              false
            );
          }
        }
      };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // --------------------------------------------------
  // Form Validation
  // --------------------------------------------------

  const validateForm = () => {
    const nextErrors = {
      email: "",
      password: "",
      captcha: "",
      form: "",
    };

    const normalizedEmail =
      email.trim();

    // Email validation

    if (
      fields.email.enabled &&
      fields.email.required
    ) {
      if (!normalizedEmail) {
        nextErrors.email =
          "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail
        )
      ) {
        nextErrors.email =
          "Enter a valid email address";
      }
    }

    // Password validation

    if (
      fields.password.enabled &&
      fields.password.required
    ) {
      if (!password) {
        nextErrors.password =
          "Password is required";
      }
    }

    // CAPTCHA validation

    if (
      config.captcha?.enabled &&
      !captchaTokenRef.current
    ) {
      nextErrors.captcha =
        "Please complete the CAPTCHA";
    }

    setErrors(nextErrors);

    return (
      !nextErrors.email &&
      !nextErrors.password &&
      !nextErrors.captcha
    );
  };

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        loading ||
        !onLogin
      ) {
        return;
      }

      const isValid =
        validateForm();

      if (!isValid) {
        return;
      }

      setLoading(true);

      startAuthentication();

      try {
        const result =
          await onLogin({
            email:
              email.trim(),

            password,

            rememberMe,

            // Send CAPTCHA token to
            // consumer/backend.
            captchaToken:
              captchaTokenRef.current,
          });

        // ------------------------------------------------
        // Two Factor Required
        // ------------------------------------------------

        if (
          result?.requiresTwoFactor
        ) {
          requireTwoFactor({
            challengeId:
              result.challengeId,

            email:
              result.email ||
              email.trim(),

            mobile:
              result.mobile || "",
          });

          return;
        }

        // ------------------------------------------------
        // Login Successful
        // ------------------------------------------------

        if (result?.success) {
          completeAuthentication({
            user:
              result.user ||
              null,

            authorizations:
              result.authorizations ||
              [],
          });

          return;
        }

        // ------------------------------------------------
        // Login Failed
        // ------------------------------------------------

        if (
          result?.success === false
        ) {
          setErrors({
            email: "",
            password: "",
            captcha: "",

            form:
              result.error ||
              texts.invalidCredentials,
          });

          if (
            behavior
              .clearPasswordOnError
          ) {
            setPassword("");
          }
        }
      } catch (
        submissionError
      ) {
        setErrors({
          email: "",
          password: "",
          captcha: "",

          form:
            submissionError
              ?.message ||
            texts.invalidCredentials,
        });

        if (
          behavior
            .clearPasswordOnError
        ) {
          setPassword("");
        }
      } finally {
        setLoading(false);
      }
    };

  // --------------------------------------------------
  // Field Handlers
  // --------------------------------------------------

  const handleEmailChange =
    (event) => {
      setEmail(
        event.target.value
      );

      setErrors(
        (current) => ({
          ...current,

          email: "",
          form: "",
        })
      );
    };

  const handlePasswordChange =
    (event) => {
      setPassword(
        event.target.value
      );

      setErrors(
        (current) => ({
          ...current,

          password: "",
          form: "",
        })
      );
    };

  // --------------------------------------------------
  // CAPTCHA
  // --------------------------------------------------

  const handleCaptchaChange =
    (token) => {
      /*
       * Do NOT call setState here.
       *
       * Keeping the token inside a ref prevents
       * Google's checkbox from being reset after
       * successful verification.
       */

      captchaTokenRef.current =
        token || "";
    };

  // --------------------------------------------------
  // Forgot Password
  // --------------------------------------------------

  const handleForgotPassword =
    () => {
      setShowForgotPassword(
        true
      );
    };

  const handleBackToLogin =
    () => {
      setShowForgotPassword(
        false
      );
    };

  const handleForgotPasswordSubmit =
    async (data) => {
      if (
        !onForgotPassword
      ) {
        return {
          success: false,

          error:
            "Forgot password is not configured",
        };
      }

      return onForgotPassword(
        data
      );
    };

  // --------------------------------------------------
  // Logout
  //
  // authSession.logout() clears the in-memory
  // authentication state regardless of whether the
  // server logout request succeeds.
  //
  // Therefore the UI also returns to the login state
  // after the logout attempt.
  // --------------------------------------------------

  const handleLogout =
    async () => {
      if (logoutLoading) {
        return {
          success: false,

          code:
            "LOGOUT_IN_PROGRESS",

          error:
            "Logout is already in progress",
        };
      }

      if (!onLogout) {
        return {
          success: false,

          code:
            "LOGOUT_NOT_CONFIGURED",

          error:
            "Logout is not configured",
        };
      }

      setLogoutLoading(true);

      try {
        const result =
          await onLogout();

        // ----------------------------------------------
        // The session service has cleared its local
        // authentication state by this point.
        //
        // Keep the UI state synchronized with it.
        // ----------------------------------------------

        resetAuthentication();

        setPassword("");

        setRememberMe(false);

        setShowForgotPassword(
          false
        );

        captchaTokenRef.current =
          "";

        if (
          result?.success === false
        ) {
          setErrors({
            email: "",
            password: "",
            captcha: "",

            form:
              result.error ||
              result.message ||
              "Unable to complete server logout",
          });

          return result;
        }

        setErrors({
          email: "",
          password: "",
          captcha: "",
          form: "",
        });

        return {
          success: true,

          message:
            result?.message ||
            "Logged out successfully",
        };
      } catch (
        logoutError
      ) {
        // ----------------------------------------------
        // authSession.logout() clears local memory in
        // its finally path, so reset the UI as well.
        // ----------------------------------------------

        resetAuthentication();

        setPassword("");

        setRememberMe(false);

        setShowForgotPassword(
          false
        );

        captchaTokenRef.current =
          "";

        const errorMessage =
          logoutError?.message ||
          "Unable to complete logout";

        setErrors({
          email: "",
          password: "",
          captcha: "",

          form:
            errorMessage,
        });

        return {
          success: false,

          code:
            "LOGOUT_FAILED",

          error:
            errorMessage,
        };
      } finally {
        setLogoutLoading(false);
      }
    };

  // --------------------------------------------------
  // Two Factor
  // --------------------------------------------------

  const handleVerificationFailed =
    () => {
      if (!twoFactorData) {
        return;
      }

      requireTwoFactor(
        twoFactorData
      );
    };

  const disableSubmit =
    loading &&
    behavior
      .disableSubmitWhileLoading;

  // --------------------------------------------------
  // Restoring Existing Session
  //
  // Do not briefly render the login form while the
  // browser still has a valid authentication session.
  // --------------------------------------------------

  if (restoringSession) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 220,

          display: "flex",
          flexDirection:
            "column",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap: 2,
        }}
      >
        <CircularProgress
          size={28}
        />

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Restoring your session...
        </Typography>
      </Box>
    );
  }

  // --------------------------------------------------
  // Forgot Password Screen
  // --------------------------------------------------

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        config={{
          label:
            fields.email.label ||
            "Email",

          placeholder:
            fields.email
              .placeholder ||
            "Enter your email",

          submitLabel:
            texts.resetPassword ||
            "Send Reset Link",

          backLabel:
            texts.backToLogin ||
            "Back to Login",
        }}
        onSubmit={
          handleForgotPasswordSubmit
        }
        onBack={
          handleBackToLogin
        }
      />
    );
  }

  // --------------------------------------------------
  // Authenticated Landing
  // --------------------------------------------------

  if (
    authState ===
      AUTH_STATES.AUTHENTICATED &&
    authenticatedData
  ) {
    return (
      <AuthLanding
        user={
          authenticatedData.user
        }
        authorizations={
          authenticatedData
            .authorizations
        }
        onLogout={
          handleLogout
        }
        logoutLoading={
          logoutLoading
        }
      />
    );
  }

  // --------------------------------------------------
  // Two Factor Screen
  // --------------------------------------------------

  const isTwoFactorState =
    authState ===
      AUTH_STATES
        .TWO_FACTOR_REQUIRED ||
    authState ===
      AUTH_STATES
        .VERIFYING_2FA;

  if (
    isTwoFactorState &&
    twoFactorData
  ) {
    return (
      <TwoFactor
        config={config}
        twoFactorData={
          twoFactorData
        }
        onVerifyTwoFactor={
          onVerifyTwoFactor
        }
        onResendTwoFactor={
          onResendTwoFactor
        }
        onComplete={
          completeAuthentication
        }
        onStartVerification={
          startTwoFactorVerification
        }
        onVerificationFailed={
          handleVerificationFailed
        }
      />
    );
  }

  // --------------------------------------------------
  // Login Screen
  // --------------------------------------------------

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
      }}
    >
      {/* Login Header */}

      <Box
        sx={{
          marginBottom: 4,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: {
              xs: "1.75rem",
              sm: "2rem",
            },

            fontWeight: 800,

            lineHeight: 1.2,

            letterSpacing:
              "-0.03em",

            color:
              "text.primary",

            marginBottom: 1,
          }}
        >
          {login.title ||
            "Welcome Back"}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color:
              "text.secondary",

            lineHeight: 1.6,
          }}
        >
          {login.subtitle ||
            "Sign-in to your account to continue"}
        </Typography>
      </Box>

      {/* Login Form */}

      <Box
        component="form"
        onSubmit={
          handleSubmit
        }
        noValidate
        sx={{
          display: "flex",

          flexDirection:
            "column",

          gap: 1.75,
        }}
      >
        <LoginError
          message={
            errors.form
          }
        />

        {/* Email */}

        <EmailField
          value={email}
          onChange={
            handleEmailChange
          }
          config={
            fields.email
          }
          autoFocus={
            behavior.autoFocus
          }
          disabled={loading}
          error={Boolean(
            errors.email
          )}
          helperText={
            errors.email
          }
        />

        {/* Password */}

        {fields.password
          .enabled && (
          <>
            {login.passwordVisibility ? (
              <PasswordField
                value={
                  password
                }
                onChange={
                  handlePasswordChange
                }
                config={{
                  ...fields.password,

                  error:
                    Boolean(
                      errors.password
                    ),

                  helperText:
                    errors.password,
                }}
                disabled={
                  loading
                }
              />
            ) : (
              <TextField
                fullWidth
                type="password"
                label={
                  fields.password
                    .label
                }
                placeholder={
                  fields.password
                    .placeholder
                }
                required={
                  fields.password
                    .required
                }
                value={
                  password
                }
                onChange={
                  handlePasswordChange
                }
                disabled={
                  loading
                }
                error={Boolean(
                  errors.password
                )}
                helperText={
                  errors.password
                }
              />
            )}
          </>
        )}

        {/* Remember Me */}

        {login.rememberMe && (
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              minHeight:
                36,
            }}
          >
            <RememberMe
              checked={
                rememberMe
              }
              onChange={(
                event
              ) =>
                setRememberMe(
                  event.target
                    .checked
                )
              }
              config={
                fields.rememberMe
              }
              disabled={
                loading
              }
            />
          </Box>
        )}

        {/* CAPTCHA */}

        <Captcha
          config={
            config.captcha
          }
          onChange={
            handleCaptchaChange
          }
          error={
            errors.captcha
          }
          disabled={loading}
        />

        {/* Sign In */}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={
            disableSubmit
          }
          sx={{
            height: 42,

            borderRadius:
              "6px",

            fontSize:
              "0.84rem",

            fontWeight: 700,

            textTransform:
              "none",

            boxShadow:
              "0 6px 14px rgba(99, 70, 229, 0.22)",

            "&:hover": {
              boxShadow:
                "0 8px 18px rgba(99, 70, 229, 0.28)",
            },
          }}
        >
          {loading
            ? "Signing in..."
            : texts.loginButton}
        </Button>

        {/* Forgot Password */}

        {login.forgotPassword && (
          <Box
            sx={{
              display:
                "flex",

              justifyContent:
                "center",

              marginTop:
                -0.5,
            }}
          >
            <ForgotPassword
              config={{
                enabled:
                  fields
                    .forgotPassword
                    ?.enabled ??
                  true,

                label:
                  texts
                    .forgotPassword,
              }}
              onClick={
                handleForgotPassword
              }
              disabled={
                loading
              }
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default LoginForm;