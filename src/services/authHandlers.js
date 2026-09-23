// --------------------------------------------------
// Auth handlers factory
// --------------------------------------------------

export function createAuthHandlers(
  authApiClient
) {
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
  // Login
  // ------------------------------------------------

  async function handleLogin({
    email,
    password,
    rememberMe,
    captchaToken,
  }) {
    const result = await login({
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

    return {
      success: true,

      user:
        result.user,

      authorizations:
        result.user?.portals || [],
    };
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

    const accessToken =
      result.accessToken;

    if (!accessToken) {
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

    return {
      success: true,

      user:
        meResult.user,

      authorizations:
        meResult.user?.portals || [],

      // TEMPORARY.
      // Proper browser session handling comes later.
      accessToken:
        result.accessToken,

      refreshToken:
        result.refreshToken,

      session:
        result.session,
    };
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
      setTimeout(resolve, 1000);
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
  // Public handlers
  // ------------------------------------------------

  return Object.freeze({
    handleLogin,
    handleVerifyTwoFactor,
    handleResendTwoFactor,
    handleForgotPassword,
  });
}