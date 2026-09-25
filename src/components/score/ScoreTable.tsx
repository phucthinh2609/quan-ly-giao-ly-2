import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { FileSpreadsheet, Keyboard } from "lucide-react";
import { Student, ScoreEntry } from "../../types";
import { EmptyState } from "../ui/EmptyState";
import { Card } from "../ui/Card";
import { cn } from "../../lib/cn";
import { prefersReducedMotion } from "../../lib/motion";
import { ScoreRow } from "./ScoreRow";
import { QuickFillBar, QUICK_FILL_VALUES } from "./QuickFillBar";
import { useMediaQuery } from "./scoreUtils";

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
  /**
   * Danh sách học sinh vừa được lưu (hiện dấu check). Không truyền → mọi điểm hợp lệ
   * chưa sửa đều coi là đã lưu (hành vi v1).
   */
  savedStudentIds?: ReadonlySet<string> | string[];
  /** Hiện dải chip điền nhanh khi focus trên mobile. Mặc định true. */
  showQuickFill?: boolean;
  /** Giá trị chip điền nhanh. Mặc định 10 · 9 · 8 · 7 · 6 · 5 */
  quickFillValues?: number[];
  /** Hiện gợi ý phím tắt trên desktop. Mặc định true. */
  showKeyboardHint?: boolean;
}

const INPUT_ID_PREFIX = "score-input-";

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-xs border border-line-strong bg-surface px-1.5 font-mono text-xs font-semibold text-ink-2 shadow-xs">
    {children}
  </kbd>
);

