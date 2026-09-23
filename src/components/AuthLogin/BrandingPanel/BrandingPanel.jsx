import {
  HierarchySquare,
  MagicStar,
  SecurityUser,
} from "iconsax-react";

import {
  Box,
  Typography,
} from "@mui/material";

const featureIcons = {
  leadTracking: HierarchySquare,
  insights: MagicStar,
  roleAccess: SecurityUser,
};

function BrandingPanel({
  branding,
}) {
  const {
    logo,
    logoText = "A",
    title,
    hero,
    features = [],
    footer,
  } = branding;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",

        padding: {
          md: 4,
          lg: 4.5,
        },

        boxSizing: "border-box",
        overflow: "hidden",

        background:
          "linear-gradient(180deg, #2a1b6d 0%, #21175a 50%, #191442 100%)",

        color: "#ffffff",
      }}
    >
      {/* Logo + Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        {logo ? (
          <Box
            component="img"
            src={logo}
            alt={title}
            sx={{
              maxWidth: 150,
              maxHeight: 44,
              objectFit: "contain",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 42,
              height: 42,
              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: 2,

              background:
                "linear-gradient(135deg, #7657f5 0%, #6346e5 100%)",

              fontWeight: 800,
              fontSize: "1rem",
            }}
          >
            {logoText}
          </Box>
        )}

        {title && (
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
        )}
      </Box>

      {/* Main Branding Content */}
      <Box
        sx={{
          flex: 1,

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",

          minHeight: 0,
          paddingY: 2,
        }}
      >
        {/* Hero */}
        <Box
          sx={{
            marginBottom: 3.5,
          }}
        >
          {hero?.title && (
            <Typography
              component="h2"
              sx={{
                fontSize: {
                  md: "2rem",
                  lg: "2.2rem",
                },

                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.035em",
              }}
            >
              {hero.title}
            </Typography>
          )}

          {hero?.highlight && (
            <Typography
              component="div"
              sx={{
                fontSize: {
                  md: "2rem",
                  lg: "2.2rem",
                },

                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.035em",

                color: "#8b75ff",
              }}
            >
              {hero.highlight}
            </Typography>
          )}

          {hero?.secondaryTitle && (
            <Typography
              component="div"
              sx={{
                fontSize: {
                  md: "2rem",
                  lg: "2.2rem",
                },

                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.035em",

                marginTop: 2,
                color: "#ffffff",
              }}
            >
              {hero.secondaryTitle}
            </Typography>
          )}

          {hero?.description && (
            <Typography
              variant="body2"
              sx={{
                maxWidth: 390,

                marginTop: 2,

                color: "#b1a7e2",

                fontSize: "0.82rem",
                lineHeight: 1.65,
              }}
            >
              {hero.description}
            </Typography>
          )}
        </Box>

        {/* Features */}
        {features.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
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
                      alignItems:
                        "flex-start",
                      gap: 1.5,
                    }}
                  >
                    {/* Feature Icon */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,

                        flexShrink: 0,

                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",

                        borderRadius: 2,

                        backgroundColor:
                          "rgba(255,255,255,0.08)",

                        border:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {Icon ? (
                        <Icon
                          size="18"
                          color="#c5baff"
                          variant="Linear"
                        />
                      ) : (
                        <Typography
                          sx={{
                            fontSize:
                              "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Typography>
                      )}
                    </Box>

                    {/* Feature Content */}
                    <Box
                      sx={{
                        paddingTop: 0.1,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize:
                            "0.84rem",

                          fontWeight: 700,
                          lineHeight: 1.35,

                          marginBottom: 0.35,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      {feature.description && (
                        <Typography
                          sx={{
                            color:
                              "#b1a7e2",

                            fontSize:
                              "0.76rem",

                            lineHeight: 1.45,
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
            flexShrink: 0,

            color:
              "rgba(177, 167, 226, 0.65)",

            fontSize: "0.68rem",
          }}
        >
          {footer}
        </Typography>
      )}
    </Box>
  );
}

export default BrandingPanel;