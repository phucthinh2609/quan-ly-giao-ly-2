import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SubjectScoreSummary } from "../../types";
import { cn } from "../../lib/cn";
import { scoreGrade } from "../../lib/format";
import { IconTile } from "../ui/IconTile";
import { ProgressBar } from "../ui/ProgressBar";
import { TONE_TEXT, toneFromString } from "../ui/tone";
import { formatScore, subjectIcon } from "./parentInsights";

export interface SubjectScoreCardProps {
  subject: SubjectScoreSummary;
  onSelect?: (subject: SubjectScoreSummary) => void;
  defaultExpanded?: boolean;
  className?: string;
}

const hasValue = (value: number | null | undefined): value is number =>
  value !== null && value !== undefined && !Number.isNaN(value);

/**
 * SubjectScoreCard (03 §9, 04 §11) — IconTile môn · tên · điểm TB lớn ·
 * Giữa kỳ / Cuối kỳ · thanh tiến độ nhỏ. Chạm "Xem chi tiết" để xem điểm miệng,
 * 15 phút và nhận xét môn (nếu có).
 */
export const SubjectScoreCard: React.FC<SubjectScoreCardProps> = ({
  subject,
  onSelect,
  defaultExpanded = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const detailId = useId();
  const { subjectName, averageScore, midtermScore, finalScore, oralScore, quizScore, comment } = subject;

  const grade = scoreGrade(averageScore);
  const Icon = subjectIcon(subjectName);
  const hasDetails = hasValue(oralScore) || hasValue(quizScore) || Boolean(comment);

  const toggle = () => {
    setIsExpanded((open) => !open);
    onSelect?.(subject);
  };

  return (
    <article className={cn("rounded-card border border-line bg-surface p-4 shadow-card sm:p-5", className)}>
      <div className="flex items-start gap-3">
        <IconTile icon={<Icon />} tone={toneFromString(subjectName)} size="md" className="mt-0.5" />

        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-snug font-semibold text-ink">{subjectName}</h3>
          <p className={cn("text-sm font-semibold", TONE_TEXT[grade.tone])}>{grade.label}</p>
        </div>

        <p className="shrink-0 text-right" aria-label={`Điểm trung bình ${formatScore(averageScore)}`}>
          <span className="block text-3xl leading-none font-bold tracking-tight text-ink tabular-nums">
            {formatScore(averageScore)}
          </span>
          <span className="mt-1 block text-sm text-ink-3">Điểm TB</span>
        </p>
      </div>

      <ProgressBar
        value={averageScore}
        max={10}
        tone={grade.tone}
        size="sm"
        label={`${subjectName}: ${formatScore(averageScore)} trên 10`}
        className="mt-4"
      />

      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-base">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-ink-2">Giữa kỳ</dt>
          <dd className="font-semibold text-ink tabular-nums">{hasValue(midtermScore) ? formatScore(midtermScore) : "Chưa có"}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-ink-2">Cuối kỳ</dt>
          <dd className="font-semibold text-ink tabular-nums">{hasValue(finalScore) ? formatScore(finalScore) : "Chưa có"}</dd>
        </div>
      </dl>

      {hasDetails && (
        <>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isExpanded}
            aria-controls={detailId}
            className={cn(
              "-mx-2 mt-2 flex min-h-13 w-[calc(100%_+_1rem)] items-center justify-between gap-2 rounded-control px-2 text-base font-semibold text-primary-ink",
              "transition-colors duration-200 hover:bg-primary-soft focus-visible:outline-3 focus-visible:outline-offset-1"
            )}
          >
            <span>{isExpanded ? "Thu gọn" : "Xem chi tiết"}</span>
            <ChevronDown
              className={cn("size-5 transition-transform duration-200", isExpanded && "rotate-180")}
              aria-hidden="true"
            />
          </button>

          {isExpanded && (
            <div id={detailId} className="mt-2 space-y-3 border-t border-line pt-3">
              {(hasValue(oralScore) || hasValue(quizScore)) && (
                <dl className="grid grid-cols-2 gap-2">
                  {hasValue(oralScore) && (
                    <div className="rounded-control bg-surface-2 p-3">
                      <dt className="text-sm text-ink-2">Điểm miệng</dt>
                      <dd className="text-xl font-bold text-ink tabular-nums">{formatScore(oralScore)}</dd>
                    </div>
                  )}
                  {hasValue(quizScore) && (
                    <div className="rounded-control bg-surface-2 p-3">
                      <dt className="text-sm text-ink-2">Kiểm tra 15 phút</dt>
                      <dd className="text-xl font-bold text-ink tabular-nums">{formatScore(quizScore)}</dd>
                    </div>
                  )}
                </dl>
              )}
              {comment && (
                <figure className="rounded-control bg-gold-soft/60 p-3">
                  <figcaption className="text-sm font-semibold text-gold-ink">Nhận xét môn học</figcaption>
                  <blockquote className="mt-1 font-accent text-base leading-relaxed text-ink italic">
                    &ldquo;{comment}&rdquo;
                  </blockquote>
                </figure>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
};
