import React, { useEffect, useRef } from "react";
import { Check, CheckCircle2, Plus, Zap } from "lucide-react";
import { cn } from "../../lib/cn";
import { celebrate, haptic } from "../../lib/motion";
import { Tone } from "../ui/tone";
import { IconTile } from "../ui/IconTile";
import { ProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";

export interface QuestCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  icon: React.ReactNode;
  tone?: Tone;
  current: number;
  target: number;
  /** Câu gợi ý ngắn khi chưa xong */
  hint?: string;
  xpReward?: number;
  /** Nút để em tự đánh dấu tiến độ (VD "Xong thêm 1 bài") */
  actionLabel?: string;
  onAction?: () => void;
  /** Bắn hiệu ứng ăn mừng khi vừa hoàn thành (mặc định bật) */
  celebrateOnComplete?: boolean;
}

/**
 * QuestCard (03 §10) — nhiệm vụ tuần: IconTile + tên + "2/3" + ProgressBar.
 * Hoàn thành → dấu tích, tone success và hiệu ứng ăn mừng (tắt khi reduced-motion).
 */
export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  icon,
  tone = "sky",
  current,
  target,
  hint,
  xpReward,
  actionLabel,
  onAction,
  celebrateOnComplete = true,
  className,
  ...rest
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const safeTarget = Math.max(1, target);
  const value = Math.min(current, safeTarget);
  const done = value >= safeTarget;
  const wasDone = useRef(done);

  useEffect(() => {
    if (done && !wasDone.current && celebrateOnComplete) {
      celebrate(cardRef.current, { count: 16 });
      haptic(12);
    }
    wasDone.current = done;
  }, [done, celebrateOnComplete]);

  return (
    <article
      ref={cardRef}
      className={cn(
        "flex h-full flex-col rounded-card border p-4 transition-colors duration-300 sm:p-5",
        done ? "border-success/30 bg-success-soft" : "border-line bg-surface shadow-card",
        className
      )}
      {...rest}
    >
      <div className="flex gap-4">
        <IconTile
          icon={done ? <Check strokeWidth={3} /> : icon}
          tone={done ? "success" : tone}
          solid={done}
          size="lg"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base leading-snug font-semibold text-ink sm:text-lg">{title}</h3>
            <span className="shrink-0 font-mono text-lg font-bold text-ink" aria-hidden="true">
              {value}/{safeTarget}
            </span>
          </div>

          <ProgressBar
            value={value}
            max={safeTarget}
            tone={done ? "success" : tone}
            size="md"
            label={`${title}: ${value} trên ${safeTarget}`}
            className="mt-2.5"
          />

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            {done ? (
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Em đã hoàn thành!
              </p>
            ) : (
              hint && <p className="text-sm text-ink-2">{hint}</p>
            )}
            {xpReward !== undefined && (
              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-grape-soft px-2.5 text-sm font-semibold text-ink">
                <Zap className="size-3.5 fill-grape text-grape" aria-hidden="true" />+{xpReward} XP
              </span>
            )}
          </div>
        </div>
      </div>

      {!done && onAction && actionLabel && (
        <Button
          variant="outline"
          size="md"
          fullWidth
          leftIcon={<Plus />}
          onClick={onAction}
          className="mt-4 min-h-13"
        >
          {actionLabel}
        </Button>
      )}
    </article>
  );
};
