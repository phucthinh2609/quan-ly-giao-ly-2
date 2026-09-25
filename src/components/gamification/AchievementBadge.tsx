import React from "react";
import { Lock, Check, Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";
import { Tone } from "../ui/tone";

export type AchievementState = "LOCKED" | "AVAILABLE" | "UNLOCKED" | "NEW";
export type AchievementRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type AchievementBadgeSize = "sm" | "md" | "lg";

export interface AchievementBadgeProps {
  id: string;
  /** Tên huy hiệu (VD: "Chuyên cần vàng", "Hiệp sĩ Lời Chúa") */
  title: string;
  /** Cách đạt huy hiệu */
  description: string;
  /** Icon Lucide đại diện */
  icon: React.ReactNode;
  /**
   * - LOCKED: còn xa, xám + khóa + gợi ý mở khóa
   * - AVAILABLE: sắp đạt, xám + khóa + tiến độ
   * - UNLOCKED: đã có, huy chương màu với viền gradient
   * - NEW: vừa nhận, thêm chấm nhấp nháy + nhãn "Mới"
   */
  status: AchievementState;
  /** XP thưởng khi đạt huy hiệu */
  xpReward?: number;
  /** Ngày đạt (UNLOCKED / NEW) */
  unlockedAt?: string;
  /** Độ hiếm — quyết định màu khi không truyền `tone` */
  rarity?: AchievementRarity;
  onClick?: () => void;
  className?: string;
  /** v2: màu huy chương (kid palette) */
  tone?: Tone;
  /** v2: tiến độ mở khóa */
  progress?: { current: number; total: number };
  /** v2: gợi ý mở khóa ngắn, VD "Còn 2 buổi nữa" */
  progressText?: string;
  /** v2: kích thước (sm cho kệ cuộn ngang, md cho lưới) */
  size?: AchievementBadgeSize;
}

// ----------------------------------------------------------------------------
// Medal color maps — chuỗi class đầy đủ để Tailwind nhận diện
// ----------------------------------------------------------------------------
const MEDAL_GRADIENT: Record<Tone, string> = {
  neutral: "from-ink-3 to-ink-2",
  primary: "from-primary to-coral",
  gold: "from-gold to-sun",
  success: "from-success to-mint",
  warning: "from-warning to-sun",
  danger: "from-danger to-coral",
  info: "from-info to-sky",
  sky: "from-sky to-grape",
  mint: "from-mint to-sky",
  sun: "from-sun to-coral",
  grape: "from-grape to-rose",
  coral: "from-coral to-rose",
  rose: "from-rose to-grape",
};

/** Màu icon trên huy chương: tone sáng dùng chữ tối, còn lại dùng on-solid (tự đảo ở Dark). */
const MEDAL_ICON: Record<Tone, string> = {
  neutral: "text-canvas",
  primary: "text-on-primary",
  gold: "text-night",
  success: "text-on-solid",
  warning: "text-on-solid",
  danger: "text-on-solid",
  info: "text-on-solid",
  sky: "text-on-solid",
  mint: "text-night",
  sun: "text-night",
  grape: "text-on-solid",
  coral: "text-on-solid",
  rose: "text-on-solid",
};

const RARITY_TONE: Record<AchievementRarity, Tone> = {
  COMMON: "sky",
  RARE: "grape",
  EPIC: "rose",
  LEGENDARY: "gold",
};

const MEDAL_SIZE: Record<AchievementBadgeSize, { rim: string; icon: string; lock: string }> = {
  sm: { rim: "max-w-16", icon: "[&_svg]:size-7", lock: "size-6 [&_svg]:size-3.5" },
  md: { rim: "max-w-18", icon: "[&_svg]:size-8", lock: "size-7 [&_svg]:size-4" },
  lg: { rim: "max-w-28", icon: "[&_svg]:size-12", lock: "size-9 [&_svg]:size-5" },
};

export function isBadgeEarned(status: AchievementState): boolean {
  return status === "UNLOCKED" || status === "NEW";
}

/** Câu mô tả trạng thái cho screen reader và dòng phụ. */
export function badgeStatusText(status: AchievementState, progressText?: string): string {
  if (status === "NEW") return "Mới nhận";
  if (status === "UNLOCKED") return "Đã có";
  return progressText ? `Chưa mở. ${progressText}` : "Chưa mở. Chạm để xem cách mở";
}

export interface BadgeMedalProps {
  icon: React.ReactNode;
  status: AchievementState;
  tone?: Tone;
  size?: AchievementBadgeSize;
  className?: string;
}

/** Huy chương tròn — dùng lại trong kệ, lưới và sheet chi tiết. */
export const BadgeMedal = React.forwardRef<HTMLSpanElement, BadgeMedalProps>(
  ({ icon, status, tone = "grape", size = "md", className }, ref) => {
    const earned = isBadgeEarned(status);
    const dims = MEDAL_SIZE[size];

    return (
      <span ref={ref} className={cn("relative mx-auto block aspect-square w-full", dims.rim, className)}>
        {/* Viền: gradient vàng khi đã có, xám khi chưa mở */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 rounded-full p-1",
            earned ? "bg-linear-to-br from-gold via-sun to-coral shadow-card" : "bg-surface-3"
          )}
        >
          <span
            className={cn(
              "flex size-full items-center justify-center rounded-full ring-2 ring-surface",
              earned
                ? cn("bg-linear-to-br", MEDAL_GRADIENT[tone], MEDAL_ICON[tone])
                : "bg-surface-2 text-ink-3 grayscale",
              status === "LOCKED" && "opacity-60",
              dims.icon
            )}
          >
            {icon}
          </span>
        </span>

        {/* Khóa cho huy hiệu chưa mở */}
        {!earned && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-0.5 -bottom-0.5 inline-flex items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-xs",
              dims.lock
            )}
          >
            <Lock strokeWidth={2.5} />
          </span>
        )}

        {/* Chấm nhấp nháy cho huy hiệu mới */}
        {status === "NEW" && (
          <span aria-hidden="true" className="absolute top-0.5 right-0.5 flex size-4">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-4 rounded-full bg-primary ring-2 ring-surface" />
          </span>
        )}
      </span>
    );
  }
);

