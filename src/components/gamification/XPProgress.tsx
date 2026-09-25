import React from "react";
import { Flame, Star } from "lucide-react";
import { cn } from "../../lib/cn";
import { ProgressBar } from "../ui/ProgressBar";
import { CountUp } from "../ui/CountUp";

export interface XPProgressProps {
  /** Level hiện tại (VD: 5) */
  level: number;
  /** XP hiện có ở level này (VD: 860) */
  currentXP: number;
  /** XP cần để lên level kế tiếp (VD: 1000) */
  nextLevelXP: number;
  /** Danh hiệu (VD: "Hiệp sĩ nhỏ") */
  rankTitle?: string;
  /** Số Chúa Nhật đi học liên tiếp */
  streakDays?: number;
  className?: string;
}

/**
 * XPProgress (03 §10) — thẻ Level + thanh XP dày bo tròn, gradient grape → sky, lấp đầy động.
 * Gamification chỉ dùng trong khu Học sinh (RULE-015).
 */
export const XPProgress: React.FC<XPProgressProps> = ({
  level,
  currentXP,
  nextLevelXP,
  rankTitle = "Hiệp sĩ nhỏ",
  streakDays,
  className,
}) => {
  const neededXP = Math.max(0, nextLevelXP - currentXP);
  const nextLevel = level + 1;

  return (
    <div className={cn("rounded-card border border-line bg-surface p-5 shadow-card sm:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            aria-hidden="true"
            className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-card bg-linear-to-br from-grape to-sky text-on-solid shadow-card"
          >
            <span className="font-mono text-2xl font-bold">{level}</span>
            <Star className="absolute -top-1.5 -right-1.5 size-5 fill-gold text-gold" />
          </span>
          <div className="min-w-0">
            <p className="text-lg leading-tight font-bold tracking-tight text-ink">Level {level}</p>
            <p className="text-sm font-medium text-ink-2">{rankTitle}</p>
          </div>
        </div>

        {streakDays !== undefined && (
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-sun-soft px-3.5 text-sm font-semibold text-ink">
            <Flame className="size-5 fill-sun text-sun" aria-hidden="true" />
            {streakDays} Chúa Nhật liên tiếp
          </span>
        )}
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold text-ink-2">XP của em</span>
          <span className="font-mono text-base font-semibold text-ink">
            <CountUp value={currentXP} /> / {nextLevelXP} XP
          </span>
        </div>
        <ProgressBar
          value={currentXP}
          max={nextLevelXP}
          size="lg"
          label={`XP: ${currentXP} trên ${nextLevelXP}`}
          fillClassName="bg-linear-to-r from-grape to-sky"
          className="[&_[role=progressbar]]:h-3"
        />
        <p className="text-sm text-ink-2">
          {neededXP > 0 ? (
            <>
              Còn <strong className="font-semibold text-ink">{neededXP} XP</strong> nữa lên Level {nextLevel}
            </>
          ) : (
            <strong className="font-semibold text-ink">Em đã sẵn sàng lên Level {nextLevel}!</strong>
          )}
        </p>
      </div>
    </div>
  );
};
