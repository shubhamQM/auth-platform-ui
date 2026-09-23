import {
  Alert,
  Box,
  Typography,
} from "@mui/material";

import {
  GoogleReCaptchaCheckbox,
} from "@google-recaptcha/react";

function Recaptcha({
  config,
  onChange,
  error = "",
  disabled = false,
}) {
  if (!config.enabled) {
    return null;
  }

  if (!config.siteKey) {
    return (
      <Alert
        severity="warning"
        sx={{
          fontSize: "0.78rem",
          borderRadius: "6px",
        }}
      >
        reCAPTCHA is enabled but no site key
        has been configured.
      </Alert>
    );
  }

  const handleChange = (token) => {
     console.log("reCAPTCHA token:", token);
    if (disabled) {
      return;
    }

    onChange?.(token || "");
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <GoogleReCaptchaCheckbox
          onChange={handleChange}
          theme={config.theme || "light"}
          size="normal"
        />
      </Box>

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            display: "block",
            marginTop: 0.5,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default Recaptcha;