BadgeMedal.displayName = "BadgeMedal";

/**
 * AchievementBadge (03 §10) — huy hiệu tròn lớn.
 * UNLOCKED: màu đầy đủ, viền gradient. NEW: + chấm nhấp nháy + nhãn "Mới".
 * AVAILABLE / LOCKED: xám, icon khóa và câu gợi ý cách mở (không chỉ dùng màu).
 * Gamification chỉ dùng trong khu Học sinh (RULE-015).
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
  className,
  tone,
  progress,
  progressText,
  size = "md",
}) => {
  const earned = isBadgeEarned(status);
  const medalTone = tone ?? RARITY_TONE[rarity];
  const hint = progressText ?? (progress ? `${progress.current}/${progress.total}` : undefined);
  const statusText = badgeStatusText(status, hint);

  const ariaLabel = [
    title,
    statusText,
    earned && unlockedAt ? `Ngày nhận ${unlockedAt}` : undefined,
    xpReward ? `Thưởng ${xpReward} XP` : undefined,
  ]
    .filter(Boolean)
    .join(". ");

  const content = (
    <>
      <BadgeMedal
        icon={icon}
        status={status}
        tone={medalTone}
        size={size}
        className={onClick ? "transition-transform duration-300 ease-spring group-hover:scale-105" : undefined}
      />

      <span className="flex w-full flex-col items-center gap-1">
        <span
          className={cn(
            "line-clamp-2 leading-snug font-semibold text-ink",
            size === "sm" ? "text-sm" : "text-sm sm:text-base"
          )}
        >
          {title}
        </span>

        {status === "NEW" && (
          <span className="inline-flex h-6 items-center gap-1 rounded-full bg-primary px-2 text-xs font-bold text-on-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Mới
          </span>
        )}

        {status === "UNLOCKED" && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            Đã có
          </span>
        )}

        {!earned && (
          <span className="line-clamp-2 text-xs leading-snug font-medium text-ink-2">
            {hint ?? description}
          </span>
        )}
      </span>
    </>
  );

  const baseClass = cn(
    "group relative flex w-full flex-col items-center gap-2.5 rounded-card border p-2.5 pt-3 text-center sm:p-3",
    status === "NEW"
      ? "border-gold/40 bg-gold-soft"
      : earned
        ? "border-line bg-surface shadow-xs"
        : "border-dashed border-line-strong bg-surface-2/60",
    className
  );

  if (!onClick) {
    return (
      <div data-achievement-id={id} role="img" aria-label={ariaLabel} className={baseClass}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      data-achievement-id={id}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        baseClass,
        "min-h-13 cursor-pointer select-none",
        "transition-[transform,box-shadow,background-color] duration-200 ease-out-soft",
        "hover:-translate-y-0.5 hover:shadow-float active:scale-[0.97]",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
      )}
    >
      {content}
    </button>
  );
};
