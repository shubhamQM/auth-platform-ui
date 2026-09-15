import { useState } from "react";

import { IconButton, InputAdornment, TextField } from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

function PasswordField({ value, onChange, config, disabled = false }) {
  const [visible, setVisible] = useState(false);

  const { label, placeholder, required } = config;

  return (
    <TextField
      fullWidth
      type={visible ? "text" : "password"}
      label={label}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={config.error}
      helperText={config.helperText}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                onClick={() => setVisible((current) => !current)}
                edge="end"
                aria-label={visible ? "Hide password" : "Show password"}
                disabled={disabled}
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default PasswordField;
