import React from "react";
import { Award } from "lucide-react";
import { cn } from "../../lib/cn";
import { scoreGrade } from "../../lib/format";
import { Badge, BadgeVariant } from "../ui/Badge";
import { CountUp } from "../ui/CountUp";
import { ProgressRing } from "../ui/ProgressRing";
import { Skeleton } from "../ui/Skeleton";
import { formatScore } from "./parentInsights";

export interface GPAHighlightProps {
  gpa: number;
  rankLabel?: string;
  periodLabel?: string;
  rankColor?: "gold" | "success" | "neutral";
  isLoading?: boolean;
  className?: string;
}

const GRADE_BADGE: Record<ReturnType<typeof scoreGrade>["tone"], BadgeVariant> = {
  success: "success",
  info: "info",
  warning: "warning",
  danger: "error",
};

/**
 * GPAHighlight (03 §9, 04 §11) — ProgressRing + điểm TB lớn (CountUp) + xếp loại.
 * Xếp loại lấy từ scoreGrade() để khớp câu tóm tắt ở trang chủ.
 */
export const GPAHighlight: React.FC<GPAHighlightProps> = ({ gpa, periodLabel, isLoading = false, className }) => {
  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className={cn("flex items-center gap-5 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6", className)}
      >
        <Skeleton variant="circular" className="size-24 shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-2/3 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded-full" />
        </div>
      </div>
    );
  }

  const grade = scoreGrade(gpa);

  return (
    <section
      aria-label={`Điểm trung bình${periodLabel ? ` ${periodLabel}` : ""}: ${formatScore(gpa)} trên 10, xếp loại ${grade.label}`}
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6",
        className
      )}
    >
      <ProgressRing value={gpa} max={10} tone={grade.tone} size="lg" thickness={9} label="Điểm trung bình trên thang 10">
        <CountUp value={gpa} decimals={1} className="text-3xl font-bold tracking-tight text-ink" />
      </ProgressRing>

      <div className="min-w-0 flex-1 basis-40">
        <p className="text-lg font-semibold text-ink">Điểm trung bình</p>
        {periodLabel && <p className="text-sm text-ink-3">{periodLabel} · thang điểm 10</p>}
        <Badge variant={GRADE_BADGE[grade.tone]} size="lg" icon={<Award />} className="mt-2.5">
          {grade.label}
        </Badge>
      </div>
    </section>
  );
};
