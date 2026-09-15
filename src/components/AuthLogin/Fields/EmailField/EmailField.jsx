import { TextField } from "@mui/material";

function EmailField({
  value,
  onChange,
  config,
  error = false,
  helperText = "",
  autoFocus = false,
  disabled = false,
}) {
  if (!config.enabled) {
    return null;
  }

  return (
    <TextField
      fullWidth
      type="email"
      label={config.label}
      placeholder={config.placeholder}
      required={config.required}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      disabled={disabled}
      error={error}
      helperText={helperText}
    />
  );
}

export default EmailField;