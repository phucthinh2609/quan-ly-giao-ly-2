import React from "react";
import { Student, AttendanceStatus } from "../../types";
import { Avatar } from "../ui/Avatar";
import { AttendanceQuickToggle } from "./AttendanceQuickToggle";

export interface AttendanceRowProps {
  student: Student;
  status: AttendanceStatus;
  disabled?: boolean;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  // Optional extension props for rich feedback without breaking interface
  isDirty?: boolean;
  isSaved?: boolean;
  hasError?: boolean;
  className?: string;
}

/**
 * AttendanceRow Component (§21 - 03_Component_Library)
 *
 * Phân cấp cấu trúc:
 * ├── StudentAvatar (với fallback tên tắt)
 * ├── StudentName (kèm Tên Thánh, STT, Mã số)
 * ├── AttendanceStatus (hiển thị trực quan)
 * └── QuickAction (AttendanceQuickToggle 1 chạm hoặc chọn menu)
 *
 * Tối ưu UX/UI cho Giáo lý viên & người lớn tuổi:
 * - Touch target ≥ 48px
 * - Font chữ rõ ràng, độ tương phản cao
 * - Highlight viền/nền khi có thay đổi (dirty) hoặc lỗi (error)
 */
export const AttendanceRow: React.FC<AttendanceRowProps> = ({
  student,
  status,
  disabled = false,
  onStatusChange,
  isDirty = false,
  isSaved = false,
  hasError = false,
  className = "",
}) => {
  const handleStatusChange = (newStatus: AttendanceStatus) => {
    onStatusChange(student.id, newStatus);
  };

  return (
    <div
      data-testid={`attendance-row-${student.id}`}
      className={`
        group relative flex items-center justify-between gap-3 sm:gap-4
        p-3.5 sm:p-4 rounded-[14px] border transition-all duration-200
        min-h-[64px] sm:min-h-[72px]
        ${
          disabled
            ? "bg-[#FAFAF9] border-[#E7E5E4] opacity-75"
            : hasError
            ? "bg-[#FEF2F2] border-[#FECDD3] ring-1 ring-[#F87171]"
            : isDirty
            ? "bg-[#FFFBEB] border-[#FDE68A] shadow-xs"
            : "bg-white border-[#E7E5E4] hover:border-[#D6D3D1] hover:shadow-xs"
        }
        ${className}
      `}
    >
      {/* Cột trái: STT + Avatar + Thông tin học sinh */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
        {/* Số thứ tự (STT) lớn, rõ ràng */}
        <div className="shrink-0 w-7 sm:w-8 text-center">
          <span className="font-mono text-[13px] sm:text-[14px] font-bold text-[#78716C]">
            {student.orderNumber < 10
              ? `0${student.orderNumber}`
              : student.orderNumber}
          </span>
        </div>

        {/* Avatar học sinh */}
        <div className="shrink-0">
          <Avatar
            src={student.avatarUrl}
            name={student.name}
            size="md"
            roleBadge="HS"
            className="ring-2 ring-white shadow-xs"
          />
        </div>

        {/* Họ tên, Tên Thánh, Mã số */}
        <div className="min-w-0 flex-1 space-y-0.5">
          {/* Tên Thánh (Christian name) nếu có */}
          {student.christianName && (
            <div className="text-[12px] sm:text-[13px] font-bold text-[#B4232C] uppercase tracking-wide">
              {student.christianName}
            </div>
          )}

          {/* Họ và tên chính */}
          <div className="font-bold text-[15px] sm:text-[16px] text-[#1C1917] truncate leading-snug">
            {student.name}
          </div>

          {/* Mã học sinh & ghi chú phụ */}
          <div className="flex items-center gap-2 text-[12px] text-[#78716C] flex-wrap">
            <span className="font-mono font-medium">{student.code}</span>
            {student.gender && (
              <span className="text-[#A8A29E]">• {student.gender === "MALE" ? "Nam" : "Nữ"}</span>
            )}
            {isDirty && (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#8B6419]">
                Chưa lưu
              </span>
            )}
            {isSaved && !isDirty && (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#146C47]">
                Đã lưu
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cột phải: AttendanceQuickToggle (One-touch cycle + Full Menu) */}
      <div className="shrink-0 ml-2">
        <AttendanceQuickToggle
          status={status}
          onChange={handleStatusChange}
          disabled={disabled}
          ariaLabel={`Điểm danh cho em ${student.name}`}
        />
      </div>
    </div>
  );
};
