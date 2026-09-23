// --------------------------------------------------
// Browser authentication session
//
// Responsibilities:
// - Own the access token in JavaScript memory.
// - Own non-sensitive authenticated session metadata.
// - Own authenticated user/authorization metadata.
// - Refresh the access token through the Auth API.
// - Execute authenticated operations with a single
//   refresh/retry when the access token expires.
// - Coordinate secure logout.
// - Restore authentication after browser reload.
//
// Important:
// - Refresh tokens are NOT stored here.
// - Refresh tokens are owned by the browser through
//   the Auth API HttpOnly cookie.
// - Nothing is persisted to localStorage or
//   sessionStorage.
// --------------------------------------------------

export function createAuthSession(
  authApiClient
) {
  if (
    !authApiClient ||
    typeof authApiClient !== "object" ||
    typeof authApiClient.refreshSession !==
      "function" ||
    typeof authApiClient.getCurrentUser !==
      "function" ||
    typeof authApiClient.logout !==
      "function"
  ) {
    throw new TypeError(
      "A valid authApiClient with refreshSession, getCurrentUser and logout is required"
    );
  }

  let accessToken = null;

  let session = null;

  let user = null;

  let authorizations = [];

  // ------------------------------------------------
  // Refresh coordination
  // ------------------------------------------------

  let refreshPromise = null;

  // ------------------------------------------------
  // Restore coordination
  //
  // Multiple consumers may attempt to restore the
  // browser session during application startup.
  //
  // Only one restore operation should execute.
  // ------------------------------------------------

  let restorePromise = null;

  // ------------------------------------------------
  // Logout coordination
  // ------------------------------------------------

  let logoutPromise = null;

  // ------------------------------------------------
  // Set authenticated session
  // ------------------------------------------------

  function setAuthentication({
    accessToken: nextAccessToken,
    session: nextSession = null,
    user: nextUser = null,
    authorizations:
      nextAuthorizations = [],
  } = {}) {
    if (
      typeof nextAccessToken !==
        "string" ||
      !nextAccessToken.trim()
    ) {
      throw new TypeError(
        "A valid access token is required"
      );
    }

    accessToken =
      nextAccessToken;

    session =
      nextSession;

    user =
      nextUser;

    authorizations =
      Array.isArray(
        nextAuthorizations
      )
        ? [...nextAuthorizations]
        : [];
  }

  // ------------------------------------------------
  // Update access token
  // ------------------------------------------------

  function setAccessToken(
    nextAccessToken
  ) {
    if (
      typeof nextAccessToken !==
        "string" ||
      !nextAccessToken.trim()
    ) {
      throw new TypeError(
        "A valid access token is required"
      );
    }

    accessToken =
      nextAccessToken;
  }

  // ------------------------------------------------
  // Update session metadata
  // ------------------------------------------------

  function setSession(
    nextSession = null
  ) {
    session =
      nextSession;
  }

  // ------------------------------------------------
  // Update authenticated user
  // ------------------------------------------------

  function setUser(
    nextUser = null
  ) {
    user =
      nextUser;
  }

  // ------------------------------------------------
  // Update authorizations
  // ------------------------------------------------

  function setAuthorizations(
    nextAuthorizations = []
  ) {
    authorizations =
      Array.isArray(
        nextAuthorizations
      )
        ? [...nextAuthorizations]
        : [];
  }

  // ------------------------------------------------
  // Access token
  // ------------------------------------------------

  function getAccessToken() {
    return accessToken;
  }

  // ------------------------------------------------
  // Authentication status
  // ------------------------------------------------

  function isAuthenticated() {
    return Boolean(accessToken);
  }

  // ------------------------------------------------
  // Public session snapshot
  //
  // The access token is deliberately excluded.
  // ------------------------------------------------

  function getSnapshot() {
    return {
      authenticated:
        isAuthenticated(),

      session,

      user,

      authorizations:
        [...authorizations],
    };
  }

  // ------------------------------------------------
  // Clear local authentication state
  // ------------------------------------------------

  function clear() {
    accessToken = null;

    session = null;

    user = null;

    authorizations = [];
  }

  // ------------------------------------------------
  // Execute refresh
  // ------------------------------------------------

  async function executeRefresh() {
    const result =
      await authApiClient.refreshSession();

    if (
      !result ||
      result.success !== true
    ) {
      clear();

      return {
        success: false,

        code:
          result?.code ||
          "SESSION_REFRESH_FAILED",

        error:
          result?.message ||
          "Unable to refresh authentication session",
      };
    }

    if (
      typeof result.accessToken !==
        "string" ||
      !result.accessToken.trim()
    ) {
      clear();

      return {
        success: false,

        code:
          "INVALID_AUTH_RESPONSE",

        error:
          "Authentication service did not return an access token",
      };
    }

    setAccessToken(
      result.accessToken
    );

    if (result.session) {
      setSession(
        result.session
      );
    }

    return {
      success: true,

      session:
        result.session || session,
    };
  }

  // ------------------------------------------------
  // Refresh access token
  // ------------------------------------------------

  async function refresh() {
    if (logoutPromise) {
      return {
        success: false,

        code:
          "AUTHENTICATION_REQUIRED",

        error:
          "Authentication session is ending",
      };
    }

    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise =
      executeRefresh();

    try {
      return await refreshPromise;
    } finally {
      refreshPromise = null;
    }
  }

  // ------------------------------------------------
  // Execute authenticated operation
  //
  // If ACCESS_TOKEN_EXPIRED is returned:
  //
  // 1. Refresh.
  // 2. Replace the access token.
  // 3. Retry ONCE.
  // ------------------------------------------------

  async function executeAuthenticated(
    operation
  ) {
    if (
      typeof operation !== "function"
    ) {
      throw new TypeError(
        "Authenticated operation must be a function"
      );
    }

    if (logoutPromise) {
      return {
        success: false,

        code:
          "AUTHENTICATION_REQUIRED",

        message:
          "Authentication session is ending",
      };
    }

    if (!accessToken) {
      return {
        success: false,

        code:
          "AUTHENTICATION_REQUIRED",

        message:
          "Authentication is required",
      };
    }

    const firstResult =
      await operation({
        accessToken,
      });

    if (
      firstResult?.success === true
    ) {
      return firstResult;
    }

    if (
      firstResult?.code !==
      "ACCESS_TOKEN_EXPIRED"
    ) {
      return firstResult;
    }

    const refreshResult =
      await refresh();

    if (
      refreshResult.success !== true
    ) {
      return refreshResult;
    }

    return operation({
      accessToken,
    });
  }

  // ------------------------------------------------
  // Execute session restoration
  //
  // Browser reload removes the in-memory access
  // token but does not necessarily remove the
  // HttpOnly refresh cookie.
  //
  // Restore therefore:
  //
  // 1. Uses the refresh cookie to obtain a new
  //    access token.
  // 2. Loads /me using that new access token.
  // 3. Restores user and portal information.
  // ------------------------------------------------

  async function executeRestore() {
    if (logoutPromise) {
      return {
        success: false,

        code:
          "AUTHENTICATION_REQUIRED",

        error:
          "Authentication session is ending",
      };
    }

    // ----------------------------------------------
    // Already restored/authenticated.
    // ----------------------------------------------

    if (
      accessToken &&
      user
    ) {
      return {
        success: true,

        user,

        authorizations:
          [...authorizations],

        session,
      };
    }

    // ----------------------------------------------
    // Obtain a fresh access token using the
    // browser-managed HttpOnly refresh cookie.
    // ----------------------------------------------

    const refreshResult =
      await refresh();

    if (
      refreshResult.success !== true
    ) {
      return refreshResult;
    }

    const restoredAccessToken =
      getAccessToken();

    if (
      typeof restoredAccessToken !==
        "string" ||
      !restoredAccessToken.trim()
    ) {
      clear();

      return {
        success: false,

        code:
          "INVALID_AUTH_RESPONSE",

        error:
          "Authentication session could not be restored",
      };
    }

    // ----------------------------------------------
    // Load current user and portal access.
    // ----------------------------------------------

    const meResult =
      await authApiClient.getCurrentUser({
        accessToken:
          restoredAccessToken,
      });

    if (
      !meResult ||
      meResult.success !== true
    ) {
      clear();

      return {
        success: false,

        code:
          meResult?.code ||
          "SESSION_RESTORE_FAILED",

        error:
          meResult?.message ||
          "Unable to restore authenticated user",
      };
    }

    if (
      !meResult.user ||
      typeof meResult.user !== "object"
    ) {
      clear();

      return {
        success: false,

        code:
          "INVALID_AUTH_RESPONSE",

        error:
          "Authentication service did not return the authenticated user",
      };
    }

    const restoredUser =
      meResult.user;

    const restoredAuthorizations =
      restoredUser?.portals || [];

    // ----------------------------------------------
    // Rebuild browser session state.
    // ----------------------------------------------

    setAuthentication({
      accessToken:
        restoredAccessToken,

      session,

      user:
        restoredUser,

      authorizations:
        restoredAuthorizations,
    });

    return {
      success: true,

      user:
        restoredUser,

      authorizations:
        restoredAuthorizations,

      session,
    };
  }

  // ------------------------------------------------
  // Restore session
  //
  // Only one restore operation runs at a time.
  // ------------------------------------------------

  async function restore() {
    if (restorePromise) {
      return restorePromise;
    }

    restorePromise =
      executeRestore();

    try {
      return await restorePromise;
    } finally {
      restorePromise = null;
    }
  }

  // ------------------------------------------------
  // Execute logout
  //
  // If refresh is currently running, wait for it
  // before revoking the session.
  //
  // Local state is always cleared.
  // ------------------------------------------------

  async function executeLogout() {
    if (refreshPromise) {
      try {
        await refreshPromise;
      } catch {
        // Continue with logout.
      }
    }

    let result;

    try {
      result =
        await authApiClient.logout();
    } finally {
      clear();
    }

    if (
      !result ||
      result.success !== true
    ) {
      return {
        success: false,

        code:
          result?.code ||
          "LOGOUT_FAILED",

        error:
          result?.message ||
          "Unable to complete server logout",
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
  // Logout
  // ------------------------------------------------

  async function logout() {
    if (logoutPromise) {
      return logoutPromise;
    }

    logoutPromise =
      executeLogout();

    try {
      return await logoutPromise;
    } finally {
      logoutPromise = null;
    }
  }

  // ------------------------------------------------
  // Public API
  // ------------------------------------------------

  return Object.freeze({
    setAuthentication,
    setAccessToken,
    setSession,
    setUser,
    setAuthorizations,

    getAccessToken,
    getSnapshot,

    isAuthenticated,

    refresh,
    restore,
    executeAuthenticated,
    logout,

    clear,
  });
}