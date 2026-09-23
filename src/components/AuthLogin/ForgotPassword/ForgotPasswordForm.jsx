import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowLeft,
  Sms,
} from "iconsax-react";

function ForgotPasswordForm({
  config,
  onSubmit,
  onBack,
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail =
      email.trim();

    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      setError(
        "Enter a valid email address"
      );
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
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          marginBottom: 3.5,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
            },

            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",

            color: "text.primary",

            marginBottom: 1,
          }}
        >
          Forgot Password?
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.6,
            fontSize: "0.84rem",
          }}
        >
          Enter your registered email address
          and we'll send you instructions to
          reset your password.
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{
            marginBottom: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Success */}
      {success && (
        <Alert
          severity="success"
          sx={{
            marginBottom: 2,
          }}
        >
          {success}
        </Alert>
      )}

      {/* Email */}
      <Box
        sx={{
          marginBottom: 2.25,
        }}
      >
        <TextField
          fullWidth
          type="email"
          label={
            config.label ||
            "Email Address"
          }
          placeholder={
            config.placeholder ||
            "Enter your email address"
          }
          required
          value={email}
          onChange={(event) => {
            setEmail(
              event.target.value
            );

            setError("");
            setSuccess("");
          }}
          disabled={loading}
          autoFocus
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
              backgroundColor:
                "#f9fafb",

              "& fieldset": {
                borderColor:
                  "#e5e7eb",
              },

              "&:hover fieldset": {
                borderColor:
                  "#c7cad1",
              },

              "&.Mui-focused fieldset": {
                borderColor:
                  "primary.main",
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
      </Box>

      {/* Send Reset Link */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          height: 42,
          borderRadius: "6px",

          fontSize: "0.84rem",
          fontWeight: 700,
          textTransform: "none",

          boxShadow:
            "0 6px 14px rgba(99, 70, 229, 0.22)",

          "&:hover": {
            boxShadow:
              "0 8px 18px rgba(99, 70, 229, 0.28)",
          },
        }}
      >
        {loading
          ? "Sending..."
          : config.submitLabel ||
            "Send Reset Link"}
      </Button>

      {/* Back to Login */}
      {onBack && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 1.5,
          }}
        >
          <Button
            type="button"
            variant="text"
            onClick={onBack}
            disabled={loading}
            startIcon={
              <ArrowLeft
                size="16"
                color="currentColor"
                variant="Linear"
              />
            }
            sx={{
              minHeight: "auto",
              padding: 0.5,

              fontSize: "0.78rem",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {config.backLabel ||
              "Back to Login"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ForgotPasswordForm;