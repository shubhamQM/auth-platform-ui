import { useState } from "react";

import {
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import {
  Eye,
  EyeSlash,
  Lock,
} from "iconsax-react";

function PasswordField({
  value,
  onChange,
  config,
  disabled = false,
}) {
  const [visible, setVisible] =
    useState(false);

  const {
    label,
    placeholder,
    required,
  } = config;

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
          startAdornment: (
            <InputAdornment position="start">
              <Lock
                size="18"
                color="#8b93a7"
                variant="Linear"
              />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                onClick={() =>
                  setVisible(
                    (current) => !current
                  )
                }
                edge="end"
                aria-label={
                  visible
                    ? "Hide password"
                    : "Show password"
                }
                disabled={disabled}
                sx={{
                  color: "#8b93a7",
                }}
              >
                {visible ? (
                  <EyeSlash
                    size="19"
                    color="currentColor"
                    variant="Linear"
                  />
                ) : (
                  <Eye
                    size="19"
                    color="currentColor"
                    variant="Linear"
                  />
                )}
              </IconButton>
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

  "& .MuiIconButton-root": {
    padding: "5px",
  },
}}
    />
  );
}

export default PasswordField;