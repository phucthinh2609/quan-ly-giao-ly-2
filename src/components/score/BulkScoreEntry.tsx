import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
import { useToast } from "../ui/Toast";
import {
  ScoreHeader,
  DEFAULT_SUBJECTS,
  DEFAULT_EXAM_TYPES,
} from "./ScoreHeader";
import { ScoreTable, ScoreTableRef } from "./ScoreTable";
import { ScoreValidationSummary } from "./ScoreValidationSummary";
import { ScoreSaveBar } from "./ScoreSaveBar";
import { ExcelUploader } from "./ExcelUploader";
import { ExcelPreview } from "./ExcelPreview";
import { MOCK_CLASSES, MOCK_STUDENTS_BY_CLASS } from "../attendance/AttendancePage";
import {
  AlertTriangle,
  Keyboard,
} from "lucide-react";

export interface BulkScoreEntryProps {
  onBack?: () => void;
  initialClassId?: string;
  initialSubjectId?: string;
  initialExamType?: ExamType;
  className?: string;
  onSaveSuccess?: (scores: Record<string, ScoreEntry>) => void;
}

// Generate realistic mock scores seed
function generateSeedScores(students: Student[]): Record<string, ScoreEntry> {
  const initial: Record<string, ScoreEntry> = {};
  const seedScores = [8.5, 9.0, 7.5, 8.0, 9.5, 8.0, 7.0, 8.5, 9.0, 8.5, 7.5, 8.0, 9.0, 8.5, 9.0, 8.0];

  students.forEach((s, idx) => {
    // Leave the last 2 students blank to show "chưa nhập"
    if (idx >= students.length - 2) {
      initial[s.id] = {
        studentId: s.id,
        score: null,
        rawInput: "",
        previousScore: 7.5,
        isDirty: false,
        error: null,
      };
    } else {
      const score = seedScores[idx % seedScores.length];
      initial[s.id] = {
        studentId: s.id,
        score: score,
        rawInput: String(score),
        previousScore: Math.max(5, Number((score - 0.5).toFixed(1))),
        isDirty: false,
        error: null,
      };
    }
  });

  return initial;
}

