import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { AlertTriangle, FlaskConical } from "lucide-react";
import {
  Student,
  ScoreEntry,
  ScoreSaveState,
  ScoreValidationItem,
  ExcelImportResult,
  ExamType,
} from "../../types";
import { PageHeader } from "../ui/PageHeader";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { useToast } from "../ui/Toast";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { useDraft } from "../../hooks/useDraft";
import { ScoreHeader, DEFAULT_SUBJECTS, DEFAULT_EXAM_TYPES, EXAM_TYPE_SHORT_LABELS } from "./ScoreHeader";
import { ScoreTable, ScoreTableRef } from "./ScoreTable";
import { ScoreValidationSummary } from "./ScoreValidationSummary";
import { ScoreSaveBar } from "./ScoreSaveBar";
import { ScoreDraftBanner } from "./ScoreDraftBanner";
import { ExcelUploader } from "./ExcelUploader";
import { ExcelPreview } from "./ExcelPreview";
import { ExcelImportStepper, ExcelImportStep } from "./ExcelImportStepper";
import { normalizeScoreText, useDemoMode, validateScoreText } from "./scoreUtils";
import { MOCK_CLASSES, MOCK_STUDENTS_BY_CLASS } from "../attendance/AttendancePage";

export interface BulkScoreEntryProps {
  onBack?: () => void;
  initialClassId?: string;
  initialSubjectId?: string;
  initialExamType?: ExamType;
  className?: string;
  onSaveSuccess?: (scores: Record<string, ScoreEntry>) => void;
}

interface SheetSelection {
  classId: string;
  subjectId: string;
  examType: ExamType;
}

/** Nội dung bản nháp: chỉ các ô đã sửa (studentId → chuỗi đã gõ) */
interface ScoreDraftData {
  key: string;
  values: Record<string, string>;
}

type TestCase = "-1" | "11" | "abc" | "empty" | "all";

const FALLBACK_CLASS_ID = "class-rl1a";

function studentsForClass(classId: string): Student[] {
  return MOCK_STUDENTS_BY_CLASS[classId] || MOCK_STUDENTS_BY_CLASS[FALLBACK_CLASS_ID] || [];
}

function resolveSelection(classId: string, subjectId: string, examType: ExamType): SheetSelection {
  return {
    classId: MOCK_STUDENTS_BY_CLASS[classId] ? classId : MOCK_CLASSES[0]?.id ?? FALLBACK_CLASS_ID,
    subjectId: DEFAULT_SUBJECTS.some((s) => s.id === subjectId) ? subjectId : DEFAULT_SUBJECTS[0].id,
    examType: DEFAULT_EXAM_TYPES.some((e) => e.id === examType) ? examType : DEFAULT_EXAM_TYPES[0].id,
  };
}

function draftKeyOf(selection: SheetSelection): string {
  return `qlgl.draft.scores.${selection.classId}.${selection.subjectId}.${selection.examType}`;
}

// Điểm mẫu có sẵn (mô phỏng dữ liệu đã lưu trên hệ thống)
function generateSeedScores(students: Student[]): Record<string, ScoreEntry> {
  const initial: Record<string, ScoreEntry> = {};
  const seedScores = [8.5, 9.0, 7.5, 8.0, 9.5, 8.0, 7.0, 8.5, 9.0, 8.5, 7.5, 8.0, 9.0, 8.5, 9.0, 8.0];

  students.forEach((s, idx) => {
    // 2 em cuối để trống → "chưa nhập"
    if (idx >= students.length - 2) {
      initial[s.id] = { studentId: s.id, score: null, rawInput: "", previousScore: 7.5, isDirty: false, error: null };
    } else {
      const score = seedScores[idx % seedScores.length];
      initial[s.id] = {
        studentId: s.id,
        score,
        rawInput: String(score),
        previousScore: Math.max(5, Number((score - 0.5).toFixed(1))),
        isDirty: false,
        error: null,
      };
    }
  });

  return initial;
}

function baselineFrom(scores: Record<string, ScoreEntry>): Record<string, string> {
  const baseline: Record<string, string> = {};
  Object.values(scores).forEach((e) => {
    baseline[e.studentId] = e.rawInput ?? (e.score !== null ? String(e.score) : "");
  });
  return baseline;
}