/**
 * Bảng nhập điểm (03 §8).
 * - Desktop (≥ md): bảng có header sticky, cuộn trong khung riêng.
 * - Mobile: danh sách thẻ gọn + dải chip điền nhanh khi đang nhập.
 * - Phím: Enter / Tab / ↓ → em kế tiếp · Shift+Tab / ↑ → em trước · Esc → thoát ô.
 * - Ref `focusStudent(id)`: cuộn tới và focus ô của học sinh (dùng từ tóm tắt lỗi).
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
      savedStudentIds,
      showQuickFill = true,
      quickFillValues = QUICK_FILL_VALUES,
      showKeyboardHint = true,
    },
    ref
  ) => {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const isDesktop = useMediaQuery("(min-width: 48rem)");
    const [focusedId, setFocusedId] = useState<string | null>(null);

    const savedSet: ReadonlySet<string> | null =
      savedStudentIds === undefined
        ? null
        : Array.isArray(savedStudentIds)
          ? new Set(savedStudentIds)
          : (savedStudentIds as ReadonlySet<string>);

    const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");

    const focusInput = (input: HTMLInputElement | null | undefined, block: ScrollLogicalPosition) => {
      if (!input) return;
      input.focus({ preventScroll: true });
      input.select();
      input.scrollIntoView({ behavior: scrollBehavior(), block });
    };

    const focusIndex = (index: number) => {
      const target = students[index];
      if (!target) return;
      // Mobile: đưa ô ra giữa màn hình để không bị thanh Lưu / chip điền nhanh che
      focusInput(inputRefs.current[target.id], isDesktop ? "nearest" : "center");
    };

    useImperativeHandle(ref, () => ({
      focusStudent: (studentId: string) => {
        const inputElem = inputRefs.current[studentId];
        if (inputElem) {
          focusInput(inputElem, "center");
        } else {
          const rowElem = document.getElementById(`score-row-${studentId}`);
          rowElem?.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
        }
      },
    }));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
      if (e.key === "Enter" || e.key === "Tab") {
        // Shift + Tab về em trước; Tab / Enter sang em kế tiếp
        const isBackward = e.key === "Tab" && e.shiftKey;
        const targetIndex = isBackward ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex >= 0 && targetIndex < students.length) {
          e.preventDefault();
          focusIndex(targetIndex);
        } else if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIndex + 1 < students.length) focusIndex(currentIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex - 1 >= 0) focusIndex(currentIndex - 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.currentTarget.blur();
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const next = e.relatedTarget as HTMLElement | null;
      // Chuyển giữa các ô điểm → giữ dải điền nhanh, tránh nhấp nháy
      if (next && next.id && next.id.startsWith(INPUT_ID_PREFIX)) return;
      setFocusedId(null);
    };

    const handleQuickFill = (value: number) => {
      if (!focusedId) return;
      const index = students.findIndex((s) => s.id === focusedId);
      if (index < 0) return;
      onScoreChange(focusedId, value, String(value));
      if (index + 1 < students.length) {
        focusIndex(index + 1);
      } else {
        inputRefs.current[focusedId]?.blur();
      }
    };

    if (students.length === 0) {
      return (
        <EmptyState
          icon={<FileSpreadsheet className="size-8" />}
          title="Lớp chưa có học sinh"
          description="Khi lớp có danh sách học sinh, bảng nhập điểm sẽ hiện ở đây."
        />
      );
    }

    const layout = isDesktop ? "table" : "card";

    const rows = students.map((student, index) => {
      const entry = scores[student.id];
      const scoreVal = entry ? entry.score : null;
      const rawVal = entry ? entry.rawInput : undefined;
      const prevVal = previousScores[student.id] ?? entry?.previousScore ?? null;
      const errorMsg = entry?.error;
      const isDirty = Boolean(entry?.isDirty);
      const isSaved = savedSet
        ? savedSet.has(student.id) && !isDirty && !errorMsg
        : !isDirty && scoreVal !== null && !errorMsg;

      return (
        <ScoreRow
          key={student.id}
          ref={(el) => {
            inputRefs.current[student.id] = el;
          }}
          layout={layout}
          student={student}
          score={scoreVal}
          rawInput={rawVal}
          previousScore={prevVal}
          error={errorMsg}
          isDirty={isDirty}
          isSaved={isSaved}
          disabled={disabled}
          readOnly={readOnly}
          isHighlighted={highlightedStudentId === student.id}
          onScoreChange={onScoreChange}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => setFocusedId(student.id)}
          onBlur={handleBlur}
        />
      );
    });

    const focusedStudent = focusedId ? students.find((s) => s.id === focusedId) : undefined;
    const quickFillVisible = showQuickFill && !isDesktop && !disabled && !readOnly && Boolean(focusedStudent);
    const th = "sticky top-0 z-10 border-b border-line bg-surface-2 px-4 py-3 text-sm font-semibold text-ink-2";

    return (
      <div className={cn("space-y-3", className)}>
        {isDesktop ? (
          <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
            <div className="max-h-[calc(100dvh_-_14rem)] overflow-auto">
              <table className="w-full border-separate border-spacing-0 text-left">
                <caption className="sr-only">Bảng nhập điểm, {students.length} học sinh</caption>
                <thead>
                  <tr>
                    <th scope="col" className={cn(th, "w-16 text-center")}>
                      STT
                    </th>
                    <th scope="col" className={th}>
                      Học sinh
                    </th>
                    <th scope="col" className={cn(th, "w-28 text-center")}>
                      Điểm cũ
                    </th>
                    <th scope="col" className={cn(th, "w-60")}>
                      Điểm mới
                    </th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card padding="none" className="overflow-hidden">
            <ul aria-label={`Danh sách ${students.length} học sinh`} className="divide-y divide-line">
              {rows}
            </ul>
          </Card>
        )}

        {showKeyboardHint && isDesktop && !readOnly && (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-3">
            <Keyboard className="size-4 shrink-0" aria-hidden="true" />
            <Kbd>Enter</Kbd>
            <span>hoặc</span>
            <Kbd>↓</Kbd>
            <span>để sang em kế tiếp</span>
            <span aria-hidden="true">·</span>
            <Kbd>↑</Kbd>
            <span>về em trước</span>
          </p>
        )}

        {quickFillVisible && focusedStudent && (
          <QuickFillBar
            values={quickFillValues}
            targetName={`${focusedStudent.christianName || ""} ${focusedStudent.name}`.trim()}
            onPick={handleQuickFill}
          />
        )}
      </div>
    );
  }
);

ScoreTable.displayName = "ScoreTable";
