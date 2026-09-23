// --------------------------------------------------
// Auth API client
// --------------------------------------------------

export function createAuthApiClient({
  baseUrl,
} = {}) {
  const normalizedBaseUrl =
    typeof baseUrl === "string"
      ? baseUrl
          .trim()
          .replace(/\/+$/, "")
      : "";

  if (!normalizedBaseUrl) {
    throw new Error(
      "Authentication API baseUrl is required"
    );
  }

  // ------------------------------------------------
  // Shared request helper
  //
  // credentials: "include" is required because the
  // Auth API manages the refresh token through an
  // HttpOnly cookie.
  //
  // JavaScript cannot read that cookie.
  // The browser receives and sends it automatically.
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

          credentials:
            "include",

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

        httpStatus:
          response.status,
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

        httpStatus:
          response.status,
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
  //
  // On successful verification the Auth API sends
  // the refresh token through Set-Cookie.
  //
  // Because request() uses credentials: "include",
  // the browser can accept that cookie.
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
  //
  // Access token remains a Bearer token.
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
  //
  // No refresh-token argument exists here.
  //
  // The browser automatically sends the HttpOnly
  // refresh cookie to the Auth API.
  // ------------------------------------------------

  async function refreshSession() {
    return request(
      "/refresh",
      {
        method: "POST",
      }
    );
  }

  // ------------------------------------------------
  // Logout
  //
  // No refresh-token argument exists here.
  //
  // The browser sends the HttpOnly refresh cookie.
  // The backend revokes the server-side session and
  // clears that cookie.
  // ------------------------------------------------

  async function logout() {
    return request(
      "/logout",
      {
        method: "POST",
      }
    );
  }

  // ------------------------------------------------
  // Public API
  // ------------------------------------------------

  return Object.freeze({
    login,
    verifyTwoFactor,
    resendTwoFactor,
    getCurrentUser,
    refreshSession,
    logout,
  });
}