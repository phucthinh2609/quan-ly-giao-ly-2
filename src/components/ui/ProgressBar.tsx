import React, { useRef } from "react";
import { gsap, useGSAP } from "../../lib/motion";
import { cn } from "../../lib/cn";
import { TONE_BG, Tone } from "./tone";

export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  /** Nhãn cho screen reader; hiển thị trên thanh nếu showValue */
  label?: string;
  showValue?: boolean;
  /** Tắt hiệu ứng lấp đầy */
  animate?: boolean;
  /** Class cho phần lấp đầy (VD gradient: "bg-linear-to-r from-grape to-sky") */
  fillClassName?: string;
  className?: string;
}

const heights: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  tone = "primary",
  size = "md",
  label,
  showValue = false,
  animate = true,
  fillClassName,
  className,
}) => {
  const fillRef = useRef<HTMLDivElement>(null);
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const fromPct = useRef(0);

  useGSAP(
    () => {
      const el = fillRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          if (!animate || ctx.conditions?.reduce) {
            gsap.set(el, { width: `${pct}%` });
          } else {
            gsap.fromTo(el, { width: `${fromPct.current}%` }, { width: `${pct}%`, duration: 0.9, ease: "power3.out" });
          }
          fromPct.current = pct;
        }
      );
      return () => mm.revert();
    },
    { dependencies: [pct, animate] }
  );

  return (
    <div className={cn("w-full", className)}>
      {showValue && label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-ink-2">{label}</span>
          <span className="font-semibold tabular-nums text-ink">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn("w-full overflow-hidden rounded-full bg-surface-3", heights[size])}
      >
        <div
          ref={fillRef}
          className={cn("h-full rounded-full", fillClassName ?? TONE_BG[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
