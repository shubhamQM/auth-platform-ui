import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  TextField,
} from "@mui/material";

function ForgotPasswordForm({
  config,
  onSubmit,
  onBack,
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      setError("Enter a valid email address");
      return;
    }

    if (!onSubmit) {
      return;
    }

    setLoading(true);

    try {
      const result = await onSubmit({
        email: normalizedEmail,
      });

      if (result?.success === false) {
        setError(
          result.error ||
            "Unable to process your request"
        );
        return;
      }

      setSuccess(
        result?.message ||
          "If an account exists with this email, password reset instructions have been sent."
      );
    } catch (submissionError) {
      setError(
        submissionError?.message ||
          "Unable to process your request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success">
          {success}
        </Alert>
      )}

      <TextField
        fullWidth
        type="email"
        label={config.label || "Email"}
        placeholder={
          config.placeholder || "Enter your email"
        }
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setError("");
          setSuccess("");
        }}
        disabled={loading}
        autoFocus
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
      >
        {loading
          ? "Sending..."
          : config.submitLabel || "Send Reset Link"}
      </Button>

      {onBack && (
        <Button
          type="button"
          variant="text"
          onClick={onBack}
          disabled={loading}
        >
          {config.backLabel || "Back to Login"}
        </Button>
      )}
    </Box>
  );
}

export default ForgotPasswordForm;