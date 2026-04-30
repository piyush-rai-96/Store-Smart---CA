// Impact UI Color Theme — aligned with impact-ui@3.7.20 compiled palette
// Source of truth: src/styles/impact-typography.css --ia-color-* tokens
// Keep export shape stable so call-sites require no changes.
export const IA_COLORS = {
  // Primary Brand Colors — Impact UI #4259EE family
  primary: {
    main: '#4259EE',      // Impact UI primary blue
    dark: '#3649C6',      // Hover state
    light: '#ECEEFD',     // Soft tint surface
    pressed: '#29399F',   // Pressed / deep accent
    border: '#B3BDF8',    // Border / notification ring
    info: '#5267F4',      // Info badge fill
  },

  // Secondary Colors
  secondary: {
    gray: '#60697D',      // Impact UI text-secondary
    lightGray: '#F8F9FB', // Impact UI bg-subtle
    border: '#D9DDE7',    // Impact UI border
  },

  // Status Colors — Impact UI semantic palette
  status: {
    success: '#108431',   // Impact UI success
    successSoft: '#C4E8D5',
    successBg: '#ECFDF3',
    warning: '#FFE174',   // Impact UI warning fill
    warningText: '#8C6F06',
    warningBg: '#FFF8E1',
    error: '#EC4C5C',     // Impact UI error
    errorStrong: '#D62F2D',
    errorBg: '#FCEEEE',
    info: '#5267F4',
  },

  // Neutral Colors — Impact UI neutral ramp
  neutral: {
    50: '#F8F9FB',
    100: '#F2F3F4',
    200: '#D9DDE7',
    300: '#C3C8D4',
    400: '#B4BAC7',
    500: '#60697D',
    600: '#60697D',
    700: '#1F2B4D',
    800: '#1F2B4D',
    900: '#1F2B4D',
  },

  // Background & Surface
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FB',
    tertiary: '#F2F3F4',
    dark: '#1F2B4D',
  },

  // Text Colors — Impact UI text ramp
  text: {
    primary: '#1F2B4D',
    secondary: '#60697D',
    tertiary: '#B4BAC7',
    light: '#B4BAC7',
    inverse: '#FFFFFF',
  },
} as const;

// Gradient definitions — Impact UI brand gradients
export const IA_GRADIENTS = {
  primary: 'linear-gradient(135deg, #4259EE 0%, #3649C6 100%)',
  secondary: 'linear-gradient(135deg, #60697D 0%, #1F2B4D 100%)',
  accent: 'linear-gradient(135deg, #4259EE 0%, #5267F4 100%)',
  success: 'linear-gradient(135deg, #108431 0%, #0B832F 100%)',
  warning: 'linear-gradient(135deg, #FFE174 0%, #8C6F06 100%)',
  error: 'linear-gradient(135deg, #EC4C5C 0%, #D62F2D 100%)',
} as const;
