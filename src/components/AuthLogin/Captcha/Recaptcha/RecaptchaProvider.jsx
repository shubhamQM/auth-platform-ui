import { GoogleReCaptchaProvider } from "@google-recaptcha/react";

function RecaptchaProvider({
  siteKey,
  children,
}) {
  if (!siteKey) {
    return children;
  }

  return (
    <GoogleReCaptchaProvider
      type="v2-checkbox"
      siteKey={siteKey}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

export default RecaptchaProvider;