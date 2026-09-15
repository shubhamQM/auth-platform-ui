export const createTwoFactorData = ({
  challengeId,
  email,
  mobile,
}) => ({
  challengeId,
  email,
  mobile,
  emailVerified: false,
  mobileVerified: false,
});