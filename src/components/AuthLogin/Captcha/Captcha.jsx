import { Box } from "@mui/material";

import RecaptchaProvider from "./Recaptcha/RecaptchaProvider";
import Recaptcha from "./Recaptcha/Recaptcha";

function Captcha({
  config,
  value,
  onChange,
  error = "",
  disabled = false,
}) {
  if (!config.enabled) {
    return null;
  }

  if (
    config.provider !== "recaptcha" ||
    config.version !== "v2"
  ) {
    return null;
  }

  return (
    <Box>
      <RecaptchaProvider siteKey={config.siteKey}>
        <Recaptcha
          config={config}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      </RecaptchaProvider>
    </Box>
  );
}

export default Captcha;