/** Tạo entry mới từ chuỗi người dùng gõ; "dirty" = khác giá trị đã lưu gần nhất. */
function buildEntry(
  current: ScoreEntry | undefined,
  studentId: string,
  rawText: string,
  baselineRaw: string,
  options: { required?: boolean } = {}
): ScoreEntry {
  const { parsed, error } = validateScoreText(rawText, { required: options.required });
  return {
    ...current,
    studentId,
    previousScore: current?.previousScore ?? null,
    score: error ? null : parsed,
    rawInput: rawText,
    error,
    isDirty: normalizeScoreText(rawText) !== normalizeScoreText(baselineRaw) || Boolean(error),
  };
}

function isDraftData(value: unknown): value is ScoreDraftData {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<ScoreDraftData>;
  return typeof v.key === "string" && !!v.values && typeof v.values === "object";
}

/**
 * Nhập điểm hàng loạt cho GLV (02 §11, B-GLV-07/08).
 * PageHeader → (bản nháp) → (công cụ demo) → ScoreHeader → Tóm tắt lỗi → ScoreTable → SaveBar
 * + Modal nhập Excel 3 bước + hộp thoại rời trang khi còn thay đổi.
 */
export const BulkScoreEntry: React.FC<BulkScoreEntryProps> = ({
  onBack,
  initialClassId = "class-rl1a",
  initialSubjectId = "giao_ly",
  initialExamType = "GIUA_KY",
  className = "",
  onSaveSuccess,
}) => {
  const toast = useToast();
  const demoMode = useDemoMode();
  const tableRef = useRef<ScoreTableRef | null>(null);
  const revealRef = useReveal<HTMLDivElement>();

  // 1. Bảng điểm đang chọn (Lớp · Môn · Loại điểm)
  const [selection, setSelection] = useState<SheetSelection>(() =>
    resolveSelection(initialClassId, initialSubjectId, initialExamType)
  );
  const { classId: selectedClassId, subjectId: selectedSubjectId, examType: selectedExamType } = selection;
  const draftKey = draftKeyOf(selection);

  const students = useMemo(() => studentsForClass(selectedClassId), [selectedClassId]);

  // 2. Điểm + mốc "đã lưu" để tính thay đổi
  const baselineRef = useRef<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, ScoreEntry>>(() => {
    const seeded = generateSeedScores(studentsForClass(selection.classId));
    baselineRef.current = baselineFrom(seeded);
    return seeded;
  });
  const scoresRef = useRef(scores);
  scoresRef.current = scores;

  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [highlightedStudentId, setHighlightedStudentId] = useState<string | null>(null);
  const highlightTimer = useRef<number | undefined>(undefined);

  // 3. Trạng thái lưu
  const [saveState, setSaveState] = useState<ScoreSaveState>("NO_CHANGES");
  const [simulateNetworkError, setSimulateNetworkError] = useState<boolean>(false);

  // 4. Nhập Excel
  const [isExcelModalOpen, setIsExcelModalOpen] = useState<boolean>(false);
  const [excelResult, setExcelResult] = useState<ExcelImportResult | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // 5. Hộp thoại rời trang
  const [pendingLeaveAction, setPendingLeaveAction] = useState<(() => void) | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);

  // 6. Bản nháp tự động theo lớp + môn + loại điểm
  const { draft, saveDraft, clearDraft } = useDraft<ScoreDraftData>(draftKey);
  const touchedRef = useRef(false);
  const [draftDecidedKey, setDraftDecidedKey] = useState<string | null>(null);

  useEffect(
    () => () => {
      window.clearTimeout(highlightTimer.current);
    },
    []
  );

  // --------------------------------------------------------------------------
  // SỐ LIỆU
  // --------------------------------------------------------------------------
  const dirtyCount = useMemo(() => Object.values(scores).filter((e) => e.isDirty).length, [scores]);
  const isDirty = dirtyCount > 0;

  const validationErrors: ScoreValidationItem[] = useMemo(() => {
    const list: ScoreValidationItem[] = [];
    students.forEach((student) => {
      const entry = scores[student.id];
      if (entry && entry.error) {
        list.push({
          studentId: student.id,
          studentName: `${student.christianName || ""} ${student.name}`.trim(),
          orderNumber: student.orderNumber,
          score: entry.rawInput || entry.score,
          error: entry.error,
        });
      }
    });
    return list;
  }, [scores, students]);

  const hasValidationErrors = validationErrors.length > 0;

  const enteredCount = useMemo(
    () => Object.values(scores).filter((e) => e.score !== null && !e.error).length,
    [scores]
  );

  const effectiveSaveState: ScoreSaveState =
    saveState === "SAVING" || saveState === "ERROR"
      ? saveState
      : isDirty || hasValidationErrors
        ? "DIRTY"
        : saveState === "SAVED"
          ? "SAVED"
          : "NO_CHANGES";

  const currentClass = MOCK_CLASSES.find((c) => c.id === selectedClassId);
  const currentSubject = DEFAULT_SUBJECTS.find((s) => s.id === selectedSubjectId);

  // --------------------------------------------------------------------------
  // BẢN NHÁP
  // --------------------------------------------------------------------------
  const draftValues = draft && isDraftData(draft.data) && draft.data.key === draftKey ? draft.data.values : null;
  const draftCount = draftValues ? students.filter((s) => draftValues[s.id] !== undefined).length : 0;
  const showDraftBanner = Boolean(draft && draftValues && draftCount > 0 && draftDecidedKey !== draftKey);

  // Tự lưu nháp khi GLV sửa điểm (chỉ sau thao tác đầu tiên để không xóa nháp cũ trước khi quyết định)
  useEffect(() => {
    if (!touchedRef.current) return;
    const values: Record<string, string> = {};
    Object.values(scores).forEach((e) => {
      if (e.isDirty) values[e.studentId] = e.rawInput ?? "";
    });
    if (Object.keys(values).length === 0) {
      clearDraft();
    } else {
      saveDraft({ key: draftKey, values });
    }
  }, [scores, draftKey, saveDraft, clearDraft]);

  const handleRestoreDraft = () => {
    if (!draftValues) return;
    touchedRef.current = true;
    setScores((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        const raw = draftValues[s.id];
        if (raw !== undefined) next[s.id] = buildEntry(next[s.id], s.id, raw, baselineRef.current[s.id] ?? "");
      });
      return next;
    });
    setSaveState("DIRTY");
    setDraftDecidedKey(draftKey);
    toast.success(`Đã khôi phục ${draftCount} điểm từ bản nháp`);
  };

  const handleDismissDraft = () => {
    clearDraft();
    setDraftDecidedKey(draftKey);
    // Nếu đã sửa thêm sau khi mở trang, giữ nháp của phần vừa sửa
    if (touchedRef.current) {
      const values: Record<string, string> = {};
      Object.values(scoresRef.current).forEach((e) => {
        if (e.isDirty) values[e.studentId] = e.rawInput ?? "";
      });
      if (Object.keys(values).length > 0) saveDraft({ key: draftKey, values });
    }
  };

  // --------------------------------------------------------------------------
  // CẢNH BÁO RỜI TRANG
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu trên bảng điểm.";
        return "Bạn có thay đổi chưa lưu trên bảng điểm.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const executeSafeNavigation = (navigateAction: () => void) => {
    if (isDirty) {
      setPendingLeaveAction(() => navigateAction);
      setIsLeaveModalOpen(true);
    } else {
      navigateAction();
    }
  };

  const applySelection = (next: SheetSelection) => {
    const seeded = generateSeedScores(studentsForClass(next.classId));
    baselineRef.current = baselineFrom(seeded);
    touchedRef.current = false;
    window.clearTimeout(highlightTimer.current);
    setSelection(next);
    setScores(seeded);
    setSavedIds(new Set());
    setHighlightedStudentId(null);
    setSaveState("NO_CHANGES");
    setDraftDecidedKey(null);
  };

  const requestSelection = (patch: Partial<SheetSelection>) => {
    const next = { ...selection, ...patch };
    if (
      next.classId === selection.classId &&
      next.subjectId === selection.subjectId &&
      next.examType === selection.examType
    ) {
      return;
    }
    executeSafeNavigation(() => applySelection(next));
  };

  const handleBackRequest = () => {
    executeSafeNavigation(() => {
      onBack?.();
    });
  };

  const closeLeaveModal = () => {
    setIsLeaveModalOpen(false);
    setPendingLeaveAction(null);
  };

  // --------------------------------------------------------------------------
  // SỬA ĐIỂM (validate inline 0–10, bước 0.25)
  // --------------------------------------------------------------------------
  const handleScoreChange = useCallback((studentId: string, _parsedScore: number | null, rawText: string) => {
    touchedRef.current = true;
    setScores((prev) => ({
      ...prev,
      [studentId]: buildEntry(prev[studentId], studentId, rawText, baselineRef.current[studentId] ?? ""),
    }));
    setSavedIds((prev) => {
      if (!prev.has(studentId)) return prev;
      const next = new Set(prev);
      next.delete(studentId);
      return next;
    });
    setSaveState((prev) => (prev === "SAVING" ? prev : "DIRTY"));
  }, []);

  // --------------------------------------------------------------------------
  // BẤM LỖI TRONG TÓM TẮT → CUỘN + FOCUS
  // --------------------------------------------------------------------------
  const handleErrorItemClick = (studentId: string) => {
    setHighlightedStudentId(studentId);
    tableRef.current?.focusStudent(studentId);
    window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => {
      setHighlightedStudentId((prev) => (prev === studentId ? null : prev));
    }, 2500);
  };

  // --------------------------------------------------------------------------
  // LƯU
  // --------------------------------------------------------------------------
  const handleSave = (afterSuccess?: () => void) => {
    if (saveState === "SAVING") return;

    if (hasValidationErrors) {
      toast.error(`Còn ${validationErrors.length} điểm chưa hợp lệ. Sửa xong rồi lưu nhé.`);
      handleErrorItemClick(validationErrors[0].studentId);
      return;
    }

    if (!isDirty && saveState !== "ERROR") {
      afterSuccess?.();
      return;
    }

    const count = dirtyCount;
    const failThisTime = simulateNetworkError;
    setSaveState("SAVING");

    window.setTimeout(() => {
      if (failThisTime) {
        // Lỗi mạng: KHÔNG xóa dữ liệu trên máy; nháp vẫn còn
        setSaveState("ERROR");
        toast.error("Chưa lưu được do lỗi kết nối. Điểm vẫn còn trên máy.", {
          action: { label: "Thử lại", onClick: () => handleSaveRef.current() },
        });
        return;
      }

      const current = scoresRef.current;
      const next: Record<string, ScoreEntry> = {};
      const justSaved = new Set<string>();
      Object.keys(current).forEach((id) => {
        const entry = current[id];
        if (entry.isDirty) {
          justSaved.add(id);
          next[id] = { ...entry, isDirty: false, previousScore: entry.score };
        } else {
          next[id] = entry;
        }
      });
      baselineRef.current = baselineFrom(next);
      touchedRef.current = false;

      setScores(next);
      setSavedIds(justSaved);
      setSaveState("SAVED");
      clearDraft();
      toast.success(`Đã lưu ${count} điểm`);
      onSaveSuccess?.(next);
      afterSuccess?.();
    }, 700);
  };

  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;

  // Hủy thay đổi → về điểm đã lưu gần nhất, có Hoàn tác
  const revertToBaseline = () => {
    const current = scoresRef.current;
    const next: Record<string, ScoreEntry> = {};
    Object.keys(current).forEach((id) => {
      next[id] = buildEntry(current[id], id, baselineRef.current[id] ?? "", baselineRef.current[id] ?? "");
    });
    touchedRef.current = true;
    setScores(next);
    setSaveState("NO_CHANGES");
  };

  const handleReset = () => {
    const snapshot = scoresRef.current;
    const count = dirtyCount;
    revertToBaseline();
    toast.info(`Đã hủy ${count} thay đổi`, {
      action: {
        label: "Hoàn tác",
        onClick: () => {
          touchedRef.current = true;
          setScores(snapshot);
          setSaveState("DIRTY");
        },
      },
    });
  };

  // --------------------------------------------------------------------------
  // NHẬP EXCEL
  // --------------------------------------------------------------------------
  const excelStep: ExcelImportStep = isImporting ? 3 : excelResult ? 2 : 1;

  const openExcel = () => {
    setExcelResult(null);
    setIsExcelModalOpen(true);
  };

  const closeExcel = () => {
    if (isImporting) return;
    setIsExcelModalOpen(false);
    setExcelResult(null);
  };

  const handleConfirmExcelImport = () => {
    if (!excelResult || excelResult.validCount === 0) return;
    const result = excelResult;
    setIsImporting(true);

    window.setTimeout(() => {
      touchedRef.current = true;
      setScores((prev) => {
        const next = { ...prev };
        result.validData.forEach((item) => {
          next[item.studentId] = buildEntry(
            next[item.studentId],
            item.studentId,
            String(item.score),
            baselineRef.current[item.studentId] ?? ""
          );
        });
        return next;
      });
      setSaveState("DIRTY");
      setIsImporting(false);
      setIsExcelModalOpen(false);
      setExcelResult(null);
      toast.success(`Đã nhập ${result.validCount} điểm từ Excel. Kiểm tra rồi bấm "Lưu tất cả".`);
    }, 500);
  };

  // --------------------------------------------------------------------------
  // CÔNG CỤ KIỂM THỬ (chỉ khi bật Chế độ demo)
  // --------------------------------------------------------------------------
  const applyTestCase = (type: TestCase) => {
    if (students.length === 0) return;
    const pick = (i: number) => students[i] || students[0];
    const cases: { student: Student; raw: string; required?: boolean }[] = [];
    if (type === "-1" || type === "all") cases.push({ student: pick(0), raw: "-1" });
    if (type === "11" || type === "all") cases.push({ student: pick(1), raw: "11" });
    if (type === "abc" || type === "all") cases.push({ student: pick(2), raw: "abc" });
    if (type === "empty" || type === "all") cases.push({ student: pick(3), raw: "", required: true });

    touchedRef.current = true;
    setScores((prev) => {
      const next = { ...prev };
      cases.forEach(({ student, raw, required }) => {
        next[student.id] = buildEntry(next[student.id], student.id, raw, baselineRef.current[student.id] ?? "", {
          required,
        });
      });
      return next;
    });
    setSaveState("DIRTY");
    toast.warning(`Đã tạo lỗi mẫu: ${type === "all" ? "cả 4 trường hợp" : type === "empty" ? "để trống" : type}`);
  };

  const clearTestErrors = () => {
    revertToBaseline();
    toast.success("Đã khôi phục điểm hợp lệ");
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  const examLabel = EXAM_TYPE_SHORT_LABELS[selectedExamType];

  return (
    <div className={cn("w-full", className)}>
      <div ref={revealRef} className="space-y-6">
        <div data-reveal>
          <PageHeader
            title="Nhập điểm"
            description="Nhập điểm cho cả lớp. Bản nháp được lưu tự động trên máy này."
            showBackButton={Boolean(onBack)}
            onBack={handleBackRequest}
          />
        </div>

        {showDraftBanner && draft && (
          <div data-reveal>
            <ScoreDraftBanner
              savedAt={draft.savedAt}
              count={draftCount}
              onRestore={handleRestoreDraft}
              onDismiss={handleDismissDraft}
            />
          </div>
        )}

        {demoMode && (
          <Card variant="outline" padding="md" className="space-y-4 border-dashed border-line-strong" data-reveal>
            <div className="flex flex-wrap items-center gap-2">
              <FlaskConical className="size-5 text-ink-3" aria-hidden="true" />
              <h2 className="text-base font-semibold text-ink">Công cụ kiểm thử</h2>
              <Badge variant="grape" size="sm">
                Chế độ demo
              </Badge>
            </div>

            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control bg-surface-2 px-4 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={simulateNetworkError}
                onChange={(e) => setSimulateNetworkError(e.target.checked)}
                className="size-5 shrink-0 accent-primary"
              />
              <span>Giả lập lỗi mạng khi lưu</span>
            </label>

            <div className="space-y-2">
              <p className="text-sm font-medium text-ink-2">Tạo lỗi mẫu để kiểm tra thông báo</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => applyTestCase("-1")}>
                  Điểm -1
                </Button>
                <Button variant="outline" onClick={() => applyTestCase("11")}>
                  Điểm 11
                </Button>
                <Button variant="outline" onClick={() => applyTestCase("abc")}>
                  Chữ "abc"
                </Button>
                <Button variant="outline" onClick={() => applyTestCase("empty")}>
                  Để trống
                </Button>
                <Button variant="soft" onClick={() => applyTestCase("all")}>
                  Cả 4 lỗi
                </Button>
                {hasValidationErrors && (
                  <Button variant="ghost" onClick={clearTestErrors}>
                    Khôi phục điểm hợp lệ
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        <div data-reveal>
          <ScoreHeader
            classes={MOCK_CLASSES}
            selectedClassId={selectedClassId}
            onClassChange={(classId) => requestSelection({ classId })}
            selectedSubjectId={selectedSubjectId}
            onSubjectChange={(subjectId) => requestSelection({ subjectId })}
            selectedExamType={selectedExamType}
            onExamTypeChange={(examType) => requestSelection({ examType })}
            onOpenExcelImport={openExcel}
            totalStudents={students.length}
            enteredCount={enteredCount}
            invalidCount={validationErrors.length}
          />
        </div>

        {hasValidationErrors && (
          <ScoreValidationSummary errors={validationErrors} onErrorClick={handleErrorItemClick} />
        )}

        <div data-reveal>
          <ScoreTable
            ref={tableRef}
            students={students}
            scores={scores}
            highlightedStudentId={highlightedStudentId}
            onScoreChange={handleScoreChange}
            savedStudentIds={savedIds}
          />
        </div>
      </div>

      {/* Thanh lưu nổi — nằm ngoài vùng reveal để không bị lệch vị trí fixed */}
      <ScoreSaveBar
        state={effectiveSaveState}
        dirtyCount={dirtyCount}
        totalCount={students.length}
        enteredCount={enteredCount}
        errorCount={validationErrors.length}
        hasErrors={hasValidationErrors}
        allowSaveWithErrors
        onSave={() => handleSave()}
        onReset={handleReset}
      />

      {/* Nhập từ Excel: 1 Chọn file · 2 Kiểm tra · 3 Nhập */}
      <Modal
        isOpen={isExcelModalOpen}
        onClose={closeExcel}
        title="Nhập điểm từ Excel"
        description={[currentClass?.name, currentSubject?.name, examLabel].filter(Boolean).join(" · ")}
        size="lg"
        loading={isImporting}
      >
        <div className="space-y-5">
          <ExcelImportStepper current={excelStep} />
          {!excelResult ? (
            <ExcelUploader students={students} onParsed={(parsed) => setExcelResult(parsed)} />
          ) : (
            <ExcelPreview
              result={excelResult}
              onConfirmImport={handleConfirmExcelImport}
              onCancel={closeExcel}
              onChooseAnother={() => setExcelResult(null)}
              isImporting={isImporting}
            />
          )}
        </div>
      </Modal>

      {/* Rời trang / đổi bảng điểm khi còn thay đổi */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={closeLeaveModal}
        title={`Còn ${dirtyCount} thay đổi chưa lưu`}
        description="Nếu rời đi bây giờ, các điểm vừa nhập sẽ không được lưu."
        size="sm"
        role="alertdialog"
      >
        <div className="space-y-4">
          {hasValidationErrors && (
            <p className="flex items-start gap-2 rounded-control bg-danger-soft p-3 text-sm font-medium text-danger">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Còn {validationErrors.length} điểm chưa hợp lệ. Sửa xong mới lưu được.
              </span>
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row-reverse sm:justify-start">
            <Button
              variant="primary"
              disabled={hasValidationErrors}
              onClick={() => {
                const action = pendingLeaveAction;
                closeLeaveModal();
                handleSave(() => action?.());
              }}
              className="w-full sm:w-auto"
            >
              Lưu rồi rời
            </Button>
            <Button variant="outline" onClick={closeLeaveModal} className="w-full sm:w-auto">
              Ở lại
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const action = pendingLeaveAction;
                closeLeaveModal();
                clearDraft();
                touchedRef.current = false;
                action?.();
              }}
              className="w-full text-danger hover:bg-danger-soft hover:text-danger sm:mr-auto sm:w-auto"
            >
              Bỏ thay đổi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
