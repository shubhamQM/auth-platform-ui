import { Button } from "@mui/material";

function ForgotPassword({
  config,
  onClick,
  disabled = false,
}) {
  if (!config.enabled) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="text"
      onClick={onClick}
      disabled={disabled}
      sx={{
        alignSelf: "flex-end",
        padding: 0,
        minWidth: "auto",
      }}
    >
      {config.label}
    </Button>
  );
}

export default ForgotPassword;