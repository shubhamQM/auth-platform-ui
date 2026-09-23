import { useState } from "react";

import { AUTH_STATES } from "./authStates";

function useAuthFlow() {
  const [authState, setAuthState] = useState(
    AUTH_STATES.IDLE
  );

  const [twoFactorData, setTwoFactorData] =
    useState(null);

  /*
   * Stores the final authenticated result.
   *
   * Expected structure:
   *
   * {
   *   user: {
   *     userId: "...",
   *     name: "..."
   *   },
   *   authorizations: [
   *     {
   *       id: "...",
   *       label: "...",
   *       url: "..."
   *     }
   *   ]
   * }
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
    setAuthState(AUTH_STATES.IDLE);

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