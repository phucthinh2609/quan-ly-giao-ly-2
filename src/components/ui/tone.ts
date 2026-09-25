// ============================================================================
// TONE MAPS (03 §3.1) — ánh xạ Tone → utility token.
// Chuỗi class phải viết đầy đủ (không ghép động) để Tailwind nhận diện.
// ============================================================================

export type Tone =
  | "neutral"
  | "primary"
  | "gold"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "sky"
  | "mint"
  | "sun"
  | "grape"
  | "coral"
  | "rose";

/** Nền nhạt + chữ/icon đậm cùng tone (pattern mặc định cho badge, icon tile, chip). */
export const TONE_SOFT: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2",
  primary: "bg-primary-soft text-primary-ink",
  gold: "bg-gold-soft text-gold-ink",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  sky: "bg-sky-soft text-sky",
  mint: "bg-mint-soft text-mint",
  sun: "bg-sun-soft text-sun",
  grape: "bg-grape-soft text-grape",
  coral: "bg-coral-soft text-coral",
  rose: "bg-rose-soft text-rose",
};

/** Nền đặc + chữ tương phản (trạng thái được chọn, nút nổi bật). */
export const TONE_SOLID: Record<Tone, string> = {
  neutral: "bg-ink text-canvas",
  primary: "bg-primary text-on-primary",
  gold: "bg-gold text-night",
  success: "bg-success text-on-solid",
  warning: "bg-warning text-on-solid",
  danger: "bg-danger text-on-solid",
  info: "bg-info text-on-solid",
  sky: "bg-sky text-on-solid",
  mint: "bg-mint text-night",
  sun: "bg-sun text-night",
  grape: "bg-grape text-on-solid",
  coral: "bg-coral text-on-solid",
  rose: "bg-rose text-on-solid",
};

/** Chỉ màu chữ/icon (đủ tương phản trên surface). */
export const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-ink-2",
  primary: "text-primary-ink",
  gold: "text-gold-ink",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  sky: "text-sky",
  mint: "text-mint",
  sun: "text-sun",
  grape: "text-grape",
  coral: "text-coral",
  rose: "text-rose",
};

/** Chỉ màu nền đặc (thanh tiến độ, chấm trạng thái). */
export const TONE_BG: Record<Tone, string> = {
  neutral: "bg-ink-3",
  primary: "bg-primary",
  gold: "bg-gold",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  sky: "bg-sky",
  mint: "bg-mint",
  sun: "bg-sun",
  grape: "bg-grape",
  coral: "bg-coral",
  rose: "bg-rose",
};

export const TONE_BORDER: Record<Tone, string> = {
  neutral: "border-line-strong",
  primary: "border-primary/30",
  gold: "border-gold/40",
  success: "border-success/30",
  warning: "border-warning/30",
  danger: "border-danger/30",
  info: "border-info/30",
  sky: "border-sky/30",
  mint: "border-mint/30",
  sun: "border-sun/40",
  grape: "border-grape/30",
  coral: "border-coral/30",
  rose: "border-rose/30",
};

/** Màu stroke cho SVG (ProgressRing, biểu đồ). */
export const TONE_STROKE: Record<Tone, string> = {
  neutral: "stroke-ink-3",
  primary: "stroke-primary",
  gold: "stroke-gold",
  success: "stroke-success",
  warning: "stroke-warning",
  danger: "stroke-danger",
  info: "stroke-info",
  sky: "stroke-sky",
  mint: "stroke-mint",
  sun: "stroke-sun",
  grape: "stroke-grape",
  coral: "stroke-coral",
  rose: "stroke-rose",
};

/** Kid palette xoay vòng — dùng cho avatar fallback, minh họa. */
export const KID_TONES: Tone[] = ["sky", "mint", "sun", "grape", "coral", "rose"];

/** Chọn tone xác định theo chuỗi (tên người, mã môn...). */
export function toneFromString(value: string, palette: Tone[] = KID_TONES): Tone {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return palette[Math.abs(hash) % palette.length];
}
