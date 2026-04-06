// Impact Analytics Color Theme - Matching IA Platform
export const IA_COLORS = {
  // Primary Brand Colors - IA Platform Blue
  primary: {
    main: '#0066cc',      // IA Platform Primary Blue
    dark: '#0052a3',      // Darker blue for hover
    light: '#3385d6',     // Lighter blue for accents
  },
  
  // Secondary Colors
  secondary: {
    gray: '#6c757d',      // Professional gray
    lightGray: '#f8f9fa', // Background gray
    border: '#dee2e6',    // Border gray
  },
  
  // Status Colors - Professional
  status: {
    success: '#28a745',   // Professional green
    warning: '#ffc107',   // Amber warning
    error: '#dc3545',     // Professional red
    info: '#17a2b8',      // Info teal
  },
  
  // Neutral Colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Background & Surface
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    dark: '#1a2332',
  },
  
  // Text Colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    light: '#94a3b8',
    inverse: '#ffffff',
  },
} as const;

// Gradient definitions - IA Platform Style
export const IA_GRADIENTS = {
  primary: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
  secondary: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
  accent: 'linear-gradient(135deg, #0066cc 0%, #17a2b8 100%)',
  success: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
  warning: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
  error: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
} as const;
