import {
  InputAdornment,
  TextField,
} from "@mui/material";

import { Sms } from "iconsax-react";

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
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Sms
                size="18"
                color="#8b93a7"
                variant="Linear"
              />
            </InputAdornment>
          ),
        },
      }}
sx={{
  "& .MuiOutlinedInput-root": {
    height: 42,
    borderRadius: "6px",
    backgroundColor: "#f9fafb",

    "& fieldset": {
      borderColor: "#e5e7eb",
    },

    "&:hover fieldset": {
      borderColor: "#c7cad1",
    },

    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
    },
  },

  "& .MuiInputLabel-root": {
    fontSize: "0.82rem",
  },

  "& .MuiInputBase-input": {
    fontSize: "0.84rem",
    paddingTop: 0,
    paddingBottom: 0,
  },
}}
    />
  );
}

export default EmailField;