import {
  describe,
  expect,
  it,
} from "vitest";

import {
  normalizeConfig,
} from "../normalizeConfig";

import defaultConfig from "../defaultConfig";

describe("normalizeConfig", () => {
  it("returns the default configuration when no config is provided", () => {
    const result = normalizeConfig();

    expect(result).toEqual(
      defaultConfig,
    );
  });

  it("overrides a top-level nested value", () => {
    const result = normalizeConfig({
      api: {
        baseUrl:
          "https://auth.example.com",
      },
    });

    expect(
      result.api.baseUrl,
    ).toBe(
      "https://auth.example.com",
    );
  });

  it("preserves defaults when partially overriding nested configuration", () => {
    const result = normalizeConfig({
      captcha: {
        theme: "dark",
      },
    });

    expect(
      result.captcha.theme,
    ).toBe("dark");

    expect(
      result.captcha.enabled,
    ).toBe(
      defaultConfig.captcha.enabled,
    );

    expect(
      result.captcha.provider,
    ).toBe(
      defaultConfig.captcha.provider,
    );

    expect(
      result.captcha.version,
    ).toBe(
      defaultConfig.captcha.version,
    );
  });

  it("deep merges nested configuration", () => {
    const result = normalizeConfig({
      theme: {
        colors: {
          primary: "#000000",
        },
      },
    });

    expect(
      result.theme.colors.primary,
    ).toBe("#000000");

    expect(
      result.theme.colors.secondary,
    ).toBe(
      defaultConfig.theme.colors
        .secondary,
    );
  });

  it("replaces arrays instead of merging them", () => {
    const features = [
      {
        icon: "custom",
        title: "Custom Feature",
        description:
          "Custom description",
      },
    ];

    const result = normalizeConfig({
      branding: {
        features,
      },
    });

    expect(
      result.branding.features,
    ).toEqual(features);

    expect(
      result.branding.features,
    ).toHaveLength(1);
  });

  it("does not mutate the default configuration", () => {
    const originalPrimary =
      defaultConfig.theme.colors.primary;

    normalizeConfig({
      theme: {
        colors: {
          primary: "#123456",
        },
      },
    });

    expect(
      defaultConfig.theme.colors.primary,
    ).toBe(originalPrimary);
  });
});