const DEMO_BADGE_ID = 'OFF001';
const DEMO_OTP = '123456';

const SESSION_TIMEOUT = 60 * 1000; // 60 seconds

let currentUser = null;
let lastActivityTime = null;

// --------------------
// Badge ID validation
// --------------------

export const validateBadgeId = (badgeId) => {
  return badgeId === DEMO_BADGE_ID;
};

// --------------------
// OTP verification
// --------------------

export const verifyOTP = (otp) => {
  return otp === DEMO_OTP;
};

// --------------------
// Login
// --------------------

export const login = (badgeId) => {
  currentUser = {
    badgeId: badgeId,
  };

  lastActivityTime = Date.now();
};

// --------------------
// Logout
// --------------------

export const logout = () => {
  currentUser = null;
  lastActivityTime = null;
};

// --------------------
// Update activity
// --------------------

export const updateActivity = () => {
  if (currentUser !== null) {
    lastActivityTime = Date.now();
  }
};

// --------------------
// Authentication check
// --------------------

export const isAuthenticated = () => {
  if (currentUser === null) {
    return false;
  }

  if (lastActivityTime === null) {
    logout();
    return false;
  }

  const inactiveTime = Date.now() - lastActivityTime;

  if (inactiveTime >= SESSION_TIMEOUT) {
    logout();
    return false;
  }

  return true;
};

// --------------------
// Get current user
// --------------------

export const getCurrentUser = () => {
  return currentUser;
};

// --------------------
// Get remaining session time
// --------------------

export const getRemainingSessionTime = () => {
  if (currentUser === null || lastActivityTime === null) {
    return 0;
  }

  const elapsed = Date.now() - lastActivityTime;
  const remaining = SESSION_TIMEOUT - elapsed;

  return Math.max(0, remaining);
};
