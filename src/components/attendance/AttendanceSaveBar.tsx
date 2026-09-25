import React, { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, RotateCw } from "lucide-react";
import { AttendanceSaveState, AttendanceSummaryData } from "../../types";
import { cn } from "../../lib/cn";
import { celebrate } from "../../lib/motion";
import { Button } from "../ui/Button";
import { ProgressRing } from "../ui/ProgressRing";
import { useToastOffset } from "../ui/Toast";
import { formatAttendanceBrief, presentRateTone } from "./attendanceStatus";

export interface AttendanceSaveBarProps {
  totalStudents: number;
  markedCount: number;
  dirtyCount: number;
  state: AttendanceSaveState;
  onSave: () => void;
  onRetry?: () => void;
  errorMessage?: string;
  className?: string;
  /** Thống kê hiện tại → vòng tỷ lệ có mặt + tóm tắt "3 vắng · 1 muộn" */
  summary?: AttendanceSummaryData;
  /** Bắn hiệu ứng ăn mừng từ nút khi chuyển sang SAVED (mặc định bật) */
  celebrateOnSave?: boolean;
}

const ANNOUNCE: Partial<Record<AttendanceSaveState, string>> = {
  SAVING: "Đang lưu điểm danh",
  SAVED: "Đã lưu điểm danh",
  ERROR: "Lưu điểm danh chưa thành công",
};

/**
 * AttendanceSaveBar (03 §7): thanh nổi phía trên bottom nav (mobile) / góc dưới phải (desktop).
 * Trạng thái: NO_CHANGES (nút tắt) · DIRTY · SAVING (loading, giữ kích thước) · SAVED · ERROR ("Thử lại").
 * Khi hiển thị, đẩy vùng toast lên trên thanh để toast "Hoàn tác" không che nút Lưu.
 */
export const AttendanceSaveBar: React.FC<AttendanceSaveBarProps> = ({
  totalStudents,
  markedCount,
  dirtyCount,
  state,
  onSave,
  onRetry,
  errorMessage = "Không kết nối được máy chủ. Dữ liệu vẫn được giữ trên máy.",
  className,
  summary,
  celebrateOnSave = true,
}) => {
  useToastOffset("11rem", "7.5rem");

  const actionRef = useRef<HTMLDivElement>(null);
  const prevState = useRef<AttendanceSaveState>(state);

  useEffect(() => {
    if (celebrateOnSave && prevState.current !== "SAVED" && state === "SAVED") {
      celebrate(actionRef.current);
    }
    prevState.current = state;
  }, [state, celebrateOnSave]);

  const rate = summary ? summary.presentRate : totalStudents > 0 ? (markedCount / totalStudents) * 100 : 0;
  const rounded = Math.round(rate);
  const brief = summary ? formatAttendanceBrief(summary) : `${markedCount}/${totalStudents} em đã điểm danh`;

  const isError = state === "ERROR";
  const isSaved = state === "SAVED";

  let title: React.ReactNode = brief;
  let subtitle: React.ReactNode;
  switch (state) {
    case "DIRTY":
      subtitle = `${dirtyCount} thay đổi chưa lưu · đã giữ bản nháp`;
      break;
    case "SAVING":
      subtitle = "Đang lưu…";
      break;
    case "SAVED":
      title = (
        <span className="inline-flex items-center gap-1.5 text-success">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          Đã lưu điểm danh
        </span>
      );
      subtitle = brief;
      break;
    case "ERROR":
      title = (
        <span className="inline-flex items-center gap-1.5 text-danger">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          Chưa lưu được
        </span>
      );
      subtitle = errorMessage;
      break;
    default:
      subtitle = "Không có thay đổi mới";
  }

  return (
    <div
      role="region"
      aria-label="Lưu điểm danh"
      data-testid="attendance-save-bar"
      className={cn(
        "fixed inset-x-3 bottom-[calc(5.75rem_+_env(safe-area-inset-bottom))] z-30 mx-auto max-w-2xl",
        "lg:bottom-6 lg:left-auto lg:right-6 lg:mx-0 lg:w-[30rem]",
        "flex items-center gap-3 rounded-card border bg-surface/90 p-2 pl-2.5 shadow-float backdrop-blur-xl",
        "transition-[border-color] duration-200",
        isError ? "border-danger/40" : isSaved ? "border-success/30" : "border-line",
        className
      )}
    >
      <ProgressRing
        value={rate}
        max={100}
        tone={summary ? presentRateTone(rate) : "primary"}
        size="sm"
        thickness={11}
        label={`Tỷ lệ có mặt ${rounded}%`}
      >
        <span className="font-mono text-xs font-semibold tabular-nums text-ink">{rounded}%</span>
      </ProgressRing>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{title}</p>
        <p className={cn("truncate text-xs", isError ? "text-ink-2" : "text-ink-3")} title={typeof subtitle === "string" ? subtitle : undefined}>
          {subtitle}
        </p>
        <span className="sr-only" aria-live="polite">
          {ANNOUNCE[state] ?? ""}
        </span>
      </div>

      <div ref={actionRef} className="shrink-0">
        {isError ? (
          <Button variant="danger" onClick={onRetry ?? onSave} leftIcon={<RotateCw />}>
            Thử lại
          </Button>
        ) : isSaved ? (
          <span className="inline-flex h-(--control) items-center gap-2 rounded-full bg-success-soft px-4 text-sm font-semibold text-success">
            <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
            Đã lưu
          </span>
        ) : (
          <Button
            variant="primary"
            onClick={onSave}
            loading={state === "SAVING"}
            disabled={state === "NO_CHANGES"}
            aria-label="Lưu điểm danh"
          >
            <span className="sm:hidden">Lưu</span>
            <span className="hidden sm:inline">Lưu điểm danh</span>
          </Button>
        )}
      </div>
    </div>
  );
};
