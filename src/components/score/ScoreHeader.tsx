import React from "react";
import { ClassInfo, ExamType, ExamTypeOption, SubjectOption } from "../../types";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { FileUp } from "lucide-react";

export const DEFAULT_SUBJECTS: SubjectOption[] = [
  { id: "giao_ly", name: "Giáo lý Hồng Ân", code: "GL" },
  { id: "kinh_thanh", name: "Lời Chúa & Kinh Thánh", code: "KT" },
  { id: "phung_vu", name: "Phụng vụ & Thánh ca", code: "PV" },
];

export const DEFAULT_EXAM_TYPES: ExamTypeOption[] = [
  { id: "MIENG", label: "Kiểm tra Miệng (Hệ số 1)", weight: 1 },
  { id: "PHUT_15", label: "Kiểm tra 15 Phút (Hệ số 1)", weight: 1 },
  { id: "GIUA_KY", label: "Điểm Giữa Kỳ (Hệ số 2)", weight: 2 },
  { id: "CUOI_KY", label: "Điểm Cuối Kỳ (Hệ số 3)", weight: 3 },
];

export interface ScoreHeaderProps {
  classes: ClassInfo[];
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  subjects?: SubjectOption[];
  selectedSubjectId: string;
  onSubjectChange: (subjectId: string) => void;
  examTypes?: ExamTypeOption[];
  selectedExamType: ExamType;
  onExamTypeChange: (examType: ExamType) => void;
  onOpenExcelImport: () => void;
  totalStudents: number;
  enteredCount: number;
  invalidCount: number;
  disabled?: boolean;
  className?: string;
}

/**
 * ScoreHeader Component (§22 - 03_Component_Library.md)
 *
 * `ClassSelector + SubjectSelector + ExamTypeSelector + ImportExcelButton + StatusSummary`
 */
export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  classes,
  selectedClassId,
  onClassChange,
  subjects = DEFAULT_SUBJECTS,
  selectedSubjectId,
  onSubjectChange,
  examTypes = DEFAULT_EXAM_TYPES,
  selectedExamType,
  onExamTypeChange,
  onOpenExcelImport,
  totalStudents,
  enteredCount,
  invalidCount,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`p-4 sm:p-5 rounded-[14px] bg-white border border-[#E7E5E4] shadow-xs space-y-4 ${className}`}>
      {/* 3 Selectors Row: Class, Subject, Exam Type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Class Selector */}
        <div>
          <Select
            label="Lớp Giáo lý"
            value={selectedClassId}
            disabled={disabled}
            options={classes.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.studentCount} HS)`,
            }))}
            onChange={(val) => onClassChange(val as string)}
          />
        </div>

        {/* 2. Subject Selector */}
        <div>
          <Select
            label="Môn học"
            value={selectedSubjectId}
            disabled={disabled}
            options={subjects.map((s) => ({
              value: s.id,
              label: `${s.name} (${s.code})`,
            }))}
            onChange={(val) => onSubjectChange(val as string)}
          />
        </div>

        {/* 3. Exam Type Selector */}
        <div>
          <Select
            label="Loại điểm"
            value={selectedExamType}
            disabled={disabled}
            options={examTypes.map((et) => ({
              value: et.id,
              label: et.label,
            }))}
            onChange={(val) => onExamTypeChange(val as ExamType)}
          />
        </div>
      </div>

      {/* Action Row & Progress indicator */}
      <div className="pt-2 border-t border-[#F5F5F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Progress & Stat */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[13px]">
          <span className="font-semibold text-[#1C1917] bg-[#FAFAF9] px-2.5 py-1 rounded-[6px] border border-[#E7E5E4]">
            Tiến độ: <strong className="text-[#B4232C]">{enteredCount}</strong>/{totalStudents} học sinh
          </span>

          {invalidCount > 0 ? (
            <span className="font-semibold text-[#DC4C4C] bg-[#FEE2E2] px-2.5 py-1 rounded-[6px] border border-[#FECDD3]">
              ⚠ {invalidCount} điểm chưa hợp lệ
            </span>
          ) : (
            <span className="font-semibold text-[#168154] bg-[#DCFCE7] px-2.5 py-1 rounded-[6px] border border-[#BBF7D0]">
              ✓ Dữ liệu hợp lệ
            </span>
          )}
        </div>

        {/* Import Excel Trigger Button */}
        <div>
          <Button
            variant="outline"
            size="md"
            leftIcon={<FileUp className="w-4 h-4 text-[#168154]" />}
            onClick={onOpenExcelImport}
            disabled={disabled}
            className="w-full sm:w-auto font-semibold !text-[#1C1917] hover:bg-[#F0FDF4] hover:border-[#168154]"
          >
            Nhập từ Excel (.xlsx)
          </Button>
        </div>
      </div>
    </div>
  );
};
