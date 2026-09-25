import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { Student } from "../../types";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/cn";
import { ScoreInput } from "./ScoreInput";
import { formatScore } from "./scoreUtils";

export type ScoreRowLayout = "table" | "card";

export interface ScoreRowProps {
  student: Student;
  score: number | null;
  rawInput?: string;
  previousScore?: number | null;
  error?: string | null;
  isDirty?: boolean;
  isSaved?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onScoreChange: (studentId: string, score: number | null, rawText: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isHighlighted?: boolean;
  /** "table" = hàng <tr> cho bảng desktop (mặc định) · "card" = thẻ <li> cho mobile */
  layout?: ScoreRowLayout;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const StudentName: React.FC<{ student: Student; className?: string }> = ({ student, className }) => (
  <p className={cn("text-base leading-snug text-ink", className)}>
    {student.christianName && <span className="font-medium text-ink-2">{student.christianName} </span>}
    <span className="font-semibold">{student.name}</span>
  </p>
);

/**
 * Một học sinh trong bảng nhập điểm: STT · Học sinh · Điểm cũ · Điểm mới.
 * Desktop render <tr>; mobile (layout="card") render <li> gọn, lỗi hiển thị full chiều ngang.
 */
export const ScoreRow = forwardRef<HTMLInputElement, ScoreRowProps>(
  (
    {
      student,
      score,
      rawInput,
      previousScore,
      error,
      isDirty = false,
      isSaved = false,
      disabled = false,
      readOnly = false,
      onScoreChange,
      onKeyDown,
      isHighlighted = false,
      layout = "table",
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const formattedOrder = String(student.orderNumber).padStart(2, "0");
    const hasError = Boolean(error);
    const inputId = `score-input-${student.id}`;
    const fullName = `${student.christianName || ""} ${student.name}`.trim();
    const hasPrevious = previousScore !== undefined && previousScore !== null;

    const input = (
      <ScoreInput
        ref={ref}
        id={inputId}
        name={`score-${student.id}`}
        studentName={fullName}
        value={score}
        rawInput={rawInput}
        error={error}
        isDirty={isDirty}
        isSaved={isSaved}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(newScore, rawText) => onScoreChange(student.id, newScore, rawText)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        showInlineError={layout === "table"}
      />
    );

    const rowTone = isHighlighted ? "bg-warning-soft" : hasError ? "bg-danger-soft/40" : "";

    if (layout === "card") {
      return (
        <li
          id={`score-row-${student.id}`}
          className={cn("px-4 py-3 transition-colors duration-300", rowTone)}
        >
          <div className="flex items-center gap-3">
            <span className="w-7 shrink-0 font-mono text-sm text-ink-3 tabular-nums" aria-hidden="true">
              {formattedOrder}
            </span>
            <div className="min-w-0 flex-1">
              <StudentName student={student} className="line-clamp-2" />
              <p className="mt-0.5 text-sm text-ink-3">
                Điểm cũ{" "}
                <span className="font-mono font-medium text-ink-2 tabular-nums">
                  {hasPrevious ? formatScore(previousScore) : "—"}
                </span>
              </p>
            </div>
            {input}
          </div>
          {hasError && (
            <p
              id={`${inputId}-error`}
              aria-live="polite"
              className="mt-2 flex items-start gap-1.5 pl-10 text-sm font-medium leading-snug text-danger"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}
        </li>
      );
    }

    const cell = "border-b border-line px-4 py-3 align-middle";

    return (
      <tr
        id={`score-row-${student.id}`}
        className={cn(
          "transition-colors duration-300 [&:last-child>td]:border-b-0",
          rowTone || "hover:bg-surface-2/60"
        )}
      >
        <td className={cn(cell, "text-center")}>
          <span className="font-mono text-sm text-ink-3 tabular-nums">{formattedOrder}</span>
        </td>

        <td className={cell}>
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={student.name} src={student.avatarUrl} size="sm" />
            <div className="min-w-0">
              <StudentName student={student} />
              <p className="font-mono text-xs text-ink-3">{student.code}</p>
            </div>
          </div>
        </td>

        <td className={cn(cell, "text-center")}>
          {hasPrevious ? (
            <span className="font-mono text-base text-ink-2 tabular-nums">{formatScore(previousScore)}</span>
          ) : (
            <span className="text-ink-3">
              <span aria-hidden="true">—</span>
              <span className="sr-only">Chưa có</span>
            </span>
          )}
        </td>

        <td className={cell}>{input}</td>
      </tr>
    );
  }
);

ScoreRow.displayName = "ScoreRow";
