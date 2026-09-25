import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export type ExcelImportStep = 1 | 2 | 3;

export interface ExcelImportStepperProps {
  current: ExcelImportStep;
  className?: string;
}

const STEPS: { step: ExcelImportStep; label: string }[] = [
  { step: 1, label: "Chọn file" },
  { step: 2, label: "Kiểm tra" },
  { step: 3, label: "Nhập" },
];

/**
 * Stepper 3 bước cho nhập điểm từ Excel: 1 Chọn file · 2 Kiểm tra · 3 Nhập.
 * Màn hẹp chỉ hiện nhãn của bước hiện tại (các bước khác vẫn có nhãn cho screen reader).
 */
export const ExcelImportStepper: React.FC<ExcelImportStepperProps> = ({ current, className }) => (
  <ol aria-label="Các bước nhập điểm từ Excel" className={cn("flex items-center gap-2", className)}>
    {STEPS.map(({ step, label }, index) => {
      const done = step < current;
      const active = step === current;
      const isLast = index === STEPS.length - 1;
      return (
        <li
          key={step}
          aria-current={active ? "step" : undefined}
          className={cn("flex min-w-0 items-center gap-2", !isLast && "flex-1")}
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold transition-colors duration-200",
              done && "bg-primary-soft text-primary-ink",
              active && "bg-primary text-on-primary",
              !done && !active && "bg-surface-2 text-ink-3"
            )}
          >
            {done ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : step}
          </span>
          <span
            className={cn(
              "text-sm font-semibold whitespace-nowrap",
              active ? "text-ink" : "sr-only sm:not-sr-only",
              done ? "sm:text-ink-2" : !active && "sm:text-ink-3"
            )}
          >
            {done && <span className="sr-only">Đã xong: </span>}
            {label}
          </span>
          {!isLast && (
            <span
              aria-hidden="true"
              className={cn("h-0.5 min-w-4 flex-1 rounded-full", done ? "bg-primary" : "bg-line-strong")}
            />
          )}
        </li>
      );
    })}
  </ol>
);
