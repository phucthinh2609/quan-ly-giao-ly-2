import React from "react";
import { Check, AlertCircle, Loader2, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { AttendanceSaveState } from "../../types";

export interface AttendanceSaveBarProps {
  totalStudents: number;
  markedCount: number;
  dirtyCount: number;
  state: AttendanceSaveState;
  onSave: () => void;
  onRetry?: () => void;
  errorMessage?: string;
  className?: string;
}

/**
 * Attendance SaveBar Component (§31 - 03_Component_Library)
 *
 * Wireframe reference:
 * ┌────────────────────────────────┐
 * │ 31/32 đã cập nhật     [LƯU]   │
 * └────────────────────────────────┘
 *
 * States:
 * - NO_CHANGES: Không có sửa đổi, nút LƯU bị disabled
 * - DIRTY: Có thay đổi chưa lưu, hiển thị số học sinh cập nhật + nút LƯU nổi bật
 * - SAVING: Đang gửi dữ liệu lên server (hiển thị spinner)
 * - SAVED: Đã lưu thành công (xanh lá cây)
 * - ERROR: Lỗi mạng/lưu thất bại (đỏ), KHÔNG được reset dữ liệu local, cho phép thử lại
 *
 * Tối ưu Touch target ≥ 48–52px, Sticky cố định chân trang trên mobile & desktop
 */
export const AttendanceSaveBar: React.FC<AttendanceSaveBarProps> = ({
  totalStudents,
  markedCount,
  dirtyCount,
  state,
  onSave,
  onRetry,
  errorMessage = "Lỗi kết nối máy chủ. Dữ liệu đã lưu tạm trên máy.",
  className = "",
}) => {
  const isNoChanges = state === "NO_CHANGES";
  const isSaving = state === "SAVING";
  const isSaved = state === "SAVED";
  const isError = state === "ERROR";
  const isDirty = state === "DIRTY";

  return (
    <div
      data-testid="attendance-save-bar"
      className={`
        sticky bottom-0 z-[250] w-full
        bg-white/95 backdrop-blur-md border-t border-[#E7E5E4]
        shadow-[0_-4px_20px_rgba(28,25,23,0.12)]
        transition-all duration-200
        ${className}
      `}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between gap-4">
        {/* Khối thông tin bên trái */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Trạng thái Icon */}
          <div className="shrink-0">
            {isSaving && (
              <div className="w-9 h-9 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
            {isSaved && (
              <div className="w-9 h-9 rounded-full bg-[#ECFDF3] text-[#168154] flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
            )}
            {isError && (
              <div className="w-9 h-9 rounded-full bg-[#FEF2F2] text-[#DC4C4C] flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            {(isNoChanges || isDirty) && (
              <div className="w-9 h-9 rounded-full bg-[#FAFAF9] text-[#78716C] border border-[#E7E5E4] flex items-center justify-center">
                <Save className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Nhãn văn bản thông tin */}
          <div className="min-w-0">
            {isError ? (
              <div className="space-y-0.5">
                <div className="text-[14px] sm:text-[15px] font-bold text-[#DC4C4C]">
                  Lưu điểm danh thất bại
                </div>
                <div className="text-[12px] text-[#78716C] truncate max-w-xs sm:max-w-md">
                  {errorMessage} (Dữ liệu đã đánh dấu vẫn được giữ nguyên)
                </div>
              </div>
            ) : isSaved ? (
              <div className="space-y-0.5">
                <div className="text-[14px] sm:text-[15px] font-bold text-[#168154]">
                  Đã lưu điểm danh thành công!
                </div>
                <div className="text-[12px] text-[#78716C]">
                  Đã đồng bộ {markedCount}/{totalStudents} học sinh
                </div>
              </div>
            ) : isSaving ? (
              <div className="space-y-0.5">
                <div className="text-[14px] sm:text-[15px] font-bold text-[#1C1917]">
                  Đang lưu điểm danh...
                </div>
                <div className="text-[12px] text-[#78716C]">
                  Đang gửi dữ liệu lên máy chủ
                </div>
              </div>
            ) : isDirty ? (
              <div className="space-y-0.5">
                <div className="text-[15px] sm:text-[16px] font-bold text-[#1C1917]">
                  <strong className="text-[#B4232C] font-mono">{dirtyCount}</strong> thay đổi chưa lưu
                </div>
                <div className="text-[12px] text-[#78716C]">
                  {markedCount}/{totalStudents} đã cập nhật
                </div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="text-[14px] sm:text-[15px] font-semibold text-[#57534E]">
                  {markedCount}/{totalStudents} đã cập nhật
                </div>
                <div className="text-[12px] text-[#A8A29E]">
                  Chưa có thay đổi mới
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Khối nút hành động bên phải */}
        <div className="shrink-0">
          {isError ? (
            <Button
              variant="danger"
              size="md"
              onClick={onRetry || onSave}
              className="!min-h-[48px] sm:!min-h-[50px] px-5 sm:px-6 font-bold text-[15px] shadow-sm cursor-pointer"
            >
              Thử lại
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              loading={isSaving}
              disabled={isNoChanges}
              onClick={onSave}
              className={`
                !min-h-[48px] sm:!min-h-[50px] px-6 sm:px-7 font-bold text-[15px] sm:text-[16px]
                shadow-sm transition-all cursor-pointer
                ${isDirty ? "animate-pulse" : ""}
              `}
            >
              LƯU ĐIỂM DANH
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
