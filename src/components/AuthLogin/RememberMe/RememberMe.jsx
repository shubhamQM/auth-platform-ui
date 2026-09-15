import { Checkbox, FormControlLabel } from "@mui/material";

function RememberMe({
  checked,
  onChange,
  config,
  disabled = false,
}) {
  if (!config.enabled) {
    return null;
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      }
      label={config.label}
    />
  );
}

export default RememberMe;