import React, { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, ClipboardList, PenLine, RotateCcw, WifiOff } from "lucide-react";
import { ScoreSaveState } from "../../types";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Spinner } from "../ui/Spinner";
import { ProgressRing } from "../ui/ProgressRing";
import { useToastOffset } from "../ui/Toast";
import { Tone } from "../ui/tone";
import { cn } from "../../lib/cn";
import { celebrate } from "../../lib/motion";

export interface ScoreSaveBarProps {
  state: ScoreSaveState;
  dirtyCount: number;
  totalCount: number;
  hasErrors: boolean;
  onSave: () => void;
  onReset?: () => void;
  className?: string;
  /** Số em đã có điểm hợp lệ — hiển thị "25/28 đã nhập" */
  enteredCount?: number;
  /** Số điểm lỗi — hiển thị "· 2 lỗi" */
  errorCount?: number;
  /**
   * Cho phép bấm Lưu khi còn lỗi (cha tự xử lý: báo lỗi + đưa tới ô lỗi đầu tiên).
   * Mặc định false: nút Lưu bị khóa khi còn lỗi (hành vi v1).
   */
  allowSaveWithErrors?: boolean;
}

/**
 * Thanh lưu nổi (03 §8, như AttendanceSaveBar): nằm trên bottom nav ở mobile,
 * góc dưới phải ở desktop. State: NO_CHANGES · DIRTY · SAVING · SAVED · ERROR.
 * Tự đẩy vùng toast lên trên, tự thêm khoảng trống cuối trang, ăn mừng khi lưu xong.
 */
export const ScoreSaveBar: React.FC<ScoreSaveBarProps> = ({
  state,
  dirtyCount,
  totalCount,
  hasErrors,
  onSave,
  onReset,
  className = "",
  enteredCount,
  errorCount,
  allowSaveWithErrors = false,
}) => {
  useToastOffset("11rem", "7.5rem");

  const barRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prevState = useRef<ScoreSaveState>(state);

  const isSaving = state === "SAVING";
  const isError = state === "ERROR";
  const isDirty = !isSaving && !isError && (state === "DIRTY" || dirtyCount > 0);
  const isSaved = state === "SAVED" && dirtyCount === 0;
  const isNoChanges = !isSaving && !isError && !isDirty && !isSaved;
  const errors = errorCount ?? (hasErrors ? 1 : 0);
  const showErrors = hasErrors || errors > 0;

  // Ăn mừng khi vừa lưu xong
  useEffect(() => {
    if (prevState.current === "SAVING" && state === "SAVED") {
      celebrate(buttonRef.current);
    }
    prevState.current = state;
  }, [state]);

  // Công bố chiều cao thanh để dải điền nhanh nằm ngay phía trên
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const root = document.documentElement;
    const update = () => root.style.setProperty("--score-savebar-h", `${el.offsetHeight}px`);
    update();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(el);
    return () => {
      observer?.disconnect();
      root.style.removeProperty("--score-savebar-h");
    };
  }, []);

  let tone: Tone = "neutral";
  let statusIcon: React.ReactNode = <ClipboardList />;
  let subtitle: React.ReactNode = "Chưa có thay đổi";
  let subtitleClass = "text-ink-3";

  if (isSaving) {
    tone = "primary";
    statusIcon = <Spinner size="xs" color="current" />;
    subtitle = "Đang lưu...";
  } else if (isError) {
    tone = "danger";
    statusIcon = <WifiOff />;
    subtitle = "Chưa lưu được, điểm vẫn còn trên máy";
    subtitleClass = "text-danger";
  } else if (isDirty && showErrors) {
    tone = "danger";
    statusIcon = <AlertCircle />;
    subtitle = errorCount !== undefined ? `Sửa ${errorCount} lỗi trước khi lưu` : "Sửa lỗi trước khi lưu";
    subtitleClass = "text-danger";
  } else if (isDirty) {
    tone = "warning";
    statusIcon = <PenLine />;
    subtitle = (
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full bg-warning" aria-hidden="true" />
        <span>
          <span className="font-mono tabular-nums">{dirtyCount}</span> thay đổi chưa lưu
        </span>
      </span>
    );
    subtitleClass = "text-ink-2";
  } else if (isSaved) {
    tone = "success";
    statusIcon = <CheckCircle2 />;
    subtitle = "Đã lưu tất cả";
    subtitleClass = "text-success";
  }

  const saveDisabled =
    isSaving || isNoChanges || isSaved || (!allowSaveWithErrors && hasErrors && !isError);

  return (
    <>
      {/* Khoảng trống cuối trang để hàng cuối không bị thanh nổi che */}
      <div aria-hidden="true" className="h-28 lg:h-12" />

      <div
        ref={barRef}
        role="region"
        aria-label="Lưu bảng điểm"
        className={cn(
          "@container fixed inset-x-3 bottom-[calc(5.75rem_+_env(safe-area-inset-bottom))] z-40",
          "lg:bottom-6 lg:left-auto lg:right-6 lg:w-[30rem]",
          "rounded-card border border-line bg-surface/90 p-3 pl-4 shadow-float backdrop-blur-xl",
          className
        )}
      >
        <div className="flex items-center gap-3">
          {enteredCount !== undefined ? (
            <ProgressRing
              value={enteredCount}
              max={Math.max(totalCount, 1)}
              tone={tone === "neutral" ? "primary" : tone}
              size="sm"
              thickness={12}
              label="Tiến độ nhập điểm"
              className="hidden shrink-0 @md:inline-flex"
            >
              <span className="flex text-ink-2 [&_svg]:size-4" aria-hidden="true">
                {statusIcon}
              </span>
            </ProgressRing>
          ) : (
            <span
              className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-2 @md:inline-flex [&_svg]:size-5"
              aria-hidden="true"
            >
              {statusIcon}
            </span>
          )}

          <div className="min-w-0 flex-1" aria-live="polite">
            <p className="truncate text-sm font-semibold text-ink">
              {enteredCount !== undefined ? (
                <>
                  <span className="font-mono tabular-nums">
                    {enteredCount}/{totalCount}
                  </span>{" "}
                  đã nhập
                </>
              ) : (
                <>
                  <span className="font-mono tabular-nums">{totalCount}</span> học sinh
                </>
              )}
              {showErrors && errorCount !== undefined && errorCount > 0 && (
                <span className="text-danger">
                  {" "}
                  · <span className="font-mono tabular-nums">{errorCount}</span> lỗi
                </span>
              )}
            </p>
            <p className={cn("truncate text-xs font-medium", subtitleClass)}>{subtitle}</p>
          </div>

          {onReset && (isDirty || isError) && (
            <IconButton
              aria-label="Hủy thay đổi"
              variant="ghost"
              size="md"
              icon={<RotateCcw />}
              onClick={onReset}
              disabled={isSaving}
            />
          )}

          <Button
            ref={buttonRef}
            variant="primary"
            onClick={onSave}
            loading={isSaving}
            disabled={saveDisabled}
            className="px-4"
          >
            {isError ? "Thử lại" : "Lưu tất cả"}
          </Button>
        </div>
      </div>
    </>
  );
};
