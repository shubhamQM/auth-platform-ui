import { useEffect, useState } from "react";

function useTwoFactor({
  onVerifyTwoFactor,
  onResendTwoFactor,
  onComplete,
  resendCooldown = 30,
  otpExpiresIn = 300,
  maxAttempts = 5,
}) {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");

  const [emailCooldown, setEmailCooldown] = useState(0);
  const [mobileCooldown, setMobileCooldown] = useState(0);

  const [emailExpiresIn, setEmailExpiresIn] =
    useState(otpExpiresIn);

  const [mobileExpiresIn, setMobileExpiresIn] =
    useState(otpExpiresIn);

  const [emailAttempts, setEmailAttempts] = useState(0);
  const [mobileAttempts, setMobileAttempts] = useState(0);

  useEffect(() => {
    if (
      emailCooldown === 0 &&
      mobileCooldown === 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setEmailCooldown((current) =>
        current > 0 ? current - 1 : 0
      );

      setMobileCooldown((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [emailCooldown, mobileCooldown]);

  useEffect(() => {
    if (
      emailExpiresIn === 0 &&
      mobileExpiresIn === 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setEmailExpiresIn((current) =>
        current > 0 ? current - 1 : 0
      );

      setMobileExpiresIn((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [emailExpiresIn, mobileExpiresIn]);

  const verify = async ({
    challengeId,
    emailCode,
    mobileCode,
  }) => {
    if (!onVerifyTwoFactor) {
      const configurationError =
        "Two-factor verification is not configured";

      setError(configurationError);

      return {
        success: false,
        error: configurationError,
      };
    }

    const emailProvided = Boolean(emailCode);
    const mobileProvided = Boolean(mobileCode);

    const emailExpired =
      emailProvided &&
      emailExpiresIn === 0;

    const mobileExpired =
      mobileProvided &&
      mobileExpiresIn === 0;

    if (emailExpired) {
      const expirationError =
        "Email verification code has expired";

      setError(expirationError);

      return {
        success: false,
        error: expirationError,
      };
    }

    if (mobileExpired) {
      const expirationError =
        "Mobile verification code has expired";

      setError(expirationError);

      return {
        success: false,
        error: expirationError,
      };
    }

    const emailLocked =
      emailProvided &&
      emailAttempts >= maxAttempts;

    const mobileLocked =
      mobileProvided &&
      mobileAttempts >= maxAttempts;

    if (emailLocked) {
      const attemptsError =
        "Maximum email verification attempts reached";

      setError(attemptsError);

      return {
        success: false,
        error: attemptsError,
      };
    }

    if (mobileLocked) {
      const attemptsError =
        "Maximum mobile verification attempts reached";

      setError(attemptsError);

      return {
        success: false,
        error: attemptsError,
      };
    }

    setLoading(true);
    setError("");

    try {
      const result = await onVerifyTwoFactor({
        challengeId,
        emailCode,
        mobileCode,
      });

      if (result?.success) {
        onComplete?.(result);

        return result;
      }

      if (emailProvided) {
        setEmailAttempts((current) =>
          current + 1
        );
      }

      if (mobileProvided) {
        setMobileAttempts((current) =>
          current + 1
        );
      }

      const nextEmailAttempts =
        emailProvided
          ? emailAttempts + 1
          : emailAttempts;

      const nextMobileAttempts =
        mobileProvided
          ? mobileAttempts + 1
          : mobileAttempts;

      const emailMaxReached =
        emailProvided &&
        nextEmailAttempts >= maxAttempts;

      const mobileMaxReached =
        mobileProvided &&
        nextMobileAttempts >= maxAttempts;

      let verificationError =
        result?.error ||
        "Two-factor verification failed";

      if (emailMaxReached) {
        verificationError =
          "Maximum email verification attempts reached";
      } else if (mobileMaxReached) {
        verificationError =
          "Maximum mobile verification attempts reached";
      }

      setError(verificationError);

      return {
        success: false,
        error: verificationError,
        attempts: {
          email: nextEmailAttempts,
          mobile: nextMobileAttempts,
        },
      };
    } catch (verificationError) {
      if (emailProvided) {
        setEmailAttempts((current) =>
          current + 1
        );
      }

      if (mobileProvided) {
        setMobileAttempts((current) =>
          current + 1
        );
      }

      const message =
        verificationError?.message ||
        "Two-factor verification failed";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  const resend = async ({
    challengeId,
    channel,
  }) => {
    if (!onResendTwoFactor) {
      const configurationError =
        "Two-factor resend is not configured";

      setError(configurationError);

      return {
        success: false,
        error: configurationError,
      };
    }

    const isEmail = channel === "email";

    const currentCooldown = isEmail
      ? emailCooldown
      : mobileCooldown;

    if (currentCooldown > 0) {
      return {
        success: false,
        error:
          "Please wait before requesting another code",
      };
    }

    setResendLoading(true);
    setError("");

    try {
      const result = await onResendTwoFactor({
        challengeId,
        channel,
      });

      if (result?.success === false) {
        const resendError =
          result.error ||
          "Unable to resend verification code";

        setError(resendError);

        return {
          success: false,
          error: resendError,
        };
      }

      if (isEmail) {
        setEmailCooldown(resendCooldown);
        setEmailExpiresIn(otpExpiresIn);
        setEmailAttempts(0);
      } else {
        setMobileCooldown(resendCooldown);
        setMobileExpiresIn(otpExpiresIn);
        setMobileAttempts(0);
      }

      return result;
    } catch (resendError) {
      const message =
        resendError?.message ||
        "Unable to resend verification code";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setResendLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return {
    loading,
    resendLoading,
    error,

    emailCooldown,
    mobileCooldown,

    emailExpiresIn,
    mobileExpiresIn,

    emailAttempts,
    mobileAttempts,

    verify,
    resend,
    clearError,
  };
}

export default useTwoFactor;