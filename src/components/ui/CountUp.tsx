import React, { useRef } from "react";
import { gsap, useGSAP } from "../../lib/motion";
import { cn } from "../../lib/cn";

export interface CountUpProps {
  value: number;
  decimals?: number;
  /** giây */
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function format(value: number, decimals: number) {
  return value.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Đếm số động (01 §11.2). Cập nhật textContent trực tiếp để không re-render mỗi frame.
 * Reduced-motion: hiển thị giá trị cuối ngay.
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  decimals = 0,
  duration = 0.9,
  prefix = "",
  suffix = "",
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ n: 0 });

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const render = () => {
        el.textContent = `${prefix}${format(current.current.n, decimals)}${suffix}`;
      };
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            current.current.n = value;
            render();
            return;
          }
          gsap.to(current.current, { n: value, duration, ease: "power2.out", onUpdate: render, onComplete: render });
        }
      );
      return () => mm.revert();
    },
    { dependencies: [value, decimals, prefix, suffix] }
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={`${prefix}${format(value, decimals)}${suffix}`}>
      {`${prefix}${format(0, decimals)}${suffix}`}
    </span>
  );
};
