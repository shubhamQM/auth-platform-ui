import { Alert } from "@mui/material";

function LoginError({
  message,
}) {
  if (!message) {
    return null;
  }

  return (
    <Alert severity="error">
      {message}
    </Alert>
  );
}

export default LoginError;