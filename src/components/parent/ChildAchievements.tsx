import React, { useMemo } from "react";
import { CheckCircle2, CircleDashed, Trophy } from "lucide-react";
import { StudentAcademicReport } from "../../types";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { IconTile } from "../ui/IconTile";
import { ProgressBar } from "../ui/ProgressBar";
import { ProgressRing } from "../ui/ProgressRing";
import { Skeleton } from "../ui/Skeleton";
import { deriveChildMilestones } from "./parentInsights";

const PERIOD_PHRASE: Record<StudentAcademicReport["period"], string> = {
  HK1: "học kỳ I",
  HK2: "học kỳ II",
  FULL_YEAR: "cả năm học",
};

export interface ChildAchievementsProps {
  report: StudentAcademicReport | null;
  /** Tên gọi của con, VD "An" */
  childName: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * ChildAchievements — "Thành tích của con" (/parent/achievements).
 * Các mốc chuyên cần và học lực suy ra từ bảng điểm + điểm danh của kỳ đang chọn.
 */
export const ChildAchievements: React.FC<ChildAchievementsProps> = ({
  report,
  childName,
  isLoading = false,
  className,
}) => {
  const milestones = useMemo(() => (report ? deriveChildMilestones(report) : []), [report]);
  const achievedCount = milestones.filter((m) => m.achieved).length;

  if (isLoading) {
    return (
      <div className={cn("space-y-5", className)} role="status" aria-label="Đang tải thành tích">
        <div aria-hidden="true" className="flex items-center gap-5 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
          <Skeleton variant="circular" className="size-24 shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-1/2 rounded-full" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} aria-hidden="true" className="space-y-3 rounded-card border border-line bg-surface p-5 shadow-card">
              <Skeleton className="size-12 rounded-control" />
              <Skeleton className="h-5 w-2/3 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!report || milestones.length === 0) {
    return (
      <EmptyState
        className={className}
        icon={<Trophy />}
        title="Chưa có thành tích"
        description="Thành tích sẽ hiện khi GLV cập nhật điểm và điểm danh của con."
      />
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      <section
        data-reveal
        aria-label={`${childName} đã đạt ${achievedCount} trên ${milestones.length} mốc`}
        className="flex flex-wrap items-center gap-x-5 gap-y-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6"
      >
        <ProgressRing value={achievedCount} max={milestones.length} tone="gold" size="lg" thickness={9} label="Số mốc đã đạt">
          <span className="text-2xl font-bold tracking-tight text-ink tabular-nums">
            {achievedCount}
            <span className="text-base font-semibold text-ink-3">/{milestones.length}</span>
          </span>
        </ProgressRing>
        <div className="min-w-0 flex-1 basis-44">
          <p className="text-lg leading-snug font-semibold text-pretty text-ink">
            {achievedCount > 0
              ? `${childName} đã đạt ${achievedCount} mốc trong ${PERIOD_PHRASE[report.period] ?? report.periodLabel}`
              : `${childName} chưa đạt mốc nào trong ${PERIOD_PHRASE[report.period] ?? report.periodLabel}`}
          </p>
          <p className="mt-1 text-base text-ink-2">Tính từ điểm số và số buổi đi học của con.</p>
        </div>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {milestones.map((milestone) => {
          const Icon = milestone.icon;
          return (
            <li
              key={milestone.id}
              data-reveal
              className={cn(
                "flex flex-col gap-3 rounded-card border p-5 shadow-card",
                milestone.achieved ? "border-gold/40 bg-surface" : "border-line bg-surface"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <IconTile icon={<Icon />} tone={milestone.achieved ? "gold" : "neutral"} size="lg" />
                {milestone.achieved ? (
                  <Badge variant="success" size="lg" icon={<CheckCircle2 />}>
                    Đã đạt
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="lg" icon={<CircleDashed />}>
                    Chưa đạt
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="text-lg leading-snug font-semibold text-ink">{milestone.title}</h3>
                <p className="mt-0.5 text-base text-ink-2">{milestone.description}</p>
              </div>
              {!milestone.achieved && milestone.progress && (
                <div className="mt-auto space-y-1.5">
                  <ProgressBar
                    value={milestone.progress.value}
                    max={milestone.progress.max}
                    tone="gold"
                    size="sm"
                    label={milestone.progress.hint}
                  />
                  <p className="text-sm text-ink-3">{milestone.progress.hint}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
