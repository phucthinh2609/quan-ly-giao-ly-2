import React, { forwardRef } from "react";
import { Student } from "../../types";
import { Avatar } from "../ui/Avatar";
import { ScoreInput } from "./ScoreInput";

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
}

/**
 * ScoreRow Component (§22 - 03_Component_Library.md)
 *
 * Cấu trúc:
 * <ScoreRow>
 * ├── StudentPosition
 * ├── StudentIdentity (Tên Thánh, Họ tên, Mã)
 * ├── PreviousScore
 * ├── ScoreInput
 * └── ValidationMessage (Inline)
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
    },
    ref
  ) => {
    const formattedOrder = String(student.orderNumber).padStart(2, "0");
    const hasError = Boolean(error);

    return (
      <tr
        id={`score-row-${student.id}`}
        className={`
          transition-colors border-b border-[#F5F5F4]
          ${isHighlighted ? "bg-[#FEF3C7] ring-2 ring-[#D97706]/40" : hasError ? "bg-[#FEF2F2]/60" : "hover:bg-[#FAFAF9]"}
        `}
      >
        {/* 1. StudentPosition (STT) */}
        <td className="py-3 px-3 sm:px-4 text-center">
          <span className="font-mono font-bold text-[14px] text-[#78716C] bg-[#F5F5F4] px-2 py-1 rounded-[6px]">
            {formattedOrder}
          </span>
        </td>

        {/* 2. StudentIdentity (Tên Thánh, Họ tên, Mã HS) */}
        <td className="py-3 px-3 sm:px-4">
          <div className="flex items-center gap-3">
            <Avatar
              name={student.name}
              size="md"
              className={student.gender === "FEMALE" ? "bg-[#FDF2F8] text-[#DB2777]" : "bg-[#EFF6FF] text-[#2563EB]"}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {student.christianName && (
                  <span className="text-[13px] font-semibold text-[#8B6419] bg-[#FFFBEB] px-1.5 py-0.5 rounded border border-[#FEF3C7]">
                    {student.christianName}
                  </span>
                )}
                <span className="text-[15px] sm:text-[16px] font-bold text-[#1C1917] truncate">
                  {student.name}
                </span>
              </div>
              <div className="text-[12px] text-[#78716C] font-mono mt-0.5">
                {student.code}
              </div>
            </div>
          </div>
        </td>

        {/* 3. PreviousScore (Điểm cũ) */}
        <td className="py-3 px-3 sm:px-4 text-center hidden md:table-cell">
          {previousScore !== undefined && previousScore !== null ? (
            <span className="inline-block px-2.5 py-1 rounded-[6px] bg-[#F5F5F4] text-[#57534E] font-semibold text-[14px] border border-[#E7E5E4]">
              {previousScore.toFixed(1)}
            </span>
          ) : (
            <span className="text-[#A8A29E] text-[13px] italic">—</span>
          )}
        </td>

        {/* 4. ScoreInput + Inline Validation Message */}
        <td className="py-3 px-3 sm:px-4">
          <ScoreInput
            ref={ref}
            id={`score-input-${student.id}`}
            name={`score-${student.id}`}
            studentName={`${student.christianName || ""} ${student.name}`.trim()}
            value={score}
            rawInput={rawInput}
            error={error}
            isDirty={isDirty}
            isSaved={isSaved}
            disabled={disabled}
            readOnly={readOnly}
            onChange={(newScore, rawText) => onScoreChange(student.id, newScore, rawText)}
            onKeyDown={onKeyDown}
            showInlineError={true}
          />
        </td>

        {/* 5. Status indicator cell */}
        <td className="py-3 px-3 sm:px-4 text-center hidden sm:table-cell">
          {hasError ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC4C4C] border border-[#FECDD3]">
              Lỗi điểm
            </span>
          ) : isDirty ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
              Chưa lưu
            </span>
          ) : isSaved ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
              Đã lưu
            </span>
          ) : score !== null ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F5F5F4] text-[#57534E]">
              Hợp lệ
            </span>
          ) : (
            <span className="text-[12px] text-[#A8A29E]">Chưa nhập</span>
          )}
        </td>
      </tr>
    );
  }
);

ScoreRow.displayName = "ScoreRow";
