const defaultConfig = {
branding: {
  logo: null,
  title: "Your Platform",
  subtitle: "Sign in to continue",
  showLogo: true,

  hero: {
    title: "Everything you need",
    highlight: "in one place.",
    description:
      "Securely access your account and manage your platform with a seamless authentication experience.",
  },

  features: [
    {
      icon: "security",
      title: "Secure Access",
      description:
        "Enterprise-grade authentication keeps your account protected.",
    },
    {
      icon: "performance",
      title: "Fast & Reliable",
      description:
        "A smooth and responsive authentication experience.",
    },
    {
      icon: "protection",
      title: "Built for Security",
      description:
        "Modern security practices designed to protect your users.",
    },
  ],

  footer: "© 2026 Your Platform",
},

  login: {
    method: "email",
    rememberMe: true,
    forgotPassword: true,
    passwordVisibility: true,
  },

captcha: {
  enabled: false,

  provider: "recaptcha",

  version: "v2",

  siteKey: "",

  theme: "light",

  size: "normal",
},

  twoFactor: {
    enabled: false,
    required: true,

    methods: {
      email: true,
      mobile: true,
    },

    verification: {
      requireAll: true,
    },

    otp: {
      length: 6,
      numericOnly: true,
      expiresIn: 12,
      maxAttempts: 2,
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
    label: "Email",
    placeholder: "Enter your email",
  },

  password: {
    enabled: true,
    required: true,
    label: "Password",
    placeholder: "Enter your password",
  },

  rememberMe: {
    enabled: true,
    label: "Remember me",
  },

  forgotPassword: {
    enabled: true,
  },
},

texts: {
  loginButton: "Login",
  forgotPassword: "Forgot Password?",
  verifyButton: "Verify",
  resendCode: "Resend Code",

  resetPassword: "Send Reset Link",
  backToLogin: "Back to Login",

  emailOtpTitle: "Verify your email",
  mobileOtpTitle: "Verify your mobile number",

  invalidCredentials: "Invalid email or password",
  verificationFailed: "Verification failed",
},

  layout: {
    type: "centered",
    maxWidth: 420,
    fullHeight: true,
  },

  responsive: {
    enabled: true,
    breakpoint: "md",
  },

  theme: {
    mode: "light",

    colors: {
      primary: "#1976d2",
      secondary: "#9c27b0",
      background: "#ffffff",
      surface: "#ffffff",
      text: "#1a1a1a",
      error: "#d32f2f",
    },

    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },

    shape: {
      borderRadius: 8,
    },
  },

  behavior: {
    autoFocus: true,
    disableSubmitWhileLoading: true,
    clearPasswordOnError: false,
  },
};

export default defaultConfig;