import { createTheme } from "@mui/material/styles";

function createAuthTheme(themeConfig = {}) {
  const {
    mode = "light",
    colors = {},
    typography = {},
    shape = {},
  } = themeConfig;

return createTheme({
  palette: {
    mode,

    primary: {
      main: colors.primary || "#6346e5",
    },

    secondary: {
      main: colors.secondary || "#5832da",
    },

    background: {
      default:
        colors.background || "#0a0d25",

      paper:
        colors.surface || "#ffffff",
    },

    text: {
      primary:
        colors.text || "#111827",

      secondary:
        colors.textSecondary || "#6b7280",
    },

    error: {
      main:
        colors.error || "#d32f2f",
    },
  },

  typography: {
    fontFamily:
      typography.fontFamily ||
      "Inter, Arial, sans-serif",
  },

  shape: {
    borderRadius:
      shape.borderRadius ?? 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: "100%",
        },

        body: {
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: "100%",
        },

        "#root": {
          width: "100%",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});
}

export default createAuthTheme;