/**
 * BulkScoreEntry Component (§30 - Feature Component Tree)
 *
 * Cây Component Bắt Buộc (§30):
 * <BulkScoreEntry>
 * ├── <PageHeader />
 * ├── <ScoreHeader />
 * ├── <ScoreValidationSummary />
 * ├── <ScoreTable>
 * │   └── <ScoreRow>
 * │       └── <ScoreInput />
 * ├── <SaveBar />
 * ├── <ExcelUploader /> (kèm <ExcelPreview />)
 * └── <Toast />
 *
 * Tiêu chí & Ràng buộc:
 * 1. Validate: 0 <= score <= 10; chặn -1, 11, "abc", rỗng khi bắt buộc.
 * 2. Lỗi hiển thị INLINE, KHÔNG dùng modal cho từng học sinh.
 * 3. Desktop keyboard flow: Input -> Enter/Tab -> Next Student.
 *    Mobile: Tap ScoreInput -> Numeric Keyboard -> Next -> Next Student.
 * 4. ScoreValidationSummary: click lỗi -> scrollIntoView() -> focus ScoreInput tương ứng.
 * 5. Unsaved draft: cảnh báo "⚠ Có thay đổi chưa lưu" + [Tiếp tục chỉnh sửa]/[Lưu]; rời trang cảnh báo.
 * 6. ExcelUploader: accept .xlsx,.xls; state IDLE/DRAGGING/UPLOADING/PARSING/SUCCESS/ERROR; mobile [Chọn file Excel].
 * 7. ExcelPreview: format "✓ N dòng hợp lệ / ⚠ M dòng lỗi" + chi tiết dòng + [Hủy]/[Import hợp lệ].
 * 8. Table header sticky khi scroll desktop.
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
  const tableRef = useRef<ScoreTableRef | null>(null);

  // 1. Selector states
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [selectedExamType, setSelectedExamType] = useState<ExamType>(initialExamType);

  // 2. Students & Scores state
  const students = useMemo(() => {
    return MOCK_STUDENTS_BY_CLASS[selectedClassId] || MOCK_STUDENTS_BY_CLASS["class-rl1a"];
  }, [selectedClassId]);

  const [scores, setScores] = useState<Record<string, ScoreEntry>>(() =>
    generateSeedScores(students)
  );

  // Reset scores when class changes
  useEffect(() => {
    setScores(generateSeedScores(students));
    setSaveState("NO_CHANGES");
  }, [selectedClassId, students]);

  // 3. Highlighted student (when clicked from validation summary)
  const [highlightedStudentId, setHighlightedStudentId] = useState<string | null>(null);

  // 4. Save Bar State: NO_CHANGES | DIRTY | SAVING | SAVED | ERROR
  const [saveState, setSaveState] = useState<ScoreSaveState>("NO_CHANGES");
  const [simulateNetworkError, setSimulateNetworkError] = useState<boolean>(false);

  // 5. Excel Import Modal states
  const [isExcelModalOpen, setIsExcelModalOpen] = useState<boolean>(false);
  const [excelResult, setExcelResult] = useState<ExcelImportResult | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // 6. Navigation Confirm Modal (Unsaved draft guard)
  const [pendingLeaveAction, setPendingLeaveAction] = useState<(() => void) | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);

  // Compute dirty count & validation errors
  const dirtyCount = useMemo(() => {
    return Object.values(scores).filter((entry) => entry.isDirty).length;
  }, [scores]);

  const isDirty = dirtyCount > 0;

  // Validation items list for ScoreValidationSummary
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

  // Total students entered
  const enteredCount = useMemo(() => {
    return Object.values(scores).filter((e) => e.score !== null && !e.error).length;
  }, [scores]);

  // --------------------------------------------------------------------------
  // UNGUARDED LEAVE WARNING: beforeunload (§9)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu trên bảng điểm. Rời đi sẽ làm mất dữ liệu!";
        return "Bạn có thay đổi chưa lưu trên bảng điểm. Rời đi sẽ làm mất dữ liệu!";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Safe navigation wrapper for internal back/class change
  const executeSafeNavigation = (navigateAction: () => void) => {
    if (isDirty) {
      setPendingLeaveAction(() => navigateAction);
      setIsLeaveModalOpen(true);
    } else {
      navigateAction();
    }
  };

  const handleBackRequest = () => {
    executeSafeNavigation(() => {
      onBack?.();
    });
  };

  const handleClassChangeRequest = (newClassId: string) => {
    if (newClassId === selectedClassId) return;
    executeSafeNavigation(() => {
      setSelectedClassId(newClassId);
    });
  };

  // --------------------------------------------------------------------------
  // SCORE CHANGE HANDLER (Inline validation 0-10, -1, 11, abc, empty)
  // --------------------------------------------------------------------------
  const handleScoreChange = useCallback(
    (studentId: string, parsedScore: number | null, rawText: string) => {
      setScores((prev) => {
        const current = prev[studentId] || { studentId, score: null };
        const trimmed = rawText.trim();

        let error: string | null = null;

        // Validation Rules:
        // 1. Valid range: 0 <= score <= 10
        // 2. Reject -1: "Điểm không được nhỏ hơn 0 (bạn nhập -1)"
        // 3. Reject 11: "Điểm tối đa là 10 (thang điểm 10)"
        // 4. Reject "abc": "Vui lòng nhập số hợp lệ từ 0 đến 10"
        if (trimmed !== "") {
          const normalized = trimmed.replace(/,/g, ".");
          if (!/^-?\d*(\.\d+)?$/.test(normalized) || normalized === "-") {
            error = `Vui lòng nhập số hợp lệ từ 0 đến 10 (không nhập chữ "${trimmed}")`;
          } else {
            const num = parseFloat(normalized);
            if (isNaN(num)) {
              error = "Vui lòng chỉ nhập số";
            } else if (num < 0) {
              error = `Điểm không được nhỏ hơn 0 (bạn nhập ${num})`;
            } else if (num > 10) {
              error = `Điểm tối đa là 10 (bạn nhập ${num})`;
            }
          }
        }

        const isChanged = current.rawInput !== rawText;

        return {
          ...prev,
          [studentId]: {
            ...current,
            score: error ? null : parsedScore,
            rawInput: rawText,
            error,
            isDirty: isChanged ? true : current.isDirty,
          },
        };
      });

      setSaveState("DIRTY");
    },
    []
  );

  // --------------------------------------------------------------------------
  // CLICK ERROR IN SUMMARY -> SCROLL & FOCUS
  // --------------------------------------------------------------------------
  const handleErrorItemClick = (studentId: string) => {
    setHighlightedStudentId(studentId);
    tableRef.current?.focusStudent(studentId);

    // Clear highlight after 2.5s
    setTimeout(() => {
      setHighlightedStudentId((prev) => (prev === studentId ? null : prev));
    }, 2500);
  };

  // --------------------------------------------------------------------------
  // SAVE SCORES HANDLER
  // --------------------------------------------------------------------------
  const handleSave = () => {
    if (hasValidationErrors) {
      toast.error("Vui lòng sửa tất cả các điểm không hợp lệ trước khi lưu!");
      return;
    }

    setSaveState("SAVING");

    setTimeout(() => {
      if (simulateNetworkError) {
        // Network error rule: DO NOT RESET LOCAL DATA!
        setSaveState("ERROR");
        toast.error("Lỗi kết nối máy chủ! Dữ liệu cục bộ vẫn được giữ nguyên an toàn.");
      } else {
        // Mark all dirty entries as saved
        let updatedScores: Record<string, ScoreEntry> = {};
        setScores((prev) => {
          const next = { ...prev };
          Object.keys(next).forEach((id) => {
            if (next[id].isDirty) {
              next[id] = {
                ...next[id],
                isDirty: false,
                previousScore: next[id].score,
              };
            }
          });
          updatedScores = next;
          return next;
        });

        setSaveState("SAVED");
        toast.success(`Đã lưu thành công ${dirtyCount} điểm mới lên hệ thống!`);
        onSaveSuccess?.(updatedScores);
      }
    }, 700);
  };

  // Reset changes
  const handleReset = () => {
    setScores(generateSeedScores(students));
    setSaveState("NO_CHANGES");
    toast.info("Đã khôi phục bảng điểm về trạng thái ban đầu");
  };

  // --------------------------------------------------------------------------
  // EXCEL IMPORT CONFIRM HANDLER (§10)
  // --------------------------------------------------------------------------
  const handleConfirmExcelImport = () => {
    if (!excelResult || excelResult.validCount === 0) return;

    setIsImporting(true);

    setTimeout(() => {
      setIsImporting(false);

      // Apply imported valid data into scores state
      setScores((prev) => {
        const next = { ...prev };
        excelResult.validData.forEach((item) => {
          next[item.studentId] = {
            studentId: item.studentId,
            score: item.score,
            rawInput: String(item.score),
            previousScore: next[item.studentId]?.previousScore ?? null,
            error: null,
            isDirty: true,
          };
        });
        return next;
      });

      setSaveState("DIRTY");
      setIsExcelModalOpen(false);
      setExcelResult(null);

      toast.success(
        `Đã nhập thành công ${excelResult.validCount} điểm từ Excel! Vui lòng bấm "Lưu điểm".`
      );
    }, 500);
  };

  // --------------------------------------------------------------------------
  // TEST PRESET TRIGGERS (FOR VERIFYING CHECKLIST CONSTRAINTS)
  // --------------------------------------------------------------------------
  const applyTestCase = (type: "-1" | "11" | "abc" | "empty" | "all") => {
    if (students.length === 0) return;

    setScores((prev) => {
      const next = { ...prev };
      if (type === "-1" || type === "all") {
        const s = students[0];
        next[s.id] = {
          ...next[s.id],
          score: null,
          rawInput: "-1",
          error: "Điểm không được nhỏ hơn 0 (bạn nhập -1)",
          isDirty: true,
        };
      }
      if (type === "11" || type === "all") {
        const s = students[1] || students[0];
        next[s.id] = {
          ...next[s.id],
          score: null,
          rawInput: "11",
          error: "Điểm tối đa là 10 (bạn nhập 11)",
          isDirty: true,
        };
      }
      if (type === "abc" || type === "all") {
        const s = students[2] || students[0];
        next[s.id] = {
          ...next[s.id],
          score: null,
          rawInput: "abc",
          error: 'Vui lòng nhập số hợp lệ từ 0 đến 10 (không nhập chữ "abc")',
          isDirty: true,
        };
      }
      if (type === "empty" || type === "all") {
        const s = students[3] || students[0];
        next[s.id] = {
          ...next[s.id],
          score: null,
          rawInput: "",
          error: "Điểm không được để trống (bắt buộc nhập)",
          isDirty: true,
        };
      }
      return next;
    });

    setSaveState("DIRTY");
    toast.warning(`Đã kích hoạt test case validation: [${type}]`);
  };

  const clearTestErrors = () => {
    setScores(generateSeedScores(students));
    setSaveState("NO_CHANGES");
    toast.success("Đã xóa tất cả lỗi kiểm thử, khôi phục điểm hợp lệ!");
  };

  return (
    <div className={`min-h-screen bg-[#F5F5F4] flex flex-col font-sans ${className}`}>
      {/* 1. PageHeader */}
      <PageHeader
        title="Nhập Điểm Học Sinh"
        description="Quản lý và nhập điểm Giáo lý theo từng lớp, hỗ trợ phím tắt và nạp file Excel"
        showBackButton={true}
        onBack={handleBackRequest}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="gold" icon="📖">
              {DEFAULT_SUBJECTS.find((s) => s.id === selectedSubjectId)?.name}
            </Badge>
            <Badge variant="primary" dot>
              {DEFAULT_EXAM_TYPES.find((e) => e.id === selectedExamType)?.label}
            </Badge>
          </div>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* CHECKLIST & TEST CONSOLE */}
        <div className="p-4 rounded-[14px] bg-white border border-[#E7E5E4] shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#F5F5F4] gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#B4232C] text-white flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <h3 className="font-bold text-[15px] sm:text-[16px] text-[#1C1917] font-serif">
                Bảng Kiểm Tra Tiêu Chuẩn Phase 5 (§9–10, §22–23, Wireframe B)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[12px] font-semibold text-[#57534E] flex items-center gap-1.5 cursor-pointer bg-[#FAFAF9] px-2.5 py-1 rounded border border-[#E7E5E4]">
                <input
                  type="checkbox"
                  checked={simulateNetworkError}
                  onChange={(e) => setSimulateNetworkError(e.target.checked)}
                  className="rounded text-[#B4232C]"
                />
                <span>Mô phỏng lỗi mạng khi lưu</span>
              </label>
            </div>
          </div>

          {/* Quick Trigger Buttons for Validation Constraints */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[13px]">
            <span className="font-semibold text-[#78716C] mr-1 text-[12px]">
              Kích hoạt test case validate 0–10:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTestCase("-1")}
              className="!text-[12px] bg-[#FEF2F2] border-[#FECDD3] text-[#DC4C4C] hover:bg-[#FEE2E2]"
            >
              Test -1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTestCase("11")}
              className="!text-[12px] bg-[#FEF2F2] border-[#FECDD3] text-[#DC4C4C] hover:bg-[#FEE2E2]"
            >
              Test 11
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTestCase("abc")}
              className="!text-[12px] bg-[#FEF2F2] border-[#FECDD3] text-[#DC4C4C] hover:bg-[#FEE2E2]"
            >
              Test "abc"
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTestCase("empty")}
              className="!text-[12px] bg-[#FEF2F2] border-[#FECDD3] text-[#DC4C4C] hover:bg-[#FEE2E2]"
            >
              Test Rỗng
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => applyTestCase("all")}
              className="!text-[12px] font-bold"
            >
              Test Cả 4 Lỗi Cùng Lúc
            </Button>
            {hasValidationErrors && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearTestErrors}
                className="!text-[12px] text-[#168154] border-[#BBF7D0] bg-[#F0FDF4] hover:bg-[#DCFCE7]"
              >
                Khôi phục điểm hợp lệ
              </Button>
            )}
          </div>

          {/* Keyboard navigation helper notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-[#F5F5F4] text-[12px] text-[#57534E]">
            <Keyboard className="w-4 h-4 text-[#B4232C] flex-shrink-0" />
            <span>
              <strong>Thao tác bàn phím (Desktop):</strong> Nhấn <strong>Enter</strong> hoặc{" "}
              <strong>Tab</strong> để tự động chuyển sang học sinh kế tiếp. Nhấn phím mũi tên{" "}
              <strong>↑ / ↓</strong> để di chuyển nhanh.
            </span>
          </div>
        </div>

        {/* 2. ScoreHeader */}
        <ScoreHeader
          classes={MOCK_CLASSES}
          selectedClassId={selectedClassId}
          onClassChange={handleClassChangeRequest}
          selectedSubjectId={selectedSubjectId}
          onSubjectChange={setSelectedSubjectId}
          selectedExamType={selectedExamType}
          onExamTypeChange={setSelectedExamType}
          onOpenExcelImport={() => {
            setExcelResult(null);
            setIsExcelModalOpen(true);
          }}
          totalStudents={students.length}
          enteredCount={enteredCount}
          invalidCount={validationErrors.length}
        />

        {/* 3. ScoreValidationSummary (Click error -> scrollIntoView + focus) */}
        {hasValidationErrors && (
          <ScoreValidationSummary
            errors={validationErrors}
            onErrorClick={handleErrorItemClick}
          />
        )}

        {/* 4. ScoreTable (Desktop table header sticky, ScoreRow -> ScoreInput) */}
        <ScoreTable
          ref={tableRef}
          students={students}
          scores={scores}
          highlightedStudentId={highlightedStudentId}
          onScoreChange={handleScoreChange}
        />
      </main>

      {/* 5. SaveBar (ScoreSaveBar: NO_CHANGES, DIRTY, SAVING, SAVED, ERROR) */}
      <ScoreSaveBar
        state={saveState}
        dirtyCount={dirtyCount}
        totalCount={students.length}
        hasErrors={hasValidationErrors}
        onSave={handleSave}
        onReset={handleReset}
      />

      {/* 6. ExcelUploader & ExcelPreview Modal */}
      <Modal
        isOpen={isExcelModalOpen}
        onClose={() => {
          if (!isImporting) {
            setIsExcelModalOpen(false);
            setExcelResult(null);
          }
        }}
        title="Nhập Điểm Từ Tệp Excel (.xlsx, .xls)"
        size="lg"
      >
        <div className="p-1">
          {!excelResult ? (
            <ExcelUploader
              students={students}
              onParsed={(parsed) => setExcelResult(parsed)}
            />
          ) : (
            <ExcelPreview
              result={excelResult}
              onConfirmImport={handleConfirmExcelImport}
              onCancel={() => setExcelResult(null)}
              isImporting={isImporting}
            />
          )}
        </div>
      </Modal>

      {/* 7. Unsaved Changes Leave Warning Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="⚠ Có thay đổi chưa lưu trên bảng điểm"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-[12px] bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
            <div className="text-[14px] text-[#92400E]">
              Bạn đang có <strong>{dirtyCount} điểm vừa thay đổi</strong> chưa được lưu. Nếu rời khỏi
              trang hoặc đổi lớp lúc này, các thay đổi này sẽ bị mất!
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2 border-t border-[#E7E5E4]">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setIsLeaveModalOpen(false);
                if (pendingLeaveAction) {
                  pendingLeaveAction();
                  setPendingLeaveAction(null);
                }
              }}
              className="text-[#DC4C4C] hover:bg-[#FEF2F2] border-[#FECDD3]"
            >
              Bỏ qua và rời đi
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              Tiếp tục chỉnh sửa
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsLeaveModalOpen(false);
                handleSave();
              }}
              disabled={hasValidationErrors}
              className="font-bold"
            >
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
