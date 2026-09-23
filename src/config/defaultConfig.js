const defaultConfig = {
  api: {
    baseUrl: "",
  },

  branding: {
    logo: null,
    logoText: "N",
    title: "NMIMS CRM",
    subtitle: "Multi-Team Admissions CRM",

    showLogo: true,

    hero: {
      title: "Multi-Team",
      highlight: "Admissions CRM",
      secondaryTitle: "Platform",
      description: "",
    },

    features: [
      {
        icon: "leadTracking",
        title: "Full-funnel Lead Tracking",
        description:
          "Enquiry to registration, tracked in one pipeline.",
      },
      {
        icon: "insights",
        title: "AI-powered Insights",
        description:
          "Smart recommendations across campaigns, budget and leads.",
      },
      {
        icon: "roleAccess",
        title: "Role-based Access",
        description:
          "Seven tailored workspaces, from executive to leadership.",
      },
    ],

    footer:
      "© 2026 NMIMS CRM. All rights reserved. Multi-team platform v1.0",
  },

  login: {
    method: "email",

    title: "Welcome Back",
    subtitle:
      "Sign-in to your account to continue",

    rememberMe: true,
    forgotPassword: true,
    passwordVisibility: true,
  },

  captcha: {
    enabled: true,

    provider: "recaptcha",
    version: "v2",

    siteKey:
      "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",

    theme: "light",
    size: "normal",
  },

  twoFactor: {
    enabled: false,

    methods: {
      email: true,
      mobile: false,
    },

    verification: {
      requireAll: true,
    },

    otp: {
      length: 6,
      numericOnly: true,
    },

    resend: {
      enabled: true,
      cooldown: 30,
    },
  },

  fields: {
    email: {
      enabled: true,
      required: true,

      label: "Email Address",
      placeholder:
        "Enter your email address",
    },

    password: {
      enabled: true,
      required: true,

      label: "Password",
      placeholder:
        "Enter your password",
    },

    rememberMe: {
      enabled: true,
      label: "Keep me signed in",
    },

    forgotPassword: {
      enabled: true,
    },
  },

  texts: {
    loginButton: "Sign In",

    forgotPassword:
      "Forgot Password?",

    verifyButton: "Verify",
    resendCode: "Resend Code",

    resetPassword:
      "Send Reset Link",

    backToLogin:
      "Back to Login",

    emailOtpTitle:
      "Verify your email",

    mobileOtpTitle:
      "Verify your mobile number",

    invalidCredentials:
      "Invalid email or password",

    verificationFailed:
      "Verification failed",
  },

  layout: {
    type: "split",

    maxWidth: 420,

    fullHeight: true,

    container: {
      maxWidth: 1000,
      height: 650,
    },

    split: {
      branding: 45,
      form: 55,
    },
  },

  responsive: {
    enabled: true,
    breakpoint: "md",
  },

  theme: {
    mode: "light",

    colors: {
      primary: "#6346e5",
      secondary: "#7657f5",

      background: "#0a0d25",
      surface: "#ffffff",

      text: "#111827",
      textSecondary: "#6b7280",

      brandingBackground:
        "#1d164d",

      brandingText:
        "#ffffff",

      brandingSecondary:
        "#b1a7e2",

      error: "#d32f2f",
    },

    typography: {
      fontFamily:
        "Inter, Arial, sans-serif",
    },

    shape: {
      borderRadius: 8,
      containerRadius: 16,
    },
  },

  behavior: {
    autoFocus: true,

    disableSubmitWhileLoading:
      true,

    clearPasswordOnError:
      false,
  },
};

export default defaultConfig;