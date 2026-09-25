import { useEffect, useState } from "react";
import { usePreferences } from "../../context/PreferencesContext";

// ============================================================================
// SCORE UTILITIES — validate thang điểm 10, định dạng điểm, hook nội bộ.
// ============================================================================

export const SCORE_MIN = 0;
export const SCORE_MAX = 10;
/** Bước điểm lẻ cho phép (02 §11): 8 · 8.25 · 8.5 · 8.75 */
export const SCORE_STEP = 0.25;

export interface ScoreValidationOptions {
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface ScoreValidationResult {
  parsed: number | null;
  error: string | null;
}

/**
 * Kiểm tra chuỗi điểm người dùng gõ.
 * - Rỗng: hợp lệ (chưa nhập), trừ khi `required`.
 * - Chấp nhận dấu phẩy thập phân ("8,5") và dấu chấm cuối khi đang gõ ("8.").
 * - Ngoài khoảng → "Điểm phải từ 0 đến 10".
 */
export function validateScoreText(raw: string, options: ScoreValidationOptions = {}): ScoreValidationResult {
  const { min = SCORE_MIN, max = SCORE_MAX, step = SCORE_STEP, required = false } = options;
  const trimmed = raw.trim();

  if (trimmed === "") {
    return required ? { parsed: null, error: "Điểm không được để trống" } : { parsed: null, error: null };
  }

  const normalized = trimmed.replace(/,/g, ".");
  const isNumeric = /^-?\d*\.?\d*$/.test(normalized) && /\d/.test(normalized);
  if (!isNumeric) {
    return { parsed: null, error: `Điểm phải là số từ ${min} đến ${max}` };
  }

  const num = parseFloat(normalized);
  if (Number.isNaN(num)) {
    return { parsed: null, error: `Điểm phải là số từ ${min} đến ${max}` };
  }

  if (num < min || num > max) {
    return { parsed: num, error: `Điểm phải từ ${min} đến ${max}` };
  }

  if (step > 0) {
    const ratio = num / step;
    if (Math.abs(ratio - Math.round(ratio)) > 1e-9) {
      return { parsed: num, error: `Điểm lẻ theo bước ${step} (VD 8.25, 8.5)` };
    }
  }

  return { parsed: num, error: null };
}

/** So sánh 2 chuỗi điểm theo giá trị: "8", "8.0", "8,0" được coi là như nhau. */
export function normalizeScoreText(raw: string | undefined | null): string {
  const trimmed = (raw ?? "").trim().replace(/,/g, ".");
  if (trimmed === "") return "";
  const num = Number(trimmed);
  return Number.isFinite(num) ? String(num) : trimmed;
}

/** "8" → "8.0", "8.5" → "8.5", "8.25" → "8.25" */
export function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return Number.isInteger(value * 10) ? value.toFixed(1) : String(value);
}

/** Theo dõi một media query (dùng để chọn bảng desktop hay thẻ mobile). */
export function useMediaQuery(query: string, fallback = false): boolean {
  const read = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : fallback;

  const [matches, setMatches] = useState<boolean>(read);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * Chế độ demo (B-GLV-08): công cụ kiểm thử chỉ hiện khi bật trong Demo Panel.
 */
export function useDemoMode(): boolean {
  return usePreferences().demoMode;
}
