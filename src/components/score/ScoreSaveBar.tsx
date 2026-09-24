import React from "react";
import { ScoreSaveState } from "../../types";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { Check, AlertCircle, AlertTriangle, Save, RotateCcw } from "lucide-react";

export interface ScoreSaveBarProps {
  state: ScoreSaveState;
  dirtyCount: number;
  totalCount: number;
  hasErrors: boolean;
  onSave: () => void;
  onReset?: () => void;
  className?: string;
}

/**
 * ScoreSaveBar Component (§22 - 03_Component_Library.md & Sitemap §9)
 *
 * Yêu cầu:
 * - Đủ 5 state: NO_CHANGES, DIRTY, SAVING, SAVED, ERROR
 * - Hiển thị đúng số lượng thay đổi chưa lưu (e.g. "5 thay đổi chưa lưu")
 * - Cảnh báo: "⚠ Có thay đổi chưa lưu" khi có draft
 * - Nếu có lỗi validation (hasErrors = true) -> nút Lưu bị vô hiệu hóa kèm tooltip/thông báo
 */
export const ScoreSaveBar: React.FC<ScoreSaveBarProps> = ({
  state,
  dirtyCount,
  totalCount,
  hasErrors,
  onSave,
  onReset,
  className = "",
}) => {
  const isSaving = state === "SAVING";
  const isSaved = state === "SAVED";
  const isError = state === "ERROR";
  const isDirty = state === "DIRTY" || dirtyCount > 0;
  const isNoChanges = state === "NO_CHANGES" && dirtyCount === 0;

  return (
    <div
      role="toolbar"
      aria-label="Thanh lưu bảng điểm"
      className={`
        sticky bottom-0 z-30 w-full bg-white border-t-2 border-[#E7E5E4] px-4 py-3 sm:px-6 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
        transition-all duration-200
        ${isDirty ? "bg-[#FFFBEB] border-[#FDE68A]" : ""}
        ${isError ? "bg-[#FEF2F2] border-[#FECDD3]" : ""}
        ${isSaved ? "bg-[#F0FDF4] border-[#BBF7D0]" : ""}
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Status & Counts */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          {isSaving && (
            <div className="flex items-center gap-2 text-[#B4232C] font-semibold text-[14px]">
              <Spinner size="sm" className="text-[#B4232C]" />
              <span>Đang lưu bảng điểm lên hệ thống...</span>
            </div>
          )}

          {isSaved && !isDirty && (
            <div className="flex items-center gap-2 text-[#168154] font-semibold text-[14px]">
              <div className="w-6 h-6 rounded-full bg-[#DCFCE7] text-[#168154] flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <span>Đã lưu thành công tất cả điểm</span>
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2 text-[#DC4C4C] font-semibold text-[14px]">
              <AlertCircle className="w-5 h-5 text-[#DC4C4C] flex-shrink-0" />
              <div>
                <span>Lưu không thành công! </span>
                <span className="text-[12px] font-normal text-[#57534E]">
                  (Dữ liệu vừa nhập vẫn được giữ nguyên an toàn, vui lòng thử lại)
                </span>
              </div>
            </div>
          )}

          {isDirty && !isSaving && !isError && (
            <div className="flex items-center gap-2 text-[#92400E] font-semibold text-[14px]">
              <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0" />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold">⚠ Có thay đổi chưa lưu</span>
                <span className="text-[#78716C] hidden sm:inline">•</span>
                <span className="bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-[6px] border border-[#FDE68A] font-bold">
                  {dirtyCount}/{totalCount} thay đổi chưa lưu
                </span>
              </div>
            </div>
          )}

          {isNoChanges && (
            <div className="text-[13px] text-[#78716C]">
              Chưa có thay đổi mới nào trên bảng điểm ({totalCount} học sinh)
            </div>
          )}
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2.5 justify-end">
          {/* Reset button if dirty */}
          {isDirty && onReset && (
            <Button
              variant="outline"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4 text-[#78716C]" />}
              onClick={onReset}
              disabled={isSaving}
              className="text-[#57534E]"
            >
              Hủy thay đổi
            </Button>
          )}

          {/* Save Button */}
          <Button
            variant={isError ? "danger" : "primary"}
            size="lg"
            leftIcon={
              isSaving ? (
                <Spinner size="sm" className="text-white" />
              ) : isError ? (
                <RotateCcw className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )
            }
            onClick={onSave}
            disabled={isSaving || (isNoChanges && !isError) || hasErrors}
            className={`
              !min-h-[48px] px-6 font-bold shadow-sm whitespace-nowrap cursor-pointer
              ${hasErrors ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {isSaving
              ? "Đang lưu..."
              : isError
              ? "Thử lưu lại"
              : hasErrors
              ? "Sửa lỗi để lưu"
              : isDirty
              ? `Lưu ${dirtyCount} điểm mới`
              : "Lưu tất cả"}
          </Button>
        </div>
      </div>
    </div>
  );
};
