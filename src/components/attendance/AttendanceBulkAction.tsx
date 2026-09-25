import React from "react";
import { CheckCheck, RotateCcw, UserX } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";

export interface AttendanceBulkActionProps {
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  onReset: () => void;
  disabled?: boolean;
  hasChanges?: boolean;
  className?: string;
}

/**
 * AttendanceBulkAction (03 §7, B-GLV-03)
 * Có mặt tất cả (soft success) · Vắng tất cả · Đặt lại (ghost).
 * Không hỏi xác nhận: trang áp dụng ngay và hiện toast có "Hoàn tác".
 * Mobile: "Có mặt tất cả" chiếm trọn dòng đầu (thao tác hay dùng nhất).
 */
export const AttendanceBulkAction: React.FC<AttendanceBulkActionProps> = ({
  onMarkAllPresent,
  onMarkAllAbsent,
  onReset,
  disabled = false,
  hasChanges = false,
  className,
}) => {
  return (
    <div role="group" aria-label="Thao tác nhanh cho cả lớp" className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="soft"
        disabled={disabled}
        onClick={onMarkAllPresent}
        leftIcon={<CheckCheck />}
        className="grow basis-full bg-success-soft text-success hover:bg-success-soft/70 sm:grow-0 sm:basis-auto"
      >
        Có mặt tất cả
      </Button>

      <Button
        variant="outline"
        disabled={disabled}
        onClick={onMarkAllAbsent}
        leftIcon={<UserX className="text-danger" />}
        className="grow sm:grow-0"
      >
        Vắng tất cả
      </Button>

      <Button
        variant="ghost"
        disabled={disabled || !hasChanges}
        onClick={onReset}
        leftIcon={<RotateCcw />}
        title="Trả về dữ liệu đã lưu gần nhất"
        className="grow sm:grow-0"
      >
        Đặt lại
      </Button>
    </div>
  );
};
