import React from "react";
import { Flame, Sparkles, Star } from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar } from "../ui/Avatar";
import { ProgressRing } from "../ui/ProgressRing";
import { ProgressBar } from "../ui/ProgressBar";
import { CountUp } from "../ui/CountUp";

export interface StudentHeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Tên gọi dùng trong lời chào, VD "Bảo" */
  name: string;
  /** Họ tên đầy đủ cho avatar */
  fullName?: string;
  avatarUrl?: string | null;
  level: number;
  rankTitle: string;
  currentXP: number;
  nextLevelXP: number;
  /** Số Chúa Nhật đi học liên tiếp */
  streak?: number;
}

/**
 * StudentHero (03 §10) — thẻ lớn gradient kid palette: avatar có vòng Level,
 * "Chào {tên}!", Level + danh hiệu, thanh XP lấp đầy động, chuỗi Chúa Nhật.
 *
 * Tương phản: chữ dùng `text-on-solid` (trắng ở Light, gần đen ở Dark). Ở Light có lớp
 * phủ night/25 để chữ trắng đạt ≥ 4.5:1 trên nền grape/sky/mint; ở Dark kid palette sáng hơn
 * nên bỏ lớp phủ và chữ tối tự đảo.
 */
export const StudentHero: React.FC<StudentHeroProps> = ({
  name,
  fullName,
  avatarUrl,
  level,
  rankTitle,
  currentXP,
  nextLevelXP,
  streak,
  className,
  ...rest
}) => {
  const neededXP = Math.max(0, nextLevelXP - currentXP);
  const nextLevel = level + 1;

  return (
    <section
      aria-label="Level và XP của em"
      className={cn(
        "relative isolate overflow-hidden rounded-card-lg bg-linear-to-br from-grape via-sky to-mint p-5 text-on-solid shadow-card sm:p-7",
        className
      )}
      {...rest}
    >
      {/* Lớp phủ tăng tương phản (chỉ Light) + hình trang trí */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/25 dark:bg-transparent" />
      <div aria-hidden="true" className="absolute -top-16 -right-12 -z-10 size-48 rounded-full bg-on-night/10" />
      <div aria-hidden="true" className="absolute -bottom-20 -left-16 -z-10 size-56 rounded-full bg-sun/25 blur-2xl" />
      <Sparkles
        aria-hidden="true"
        className="absolute top-5 right-5 -z-10 size-10 text-on-night/30 sm:size-14 dark:text-night/20"
      />

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative shrink-0">
          <ProgressRing
            value={currentXP}
            max={nextLevelXP}
            tone="sun"
            size="lg"
            thickness={8}
            label={`Tiến độ Level ${level}: ${currentXP} trên ${nextLevelXP} XP`}
            className="[&_circle:first-of-type]:stroke-night/25"
          >
            <Avatar name={fullName ?? name} src={avatarUrl ?? undefined} size="xl" />
          </ProgressRing>
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-1/2 inline-flex h-7 -translate-x-1/2 items-center gap-1 rounded-full bg-sun px-2.5 font-mono text-sm font-bold text-night shadow-card"
          >
            <Star className="size-3.5 fill-current" />
            {level}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl">Chào {name}!</p>
          <p className="mt-1.5 text-base font-semibold sm:text-lg">
            Level {level} · {rankTitle}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold">XP của em</span>
          <span className="font-mono text-base font-bold">
            <CountUp value={currentXP} /> / {nextLevelXP} XP
          </span>
        </div>
        <ProgressBar
          value={currentXP}
          max={nextLevelXP}
          size="lg"
          label={`XP: ${currentXP} trên ${nextLevelXP}`}
          fillClassName="bg-linear-to-r from-sun to-gold"
          className="[&_[role=progressbar]]:h-4 [&_[role=progressbar]]:bg-night/30"
        />
        <p className="text-base font-medium">
          {neededXP > 0 ? (
            <>
              Còn <strong className="font-bold">{neededXP} XP</strong> nữa lên Level {nextLevel}
            </>
          ) : (
            <strong className="font-bold">Em đã sẵn sàng lên Level {nextLevel}!</strong>
          )}
        </p>
      </div>

      {streak !== undefined && streak > 0 && (
        <p className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-sun px-4 text-base font-bold text-night shadow-xs">
          <Flame className="size-5 fill-current" aria-hidden="true" />
          {streak} Chúa Nhật liên tiếp
        </p>
      )}
    </section>
  );
};
