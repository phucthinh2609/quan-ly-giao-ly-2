import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { SubjectScoreSummary } from "../../types";

export interface SubjectScoreCardProps {
  subject: SubjectScoreSummary;
  onSelect?: (subject: SubjectScoreSummary) => void;
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * SubjectScoreCard (§27, Wireframe C §8, Wireframe §9)
 *
 * Wireframe C layout:
 * ┌──────────────────────────────┐
 * │ 📖 Giáo lý                   │
 * │ Điểm TB                8.5   │
 * │ GK 8.0   CK 9.0              │
 * └──────────────────────────────┘
 *
 * Ràng buộc:
 * - Hiển thị đúng format: tên môn + icon, Điểm TB, GK/CK.
 * - Cho phép chạm mở rộng để xem chi tiết điểm thành phần (Miệng, 15', GK, CK)
 *   theo Wireframe §9.
 * - RULE-010: font-size ≥18px, touch target ≥52–56px.
 */
export const SubjectScoreCard: React.FC<SubjectScoreCardProps> = ({
  subject,
  onSelect,
  defaultExpanded = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const {
    subjectName,
    icon,
    averageScore,
    midtermScore,
    finalScore,
    oralScore,
    quizScore,
    comment,
  } = subject;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onSelect) {
      onSelect(subject);
    }
  };

  return (
    <div
      className={`rounded-[16px] bg-white border transition-all shadow-xs ${
        isExpanded
          ? "border-[#B4232C]/40 ring-2 ring-[#B4232C]/10"
          : "border-[#E7E5E4] hover:border-[#D6D3D1]"
      } ${className}`}
    >
      {/* Main Touch Area - min touch target >= 56px, font >= 18px (RULE-010) */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-label={`Môn ${subjectName}, Điểm trung bình: ${averageScore.toFixed(1)}, Giữa kỳ: ${midtermScore ?? "Chưa có"}, Cuối kỳ: ${finalScore ?? "Chưa có"}`}
        className="w-full min-h-[56px] p-4 sm:p-5 text-left flex flex-col justify-between gap-3 cursor-pointer select-none"
      >
        {/* Row 1: Icon + Tên môn (font-size >= 18px) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[22px] sm:text-[24px] flex-shrink-0" role="img" aria-hidden="true">
              {icon || "📖"}
            </span>
            <h4 className="text-[18px] sm:text-[20px] font-bold text-[#1C1917] font-serif truncate">
              {subjectName}
            </h4>
          </div>

          {/* Expand indicator with text (RULE-012) */}
          <div className="flex items-center gap-1 text-[13px] font-semibold text-[#78716C]">
            <span>{isExpanded ? "Thu gọn" : "Chi tiết"}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#B4232C]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#78716C]" />
            )}
          </div>
        </div>

        {/* Row 2: Điểm TB (font >= 18px) */}
        <div className="flex items-baseline justify-between pt-1 border-t border-[#F5F5F4]">
          <span className="text-[16px] sm:text-[18px] font-medium text-[#57534E]">
            Điểm TB
          </span>
          <span className="text-[22px] sm:text-[24px] font-bold font-serif text-[#B4232C]">
            {averageScore.toFixed(1)}
          </span>
        </div>

        {/* Row 3: GK / CK đúng format chuẩn */}
        <div className="flex items-center justify-between text-[15px] sm:text-[16px] text-[#78716C] bg-[#FAFAF9] px-3.5 py-2 rounded-[10px] border border-[#F5F5F4]">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#57534E]">Giữa kỳ:</span>
            <span className="font-bold text-[#1C1917]">
              {midtermScore !== null && midtermScore !== undefined
                ? midtermScore.toFixed(1)
                : "—"}
            </span>
          </div>

          <div className="w-px h-4 bg-[#E7E5E4]" />

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#57534E]">Cuối kỳ:</span>
            <span className="font-bold text-[#1C1917]">
              {finalScore !== null && finalScore !== undefined
                ? finalScore.toFixed(1)
                : "—"}
            </span>
          </div>
        </div>
      </button>

      {/* Expandable Section: Detail component scores (Wireframe §9) */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#F5F5F4] bg-[#FAFAF9]/60 rounded-b-[16px] space-y-3 animate-in fade-in duration-150">
          <div className="text-[13px] font-bold uppercase tracking-wider text-[#78716C]">
            Thành phần điểm chi tiết
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[14px]">
            <div className="p-2.5 rounded-[10px] bg-white border border-[#E7E5E4] text-center">
              <div className="text-[#78716C] text-[12px]">Điểm Miệng</div>
              <div className="text-[17px] font-bold text-[#1C1917] mt-0.5">
                {oralScore !== null && oralScore !== undefined ? oralScore.toFixed(1) : "—"}
              </div>
            </div>

            <div className="p-2.5 rounded-[10px] bg-white border border-[#E7E5E4] text-center">
              <div className="text-[#78716C] text-[12px]">15 Phút</div>
              <div className="text-[17px] font-bold text-[#1C1917] mt-0.5">
                {quizScore !== null && quizScore !== undefined ? quizScore.toFixed(1) : "—"}
              </div>
            </div>

            <div className="p-2.5 rounded-[10px] bg-white border border-[#E7E5E4] text-center">
              <div className="text-[#78716C] text-[12px]">Giữa Kỳ (GK)</div>
              <div className="text-[17px] font-bold text-[#1C1917] mt-0.5">
                {midtermScore !== null && midtermScore !== undefined ? midtermScore.toFixed(1) : "—"}
              </div>
            </div>

            <div className="p-2.5 rounded-[10px] bg-white border border-[#E7E5E4] text-center">
              <div className="text-[#78716C] text-[12px]">Cuối Kỳ (CK)</div>
              <div className="text-[17px] font-bold text-[#1C1917] mt-0.5">
                {finalScore !== null && finalScore !== undefined ? finalScore.toFixed(1) : "—"}
              </div>
            </div>
          </div>

          {/* Teacher Subject Comment if present */}
          {comment && (
            <div className="p-3 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] text-[14px] sm:text-[15px] text-[#92400E] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Nhận xét môn: </span>
                <span>{comment}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
