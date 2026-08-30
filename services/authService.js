const DEMO_BADGE_ID = 'OFF001';
const DEMO_OTP = '123456';

export const validateBadgeId = (badgeId) => {
  return badgeId === DEMO_BADGE_ID;
};

export const verifyOTP = (otp) => {
  return otp === DEMO_OTP;
};