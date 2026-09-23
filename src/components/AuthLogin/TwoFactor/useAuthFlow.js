import { useState } from "react";

import { AUTH_STATES } from "./authStates";

function useAuthFlow() {
  const [authState, setAuthState] =
    useState(AUTH_STATES.IDLE);

  const [
    twoFactorData,
    setTwoFactorData,
  ] = useState(null);

  /*
   * Stores the final authenticated UI data.
   *
   * Authentication credentials are intentionally
   * NOT owned by this hook.
   *
   * Expected structure:
   *
   * {
   *   user: {
   *     userId: "...",
   *     orgCode: "...",
   *     ...
   *   },
   *
   *   authorizations: [
   *     {
   *       portalCode: "P-001",
   *       name: "Marketing Portal",
   *       websiteUrl: "https://...",
   *       description: "...",
   *       isActive: true
   *     }
   *   ]
   * }
   *
   * Access-token ownership belongs to the browser
   * session layer.
   *
   * Refresh-token ownership belongs to the browser's
   * HttpOnly cookie and is never exposed here.
   */

  const [
    authenticatedData,
    setAuthenticatedData,
  ] = useState(null);

  // --------------------------------------------------
  // Authentication Started
  // --------------------------------------------------

  const startAuthentication = () => {
    setAuthState(
      AUTH_STATES.AUTHENTICATING
    );
  };

  // --------------------------------------------------
  // Two Factor Required
  // --------------------------------------------------

  const requireTwoFactor = (data) => {
    setTwoFactorData(data);

    setAuthState(
      AUTH_STATES.TWO_FACTOR_REQUIRED
    );
  };

  // --------------------------------------------------
  // Two Factor Verification Started
  // --------------------------------------------------

  const startTwoFactorVerification = () => {
    setAuthState(
      AUTH_STATES.VERIFYING_2FA
    );
  };

  // --------------------------------------------------
  // Authentication Completed
  // --------------------------------------------------

  const completeAuthentication = (
    data = null
  ) => {
    setAuthenticatedData(data);

    setTwoFactorData(null);

    setAuthState(
      AUTH_STATES.AUTHENTICATED
    );
  };

  // --------------------------------------------------
  // Reset Authentication
  // --------------------------------------------------

  const resetAuthentication = () => {
    setAuthState(
      AUTH_STATES.IDLE
    );

    setTwoFactorData(null);

    setAuthenticatedData(null);
  };

  return {
    authState,
    twoFactorData,
    authenticatedData,

    startAuthentication,
    requireTwoFactor,
    startTwoFactorVerification,
    completeAuthentication,
    resetAuthentication,
  };
}

export default useAuthFlow;