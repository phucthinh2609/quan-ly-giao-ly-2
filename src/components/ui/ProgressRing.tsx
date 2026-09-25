import React, { useRef } from "react";
import { gsap, useGSAP } from "../../lib/motion";
import { cn } from "../../lib/cn";
import { TONE_STROKE, Tone } from "./tone";

export interface ProgressRingProps {
  value: number;
  max?: number;
  tone?: Tone;
  size?: "sm" | "md" | "lg" | "xl";
  /** Độ dày nét theo đơn vị viewBox (0–100). Mặc định 10. */
  thickness?: number;
  label?: string;
  animate?: boolean;
  /** Nội dung giữa vòng (số, icon, avatar) */
  children?: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<NonNullable<ProgressRingProps["size"]>, string> = {
  sm: "size-12",
  md: "size-16",
  lg: "size-24",
  xl: "size-32",
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  tone = "primary",
  size = "md",
  thickness = 10,
  label,
  animate = true,
  children,
  className,
}) => {
  const arcRef = useRef<SVGCircleElement>(null);
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const fromOffset = useRef(CIRCUMFERENCE);
  const targetOffset = CIRCUMFERENCE * (1 - pct);

  useGSAP(
    () => {
      const el = arcRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          if (!animate || ctx.conditions?.reduce) {
            gsap.set(el, { strokeDashoffset: targetOffset });
          } else {
            gsap.fromTo(
              el,
              { strokeDashoffset: fromOffset.current },
              { strokeDashoffset: targetOffset, duration: 1, ease: "power3.out" }
            );
          }
          fromOffset.current = targetOffset;
        }
      );
      return () => mm.revert();
    },
    { dependencies: [targetOffset, animate] }
  );

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("relative inline-flex shrink-0 items-center justify-center", sizeClasses[size], className)}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth={thickness} className="stroke-surface-3" />
        <circle
          ref={arcRef}
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={targetOffset}
          className={TONE_STROKE[tone]}
        />
      </svg>
      {children && <div className="relative flex flex-col items-center justify-center text-center">{children}</div>}
    </div>
  );
};
