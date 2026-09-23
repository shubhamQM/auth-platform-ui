import {
  Box,
  Button,
  Typography,
} from "@mui/material";

function AuthLanding({
  user,
  authorizations = [],
  onPortalSelect,
  onLogout,
  logoutLoading = false,
}) {
  // --------------------------------------------------
  // Portal Selection
  // --------------------------------------------------

  const handlePortalClick = (portal) => {
    if (onPortalSelect) {
      onPortalSelect(portal);
    }

    if (portal?.websiteUrl) {
      window.location.assign(
        portal.websiteUrl,
      );
    }
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogoutClick =
    async () => {
      if (
        logoutLoading ||
        !onLogout
      ) {
        return;
      }

      await onLogout();
    };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Box>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent:
            "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            component="h1"
            variant="h4"
          >
            Welcome
            {user?.firstName
              ? `, ${user.firstName}`
              : ""}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              marginTop: 0.75,
            }}
          >
            Access your workspace by selecting
            a module below
          </Typography>
        </Box>

        {/* Logout */}

        {onLogout && (
          <Button
            type="button"
            variant="outlined"
            disabled={
              logoutLoading
            }
            onClick={
              handleLogoutClick
            }
            sx={{
              minWidth: 110,
              textTransform: "none",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {logoutLoading
              ? "Logging out..."
              : "Logout"}
          </Button>
        )}
      </Box>

      {/* Portal Grid */}

      <Box
        sx={{
          marginTop: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 2,
        }}
      >
        {authorizations.map(
          (portal) => (
            <Box
              key={
                portal.portalCode
              }
              component="button"
              type="button"
              onClick={() =>
                handlePortalClick(
                  portal
                )
              }
              disabled={
                logoutLoading
              }
              sx={{
                minHeight: 150,

                border: 0,

                borderRadius:
                  "12px",

                cursor:
                  logoutLoading
                    ? "default"
                    : "pointer",

                textAlign:
                  "left",

                padding: 3,

                backgroundColor:
                  "primary.main",

                color:
                  "primary.contrastText",

                font: "inherit",

                display: "flex",

                flexDirection:
                  "column",

                alignItems:
                  "flex-start",

                justifyContent:
                  "center",

                opacity:
                  logoutLoading
                    ? 0.7
                    : 1,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize:
                    "1rem",

                  fontWeight:
                    700,
                }}
              >
                {portal.name}
              </Typography>

              {portal.description && (
                <Typography
                  component="span"
                  sx={{
                    marginTop: 1,

                    fontSize:
                      "0.875rem",

                    lineHeight:
                      1.5,

                    opacity:
                      0.8,
                  }}
                >
                  {
                    portal.description
                  }
                </Typography>
              )}
            </Box>
          ),
        )}
      </Box>
    </Box>
  );
}

export default AuthLanding;