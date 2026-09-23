// --------------------------------------------------
// Auth handlers factory
// --------------------------------------------------

export function createAuthHandlers(
  authApiClient,
  authSession
) {
  // ------------------------------------------------
  // Validate API client
  // ------------------------------------------------

  if (
    !authApiClient ||
    typeof authApiClient !== "object"
  ) {
    throw new TypeError(
      "A valid authApiClient is required"
    );
  }

  const {
    login,
    verifyTwoFactor,
    resendTwoFactor,
    getCurrentUser,
  } = authApiClient;

  if (
    typeof login !== "function" ||
    typeof verifyTwoFactor !== "function" ||
    typeof resendTwoFactor !== "function" ||
    typeof getCurrentUser !== "function"
  ) {
    throw new TypeError(
      "authApiClient is missing required authentication methods"
    );
  }

  // ------------------------------------------------
  // Validate browser session
  // ------------------------------------------------

  if (
    !authSession ||
    typeof authSession !== "object" ||
    typeof authSession.setAuthentication !==
      "function" ||
    typeof authSession.restore !==
      "function" ||
    typeof authSession.logout !==
      "function"
  ) {
    throw new TypeError(
      "A valid authSession with setAuthentication, restore and logout is required"
    );
  }

  // ------------------------------------------------
  // Store authenticated session
  // ------------------------------------------------

  function storeAuthentication({
    accessToken,
    session,
    user,
  }) {
    if (
      typeof accessToken !== "string" ||
      !accessToken.trim()
    ) {
      return {
        success: false,

        code:
          "INVALID_AUTH_RESPONSE",

        error:
          "Authentication service did not return an access token",
      };
    }

    const authorizations =
      user?.portals || [];

    authSession.setAuthentication({
      accessToken,
      session,
      user,
      authorizations,
    });

    return {
      success: true,

      user,

      authorizations,

      session,
    };
  }

  // ------------------------------------------------
  // Login
  // ------------------------------------------------

  async function handleLogin({
    email,
    password,
    rememberMe,
    captchaToken,
  }) {
    // rememberMe is intentionally not forwarded yet.
    //
    // The backend currently owns the absolute session
    // lifetime. Remember-me semantics will be added
    // only when that contract is explicitly defined.

    void rememberMe;

    const result =
      await login({
        email,
        password,
        captchaToken,
      });

    if (!result.success) {
      return {
        success: false,

        code:
          result.code,

        error:
          result.message ||
          "Unable to sign in",
      };
    }

    // ----------------------------------------------
    // 2FA required
    // ----------------------------------------------

    if (
      result.requiresTwoFactor === true
    ) {
      return {
        success: true,

        requiresTwoFactor: true,

        challengeId:
          result.challengeId,

        mode:
          result.mode,

        expiresAt:
          result.expiresAt,

        // DEVELOPMENT ONLY
        developmentOtp:
          result.developmentOtp,
      };
    }

    // ----------------------------------------------
    // Future non-2FA compatibility
    // ----------------------------------------------

    return storeAuthentication({
      accessToken:
        result.accessToken,

      session:
        result.session,

      user:
        result.user,
    });
  }

  // ------------------------------------------------
  // Verify 2FA
  // ------------------------------------------------

  async function handleVerifyTwoFactor({
    challengeId,
    emailCode,
    mobileCode,
  }) {
    const result =
      await verifyTwoFactor({
        challengeId,
        emailCode,
        mobileCode,
      });

    if (!result.success) {
      return {
        success: false,

        code:
          result.code,

        error:
          result.message ||
          "Unable to verify authentication code",

        attemptsRemaining:
          result.details
            ?.attemptsRemaining,
      };
    }

    // ----------------------------------------------
    // Validate access token
    // ----------------------------------------------

    const accessToken =
      result.accessToken;

    if (
      typeof accessToken !== "string" ||
      !accessToken.trim()
    ) {
      return {
        success: false,

        code:
          "INVALID_AUTH_RESPONSE",

        error:
          "Authentication service did not return an access token",
      };
    }

    // ----------------------------------------------
    // Load authenticated user + portals
    // ----------------------------------------------

    const meResult =
      await getCurrentUser({
        accessToken,
      });

    if (!meResult.success) {
      return {
        success: false,

        code:
          meResult.code,

        error:
          meResult.message ||
          "Unable to load authenticated user",
      };
    }

    // ----------------------------------------------
    // Authentication completed
    // ----------------------------------------------

    return storeAuthentication({
      accessToken,

      session:
        result.session,

      user:
        meResult.user,
    });
  }

  // ------------------------------------------------
  // Resend 2FA
  // ------------------------------------------------

  async function handleResendTwoFactor({
    challengeId,
    channel,
  }) {
    const result =
      await resendTwoFactor({
        challengeId,
        channel,
      });

    if (!result.success) {
      return {
        success: false,

        code:
          result.code,

        error:
          result.message ||
          "Unable to resend verification code",

        resendsRemaining:
          result.details
            ?.resendsRemaining,
      };
    }

    return {
      success: true,

      message:
        result.message,

      challengeId:
        result.challengeId,

      mode:
        result.mode,

      channel:
        result.channel,

      expiresAt:
        result.expiresAt,

      resendCount:
        result.resendCount,

      resendsRemaining:
        result.resendsRemaining,

      // DEVELOPMENT ONLY
      developmentOtp:
        result.developmentOtp,
    };
  }

  // ------------------------------------------------
  // Restore Session
  //
  // On browser reload the access token is gone from
  // memory, but the HttpOnly refresh cookie may still
  // represent a valid backend session.
  //
  // authSession.restore() handles:
  //
  // - refresh
  // - new access token
  // - /me
  // - user
  // - portals
  // - session metadata
  // ------------------------------------------------

  async function handleRestoreSession() {
    const result =
      await authSession.restore();

    if (
      !result ||
      result.success !== true
    ) {
      return {
        success: false,

        code:
          result?.code ||
          "SESSION_RESTORE_FAILED",

        error:
          result?.error ||
          result?.message ||
          "Unable to restore authentication session",
      };
    }

    return {
      success: true,

      user:
        result.user,

      authorizations:
        result.authorizations || [],

      session:
        result.session || null,
    };
  }

  // ------------------------------------------------
  // Forgot password
  //
  // TEMPORARY MOCK.
  // Replace when backend forgot-password is
  // implemented.
  // ------------------------------------------------

  async function handleForgotPassword({
    email,
  }) {
    await new Promise((resolve) => {
      setTimeout(
        resolve,
        1000
      );
    });

    console.log(
      "Forgot password:",
      {
        email,
      }
    );

    return {
      success: true,

      message:
        "If an account exists with this email, password reset instructions have been sent.",
    };
  }

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------

  async function handleLogout() {
    const result =
      await authSession.logout();

    if (!result.success) {
      return {
        success: false,

        code:
          result.code,

        error:
          result.error ||
          result.message ||
          "Unable to complete logout",
      };
    }

    return {
      success: true,

      message:
        result.message ||
        "Logged out successfully",
    };
  }

  // ------------------------------------------------
  // Public handlers
  // ------------------------------------------------

  return Object.freeze({
    handleLogin,
    handleVerifyTwoFactor,
    handleResendTwoFactor,
    handleRestoreSession,
    handleForgotPassword,
    handleLogout,
  });
}