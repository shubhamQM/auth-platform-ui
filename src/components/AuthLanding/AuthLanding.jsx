import {
  Box,
  Typography,
} from "@mui/material";

function AuthLanding({
  user,
  authorizations = [],
  onPortalSelect,
}) {
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

  return (
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
      >
        Access your workspace by selecting
        a module below
      </Typography>

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
              key={portal.portalCode}
              component="button"
              type="button"
              onClick={() =>
                handlePortalClick(portal)
              }
              sx={{
                minHeight: 150,
                border: 0,
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                padding: 3,
                backgroundColor:
                  "primary.main",
                color:
                  "primary.contrastText",
                font: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                }}
              >
                {portal.name}
              </Typography>

              {portal.description && (
                <Typography
                  component="span"
                  sx={{
                    marginTop: 1,
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    opacity: 0.8,
                  }}
                >
                  {portal.description}
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