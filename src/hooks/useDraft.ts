import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================================
// useDraft — Lưu nháp tự động vào localStorage (B-GLV-04, B-GLV-07)
// key convention:
//   "qlgl.draft.attendance.{classId}.{date}"
//   "qlgl.draft.scores.{classId}.{subjectId}.{examType}"
// ============================================================================

export interface DraftRecord<T> {
  data: T;
  savedAt: string;
}

function readDraft<T>(key: string): DraftRecord<T> | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftRecord<T>;
    return parsed && typeof parsed === "object" && "data" in parsed ? parsed : null;
  } catch {
    return null;
  }
}

function writeDraft<T>(key: string, data: T) {
  try {
    const record: DraftRecord<T> = { data, savedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(record));
  } catch {
    // Hết dung lượng hoặc chế độ riêng tư — bỏ qua, không chặn thao tác.
  }
}

/**
 * - `draft`: bản nháp **có sẵn khi mở** (hoặc khi đổi key) — dùng để hiện banner "Khôi phục".
 *   Không cập nhật theo mỗi lần saveDraft để banner không nhấp nháy.
 * - `saveDraft(data)`: ghi nháp (debounce 400ms, tự flush khi unmount/đổi key).
 * - `clearDraft()`: xóa nháp (sau khi lưu thành công hoặc người dùng bỏ qua).
 */
export function useDraft<T>(key: string) {
  const [draft, setDraft] = useState<DraftRecord<T> | null>(() => readDraft<T>(key));
  const pending = useRef<{ key: string; data: T } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (pending.current) {
      writeDraft(pending.current.key, pending.current.data);
      pending.current = null;
    }
  }, []);

  useEffect(() => {
    setDraft(readDraft<T>(key));
    return () => flush();
  }, [key, flush]);

  const saveDraft = useCallback(
    (data: T) => {
      pending.current = { key, data };
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, 400);
    },
    [key, flush]
  );

  const clearDraft = useCallback(() => {
    window.clearTimeout(timer.current);
    pending.current = null;
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setDraft(null);
  }, [key]);

  return { draft, saveDraft, clearDraft };
}
