import React, { useState } from "react";
import { Clock, Medal, Smile, Sprout, Star, ThumbsUp, Trophy } from "lucide-react";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { scoreGrade } from "../../lib/format";
import { Card } from "../../components/ui/Card";
import { IconTile } from "../../components/ui/IconTile";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { CountUp } from "../../components/ui/CountUp";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { TONE_SOFT } from "../../components/ui/tone";
import { StarRating } from "../../components/gamification";
import type { SemesterId, SemesterScores, SubjectScore } from "../../services/studentPortalMockData";
import { StudentViewHeader } from "./StudentViewHeader";
import { renderKidIcon } from "./kidIcons";
import { averageScore } from "./studentUtils";

export interface StudentScoresViewProps {
  semesters: SemesterScores[];
  className?: string;
}

const GRADE_ICON: Record<number, React.ReactNode> = {
  5: <Trophy />,
  4: <Medal />,
  3: <ThumbsUp />,
  2: <Smile />,
  1: <Sprout />,
  0: <Clock />,
};

const AVERAGE_MESSAGE: Record<number, string> = {
  5: "Em thật tuyệt vời! Giữ vững phong độ nhé.",
  4: "Em học rất tốt. Cố thêm chút nữa là 5 sao!",
  3: "Em đang tiến bộ. Ôn bài đều hơn nhé!",
  2: "Em đã đạt rồi. Mình cùng cố gắng thêm nha!",
  1: "Đừng lo, GLV và các bạn sẽ giúp em!",
  0: "Điểm sẽ hiện khi GLV cập nhật nhé.",
};

const STAR_SCALE = [
  { stars: 5, label: "Xuất sắc", range: "Từ 9 điểm" },
  { stars: 4, label: "Giỏi", range: "Từ 8 điểm" },
  { stars: 3, label: "Khá", range: "Từ 6,5 điểm" },
  { stars: 2, label: "Đạt", range: "Từ 5 điểm" },
  { stars: 1, label: "Cố gắng thêm", range: "Dưới 5 điểm" },
];

const SubjectScoreCard: React.FC<{ subject: SubjectScore }> = ({ subject }) => {
  const grade = scoreGrade(subject.score);
  const hasScore = subject.score !== null;

  return (
    <Card as="article" padding="lg" className="h-full">
      <div className="flex items-center gap-3">
        <IconTile icon={renderKidIcon(subject.icon)} tone={subject.tone} size="lg" />
        <h3 className="min-w-0 text-lg leading-snug font-semibold text-ink">{subject.name}</h3>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        {hasScore ? (
          <p className="text-ink">
            <CountUp value={subject.score ?? 0} decimals={1} className="font-mono text-4xl font-bold" />
            <span className="ml-1 text-base text-ink-2">/ 10</span>
          </p>
        ) : (
          <p className="font-mono text-4xl font-bold text-ink-3">
            <span aria-hidden="true">—</span>
            <span className="sr-only">Chưa có điểm</span>
          </p>
        )}
        <StarRating value={grade.stars} size="md" label={hasScore ? undefined : "Chưa có sao"} />
      </div>

      <p
        className={cn(
          "mt-4 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold [&_svg]:size-4",
          TONE_SOFT[grade.tone]
        )}
      >
        <span aria-hidden="true">{GRADE_ICON[grade.stars]}</span>
        {hasScore ? grade.kidLabel : "Điểm sẽ có sau khi GLV chấm"}
      </p>
    </Card>
  );
};

/** "Điểm của em" (B-HS-02): số lớn + sao + từ ngữ dễ hiểu, không chỉ con số. */
export const StudentScoresView: React.FC<StudentScoresViewProps> = ({ semesters, className }) => {
  const [semesterId, setSemesterId] = useState<SemesterId>(semesters[0]?.id ?? "HK1");
  const semester = semesters.find((s) => s.id === semesterId) ?? semesters[0];
  const subjects = semester?.subjects ?? [];
  const avg = averageScore(subjects);
  const grade = scoreGrade(avg);

  const pageRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLUListElement>({ selector: "[data-reveal-item]", deps: [semesterId] });

  return (
    <div ref={pageRef} className={cn("space-y-8", className)}>
      <StudentViewHeader title="Điểm của em" subtitle="Năm học 2026 – 2027" icon={<Star />} tone="gold" />

      <div data-reveal>
        <SegmentedControl
          ariaLabel="Chọn học kỳ"
          value={semesterId}
          onChange={setSemesterId}
          options={semesters.map((s) => ({ value: s.id, label: s.label }))}
          size="lg"
          fullWidth
          className="max-w-md"
        />
      </div>

      {/* Điểm trung bình */}
      <Card as="section" data-reveal padding="lg" radius="card-lg" aria-labelledby="student-average-heading">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <ProgressRing
            value={avg ?? 0}
            max={10}
            tone={grade.tone}
            size="xl"
            thickness={9}
            label={avg !== null ? `Điểm trung bình ${avg} trên 10` : "Chưa có điểm trung bình"}
          >
            {avg !== null ? (
              <CountUp value={avg} decimals={1} className="font-mono text-4xl font-bold text-ink" />
            ) : (
              <span className="font-mono text-4xl font-bold text-ink-3">—</span>
            )}
            <span className="text-sm text-ink-2">trên 10</span>
          </ProgressRing>

          <div className="min-w-0 space-y-2">
            <h2 id="student-average-heading" className="text-lg font-semibold text-ink-2">
              Điểm trung bình {semester?.fullLabel}
            </h2>
            <StarRating value={grade.stars} size="lg" />
            <p className="text-2xl font-bold tracking-tight text-ink">{grade.kidLabel}</p>
            <p className="text-base text-ink-2">{AVERAGE_MESSAGE[grade.stars]}</p>
          </div>
        </div>
      </Card>

      {/* Từng môn */}
      <section aria-labelledby="student-subjects-heading" className="space-y-4">
        <h2 id="student-subjects-heading" data-reveal className="text-xl font-bold tracking-tight text-ink">
          Từng môn học
        </h2>
        <ul ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {subjects.map((subject) => (
            <li key={subject.id} data-reveal-item>
              <SubjectScoreCard subject={subject} />
            </li>
          ))}
        </ul>
      </section>

      {/* Cách đọc sao */}
      <Card as="section" data-reveal variant="muted" padding="lg" aria-labelledby="student-stars-heading">
        <h2 id="student-stars-heading" className="text-lg font-bold text-ink">
          Sao nghĩa là gì?
        </h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {STAR_SCALE.map((row) => (
            <li
              key={row.stars}
              className="flex min-h-14 items-center justify-between gap-3 rounded-control bg-surface px-4 py-2.5"
            >
              <StarRating value={row.stars} size="sm" />
              <span className="text-right">
                <span className="block text-base font-semibold text-ink">{row.label}</span>
                <span className="block text-sm text-ink-2">{row.range}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
