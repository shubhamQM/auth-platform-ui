import {
  AuthLogin,
} from "./index";

import {
  createAuthApiClient,
} from "./services/authApi";

import {
  createAuthHandlers,
} from "./services/authHandlers";

import {
  createAuthSession,
} from "./services/authSession";

// --------------------------------------------------
// Demo / development configuration
//
// A consuming portal supplies only the configuration
// values it wants to override.
//
// AuthLogin is responsible for applying defaults
// and validating the final configuration.
// --------------------------------------------------

const config = {
  api: {
    baseUrl:
      "http://localhost:5000/api/auth",
  },
};

// --------------------------------------------------
// Isolated API client
//
// The API client only needs the API configuration
// required to communicate with the Auth API.
// --------------------------------------------------

const authApiClient =
  createAuthApiClient({
    baseUrl:
      config.api.baseUrl,
  });

// --------------------------------------------------
// Browser authentication session
//
// This is the single in-memory owner of the access
// token for this application instance.
//
// It also coordinates:
// - access-token refresh
// - authenticated request retry
// - session restoration
// - logout
//
// Refresh tokens are NOT stored here.
// They remain in the browser-managed HttpOnly cookie.
// --------------------------------------------------

const authSession =
  createAuthSession(
    authApiClient
  );

// --------------------------------------------------
// UI ↔ API handlers
//
// The same authSession instance is injected into the
// handlers so successful authentication can establish
// and restore the browser session without exposing
// the access token to UI components.
// --------------------------------------------------

const {
  handleLogin,
  handleVerifyTwoFactor,
  handleResendTwoFactor,
  handleRestoreSession,
  handleForgotPassword,
  handleLogout,
} = createAuthHandlers(
  authApiClient,
  authSession,
);

// --------------------------------------------------
// Demo application
// --------------------------------------------------

function App() {
  return (
    <AuthLogin
      config={config}
      onLogin={
        handleLogin
      }
      onVerifyTwoFactor={
        handleVerifyTwoFactor
      }
      onResendTwoFactor={
        handleResendTwoFactor
      }
      onRestoreSession={
        handleRestoreSession
      }
      onForgotPassword={
        handleForgotPassword
      }
      onLogout={
        handleLogout
      }
    />
  );
}

export default App;