/**
 * Theme & Token Constants
 * Quản lý Học tập Giáo lý – Đoàn Kitô Vua
 * Tham chiếu chuẩn: 01_DesignSystem_Tokens.md (§28, §9–15, §23)
 */

export const BREAKPOINTS = {
  sm: 480,   // var(--breakpoint-sm)
  md: 768,   // var(--breakpoint-md)
  lg: 1024,  // var(--breakpoint-lg)
  xl: 1280,  // var(--breakpoint-xl)
  '2xl': 1440, // var(--breakpoint-2xl)
} as const;

export const BREAKPOINT_STRINGS = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

export const TOUCH_TARGETS = {
  min: '44px',           // var(--touch-target-min)
  comfortable: '48px',   // var(--touch-target-comfortable)
  large: '52px',         // var(--touch-target-large)
  parent: '56px',        // var(--touch-target-parent)
} as const;

export const SPACING = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const;

export const RADIUS = {
  none: '0px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  header: 300,
  overlay: 400,
  modal: 500,
  popover: 600,
  toast: 700,
  tooltip: 800,
} as const;
