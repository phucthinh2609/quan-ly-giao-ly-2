import React from "react";
import { CheckCheck, UserX, RotateCcw } from "lucide-react";
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
 * AttendanceBulkAction Component (§21 - 03_Component_Library & §8 - Sitemap)
 *
 * Cung cấp 3 thao tác hàng loạt tối ưu tốc độ cho GLV:
 * 1. Đánh dấu tất cả Có mặt (Thường 90% các em đi học, chỉ cần 1 chạm đánh dấu toàn bộ sau đó đổi riêng các em vắng)
 * 2. Đánh dấu tất cả Vắng
 * 3. Reset (Khôi phục trạng thái ban đầu đã lưu trước khi chỉnh sửa)
 *
 * Touch target ≥ 48px, font chữ to, tương phản cao
 */
export const AttendanceBulkAction: React.FC<AttendanceBulkActionProps> = ({
  onMarkAllPresent,
  onMarkAllAbsent,
  onReset,
  disabled = false,
  hasChanges = false,
  className = "",
}) => {
  return (
    <div
      className={`
        p-3 sm:p-4 bg-white rounded-[14px] border border-[#E7E5E4] shadow-xs
        flex flex-wrap items-center justify-between gap-2.5
        ${className}
      `}
    >
      <div className="text-[13px] font-bold text-[#57534E] font-serif shrink-0 flex items-center gap-1.5">
        <span>Thao tác nhanh:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
        {/* Đánh dấu tất cả Có mặt */}
        <Button
          variant="outline"
          size="md"
          disabled={disabled}
          onClick={onMarkAllPresent}
          leftIcon={<CheckCheck className="w-4 h-4 text-[#168154]" />}
          className="
            !border-[#A7F3D0] !text-[#146C47] hover:!bg-[#ECFDF3] active:!bg-[#D1FAE5]
            !min-h-[44px] sm:!min-h-[46px] font-semibold text-[13px] sm:text-[14px]
          "
        >
          Tất cả Có mặt
        </Button>

        {/* Đánh dấu tất cả Vắng */}
        <Button
          variant="outline"
          size="md"
          disabled={disabled}
          onClick={onMarkAllAbsent}
          leftIcon={<UserX className="w-4 h-4 text-[#C73A3A]" />}
          className="
            !border-[#FECDD3] !text-[#C73A3A] hover:!bg-[#FEF2F2] active:!bg-[#FEE2E2]
            !min-h-[44px] sm:!min-h-[46px] font-semibold text-[13px] sm:text-[14px]
          "
        >
          Tất cả Vắng
        </Button>

        {/* Reset (Khôi phục trạng thái ban đầu) */}
        <Button
          variant="ghost"
          size="md"
          disabled={disabled || !hasChanges}
          onClick={onReset}
          leftIcon={<RotateCcw className="w-4 h-4 text-[#78716C]" />}
          className="
            !text-[#78716C] hover:!text-[#1C1917] hover:!bg-[#F5F5F4]
            !min-h-[44px] sm:!min-h-[46px] font-semibold text-[13px] sm:text-[14px]
          "
          title="Khôi phục trạng thái ban đầu chưa lưu"
        >
          Đặt lại (Reset)
        </Button>
      </div>
    </div>
  );
};
