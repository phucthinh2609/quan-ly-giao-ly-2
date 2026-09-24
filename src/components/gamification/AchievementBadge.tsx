import React from "react";
import { Lock, Sparkles, CheckCircle2, Award } from "lucide-react";

export type AchievementState = "LOCKED" | "AVAILABLE" | "UNLOCKED" | "NEW";

export interface AchievementBadgeProps {
  id: string;
  /**
   * Tên huy hiệu (VD: "Chuyên cần vàng", "Hiệp sĩ Lời Chúa", "Nguyện ngắm sốt sắng")
   */
  title: string;
  /**
   * Mô tả điều kiện đạt huy hiệu
   */
  description: string;
  /**
   * Biểu tượng hoặc emoji đại diện
   */
  icon: React.ReactNode;
  /**
   * Trạng thái huy hiệu:
   * - LOCKED: Muted / grayscale, khóa biểu tượng
   * - AVAILABLE: Có thể mở khóa / đủ điều kiện nhận
   * - UNLOCKED: Đã nhận thành công, màu sắc rực rỡ đầy đủ
   * - NEW: Mới nhận gần đây, có thông báo viền nhẹ và nhãn MỚI
   */
  status: AchievementState;
  /**
   * Điểm kinh nghiệm (XP) thưởng khi đạt huy hiệu
   */
  xpReward?: number;
  /**
   * Ngày đạt được (dành cho UNLOCKED hoặc NEW)
   */
  unlockedAt?: string;
  /**
   * Độ hiếm / danh mục huy hiệu (Đồng, Bạc, Vàng, Kim Cương)
   */
  rarity?: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  /**
   * Callback khi nhấn vào huy hiệu
   */
  onClick?: () => void;
  className?: string;
}

const getRarityColor = (rarity?: string) => {
  switch (rarity) {
    case "LEGENDARY":
      return "from-[#E3B341] to-[#F28C28] text-white";
    case "EPIC":
      return "from-[#7C5CFC] to-[#E86A92] text-white";
    case "RARE":
      return "from-[#3B82F6] to-[#18B7C9] text-white";
    case "COMMON":
    default:
      return "from-[#D6D3D1] to-[#A8A29E] text-[#292524]";
  }
};

/**
 * AchievementBadge Component (§26 03_Component_Library)
 *
 * QUY TẮC BẢO VỆ RULE-015:
 * Gamification (AchievementBadge, XPProgress, màu game-*) CHỈ xuất hiện trong khu vực Student,
 * KHÔNG được lẫn vào Admin/GLV/Parent academic data view.
 *
 * States:
 * - LOCKED: grayscale, muted, lock icon
 * - AVAILABLE: subtle accent outline, pulse
 * - UNLOCKED: full color, unlocked checkmark
 * - NEW: subtle badge pulse & "MỚI" indicator
 */
export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  id,
  title,
  description,
  icon,
  status,
  xpReward,
  unlockedAt,
  rarity = "COMMON",
  onClick,
  className = "",
}) => {
  const isLocked = status === "LOCKED";
  const isAvailable = status === "AVAILABLE";
  const isUnlocked = status === "UNLOCKED";
  const isNew = status === "NEW";

  return (
    <div
      data-achievement-id={id}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative group rounded-2xl p-4 transition-all duration-300 flex flex-col items-center text-center ${
        isLocked
          ? "bg-[#FAFAF9] border border-[#E7E5E4] opacity-60 grayscale cursor-default"
          : isAvailable
          ? "bg-white border-2 border-dashed border-[#F4C95D] shadow-xs hover:shadow-md cursor-pointer hover:scale-[1.02]"
          : isNew
          ? "bg-gradient-to-b from-[#FFFBEB] to-white border-2 border-[#E3B341] shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.03] ring-2 ring-[#E3B341]/20"
          : "bg-white border border-[#E7E5E4] shadow-xs hover:shadow-md hover:border-[#7C5CFC]/50 cursor-pointer hover:scale-[1.02]"
      } ${className}`}
    >
      {/* "MỚI" or Status Tag */}
      {isNew && (
        <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E3B341] text-[#1C1917] shadow-sm flex items-center gap-1 animate-bounce">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Mới!</span>
        </span>
      )}

      {isAvailable && (
        <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#7C5CFC] text-white shadow-xs">
          Sẵn sàng nhận
        </span>
      )}

      {/* Icon Frame */}
      <div className="relative my-1">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] shadow-inner transition-transform group-hover:scale-110 ${
            isLocked
              ? "bg-[#E7E5E4] text-[#78716C]"
              : `bg-gradient-to-br ${getRarityColor(rarity)} shadow-md`
          }`}
        >
          {icon}
        </div>

        {/* Lock or Checkmark Overlay */}
        {isLocked && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#78716C] text-white flex items-center justify-center shadow-xs">
            <Lock className="w-3 h-3" />
          </div>
        )}
        {(isUnlocked || isNew) && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#22A06B] text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-2.5 space-y-1 w-full">
        <h4 className="text-[14px] font-bold text-[#1C1917] line-clamp-1 font-serif">
          {title}
        </h4>
        <p className="text-[12px] text-[#78716C] line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* XP or Unlocked Date */}
      <div className="mt-3 pt-2 w-full border-t border-[#F5F5F4] flex items-center justify-between text-[11px]">
        {xpReward ? (
          <span className="font-bold text-[#7C5CFC] flex items-center gap-1">
            <Award className="w-3 h-3 text-[#E3B341]" />
            +{xpReward} XP
          </span>
        ) : (
          <span className="text-[#A8A29E]">{rarity}</span>
        )}

        {isLocked ? (
          <span className="text-[#A8A29E]">Chưa mở</span>
        ) : unlockedAt ? (
          <span className="text-[#78716C] font-mono">{unlockedAt}</span>
        ) : (
          <span className="text-[#22A06B] font-semibold">Đã đạt</span>
        )}
      </div>
    </div>
  );
};
