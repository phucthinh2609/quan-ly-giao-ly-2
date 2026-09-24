import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Student, ScoreEntry } from "../../types";
import { ScoreRow } from "./ScoreRow";
import { EmptyState } from "../ui/EmptyState";
import { FileSpreadsheet } from "lucide-react";

export interface ScoreTableRef {
  focusStudent: (studentId: string) => void;
}

export interface ScoreTableProps {
  students: Student[];
  scores: Record<string, ScoreEntry>;
  previousScores?: Record<string, number | null>;
  highlightedStudentId?: string | null;
  onScoreChange: (studentId: string, score: number | null, rawText: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

/**
 * ScoreTable Component (§22 - 03_Component_Library.md & Sitemap §9)
 *
 * Yêu cầu then chốt:
 * 1. Desktop table header có sticky (`sticky top-0 z-10 bg-white border-b shadow-xs`)
 * 2. Keyboard flow desktop: Enter hoặc Tab -> tự động chuyển con trỏ sang học sinh tiếp theo (onKeyDown handler)
 * 3. Hỗ trợ ref để focusStudent(studentId) cuộn vào vị trí và focus input khi click từ ScoreValidationSummary
 * 4. Không mở modal cho từng học sinh.
 */
export const ScoreTable = forwardRef<ScoreTableRef, ScoreTableProps>(
  (
    {
      students,
      scores,
      previousScores = {},
      highlightedStudentId,
      onScoreChange,
      disabled = false,
      readOnly = false,
      className = "",
    },
    ref
  ) => {
    // Map of input refs by studentId
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // Expose focus method to parent
    useImperativeHandle(ref, () => ({
      focusStudent: (studentId: string) => {
        const inputElem = inputRefs.current[studentId];
        if (inputElem) {
          inputElem.scrollIntoView({ behavior: "smooth", block: "center" });
          inputElem.focus();
          // Highlight select text if any
          inputElem.select();
        } else {
          // Fallback to row
          const rowElem = document.getElementById(`score-row-${studentId}`);
          rowElem?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      },
    }));

    // Keyboard navigation: Enter / Tab / ArrowDown -> Next student
    // Shift+Tab / ArrowUp -> Previous student
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      currentIndex: number
    ) => {
      if (e.key === "Enter" || e.key === "Tab") {
        // Tab without shift or Enter advances to next student
        // Shift + Tab moves to previous student
        const isBackward = e.key === "Tab" && e.shiftKey;
        const targetIndex = isBackward ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex >= 0 && targetIndex < students.length) {
          e.preventDefault();
          const targetStudent = students[targetIndex];
          const targetInput = inputRefs.current[targetStudent.id];
          if (targetInput) {
            targetInput.focus();
            targetInput.select();
          }
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < students.length) {
          const nextInput = inputRefs.current[students[nextIndex].id];
          nextInput?.focus();
          nextInput?.select();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          const prevInput = inputRefs.current[students[prevIndex].id];
          prevInput?.focus();
          prevInput?.select();
        }
      }
    };

    if (students.length === 0) {
      return (
        <EmptyState
          icon={<FileSpreadsheet className="w-10 h-10 text-[#A8A29E]" />}
          title="Chưa có học sinh nào"
          description="Lớp học này hiện chưa có danh sách học sinh để nhập điểm."
        />
      );
    }

    return (
      <div className={`w-full overflow-hidden bg-white rounded-[14px] border border-[#E7E5E4] shadow-xs ${className}`}>
        <div className="overflow-x-auto max-h-[calc(100vh-280px)] min-h-[400px]">
          <table className="w-full text-left border-collapse">
            {/* Desktop Table Header - MUST BE STICKY (Checklist #7) */}
            <thead className="sticky top-0 z-10 bg-white border-b-2 border-[#E7E5E4] shadow-xs">
              <tr className="text-[12px] sm:text-[13px] font-bold text-[#57534E] uppercase tracking-wider bg-[#FAFAF9]">
                <th className="py-3 px-3 sm:px-4 text-center w-[60px] sm:w-[70px]">STT</th>
                <th className="py-3 px-3 sm:px-4 min-w-[200px]">Học sinh & Tên Thánh</th>
                <th className="py-3 px-3 sm:px-4 text-center w-[110px] hidden md:table-cell">Điểm cũ</th>
                <th className="py-3 px-3 sm:px-4 w-[160px] sm:w-[180px]">
                  Điểm mới (0–10)
                </th>
                <th className="py-3 px-3 sm:px-4 text-center w-[120px] hidden sm:table-cell">
                  Trạng thái
                </th>
              </tr>
            </thead>

            {/* Table Body with Rows */}
            <tbody className="divide-y divide-[#F5F5F4] text-[14px]">
              {students.map((student, index) => {
                const entry = scores[student.id];
                const scoreVal = entry ? entry.score : null;
                const rawVal = entry ? entry.rawInput : undefined;
                const prevVal = previousScores[student.id] ?? entry?.previousScore ?? null;
                const errorMsg = entry?.error;
                const isDirty = Boolean(entry?.isDirty);
                const isSaved = !isDirty && scoreVal !== null && !errorMsg;
                const isHighlighted = highlightedStudentId === student.id;

                return (
                  <ScoreRow
                    key={student.id}
                    ref={(el) => {
                      inputRefs.current[student.id] = el;
                    }}
                    student={student}
                    score={scoreVal}
                    rawInput={rawVal}
                    previousScore={prevVal}
                    error={errorMsg}
                    isDirty={isDirty}
                    isSaved={isSaved}
                    disabled={disabled}
                    readOnly={readOnly}
                    isHighlighted={isHighlighted}
                    onScoreChange={onScoreChange}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

ScoreTable.displayName = "ScoreTable";
