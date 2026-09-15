import { TextField } from "@mui/material";

function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
  helperText = "",
  autoFocus = false,
}) {
  const handleChange = (event) => {
    const nextValue = event.target.value;

    if (!/^\d*$/.test(nextValue)) {
      return;
    }

    if (nextValue.length > length) {
      return;
    }

    onChange?.(nextValue);
  };

  return (
    <TextField
      fullWidth
      label="Verification Code"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      error={error}
      helperText={helperText}
      autoFocus={autoFocus}
      slotProps={{
        htmlInput: {
          inputMode: "numeric",
          maxLength: length,
        },
      }}
    />
  );
}

export default OTPInput;