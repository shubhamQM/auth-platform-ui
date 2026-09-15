import { useState } from "react";

import { AUTH_STATES } from "./authStates";

function useAuthFlow() {
  const [authState, setAuthState] = useState(
    AUTH_STATES.IDLE
  );

  const [twoFactorData, setTwoFactorData] = useState(null);

  const startAuthentication = () => {
    setAuthState(AUTH_STATES.AUTHENTICATING);
  };

  const requireTwoFactor = (data) => {
    setTwoFactorData(data);
    setAuthState(AUTH_STATES.TWO_FACTOR_REQUIRED);
  };

  const startTwoFactorVerification = () => {
    setAuthState(AUTH_STATES.VERIFYING_2FA);
  };

  const completeAuthentication = () => {
    setAuthState(AUTH_STATES.AUTHENTICATED);
  };

  const resetAuthentication = () => {
    setAuthState(AUTH_STATES.IDLE);
    setTwoFactorData(null);
  };

  return {
    authState,
    twoFactorData,

    startAuthentication,
    requireTwoFactor,
    startTwoFactorVerification,
    completeAuthentication,
    resetAuthentication,
  };
}

export default useAuthFlow;