import {
  AuthLogin,
  normalizeConfig,
} from "./index";

import {
  createAuthApiClient,
} from "./services/authApi";

import {
  createAuthHandlers,
} from "./services/authHandlers";

// --------------------------------------------------
// Demo / development configuration
//
// A consuming portal will eventually supply its own
// configuration.
// --------------------------------------------------

const config = normalizeConfig({
  api: {
    baseUrl:
      "http://localhost:5000/api/auth",
  },
});

// --------------------------------------------------
// Isolated API client
// --------------------------------------------------

const authApiClient =
  createAuthApiClient({
    baseUrl:
      config.api.baseUrl,
  });

// --------------------------------------------------
// UI ↔ API handlers
// --------------------------------------------------

const {
  handleLogin,
  handleVerifyTwoFactor,
  handleResendTwoFactor,
  handleForgotPassword,
} = createAuthHandlers(
  authApiClient
);

// --------------------------------------------------
// Demo application
// --------------------------------------------------

function App() {
  return (
    <AuthLogin
      config={config}
      onLogin={handleLogin}
      onVerifyTwoFactor={
        handleVerifyTwoFactor
      }
      onResendTwoFactor={
        handleResendTwoFactor
      }
      onForgotPassword={
        handleForgotPassword
      }
    />
  );
}

export default App;