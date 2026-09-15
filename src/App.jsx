import { AuthLogin } from "./index";

function App() {
  const handleLogin = async ({
    email,
    password,
    rememberMe,
    captchaToken,
  }) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    console.log("Login request:", {
      email,
      password,
      rememberMe,
      captchaToken,
    });

    return {
      success: true,
      requiresTwoFactor: true,
      challengeId: "demo-challenge-123",
      email,
      mobile: "******1234",
    };
  };

  const handleVerifyTwoFactor = async ({
    challengeId,
    emailCode,
    mobileCode,
  }) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    console.log("2FA verification:", {
      challengeId,
      emailCode,
      mobileCode,
    });

    return {
      success: true,
    };
  };

  const handleResendTwoFactor = async ({
    challengeId,
    channel,
  }) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    console.log("2FA resend:", {
      challengeId,
      channel,
    });

    return {
      success: true,
    };
  };

  const handleForgotPassword = async ({ email }) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    console.log("Forgot password:", {
      email,
    });

    return {
      success: true,
      message:
        "If an account exists with this email, password reset instructions have been sent.",
    };
  };

  return (
    <AuthLogin
      onLogin={handleLogin}
      onVerifyTwoFactor={handleVerifyTwoFactor}
      onResendTwoFactor={handleResendTwoFactor}
      onForgotPassword={handleForgotPassword}
    />
  );
}

export default App;