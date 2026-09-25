import React from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { ClassInfo, ExamType, ExamTypeOption, SubjectOption } from "../../types";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { SegmentedControl } from "../ui/SegmentedControl";
import { cn } from "../../lib/cn";

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

/** Nhãn ngắn cho SegmentedControl Loại điểm */
export const EXAM_TYPE_SHORT_LABELS: Record<ExamType, string> = {
  MIENG: "Miệng",
  PHUT_15: "15 phút",
  GIUA_KY: "Giữa kỳ",
  CUOI_KY: "Cuối kỳ",
};

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
 * Thanh chọn bảng điểm (03 §8): Lớp · Môn · Loại điểm (segmented) · Nhập từ Excel
 * kèm tiến độ nhập của cả lớp.
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
  const currentExam = examTypes.find((et) => et.id === selectedExamType);
  const complete = totalStudents > 0 && enteredCount >= totalStudents;

  return (
    <Card padding="md" className={cn("space-y-5", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          id="score-class"
          label="Lớp"
          value={selectedClassId}
          disabled={disabled}
          options={classes.map((c) => ({ value: c.id, label: c.name }))}
          onChange={(val) => onClassChange(val)}
        />
        <Select
          id="score-subject"
          label="Môn"
          value={selectedSubjectId}
          disabled={disabled}
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          onChange={(val) => onSubjectChange(val)}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p id="score-exam-type-label" className="mb-2 text-sm font-medium text-ink-2">
            Loại điểm
            {currentExam && (
              <span className="text-ink-3">
                {" "}
                · Hệ số <span className="font-mono">{currentExam.weight}</span>
              </span>
            )}
          </p>
          {/* Cuộn ngang trên màn hẹp; -m/p để vòng focus không bị cắt */}
          <div className="no-scrollbar -m-1 overflow-x-auto p-1">
            <SegmentedControl<ExamType>
              ariaLabel="Loại điểm"
              value={selectedExamType}
              disabled={disabled}
              onChange={onExamTypeChange}
              options={examTypes.map((et) => ({
                value: et.id,
                label: EXAM_TYPE_SHORT_LABELS[et.id] ?? et.label,
              }))}
            />
          </div>
        </div>

        <Button
          variant="outline"
          leftIcon={<FileSpreadsheet />}
          onClick={onOpenExcelImport}
          disabled={disabled}
          className="w-full md:w-auto"
        >
          Nhập từ Excel
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
        <div className="flex min-w-48 flex-1 items-center gap-3">
          <ProgressBar
            value={enteredCount}
            max={Math.max(totalStudents, 1)}
            tone={complete ? "success" : "primary"}
            size="sm"
            label="Tiến độ nhập điểm"
            className="flex-1"
          />
          <p className="shrink-0 text-sm text-ink-2">
            <span className="font-mono font-semibold text-ink tabular-nums">
              {enteredCount}/{totalStudents}
            </span>{" "}
            đã nhập
          </p>
        </div>
        {invalidCount > 0 ? (
          <Badge variant="error" size="lg" icon={<AlertCircle />}>
            {invalidCount} điểm cần sửa
          </Badge>
        ) : (
          <Badge variant="success" size="lg" icon={<CheckCircle2 />}>
            Hợp lệ
          </Badge>
        )}
      </div>
    </Card>
  );
};
