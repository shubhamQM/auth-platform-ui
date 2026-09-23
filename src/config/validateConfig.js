export const validateConfig = (config) => {
  const errors = [];

  if (
    typeof config?.api?.baseUrl !==
    "string"
  ) {
    errors.push(
      "api.baseUrl must be a string",
    );
  }

  if (
    typeof config?.captcha?.enabled !==
    "boolean"
  ) {
    errors.push(
      "captcha.enabled must be a boolean",
    );
  }

  if (config?.captcha?.enabled) {
    if (
      config.captcha.provider !==
      "recaptcha"
    ) {
      errors.push(
        'captcha.provider must be "recaptcha"',
      );
    }

    if (
      config.captcha.version !== "v2"
    ) {
      errors.push(
        'captcha.version must be "v2"',
      );
    }

    if (
      typeof config.captcha.siteKey !==
        "string" ||
      !config.captcha.siteKey.trim()
    ) {
      errors.push(
        "captcha.siteKey is required when CAPTCHA is enabled",
      );
    }

    if (
      !["light", "dark"].includes(
        config.captcha.theme,
      )
    ) {
      errors.push(
        'captcha.theme must be "light" or "dark"',
      );
    }

    if (
      !["normal", "compact"].includes(
        config.captcha.size,
      )
    ) {
      errors.push(
        'captcha.size must be "normal" or "compact"',
      );
    }
  }

  if (
    typeof config?.twoFactor?.enabled !==
    "boolean"
  ) {
    errors.push(
      "twoFactor.enabled must be a boolean",
    );
  }

  if (
    !Number.isInteger(
      config?.twoFactor?.otp?.length,
    ) ||
    config.twoFactor.otp.length <= 0
  ) {
    errors.push(
      "twoFactor.otp.length must be a positive integer",
    );
  }

  if (
    !["split"].includes(
      config?.layout?.type,
    )
  ) {
    errors.push(
      'layout.type must be "split"',
    );
  }

  if (
    !["light", "dark"].includes(
      config?.theme?.mode,
    )
  ) {
    errors.push(
      'theme.mode must be "light" or "dark"',
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};