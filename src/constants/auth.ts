// Authentication constants
export const AUTH_STORAGE_KEY = 'ia_storehub_auth';

// Predefined credentials - in production, this would be handled by backend
export const VALID_CREDENTIALS = {
  email: 'admin_dummy@impactanalytics.co',
  password: 'Password@123',
} as const;

// Error messages - centralized for consistency
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
} as const;
