import React from "react";
import { LinkedStudent, AcademicPeriod, StudentAcademicReport, SubjectScoreSummary } from "../../types";
import { ParentChildSwitcher } from "./ParentChildSwitcher";
import { AcademicPeriodSelector } from "./AcademicPeriodSelector";
import { GPAHighlight } from "./GPAHighlight";
import { SubjectScoreCard } from "./SubjectScoreCard";
import { TeacherComment } from "./TeacherComment";
import { BookOpen, RefreshCw } from "lucide-react";

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
}

/**
 * ParentGradeOverview (Tier 5 Feature Component - §27, §30, Wireframe C §8, Sitemap §11)
 *
 * Component Tree Hierarchy:
 * <ParentGradeOverview>
 * ├── <ParentChildSwitcher />
 * ├── <AcademicPeriodSelector />
 * ├── <GPAHighlight />
 * ├── <SubjectSummaryList> (<SubjectScoreCard /> × N)
 * └── <TeacherComment />
 *
 * Information Priority Sequence (Strictly enforced per Sitemap §11):
 * 1. Học sinh (ParentChildSwitcher)
 * 2. Kỳ / năm học (AcademicPeriodSelector)
 * 3. Điểm trung bình (GPAHighlight)
 * 4. Danh sách môn (SubjectSummaryList)
 * 5. Chi tiết điểm (Expandable on SubjectScoreCard)
 * 6. Nhận xét (TeacherComment)
 *
 * Constraints:
 * - Controls font-size ≥18px, touch target ≥52–56px (RULE-010).
 * - No icon-only for critical actions (RULE-012).
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
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* =================================================================== */}
      {/* 1. HỌC SINH (ParentChildSwitcher)                                   */}
      {/* =================================================================== */}
      <section aria-label="1. Chọn học sinh con">
        <ParentChildSwitcher
          students={linkedStudents}
          selectedChildId={selectedChildId}
          onChange={onChildChange}
          isLoading={isLoading}
        />
      </section>

      {/* =================================================================== */}
      {/* 2. KỲ / NĂM HỌC (AcademicPeriodSelector)                            */}
      {/* =================================================================== */}
      <section aria-label="2. Chọn kỳ học">
        <AcademicPeriodSelector
          selectedPeriod={selectedPeriod}
          onChange={onPeriodChange}
          isLoading={isLoading}
        />
      </section>

      {/* Loading Skeleton if report is being fetched */}
      {isLoading || !report ? (
        <div className="space-y-6 animate-pulse">
          {/* GPA Skeleton */}
          <div className="h-[180px] rounded-[18px] bg-[#FFFBEB] border border-[#FDE68A] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#E3B341] animate-spin" />
            <span className="text-[16px] font-semibold text-[#92400E]">
              Đang làm mới bảng điểm của con...
            </span>
          </div>

          {/* Subjects Skeleton */}
          <div className="space-y-3">
            <div className="h-6 bg-[#E7E5E4] rounded-md w-1/3" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[110px] rounded-[16px] bg-white border border-[#E7E5E4]"
              />
            ))}
          </div>

          {/* Comment Skeleton */}
          <div className="h-[100px] rounded-[16px] bg-white border border-[#E7E5E4]" />
        </div>
      ) : (
        <>
          {/* =================================================================== */}
          {/* 3. ĐIỂM TRUNG BÌNH (GPAHighlight)                                   */}
          {/* =================================================================== */}
          <section aria-label="3. Điểm trung bình chung">
            <GPAHighlight
              gpa={report.gpa}
              rankLabel={report.rankLabel}
              periodLabel={report.periodLabel}
              rankColor={report.rankColor}
            />
          </section>

          {/* =================================================================== */}
          {/* 4 & 5. DANH SÁCH MÔN & CHI TIẾT ĐIỂM (SubjectSummaryList)           */}
          {/* =================================================================== */}
          <section aria-label="4. Kết quả theo môn học" className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#B4232C]" />
                <h3 className="text-[19px] sm:text-[20px] font-bold text-[#1C1917] font-serif">
                  KẾT QUẢ THEO MÔN
                </h3>
              </div>
              <span className="text-[14px] font-medium text-[#78716C]">
                {report.subjects.length} môn học
              </span>
            </div>

            {/* List of SubjectScoreCard */}
            <div className="space-y-3">
              {report.subjects.map((subject, index) => (
                <SubjectScoreCard
                  key={subject.subjectId}
                  subject={subject}
                  defaultExpanded={index === 0} // Expand first subject for immediate detail
                  onSelect={onSelectSubject}
                />
              ))}
            </div>
          </section>

          {/* =================================================================== */}
          {/* 6. NHẬN XÉT CỦA GLV (TeacherComment)                                */}
          {/* =================================================================== */}
          <section aria-label="6. Nhận xét của Giáo lý viên">
            <TeacherComment
              comment={report.teacherComment}
              teacherName={report.teacherName}
            />
          </section>
        </>
      )}
    </div>
  );
};
