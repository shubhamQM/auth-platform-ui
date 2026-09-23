// --------------------------------------------------
// Auth API client
// --------------------------------------------------

export function createAuthApiClient({
  baseUrl,
} = {}) {
  const normalizedBaseUrl =
    typeof baseUrl === "string"
      ? baseUrl.trim().replace(/\/+$/, "")
      : "";

  if (!normalizedBaseUrl) {
    throw new Error(
      "Authentication API baseUrl is required"
    );
  }

  // ------------------------------------------------
  // Shared request helper
  // ------------------------------------------------

  async function request(
    path,
    {
      method = "GET",
      body,
      accessToken,
    } = {}
  ) {
    const headers = {};

    if (body !== undefined) {
      headers["Content-Type"] =
        "application/json";
    }

    if (accessToken) {
      headers.Authorization =
        `Bearer ${accessToken}`;
    }

    let response;

    try {
      response = await fetch(
        `${normalizedBaseUrl}${path}`,
        {
          method,
          headers,

          body:
            body !== undefined
              ? JSON.stringify(body)
              : undefined,
        }
      );
    } catch (error) {
      console.error(
        "Authentication API request failed:",
        error
      );

      return {
        success: false,
        code:
          "AUTH_SERVICE_UNAVAILABLE",
        message:
          "Unable to connect to the authentication service",
      };
    }

    let result;

    try {
      result =
        await response.json();
    } catch {
      return {
        success: false,
        code:
          "INVALID_AUTH_RESPONSE",
        message:
          "Authentication service returned an invalid response",
      };
    }

    if (!response.ok) {
      return {
        success: false,

        code:
          result?.code ||
          "AUTH_REQUEST_FAILED",

        message:
          result?.message ||
          "Authentication request failed",

        details:
          result?.details,
      };
    }

    return result;
  }

  // ------------------------------------------------
  // Login
  // ------------------------------------------------

  async function login({
    email,
    password,
    captchaToken,
  }) {
    return request(
      "/login",
      {
        method: "POST",

        body: {
          email,
          password,
          captchaToken,
        },
      }
    );
  }

  // ------------------------------------------------
  // Verify 2FA
  // ------------------------------------------------

  async function verifyTwoFactor({
    challengeId,
    emailCode,
    mobileCode,
  }) {
    return request(
      "/2fa/verify",
      {
        method: "POST",

        body: {
          challengeId,
          emailCode,
          mobileCode,
        },
      }
    );
  }

  // ------------------------------------------------
  // Resend 2FA
  // ------------------------------------------------

  async function resendTwoFactor({
    challengeId,
    channel,
  }) {
    return request(
      "/2fa/resend",
      {
        method: "POST",

        body: {
          challengeId,
          channel,
        },
      }
    );
  }

  // ------------------------------------------------
  // Current authenticated user
  // ------------------------------------------------

  async function getCurrentUser({
    accessToken,
  }) {
    return request(
      "/me",
      {
        accessToken,
      }
    );
  }

  // ------------------------------------------------
  // Refresh session
  // ------------------------------------------------

  async function refreshSession({
    refreshToken,
  }) {
    return request(
      "/refresh",
      {
        method: "POST",

        body: {
          refreshToken,
        },
      }
    );
  }

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------

  async function logout({
    refreshToken,
  }) {
    return request(
      "/logout",
      {
        method: "POST",

        body: {
          refreshToken,
        },
      }
    );
  }

  return Object.freeze({
    login,
    verifyTwoFactor,
    resendTwoFactor,
    getCurrentUser,
    refreshSession,
    logout,
  });
}