import React, { useEffect, useRef } from "react";
import { CalendarCheck, Lock, Sparkles, Target, Zap } from "lucide-react";
import { celebrate, haptic } from "../../lib/motion";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { AchievementBadgeProps, BadgeMedal, isBadgeEarned } from "./AchievementBadge";

export interface BadgeDetailSheetProps {
  badge: AchievementBadgeProps | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sheet chi tiết huy hiệu (B-HS-04): tên · cách đạt · XP thưởng · ngày đạt hoặc tiến độ.
 * Huy hiệu NEW → hiệu ứng ăn mừng khi mở (celebrate tự tắt khi reduced-motion).
 */
export const BadgeDetailSheet: React.FC<BadgeDetailSheetProps> = ({ badge, isOpen, onClose }) => {
  const medalRef = useRef<HTMLSpanElement>(null);
  const badgeId = badge?.id;
  const isNew = badge?.status === "NEW";

  useEffect(() => {
    if (!isOpen || !isNew) return;
    const timer = window.setTimeout(() => {
      celebrate(medalRef.current, { count: 20 });
      haptic(14);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [isOpen, isNew, badgeId]);

  if (!badge) return null;

  const earned = isBadgeEarned(badge.status);
  const progress = badge.progress;
  const hint = badge.progressText;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={badge.title}
      description={earned ? (isNew ? "Huy hiệu mới của em!" : "Em đã có huy hiệu này") : "Em chưa có huy hiệu này"}
      footer={
        <Button variant={earned ? "primary" : "outline"} size="lg" fullWidth onClick={onClose} className="min-h-13">
          {earned ? "Tuyệt vời!" : "Em sẽ cố gắng!"}
        </Button>
      }
    >
      <div className="space-y-5 pb-2">
        <div className="flex flex-col items-center gap-3 pt-2 text-center">
          <BadgeMedal ref={medalRef} icon={badge.icon} status={badge.status} tone={badge.tone} size="lg" />
          {isNew && (
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-sm font-bold text-on-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              Mới nhận
            </span>
          )}
          {!earned && (
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 text-sm font-semibold text-ink-2">
              <Lock className="size-4" aria-hidden="true" />
              Chưa mở khóa
            </span>
          )}
        </div>

        <div className="rounded-card bg-surface-2 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-2">
            <Target className="size-4 text-grape" aria-hidden="true" />
            Cách nhận huy hiệu
          </p>
          <p className="mt-1.5 text-base leading-relaxed text-ink">{badge.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {badge.xpReward !== undefined && (
            <div className="flex items-center gap-3 rounded-card border border-line p-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-grape-soft text-grape">
                <Zap className="size-5 fill-current" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-ink-2">XP thưởng</p>
                <p className="font-mono text-lg font-bold text-ink">+{badge.xpReward} XP</p>
              </div>
            </div>
          )}

          {earned ? (
            <div className="flex items-center gap-3 rounded-card border border-line p-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-success-soft text-success">
                <CalendarCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-ink-2">Ngày em nhận</p>
                <p className="font-mono text-lg font-bold text-ink">{badge.unlockedAt ?? "Gần đây"}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-card border border-line p-4">
              <p className="text-sm text-ink-2">Tiến độ của em</p>
              {progress ? (
                <>
                  <p className="font-mono text-lg font-bold text-ink">
                    {progress.current}/{progress.total}
                  </p>
                  <ProgressBar
                    value={progress.current}
                    max={progress.total}
                    tone="grape"
                    size="md"
                    label={`Tiến độ ${badge.title}: ${progress.current} trên ${progress.total}`}
                    className="mt-2"
                  />
                </>
              ) : null}
              {hint && <p className="mt-2 text-base font-semibold text-ink">{hint}</p>}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
