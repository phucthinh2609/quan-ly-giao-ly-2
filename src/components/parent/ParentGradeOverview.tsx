import React from "react";
import { ClipboardX } from "lucide-react";
import { LinkedStudent, AcademicPeriod, StudentAcademicReport, SubjectScoreSummary } from "../../types";
import { cn } from "../../lib/cn";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { ParentChildSwitcher } from "./ParentChildSwitcher";
import { AcademicPeriodSelector } from "./AcademicPeriodSelector";
import { GPAHighlight } from "./GPAHighlight";
import { SubjectScoreCard } from "./SubjectScoreCard";
import { TeacherComment } from "./TeacherComment";

export interface ParentGradeOverviewProps {
  linkedStudents: LinkedStudent[];
  selectedChildId: string;
  onChildChange: (childId: string) => void | Promise<void>;
  selectedPeriod: AcademicPeriod;
  onPeriodChange: (period: AcademicPeriod) => void | Promise<void>;
  report: StudentAcademicReport | null;
  isLoading?: boolean;
  onSelectSubject?: (subject: SubjectScoreSummary) => void;
  className?: string;
  /** Ẩn chip chọn con khi trang đã hiển thị ở trên (mặc định hiện) */
  showChildSwitcher?: boolean;
}

const SubjectSkeleton: React.FC = () => (
  <div aria-hidden="true" className="rounded-card border border-line bg-surface p-4 shadow-card sm:p-5">
    <div className="flex items-start gap-3">
      <Skeleton className="size-10 shrink-0 rounded-control" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/3 rounded-full" />
        <Skeleton className="h-4 w-1/4 rounded-full" />
      </div>
      <Skeleton className="h-9 w-14 rounded-full" />
    </div>
    <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
    <Skeleton className="mt-3 h-5 w-1/2 rounded-full" />
  </div>
);

/**
 * ParentGradeOverview (02 §13, 04 §11)
 * Con → Kỳ học → Điểm TB (số lớn + xếp loại) → Môn → Thành phần → Nhận xét GLV.
 */
export const ParentGradeOverview: React.FC<ParentGradeOverviewProps> = ({
  linkedStudents,
  selectedChildId,
  onChildChange,
  selectedPeriod,
  onPeriodChange,
  report,
  isLoading = false,
  onSelectSubject,
  className,
  showChildSwitcher = true,
}) => {
  const loading = isLoading || !report;

  return (
    <div className={cn("space-y-6", className)}>
      {showChildSwitcher && (
        <ParentChildSwitcher
          students={linkedStudents}
          selectedChildId={selectedChildId}
          onChange={onChildChange}
          isLoading={isLoading}
        />
      )}

      <AcademicPeriodSelector selectedPeriod={selectedPeriod} onChange={onPeriodChange} isLoading={isLoading} />

      {loading ? (
        <div className="space-y-6" role="status" aria-label="Đang tải bảng điểm">
          <GPAHighlight gpa={0} isLoading />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {[0, 1, 2, 3].map((i) => (
              <SubjectSkeleton key={i} />
            ))}
          </div>
          <div aria-hidden="true" className="space-y-3 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
            <Skeleton className="h-6 w-1/3 rounded-full" />
            <Skeleton className="h-5 w-full rounded-full" />
            <Skeleton className="h-5 w-4/5 rounded-full" />
          </div>
        </div>
      ) : (
        <>
          <div data-reveal>
            <GPAHighlight
              gpa={report.gpa}
              rankLabel={report.rankLabel}
              periodLabel={report.periodLabel}
              rankColor={report.rankColor}
            />
          </div>

          <section aria-labelledby="subject-results-heading" className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="subject-results-heading" className="text-xl font-semibold tracking-tight text-ink">
                Kết quả theo môn
              </h2>
              <p className="text-sm text-ink-3">{report.subjects.length} môn</p>
            </div>

            {report.subjects.length === 0 ? (
              <EmptyState
                icon={<ClipboardX />}
                title="Chưa có bảng điểm"
                description="Điểm sẽ hiện khi GLV cập nhật."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {report.subjects.map((subject) => (
                  <div key={subject.subjectId} data-reveal>
                    <SubjectScoreCard subject={subject} onSelect={onSelectSubject} className="h-full" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {report.teacherComment && (
            <div data-reveal>
              <TeacherComment comment={report.teacherComment} teacherName={report.teacherName} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
