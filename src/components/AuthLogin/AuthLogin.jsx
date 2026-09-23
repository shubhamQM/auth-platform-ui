import {
  CssBaseline,
  Paper,
  ThemeProvider,
} from "@mui/material";

import {
  normalizeConfig,
  validateConfig,
} from "../../config";

import {
  createAuthTheme,
} from "../../theme";

import AuthLayout from "./AuthLayout";
import BrandingPanel from "./BrandingPanel";
import LoginForm from "./LoginForm";

function AuthLogin({
  config = {},
  onLogin,
  onVerifyTwoFactor,
  onResendTwoFactor,
  onRestoreSession,
  onForgotPassword,
  onLogout,
}) {
  // --------------------------------------------------
  // Normalize consumer configuration
  // --------------------------------------------------

  const normalizedConfig =
    normalizeConfig(config);

  // --------------------------------------------------
  // Validate normalized configuration
  // --------------------------------------------------

  const validation =
    validateConfig(
      normalizedConfig
    );

  if (!validation.valid) {
    throw new Error(
      [
        "Invalid AuthLogin configuration:",
        ...validation.errors.map(
          (error) =>
            `- ${error}`,
        ),
      ].join("\n"),
    );
  }

  // --------------------------------------------------
  // Configuration sections
  // --------------------------------------------------

  const {
    branding,
    layout,
    theme,
  } = normalizedConfig;

  // --------------------------------------------------
  // Auth package theme
  // --------------------------------------------------

  const authTheme =
    createAuthTheme(
      theme
    );

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <ThemeProvider
      theme={authTheme}
    >
      <CssBaseline />

      <AuthLayout
        branding={
          <BrandingPanel
            branding={
              branding
            }
          />
        }
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth:
              layout.maxWidth,
            backgroundColor:
              "transparent",
          }}
        >
          <LoginForm
            config={
              normalizedConfig
            }
            onLogin={
              onLogin
            }
            onVerifyTwoFactor={
              onVerifyTwoFactor
            }
            onResendTwoFactor={
              onResendTwoFactor
            }
            onRestoreSession={
              onRestoreSession
            }
            onForgotPassword={
              onForgotPassword
            }
            onLogout={
              onLogout
            }
          />
        </Paper>
      </AuthLayout>
    </ThemeProvider>
  );
}

export default AuthLogin;