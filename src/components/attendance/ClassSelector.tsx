import React from "react";
import { GraduationCap, Users, ChevronDown } from "lucide-react";
import { ClassInfo } from "../../types";

export interface ClassSelectorProps {
  classes: ClassInfo[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
  disabled = false,
  className = "",
}) => {
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor="attendance-class-select"
        className="block text-[13px] font-bold text-[#44403C] font-serif"
      >
        Lớp giáo lý
      </label>

      {/* Select input kết hợp trực quan */}
      <div className="relative">
        <select
          id="attendance-class-select"
          value={selectedClassId}
          onChange={(e) => onSelectClass(e.target.value)}
          disabled={disabled}
          className="
            w-full min-h-[48px] px-4 py-2.5 pr-10 rounded-[12px]
            bg-white border border-[#E7E5E4] text-[#1C1917]
            font-bold text-[15px] sm:text-[16px] shadow-xs
            focus:outline-none focus:ring-2 focus:ring-[#B4232C] focus:border-transparent
            disabled:bg-[#F5F5F4] disabled:text-[#A8A29E] disabled:cursor-not-allowed
            appearance-none cursor-pointer
          "
        >
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} ({cls.studentCount} học sinh) — {cls.grade}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#78716C]">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Thông tin chi tiết lớp đang chọn */}
      {currentClass && (
        <div className="flex items-center gap-3 text-[12px] text-[#78716C] px-1 pt-0.5 flex-wrap">
          <span className="flex items-center gap-1 font-medium">
            <Users className="w-3.5 h-3.5 text-[#57534E]" />
            Sĩ số: <strong className="text-[#1C1917]">{currentClass.studentCount} em</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-[#57534E]" />
            {currentClass.grade}
          </span>
          {currentClass.room && (
            <>
              <span>•</span>
              <span>Phòng: <strong className="text-[#1C1917]">{currentClass.room}</strong></span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
