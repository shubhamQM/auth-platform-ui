import {
  Box,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useRef,
} from "react";

function OTPInput({
  value = "",
  onChange,
  length = 6,
  disabled = false,
  error = false,
  helperText = "",
  autoFocus = false,
  label = "Verification Code",
  numericOnly = true,
}) {
  const inputRefs = useRef([]);

  const otpValues = Array.from(
    { length },
    (_, index) => value[index] || ""
  );

  useEffect(() => {
    if (
      autoFocus &&
      !disabled &&
      inputRefs.current[0]
    ) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const isValidCharacter = (character) => {
    if (!character) {
      return true;
    }

    if (numericOnly) {
      return /^\d$/.test(character);
    }

    return /^[a-zA-Z0-9]$/.test(character);
  };

  const focusInput = (index) => {
    if (
      index >= 0 &&
      index < length
    ) {
      inputRefs.current[index]?.focus();
    }
  };

  const updateValue = (
    index,
    character
  ) => {
    const nextValues = [...otpValues];

    nextValues[index] = character;

    onChange?.(nextValues.join(""));
  };

  const handleChange = (
    event,
    index
  ) => {
    const inputValue =
      event.target.value;

    if (!inputValue) {
      updateValue(index, "");
      return;
    }

    const character =
      inputValue.slice(-1);

    if (!isValidCharacter(character)) {
      return;
    }

    updateValue(index, character);

    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    event,
    index
  ) => {
    if (
      event.key === "Backspace" &&
      !otpValues[index] &&
      index > 0
    ) {
      event.preventDefault();

      const nextValues = [
        ...otpValues,
      ];

      nextValues[index - 1] = "";

      onChange?.(
        nextValues.join("")
      );

      focusInput(index - 1);
      return;
    }

    if (
      event.key === "ArrowLeft"
    ) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (
      event.key === "ArrowRight"
    ) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    let pastedValue =
      event.clipboardData
        .getData("text")
        .trim();

    if (numericOnly) {
      pastedValue =
        pastedValue.replace(
          /\D/g,
          ""
        );
    } else {
      pastedValue =
        pastedValue.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );
    }

    pastedValue =
      pastedValue.slice(0, length);

    if (!pastedValue) {
      return;
    }

    onChange?.(pastedValue);

    const nextIndex = Math.min(
      pastedValue.length,
      length - 1
    );

    focusInput(nextIndex);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {label && (
        <Typography
          component="label"
          sx={{
            display: "block",
            marginBottom: 1,

            fontSize: "0.82rem",
            fontWeight: 600,

            color: error
              ? "error.main"
              : "text.primary",
          }}
        >
          {label}
        </Typography>
      )}

<Box
  sx={{
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      `repeat(${length}, minmax(0, 1fr))`,
    gap: 1,
  }}
  onPaste={handlePaste}
>
        {otpValues.map(
          (digit, index) => (
            <TextField
              key={index}
              value={digit}
              disabled={disabled}
              error={error}
              inputRef={(element) => {
                inputRefs.current[
                  index
                ] = element;
              }}
              onChange={(event) =>
                handleChange(
                  event,
                  index
                )
              }
              onKeyDown={(event) =>
                handleKeyDown(
                  event,
                  index
                )
              }
              slotProps={{
                htmlInput: {
                  inputMode:
                    numericOnly
                      ? "numeric"
                      : "text",

                  maxLength: 1,

                  "aria-label": `${label} ${
                    index + 1
                  } of ${length}`,
                },
              }}
              sx={{
                flex: 1,
                minWidth: 0,
                // maxWidth: 48,

                "& .MuiOutlinedInput-root":
                  {
                    height: 44,

                    borderRadius:
                      "6px",

                    backgroundColor:
                      "#f9fafb",

                    "& fieldset": {
                      borderColor:
                        "#e5e7eb",
                    },

                    "&:hover fieldset":
                      {
                        borderColor:
                          "#c7cad1",
                      },

                    "&.Mui-focused fieldset":
                      {
                        borderColor:
                          "primary.main",

                        borderWidth:
                          "1.5px",
                      },
                  },

                "& .MuiInputBase-input":
                  {
                    padding: 0,

                    textAlign:
                      "center",

                    fontSize:
                      "1rem",

                    fontWeight: 700,

                    lineHeight: 1,
                  },
              }}
            />
          )
        )}
      </Box>

      {helperText && (
        <FormHelperText
          error={error}
          sx={{
            marginLeft: 0,
            marginTop: 0.75,
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

export default OTPInput;