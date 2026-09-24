import React, { useState } from "react";
import { ChevronDown, Check, RefreshCw } from "lucide-react";
import { LinkedStudent } from "../../types";

export interface ParentChildSwitcherProps {
  children?: LinkedStudent[]; // or linkedStudents
  students?: LinkedStudent[]; // alias
  selectedChildId: string;
  onChange: (childId: string) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

/**
 * ParentChildSwitcher (§27, §30, Wireframe C §8, Sitemap §6)
 *
 * Wireframe C:
 * Con đang xem
 * ┌─────────────────────────────────┐
 * │ 👦 Nguyễn Văn An            ▼  │
 * │    Lớp 7A                      │
 * └─────────────────────────────────┘
 *
 * Ràng buộc:
 * - Đổi con → BẮT BUỘC refresh context dashboard/score/attendance/notification
 *   (gọi lại toàn bộ data fetch liên quan, không chỉ đổi label hiển thị).
 * - RULE-010: font-size ≥18px (body-lg), touch target ≥52–56px.
 * - RULE-012: KHÔNG dùng icon-only cho action nghiệp vụ quan trọng.
 */
export const ParentChildSwitcher: React.FC<ParentChildSwitcherProps> = ({
  children,
  students,
  selectedChildId,
  onChange,
  isLoading = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const studentList = children || students || [];
  const currentChild =
    studentList.find((s) => s.id === selectedChildId) || studentList[0];

  const handleSelectChild = async (childId: string) => {
    setIsOpen(false);
    if (childId !== selectedChildId) {
      await onChange(childId);
    }
  };

  if (!currentChild) {
    return null;
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label above selector as per Wireframe C */}
      <div className="flex items-center justify-between px-1">
        <label
          htmlFor="parent-child-button"
          className="text-[15px] sm:text-[16px] font-semibold text-[#78716C]"
        >
          Con đang xem
        </label>
        {isLoading && (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#B4232C] animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Đang tải dữ liệu của con...</span>
          </span>
        )}
      </div>

      {/* Main Switcher Trigger Button - touch target >= 56px, font >= 18px (RULE-010) */}
      <div className="relative">
        <button
          id="parent-child-button"
          type="button"
          disabled={isLoading}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Chọn học sinh. Con đang xem: ${currentChild.name}, ${currentChild.className}`}
          className={`w-full min-h-[56px] sm:min-h-[60px] p-3.5 sm:p-4 rounded-[14px] bg-white border text-left transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
            isOpen
              ? "border-[#B4232C] ring-3 ring-[#B4232C]/15"
              : "border-[#E7E5E4] hover:border-[#D6D3D1] hover:bg-[#FAFAF9]"
          } ${isLoading ? "opacity-75 cursor-wait" : ""}`}
        >
          {/* Left: Avatar & Identity */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[22px] flex-shrink-0 shadow-xs">
              👦
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {currentChild.christianName && (
                  <span className="text-[14px] font-semibold text-[#B4232C] bg-[#FFF1F2] px-2 py-0.5 rounded-md">
                    {currentChild.christianName}
                  </span>
                )}
                <span className="text-[13px] font-mono text-[#A8A29E]">
                  {currentChild.code}
                </span>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1C1917] font-serif truncate mt-0.5">
                {currentChild.name}
              </h3>
              <p className="text-[14px] sm:text-[15px] font-medium text-[#57534E]">
                {currentChild.className} {currentChild.grade ? `· ${currentChild.grade}` : ""}
              </p>
            </div>
          </div>

          {/* Right: Dropdown arrow with clear label & touch area */}
          <div className="flex items-center gap-2 flex-shrink-0 text-[#78716C] pl-2">
            <span className="text-[14px] font-medium hidden sm:inline text-[#78716C]">
              Đổi con
            </span>
            <div
              className={`w-8 h-8 rounded-full bg-[#FAFAF9] flex items-center justify-center transition-transform duration-200 ${
                isOpen ? "rotate-180 bg-[#FFF1F2] text-[#B4232C]" : ""
              }`}
            >
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* Backdrop for mobile closing */}
        {isOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/20 sm:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Dropdown Options Menu */}
        {isOpen && (
          <div
            role="listbox"
            aria-label="Danh sách các con liên kết"
            className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-[16px] border border-[#E7E5E4] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-2 space-y-1.5"
          >
            <div className="px-3 py-2 text-[13px] font-semibold uppercase tracking-wider text-[#A8A29E] border-b border-[#F5F5F4]">
              Chọn con để xem điểm và chuyên cần ({studentList.length} con)
            </div>

            {studentList.map((student) => {
              const isSelected = student.id === currentChild.id;
              return (
                <div
                  key={student.id}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => handleSelectChild(student.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectChild(student.id);
                    }
                  }}
                  className={`w-full min-h-[56px] p-3 rounded-[12px] flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#FFF1F2] border-[#FECDD3] text-[#1C1917]"
                      : "bg-white border-transparent hover:bg-[#FAFAF9] hover:border-[#E7E5E4]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center text-[20px] flex-shrink-0">
                      👦
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {student.christianName && (
                          <span className="text-[12px] font-semibold text-[#B4232C]">
                            {student.christianName}
                          </span>
                        )}
                        <span className="text-[16px] sm:text-[18px] font-bold text-[#1C1917] font-serif truncate">
                          {student.name}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#57534E]">
                        {student.className} · Mã: {student.code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[13px] font-bold bg-[#B4232C] text-white">
                        <Check className="w-4 h-4" />
                        <span>Đang xem</span>
                      </span>
                    ) : (
                      <span className="text-[13px] font-semibold text-[#78716C] hover:text-[#1C1917]">
                        Chọn
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
