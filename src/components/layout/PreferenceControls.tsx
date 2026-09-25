import React, { useEffect, useRef, useState } from "react";
import { Check, Moon, Sun, Type } from "lucide-react";
import { usePreferences, TEXT_SIZE_OPTIONS, TextSize } from "../../context/PreferencesContext";
import { gsap, prefersReducedMotion } from "../../lib/motion";
import { cn } from "../../lib/cn";

// ============================================================================
// PREFERENCE CONTROLS (03 §6.5) — Cỡ chữ & Giao diện Sáng/Tối
// ============================================================================

const SIZE_PREVIEW: Record<TextSize, string> = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

/** Hook đóng popover khi bấm ra ngoài hoặc nhấn Esc. */
export function useDismiss(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer, { passive: true });
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, ref]);
}

/** Hiệu ứng mở popover (scale + fade từ góc trên phải). */
export function usePopoverEnter(open: boolean, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: -6, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power3.out", transformOrigin: "top right" }
      );
    });
    return () => mm.revert();
  }, [open, ref]);
}

export interface TextSizeControlProps {
  /** Hiện chữ "Cỡ chữ" cạnh nút (dùng cho Phụ huynh) */
  showLabel?: boolean;
  className?: string;
}

export const TextSizeControl: React.FC<TextSizeControlProps> = ({ showLabel = false, className }) => {
  const { textSize, setTextSize } = usePreferences();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), wrapRef);
  usePopoverEnter(open, panelRef);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Chọn cỡ chữ"
        title="Cỡ chữ"
        className={cn(
          "inline-flex h-11 items-center justify-center gap-1.5 rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink active:scale-95",
          showLabel ? "px-3.5" : "w-11",
          open && "bg-surface-2 text-ink"
        )}
      >
        <Type className="size-5" aria-hidden="true" />
        {showLabel && <span className="hidden text-sm font-semibold sm:inline">Cỡ chữ</span>}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Cỡ chữ"
          className="absolute right-0 z-50 mt-2 w-64 rounded-card border border-line bg-surface p-2 shadow-float"
        >
          <p className="px-2.5 pt-1.5 pb-2 text-sm font-semibold text-ink-2">Cỡ chữ</p>
          {TEXT_SIZE_OPTIONS.map((opt) => {
            const selected = opt.value === textSize;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  setTextSize(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-control px-2.5 text-left transition-colors",
                  selected ? "bg-primary-soft text-primary-ink" : "text-ink hover:bg-surface-2"
                )}
              >
                <span className={cn("w-8 font-bold tracking-tight", SIZE_PREVIEW[opt.value])} aria-hidden="true">
                  Aa
                </span>
                <span className="flex-1 font-medium">{opt.label}</span>
                {selected && <Check className="size-5" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = usePreferences();
  const isDark = theme === "dark";
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    toggleTheme();
    if (iconRef.current && !prefersReducedMotion()) {
      gsap.fromTo(iconRef.current, { rotate: -90, scale: 0.6 }, { rotate: 0, scale: 1, duration: 0.4, ease: "back.out(1.8)" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isDark}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={isDark ? "Giao diện sáng" : "Giao diện tối"}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink active:scale-95",
        className
      )}
    >
      <span ref={iconRef} className="inline-flex" aria-hidden="true">
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </span>
    </button>
  );
};
