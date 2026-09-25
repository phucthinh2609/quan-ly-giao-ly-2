import React from "react";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { ScoreValidationItem } from "../../types";
import { cn } from "../../lib/cn";

export interface ScoreValidationSummaryProps {
  errors: ScoreValidationItem[];
  onErrorClick: (studentId: string) => void;
  className?: string;
}

/**
 * Tóm tắt lỗi nhập điểm (03 §8): card soft danger, mỗi lỗi là một chip bấm được
 * → cuộn tới và focus đúng ô điểm của học sinh (không mở modal).
 */
export const ScoreValidationSummary: React.FC<ScoreValidationSummaryProps> = ({
  errors,
  onErrorClick,
  className = "",
}) => {
  if (errors.length === 0) {
    return (
      <div
        role="status"
        className={cn("flex items-center gap-3 rounded-card bg-success-soft p-4 text-success", className)}
      >
        <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
        <p className="text-sm font-medium text-ink">Tất cả điểm đã nhập đều hợp lệ.</p>
      </div>
    );
  }

  return (
    <section
      aria-label="Tóm tắt lỗi nhập điểm"
      className={cn("rounded-card border border-danger/25 bg-danger-soft p-4 sm:p-5", className)}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-danger text-on-solid">
          <AlertCircle className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink">
            <span className="font-mono tabular-nums">{errors.length}</span> điểm cần sửa
          </h2>
          <p className="text-sm text-ink-2">Chạm vào tên để đến ô cần sửa.</p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {errors.map((item) => (
          <li key={item.studentId} className="min-w-0 max-w-full">
            <button
              type="button"
              onClick={() => onErrorClick(item.studentId)}
              title={item.error}
              aria-label={`Sửa điểm của ${item.studentName}: ${item.error}`}
              className={cn(
                "group inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-danger/30 bg-surface py-1.5 pr-3 pl-1.5 text-left",
                "text-sm font-semibold text-ink shadow-xs transition-[border-color,transform] duration-150 ease-out-soft",
                "hover:border-danger active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2"
              )}
            >
              <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-danger-soft px-2 font-mono text-xs font-semibold text-danger tabular-nums">
                {String(item.orderNumber).padStart(2, "0")}
              </span>
              <span className="truncate">{item.studentName}</span>
              <ArrowRight
                className="size-4 shrink-0 text-danger transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
