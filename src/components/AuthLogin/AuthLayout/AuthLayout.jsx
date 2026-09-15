import { Box } from "@mui/material";

function AuthLayout({
  branding,
  children,
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0a0d25 0%, #12163b 100%)",
        padding: {
          xs: 0,
          sm: 3,
          md: 4,
        },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          height: {
            xs: "100vh",
            sm: 620,
            md: 650,
          },
          display: "flex",
          overflow: "hidden",
          borderRadius: {
            xs: 0,
            sm: 3,
            md: 4,
          },
          boxShadow: {
            xs: "none",
            sm: "0 25px 70px rgba(0, 0, 0, 0.35)",
            md: "0 30px 80px rgba(0, 0, 0, 0.45)",
          },
          backgroundColor: "#ffffff",
        }}
      >
        {/* Left Branding Panel */}
        <Box
          sx={{
            width: "45%",
            display: {
              xs: "none",
              md: "flex",
            },
            minWidth: 0,
          }}
        >
          {branding}
        </Box>

        {/* Right Authentication Panel */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "55%",
            },
            minWidth: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            padding: {
              xs: 3,
              sm: 5,
              md: 6,
            },
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default AuthLayout;