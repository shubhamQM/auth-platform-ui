import { Box, Typography } from "@mui/material";

import { GoogleReCaptchaCheckbox } from "@google-recaptcha/react";

function Recaptcha({
  config,
  onChange,
  error = "",
}) {
  if (!config.enabled || !config.siteKey) {
    return null;
  }

  const handleChange = (token) => {
    onChange?.(token || "");
  };

  return (
    <Box>
      <GoogleReCaptchaCheckbox
        onChange={handleChange}
      />

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