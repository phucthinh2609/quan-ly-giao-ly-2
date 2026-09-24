import React from "react";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { ScoreValidationItem } from "../../types";

export interface ScoreValidationSummaryProps {
  errors: ScoreValidationItem[];
  onErrorClick: (studentId: string) => void;
  className?: string;
}

/**
 * ScoreValidationSummary Component (§22 - 03_Component_Library.md)
 *
 * Tính năng quan trọng:
 * - Hiển thị tổng quan các lỗi nhập điểm hiện tại
 * - Mỗi lỗi click được → scrollIntoView({ behavior: "smooth", block: "center" })
 *   và tự động focus vào đúng ô ScoreInput của học sinh bị lỗi đó.
 * - Không gây chặn (không mở modal), cho phép GLV xem danh sách và sửa từng em.
 */
export const ScoreValidationSummary: React.FC<ScoreValidationSummaryProps> = ({
  errors,
  onErrorClick,
  className = "",
}) => {
  if (errors.length === 0) {
    return (
      <div
        className={`p-3.5 sm:p-4 rounded-[12px] bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2.5 text-[#166534] ${className}`}
      >
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#168154]" />
        <div className="text-[13px] sm:text-[14px] font-medium">
          Tất cả điểm đã nhập đều hợp lệ (Thang điểm 0–10). Không có lỗi dữ liệu.
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Tóm tắt lỗi nhập điểm"
      className={`p-4 rounded-[14px] bg-[#FFF1F2] border-2 border-[#FECDD3] shadow-xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#DC4C4C] text-white flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[15px] sm:text-[16px] text-[#991B1B] font-serif">
              Có {errors.length} điểm chưa hợp lệ cần chỉnh sửa
            </h4>
            <p className="text-[12px] text-[#B4232C]">
              Bấm vào từng lỗi bên dưới để tự động cuộn đến và sửa ngay trên bảng điểm
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEE2E2] text-[#DC4C4C] border border-[#FECDD3]">
          {errors.length} Lỗi
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
        {errors.map((item) => (
          <button
            key={item.studentId}
            type="button"
            onClick={() => onErrorClick(item.studentId)}
            className="
              text-left p-2.5 sm:p-3 rounded-[10px] bg-white border border-[#FECDD3]
              hover:border-[#DC4C4C] hover:bg-[#FFF5F5] hover:shadow-xs
              transition-all flex items-center justify-between gap-3 group cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-[#DC4C4C]
            "
          >
            <div className="min-w-0 flex items-center gap-2">
              <span className="font-mono font-bold text-[12px] text-[#B4232C] bg-[#FEE2E2] px-1.5 py-0.5 rounded">
                #{String(item.orderNumber).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="font-bold text-[13px] text-[#1C1917] truncate">
                  {item.studentName}
                </div>
                <div className="text-[12px] text-[#DC4C4C] font-medium leading-tight">
                  {item.error}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#DC4C4C] text-[12px] font-semibold group-hover:translate-x-1 transition-transform flex-shrink-0">
              <span className="hidden sm:inline">Sửa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
