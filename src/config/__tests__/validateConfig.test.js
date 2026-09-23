import {
  describe,
  expect,
  it,
} from "vitest";

import defaultConfig from "../defaultConfig";

import {
  normalizeConfig,
} from "../normalizeConfig";

import {
  validateConfig,
} from "../validateConfig";

describe("validateConfig", () => {
  it("accepts the default configuration", () => {
    const config =
      normalizeConfig();

    const result =
      validateConfig(config);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects an invalid api baseUrl", () => {
    const config =
      normalizeConfig({
        api: {
          baseUrl: 123,
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      "api.baseUrl must be a string",
    );
  });

  it("requires a site key when CAPTCHA is enabled", () => {
    const config =
      normalizeConfig({
        captcha: {
          enabled: true,
          siteKey: "",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      "captcha.siteKey is required when CAPTCHA is enabled",
    );
  });

  it("does not require a site key when CAPTCHA is disabled", () => {
    const config =
      normalizeConfig({
        captcha: {
          enabled: false,
          siteKey: "",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(true);
  });

  it("rejects an unsupported CAPTCHA provider", () => {
    const config =
      normalizeConfig({
        captcha: {
          provider: "other",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      'captcha.provider must be "recaptcha"',
    );
  });

  it("rejects an unsupported CAPTCHA version", () => {
    const config =
      normalizeConfig({
        captcha: {
          version: "v3",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      'captcha.version must be "v2"',
    );
  });

  it("rejects an invalid CAPTCHA theme", () => {
    const config =
      normalizeConfig({
        captcha: {
          theme: "purple",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      'captcha.theme must be "light" or "dark"',
    );
  });

  it("rejects an invalid CAPTCHA size", () => {
    const config =
      normalizeConfig({
        captcha: {
          size: "large",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      'captcha.size must be "normal" or "compact"',
    );
  });

  it("rejects an invalid two-factor enabled value", () => {
    const config =
      normalizeConfig({
        twoFactor: {
          enabled: "yes",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      "twoFactor.enabled must be a boolean",
    );
  });

  it("rejects an invalid OTP length", () => {
    const config =
      normalizeConfig({
        twoFactor: {
          otp: {
            length: 0,
          },
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      "twoFactor.otp.length must be a positive integer",
    );
  });

  it("rejects an unsupported layout type", () => {
    const config =
      normalizeConfig({
        layout: {
          type: "unknown",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      'layout.type must be "split"',
    );
  });

  it("rejects an unsupported theme mode", () => {
    const config =
      normalizeConfig({
        theme: {
          mode: "automatic",
        },
      });

    const result =
      validateConfig(config);

    expect(result.valid).toBe(false);

    expect(result.errors).toContain(
      'theme.mode must be "light" or "dark"',
    );
  });

  it("does not modify the supplied configuration", () => {
    const config =
      normalizeConfig();

    const original =
      JSON.stringify(config);

    validateConfig(config);

    expect(
      JSON.stringify(config),
    ).toBe(original);

    expect(
      config.captcha.siteKey,
    ).toBe(
      defaultConfig.captcha.siteKey,
    );
  });
});