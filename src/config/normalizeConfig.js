import defaultConfig from "./defaultConfig";

const isObject = (value) => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};

const deepMerge = (defaults, overrides) => {
  const result = { ...defaults };

  if (!isObject(overrides)) {
    return result;
  }

  Object.keys(overrides).forEach((key) => {
    const overrideValue = overrides[key];
    const defaultValue = defaults[key];

    if (isObject(defaultValue) && isObject(overrideValue)) {
      result[key] = deepMerge(defaultValue, overrideValue);
    } else {
      result[key] = overrideValue;
    }
  });

  return result;
};

export const normalizeConfig = (userConfig = {}) => {
  return deepMerge(defaultConfig, userConfig);
};