import {
  Security,
  Shield,
  Speed,
} from "@mui/icons-material";

import {
  Box,
  Typography,
} from "@mui/material";

const featureIcons = {
  security: Security,
  performance: Speed,
  protection: Shield,
};

function BrandingPanel({
  branding,
}) {
  const {
    logo,
    title,
    hero,
    features = [],
    footer,
  } = branding;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: {
          md: 5,
          lg: 6,
        },
        background:
          "linear-gradient(180deg, #2a1b6d 0%, #1d164d 50%, #16123a 100%)",
        color: "#ffffff",
      }}
    >
      {/* Branding */}
      <Box>
        {logo ? (
          <Box
            component="img"
            src={logo}
            alt={title}
            sx={{
              maxWidth: 180,
              maxHeight: 56,
              objectFit: "contain",
              marginBottom: 2,
            }}
          />
        ) : (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor:
                "rgba(99, 70, 229, 0.95)",
              fontWeight: 800,
              fontSize: "1.1rem",
              marginBottom: 2,
            }}
          >
            A
          </Box>
        )}

        {title && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </Typography>
        )}
      </Box>

      {/* Hero + Features */}
      <Box
        sx={{
          maxWidth: 560,
          marginY: 6,
        }}
      >
        {hero?.title && (
          <Typography
            component="h2"
            sx={{
              fontSize: {
                md: "2.5rem",
                lg: "3.25rem",
              },
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              marginBottom: 0,
            }}
          >
            {hero.title}
          </Typography>
        )}

        {hero?.highlight && (
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: {
                md: "2.5rem",
                lg: "3.25rem",
              },
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#8b75ff",
              marginBottom: 3,
            }}
          >
            {hero.highlight}
          </Typography>
        )}

        {hero?.description && (
          <Typography
            variant="body1"
            sx={{
              color: "#b1a7e2",
              lineHeight: 1.7,
              maxWidth: 500,
              marginBottom: 5,
            }}
          >
            {hero.description}
          </Typography>
        )}

        {features.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {features.map(
              (feature, index) => {
                const Icon =
                  featureIcons[
                    feature.icon
                  ];

                return (
                  <Box
                    key={
                      feature.title ||
                      index
                    }
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems:
                        "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 42,
                        height: 42,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        borderRadius: "50%",
                        backgroundColor:
                          "rgba(255, 255, 255, 0.08)",
                        border:
                          "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {Icon ? (
                        <Icon
                          sx={{
                            fontSize: 20,
                            color:
                              "#ffffff",
                          }}
                        />
                      ) : (
                        <Typography
                          sx={{
                            fontSize:
                              "1rem",
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          marginBottom: 0.5,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      {feature.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#b1a7e2",
                            lineHeight: 1.5,
                          }}
                        >
                          {
                            feature.description
                          }
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              }
            )}
          </Box>
        )}
      </Box>

      {/* Footer */}
      {footer && (
        <Typography
          variant="caption"
          sx={{
            color:
              "rgba(177, 167, 226, 0.65)",
          }}
        >
          {footer}
        </Typography>
      )}
    </Box>
  );
}

export default BrandingPanel;