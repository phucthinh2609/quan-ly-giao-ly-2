import React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";
import { haptic } from "../../lib/motion";

export const QUICK_FILL_VALUES: number[] = [10, 9, 8, 7, 6, 5];

export interface QuickFillBarProps {
  /** Các giá trị điền nhanh, mặc định 10 · 9 · 8 · 7 · 6 · 5 */
  values?: number[];
  onPick: (value: number) => void;
  /** Tên học sinh đang nhập — dùng cho aria-label */
  targetName?: string;
  /** Render vào document.body để không bị ảnh hưởng bởi transform của phần tử cha. Mặc định true. */
  portal?: boolean;
  className?: string;
}

// Giữ focus ở ô điểm khi chạm chip (không để chip "cướp" focus làm đóng bàn phím).
const keepInputFocus = (event: React.SyntheticEvent) => event.preventDefault();

/**
 * Dải chip điền nhanh (B-GLV-07) — chỉ hiện trên màn nhỏ (< md) khi có ô điểm đang focus.
 * Nằm ngay trên thanh Lưu; chạm chip → điền điểm và nhảy sang em kế tiếp (do cha xử lý).
 */
export const QuickFillBar: React.FC<QuickFillBarProps> = ({
  values = QUICK_FILL_VALUES,
  onPick,
  targetName,
  portal = true,
  className,
}) => {
  const bar = (
    <div
      role="group"
      aria-label={targetName ? `Điền nhanh điểm cho ${targetName}` : "Điền nhanh điểm"}
      className={cn(
        "fixed inset-x-3 z-40 flex items-center gap-1.5 rounded-full border border-line bg-surface/90 p-1.5 shadow-float backdrop-blur-xl md:hidden",
        "bottom-[calc(5.75rem_+_var(--score-savebar-h,4.25rem)_+_0.5rem_+_env(safe-area-inset-bottom))]",
        className
      )}
    >
      {values.map((v) => (
        <button
          key={v}
          type="button"
          tabIndex={-1}
          onPointerDown={keepInputFocus}
          onMouseDown={keepInputFocus}
          onClick={() => {
            haptic();
            onPick(v);
          }}
          aria-label={`Điền ${v} điểm`}
          className={cn(
            "h-11 min-w-0 flex-1 rounded-full bg-surface-2 font-mono text-lg font-semibold text-ink tabular-nums select-none",
            "transition-[background-color,color,transform] duration-150 ease-out-soft",
            "hover:bg-primary-soft hover:text-primary-ink active:scale-95 active:bg-primary active:text-on-primary"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );

  if (portal && typeof document !== "undefined") {
    return createPortal(bar, document.body);
  }
  return bar;
};
