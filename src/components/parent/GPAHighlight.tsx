import React from "react";
import { Award, Star } from "lucide-react";

export interface GPAHighlightProps {
  gpa: number;
  rankLabel?: string;
  periodLabel?: string;
  rankColor?: "gold" | "success" | "neutral";
  isLoading?: boolean;
  className?: string;
}

/**
 * GPAHighlight (Wireframe C §8, §27)
 *
 * Wireframe C:
 * ┌─────────────────────────────────┐
 * │ ĐIỂM TRUNG BÌNH                │
 * │             8.5                 │
 * │        Kết quả: Tốt             │
 * └─────────────────────────────────┘
 *
 * Information Priority #3 in Parent Grade Overview.
 * Displays GPA with high visual emphasis, Gold token styling, and readable typography.
 */
export const GPAHighlight: React.FC<GPAHighlightProps> = ({
  gpa,
  rankLabel = "Tốt",
  periodLabel,
  isLoading = false,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div
        className={`p-6 sm:p-7 rounded-[18px] bg-gradient-to-b from-[#FFFDF7] to-[#FFFBEB] border border-[#FDE68A] animate-pulse text-center space-y-3 min-h-[160px] flex flex-col justify-center items-center ${className}`}
      >
        <div className="w-24 h-4 bg-[#FDE68A] rounded-md" />
        <div className="w-28 h-12 bg-[#FDE68A] rounded-xl" />
        <div className="w-32 h-6 bg-[#FDE68A] rounded-full" />
      </div>
    );
  }

  return (
    <div
      aria-label={`Điểm trung bình ${periodLabel ? periodLabel + ":" : ""} ${gpa.toFixed(1)}, Kết quả: ${rankLabel}`}
      className={`relative p-6 sm:p-7 rounded-[18px] bg-gradient-to-b from-[#FFFDF7] via-[#FFFBEB] to-[#FEF3C7]/40 border-2 border-[#E3B341]/60 shadow-sm text-center overflow-hidden ${className}`}
    >
      {/* Subtle decorative background symbols */}
      <div className="absolute top-2 right-3 text-[#E3B341]/20 select-none pointer-events-none text-6xl">
        ★
      </div>
      <div className="absolute -bottom-2 -left-2 text-[#E3B341]/15 select-none pointer-events-none text-6xl">
        ✦
      </div>

      {/* Label: ĐIỂM TRUNG BÌNH */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3B341]/20 border border-[#E3B341]/40 text-[#92400E] text-[13px] sm:text-[14px] font-bold tracking-wider uppercase mb-1">
        <Star className="w-3.5 h-3.5 fill-[#E3B341] text-[#E3B341]" />
        <span>ĐIỂM TRUNG BÌNH {periodLabel ? `· ${periodLabel}` : ""}</span>
      </div>

      {/* Huge GPA Score */}
      <div className="my-2">
        <span className="text-[44px] sm:text-[52px] font-extrabold font-serif text-[#1C1917] tracking-tight leading-none">
          {gpa.toFixed(1)}
        </span>
        <span className="text-[20px] font-bold text-[#78716C] ml-1">
          / 10
        </span>
      </div>

      {/* Ranking Badge: "Kết quả: Tốt" */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E3B341] shadow-xs text-[#92400E] font-bold text-[16px] sm:text-[18px]">
        <Award className="w-4 h-4 text-[#D97706]" />
        <span>Kết quả: {rankLabel}</span>
      </div>
    </div>
  );
};
