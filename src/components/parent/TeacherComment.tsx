import React from "react";
import { MessageSquareQuote, UserCheck } from "lucide-react";

export interface TeacherCommentProps {
  comment: string;
  teacherName?: string;
  className?: string;
}

/**
 * TeacherComment (Wireframe C §8, §27)
 *
 * Wireframe C:
 * ┌─────────────────────────────────┐
 * │ 💬 Nhận xét của GLV             │
 * │ "Con chăm chỉ và tích cực       │
 * │  tham gia học tập."             │
 * └─────────────────────────────────┘
 *
 * Information Priority #6 in Parent Grade Overview.
 * Displays formal teacher feedback with quotes and author identity.
 */
export const TeacherComment: React.FC<TeacherCommentProps> = ({
  comment,
  teacherName = "GLV. Phụ trách lớp",
  className = "",
}) => {
  return (
    <div
      aria-label={`Nhận xét của Giáo lý viên: ${comment}`}
      className={`p-5 sm:p-6 rounded-[16px] bg-gradient-to-br from-[#FFFBEB]/60 via-white to-[#FFFDF7] border border-[#FDE68A] shadow-xs space-y-3 ${className}`}
    >
      {/* Header with icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <h4 className="text-[17px] sm:text-[18px] font-bold text-[#1C1917] font-serif">
            Nhận xét của GLV
          </h4>
        </div>

        <span className="text-[13px] font-medium text-[#78716C] bg-white border border-[#E7E5E4] px-2.5 py-1 rounded-full flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-[#168154]" />
          <span>{teacherName}</span>
        </span>
      </div>

      {/* Quote Body - Parent Font >= 18px (RULE-010) */}
      <blockquote className="text-[17px] sm:text-[18px] text-[#44403C] font-serif italic leading-relaxed pl-3 border-l-3 border-[#E3B341]">
        &ldquo;{comment}&rdquo;
      </blockquote>
    </div>
  );
};
