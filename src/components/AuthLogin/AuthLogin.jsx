import {
  CssBaseline,
  Paper,
  ThemeProvider,
} from "@mui/material";

import { normalizeConfig } from "../../config";
import { createAuthTheme } from "../../theme";
import AuthLayout from "./AuthLayout";
import BrandingPanel from "./BrandingPanel";
import LoginForm from "./LoginForm";

function AuthLogin({
  config = {},
  onLogin,
  onVerifyTwoFactor,
  onResendTwoFactor,
  onForgotPassword,
}) {
  const normalizedConfig =
    normalizeConfig(config);

  const {
    branding,
    layout,
    theme,
  } = normalizedConfig;

  const authTheme =
    createAuthTheme(theme);

  return (
    <ThemeProvider theme={authTheme}>
     <CssBaseline />
      <AuthLayout
        branding={
          <BrandingPanel
            branding={branding}
          />
        }
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: layout.maxWidth,
            backgroundColor:
              "transparent",
          }}
        >
          <LoginForm
            config={normalizedConfig}
            onLogin={onLogin}
            onVerifyTwoFactor={
              onVerifyTwoFactor
            }
            onResendTwoFactor={
              onResendTwoFactor
            }
            onForgotPassword={
              onForgotPassword
            }
          />
        </Paper>
      </AuthLayout>
    </ThemeProvider>
  );
}

export default AuthLogin;