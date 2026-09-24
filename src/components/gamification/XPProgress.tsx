import React from "react";
import { Zap, Flame, Trophy } from "lucide-react";

export interface XPProgressProps {
  /**
   * Cấp độ hiện tại của học sinh (VD: 5)
   */
  level: number;
  /**
   * Số XP hiện có ở cấp độ này (VD: 860)
   */
  currentXP: number;
  /**
   * Tổng XP cần có để vượt qua cấp độ này (VD: 1000)
   */
  nextLevelXP: number;
  /**
   * Danh hiệu cấp độ (VD: "Chiến sĩ Kitô", "Hiệp sĩ Bác Ái")
   */
  rankTitle?: string;
  /**
   * Chuỗi ngày chuyên cần liên tiếp (Streak)
   */
  streakDays?: number;
  className?: string;
}

/**
 * XPProgress Component (§26 03_Component_Library)
 *
 * Ràng buộc:
 * - Props: level, currentXP, nextLevelXP
 * - Hiển thị:
 *   - Level indicator
 *   - Progress bar
 *   - "{currentXP}/{nextLevelXP}"
 *   - "X XP để lên Level Y"
 *
 * QUY TẮC BẢO VỆ RULE-015:
 * Gamification (AchievementBadge, XPProgress, màu game-*) CHỈ xuất hiện trong khu vực Student,
 * KHÔNG được lẫn vào Admin/GLV/Parent academic data view.
 */
export const XPProgress: React.FC<XPProgressProps> = ({
  level,
  currentXP,
  nextLevelXP,
  rankTitle = "Chiến sĩ Nhí",
  streakDays,
  className = "",
}) => {
  // Calculate percentage safely
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((currentXP / (nextLevelXP || 1)) * 100))
  );

  const neededXP = Math.max(0, nextLevelXP - currentXP);
  const nextLevel = level + 1;

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E7E5E4] p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden ${className}`}
    >
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7C5CFC]/10 to-[#E3B341]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

      {/* Top Header: Level Badge + Current XP + Streak */}
      <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Level Circle */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#3B82F6] text-white flex items-center justify-center font-bold text-[16px] shadow-sm font-serif">
            {level}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] sm:text-[16px] font-bold text-[#1C1917] font-serif">
                Cấp độ {level}
              </span>
              <Trophy className="w-3.5 h-3.5 text-[#E3B341]" />
            </div>
            <p className="text-[12px] text-[#78716C] font-medium">{rankTitle}</p>
          </div>
        </div>

        {/* Streak or XP badge */}
        <div className="flex items-center gap-2">
          {streakDays !== undefined && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8E7] text-[#B86F08] border border-[#FEF0C7] text-[12px] font-bold shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-[#F28C28] fill-[#F28C28]" />
              <span>{streakDays} ngày</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[13px] font-bold text-[#7C5CFC] bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#DBEAFE]">
            <Zap className="w-3.5 h-3.5 fill-[#7C5CFC]" />
            <span>{currentXP} / {nextLevelXP} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar with vibrant gamification colors */}
      <div className="relative z-10 space-y-1.5">
        <div className="w-full bg-[#E7E5E4] h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7C5CFC] via-[#3B82F6] to-[#18B7C9] transition-all duration-700 ease-out shadow-xs"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Footer info: "X XP để lên Level Y" */}
        <div className="flex items-center justify-between text-[12px] pt-0.5 text-[#78716C]">
          <span className="font-semibold text-[#1C1917]">
            {percentage}% chặng đường
          </span>
          <span className="font-medium text-[#7C5CFC]">
            <strong className="text-[#1C1917]">{neededXP} XP</strong> để lên Level {nextLevel}
          </span>
        </div>
      </div>
    </div>
  );
};
