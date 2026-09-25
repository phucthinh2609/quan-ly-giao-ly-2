import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Student, AttendanceStatus, AttendanceSaveState, ClassInfo } from "../../types";
import { cn } from "../../lib/cn";
import { formatWeekdayDate } from "../../lib/format";
import { haptic, useReveal } from "../../lib/motion";
import { useDraft } from "../../hooks/useDraft";
import { usePreferences } from "../../context/PreferencesContext";
import { Button } from "../ui/Button";
import { PageHeader } from "../ui/PageHeader";
import { useToast } from "../ui/Toast";
import { AttendanceDateSelector, getTodayDateString } from "./AttendanceDateSelector";
import { ClassSelector } from "./ClassSelector";
import { AttendanceSummary } from "./AttendanceSummary";
import { AttendanceBulkAction } from "./AttendanceBulkAction";
import { AttendanceList, AttendanceListFilter } from "./AttendanceList";
import { AttendanceSaveBar } from "./AttendanceSaveBar";
import { AttendanceDraftBanner } from "./AttendanceDraftBanner";
import { isAttendanceStatus, summarizeAttendance } from "./attendanceStatus";

// ============================================================================
// MOCK DATA: DANH SÁCH LỚP HỌC & HỌC SINH GIÁO LÝ ĐOÀN KITÔ VUA
// (BulkScoreEntry dùng chung MOCK_CLASSES / MOCK_STUDENTS_BY_CLASS)
// ============================================================================

export const MOCK_CLASSES: ClassInfo[] = [
  {
    id: "class-rl1a",
    name: "Lớp Rước Lễ 1A",
    grade: "Khối Rước Lễ",
    academicYear: "2026 - 2027",
    studentCount: 16,
    room: "Phòng 102 - Nhà Mục Vụ",
    teachers: ["GLV Giuse Nguyễn Văn Hùng", "GLV Maria Trần Thị Lan"],
  },
  {
    id: "class-kt2b",
    name: "Lớp Khai Tâm 2B",
    grade: "Khối Khai Tâm",
    academicYear: "2026 - 2027",
    studentCount: 14,
    room: "Phòng 101 - Nhà Mục Vụ",
    teachers: ["GLV Têrêsa Lê Thu Hương"],
  },
  {
    id: "class-ts1",
    name: "Lớp Thêm Sức 1",
    grade: "Khối Thêm Sức",
    academicYear: "2026 - 2027",
    studentCount: 18,
    room: "Phòng 201 - Nhà Mục Vụ",
    teachers: ["GLV Phaolô Đặng Hoàng Long"],
  },
  {
    id: "class-bd1",
    name: "Lớp Bao Đồng 1",
    grade: "Khối Bao Đồng",
    academicYear: "2026 - 2027",
    studentCount: 15,
    room: "Phòng 203 - Nhà Mục Vụ",
    teachers: ["GLV Gioan Baotixita Vũ Minh Quân"],
  },
];

export const MOCK_STUDENTS_BY_CLASS: Record<string, Student[]> = {
  "class-rl1a": [
    { id: "hs-01", code: "RL1A-01", orderNumber: 1, christianName: "Giuse", name: "Nguyễn Văn An", gender: "MALE" },
    { id: "hs-02", code: "RL1A-02", orderNumber: 2, christianName: "Maria", name: "Trần Thị Bình", gender: "FEMALE" },
    { id: "hs-03", code: "RL1A-03", orderNumber: 3, christianName: "Têrêsa", name: "Lê Minh Châu", gender: "FEMALE" },
    { id: "hs-04", code: "RL1A-04", orderNumber: 4, christianName: "Gioan", name: "Phạm Quốc Dũng", gender: "MALE" },
    { id: "hs-05", code: "RL1A-05", orderNumber: 5, christianName: "Anna", name: "Hoàng Mai Hương", gender: "FEMALE" },
    { id: "hs-06", code: "RL1A-06", orderNumber: 6, christianName: "Phanxicô", name: "Vũ Đình Khang", gender: "MALE" },
    { id: "hs-07", code: "RL1A-07", orderNumber: 7, christianName: "Cecilia", name: "Đỗ Thu Linh", gender: "FEMALE" },
    { id: "hs-08", code: "RL1A-08", orderNumber: 8, christianName: "Đa Minh", name: "Bùi Tiến Nam", gender: "MALE" },
    { id: "hs-09", code: "RL1A-09", orderNumber: 9, christianName: "Lucia", name: "Ngô Mỹ Oanh", gender: "FEMALE" },
    { id: "hs-10", code: "RL1A-10", orderNumber: 10, christianName: "Phaolô", name: "Trương Gia Phát", gender: "MALE" },
    { id: "hs-11", code: "RL1A-11", orderNumber: 11, christianName: "Maria", name: "Dương Quỳnh Nga", gender: "FEMALE" },
    { id: "hs-12", code: "RL1A-12", orderNumber: 12, christianName: "Augustinô", name: "Lâm Hải Sơn", gender: "MALE" },
    { id: "hs-13", code: "RL1A-13", orderNumber: 13, christianName: "Agatha", name: "Lý Kiều Trang", gender: "FEMALE" },
    { id: "hs-14", code: "RL1A-14", orderNumber: 14, christianName: "Micae", name: "Phan Nhật Uy", gender: "MALE" },
    { id: "hs-15", code: "RL1A-15", orderNumber: 15, christianName: "Rosa", name: "Tạ Thảo Vy", gender: "FEMALE" },
    { id: "hs-16", code: "RL1A-16", orderNumber: 16, christianName: "Antôn", name: "Đinh Tuấn Kiệt", gender: "MALE" },
  ],
  "class-kt2b": [
    { id: "kt-01", code: "KT2B-01", orderNumber: 1, christianName: "Giuse", name: "Vũ Hải Đăng", gender: "MALE" },
    { id: "kt-02", code: "KT2B-02", orderNumber: 2, christianName: "Maria", name: "Nguyễn Hà My", gender: "FEMALE" },
    { id: "kt-03", code: "KT2B-03", orderNumber: 3, christianName: "Têrêsa", name: "Trần Bảo Ngọc", gender: "FEMALE" },
    { id: "kt-04", code: "KT2B-04", orderNumber: 4, christianName: "Gioan", name: "Lê Đức Phúc", gender: "MALE" },
    { id: "kt-05", code: "KT2B-05", orderNumber: 5, christianName: "Anna", name: "Phạm Thảo Phương", gender: "FEMALE" },
    { id: "kt-06", code: "KT2B-06", orderNumber: 6, christianName: "Đa Minh", name: "Hoàng Minh Trí", gender: "MALE" },
  ],
  "class-ts1": [
    { id: "ts-01", code: "TS1-01", orderNumber: 1, christianName: "Phaolô", name: "Trần Minh Quân", gender: "MALE" },
    { id: "ts-02", code: "TS1-02", orderNumber: 2, christianName: "Maria", name: "Vũ Lan Anh", gender: "FEMALE" },
    { id: "ts-03", code: "TS1-03", orderNumber: 3, christianName: "Giuse", name: "Nguyễn Hoàng Nam", gender: "MALE" },
    { id: "ts-04", code: "TS1-04", orderNumber: 4, christianName: "Têrêsa", name: "Lê Cẩm Tú", gender: "FEMALE" },
  ],
  "class-bd1": [
    { id: "bd-01", code: "BD1-01", orderNumber: 1, christianName: "Gioan", name: "Đinh Công Hậu", gender: "MALE" },
    { id: "bd-02", code: "BD1-02", orderNumber: 2, christianName: "Maria", name: "Bùi Bích Hạnh", gender: "FEMALE" },
    { id: "bd-03", code: "BD1-03", orderNumber: 3, christianName: "Phanxicô", name: "Nguyễn Thanh Tùng", gender: "MALE" },
  ],
};

// Initial realistic attendance state seed
export function generateInitialAttendance(students: Student[]): Record<string, AttendanceStatus> {
  const result: Record<string, AttendanceStatus> = {};
  students.forEach((s, idx) => {
    // Realistic distribution: mostly PRESENT, 1 ABSENT, 1 EXCUSED, 1 LATE
    if (idx === 1) result[s.id] = "ABSENT";
    else if (idx === 2) result[s.id] = "EXCUSED";
    else if (idx === 3) result[s.id] = "LATE";
    else result[s.id] = "PRESENT";
  });
  return result;
}

export interface AttendancePageProps {
  onBack?: () => void;
  initialClassId?: string;
  initialDate?: string;
  className?: string;
}

type AttendanceMap = Record<string, AttendanceStatus>;

/** "Máy chủ" giả lập trong phiên: dữ liệu đã lưu theo lớp + ngày. */
const MOCK_SAVED_STORE = new Map<string, AttendanceMap>();

const SAVE_LATENCY_MS = 800;

function resolveClassId(classId?: string): string {
  return classId && MOCK_CLASSES.some((c) => c.id === classId) ? classId : MOCK_CLASSES[0].id;
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : new Date();
}

function sameMap(ids: string[], a: AttendanceMap, b: AttendanceMap): boolean {
  return ids.every((id) => (a[id] ?? "PRESENT") === (b[id] ?? "PRESENT"));
}

/** Chế độ demo (B-GLV-08). */
function useDemoMode(): boolean {
  return usePreferences().demoMode;
}

/**
 * AttendancePage v2 (02 §10, 04 §8)
 *
 * <AttendancePage>
 * ├── PageHeader (lớp · ngày)
 * ├── AttendanceDateSelector + ClassSelector
 * └── AttendanceSession (key = lớp + ngày → đổi lớp/ngày nạp lại sạch, nháp tự lưu)
 *     ├── AttendanceDraftBanner
 *     ├── AttendanceSummary
 *     ├── AttendanceBulkAction (toast Hoàn tác, không hộp thoại)
 *     ├── AttendanceList (tìm không dấu + chip lọc)
 *     └── AttendanceSaveBar (nổi)
 *
 * Lỗi mạng khi lưu: KHÔNG reset dữ liệu đã đánh dấu, nháp vẫn giữ trong localStorage.
 */
export const AttendancePage: React.FC<AttendancePageProps> = ({
  onBack,
  initialClassId = "class-rl1a",
  initialDate,
  className,
}) => {
  const demoMode = useDemoMode();
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getTodayDateString());
  const [selectedClassId, setSelectedClassId] = useState<string>(() => resolveClassId(initialClassId));
  const [busy, setBusy] = useState(false);
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);

  // Route đổi lớp/ngày trong khi trang vẫn mounted
  useEffect(() => {
    setSelectedClassId(resolveClassId(initialClassId));
  }, [initialClassId]);
  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
  }, [initialDate]);

  const revealRef = useReveal<HTMLDivElement>({ selector: "[data-reveal-head]" });

  const currentClass = MOCK_CLASSES.find((c) => c.id === selectedClassId) ?? MOCK_CLASSES[0];
  const students = useMemo(
    () => MOCK_STUDENTS_BY_CLASS[currentClass.id] ?? [],
    [currentClass.id]
  );

  const failSaves = demoMode && simulateNetworkError;

  return (
    <div
      ref={revealRef}
      data-testid="attendance-page"
      className={cn("mx-auto w-full max-w-4xl space-y-4 sm:space-y-5", className)}
    >
      <div data-reveal-head>
        <PageHeader
          title="Điểm danh"
          description={
            <span className="inline-flex flex-wrap items-center gap-x-2">
              <span>{currentClass.name}</span>
              <span aria-hidden="true" className="text-ink-3">
                ·
              </span>
              <span>{formatWeekdayDate(parseLocalDate(selectedDate))}</span>
            </span>
          }
          showBackButton={Boolean(onBack)}
          onBack={onBack}
          backAriaLabel="Quay về trang chính"
          actions={
            demoMode ? (
              <Button
                variant="outline"
                size="sm"
                aria-pressed={simulateNetworkError}
                onClick={() => setSimulateNetworkError((prev) => !prev)}
                leftIcon={simulateNetworkError ? <WifiOff className="text-danger" /> : <Wifi className="text-success" />}
                title="Chế độ demo: giả lập lỗi mạng khi lưu điểm danh"
              >
                {simulateNetworkError ? "Lỗi mạng: bật" : "Lỗi mạng: tắt"}
              </Button>
            ) : undefined
          }
        />
      </div>

      {failSaves && (
        <p
          data-reveal-head
          role="status"
          className="flex items-center gap-2 rounded-control border border-warning/30 bg-warning-soft px-3 py-2 text-sm text-ink"
        >
          <WifiOff className="size-4 shrink-0 text-warning" aria-hidden="true" />
          Đang giả lập lỗi mạng: lần lưu tiếp theo sẽ thất bại, dữ liệu vẫn được giữ.
        </p>
      )}

      <div data-reveal-head className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end md:gap-4">
        <AttendanceDateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} disabled={busy} />
        <ClassSelector
          classes={MOCK_CLASSES}
          selectedClassId={currentClass.id}
          onSelectClass={(id) => setSelectedClassId(resolveClassId(id))}
          disabled={busy}
        />
      </div>

      <AttendanceSession
        key={`${currentClass.id}|${selectedDate}`}
        classInfo={currentClass}
        date={selectedDate}
        students={students}
        failSaves={failSaves}
        onBusyChange={setBusy}
      />
    </div>
  );
};

// ============================================================================
// SESSION: một buổi điểm danh (lớp + ngày)
// ============================================================================

interface AttendanceSessionProps {
  classInfo: ClassInfo;
  date: string;
  students: Student[];
  failSaves: boolean;
  onBusyChange: (busy: boolean) => void;
}

type SavePhase = "IDLE" | "SAVING" | "SAVED" | "ERROR";

const AttendanceSession: React.FC<AttendanceSessionProps> = ({ classInfo, date, students, failSaves, onBusyChange }) => {
  const toast = useToast();
  const sessionKey = `${classInfo.id}.${date}`;
  const studentIds = useMemo(() => students.map((s) => s.id), [students]);

  // Dữ liệu đã lưu ("máy chủ") và dữ liệu đang đánh dấu trên máy
  const [saved, setSaved] = useState<AttendanceMap>(
    () => MOCK_SAVED_STORE.get(sessionKey) ?? generateInitialAttendance(students)
  );
  const [current, setCurrent] = useState<AttendanceMap>(saved);
  const [phase, setPhase] = useState<SavePhase>("IDLE");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<AttendanceListFilter>("ALL");
  const [draftHandled, setDraftHandled] = useState(false);

  const { draft, saveDraft, clearDraft } = useDraft<AttendanceMap>(`qlgl.draft.attendance.${classInfo.id}.${date}`);

  const mountedRef = useRef(true);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    mountedRef.current = true;
    const pending = timers.current;
    return () => {
      mountedRef.current = false;
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(() => mountedRef.current && fn(), ms));
  };

  const dirtyCount = useMemo(
    () => studentIds.filter((id) => (current[id] ?? "PRESENT") !== (saved[id] ?? "PRESENT")).length,
    [studentIds, current, saved]
  );
  const isDirty = dirtyCount > 0;

  const summary = useMemo(() => summarizeAttendance(studentIds, current), [studentIds, current]);

  const saveState: AttendanceSaveState =
    phase === "SAVING"
      ? "SAVING"
      : phase === "ERROR" && isDirty
      ? "ERROR"
      : phase === "SAVED" && !isDirty
      ? "SAVED"
      : isDirty
      ? "DIRTY"
      : "NO_CHANGES";
  const isSaving = saveState === "SAVING";

  useEffect(() => {
    onBusyChange(isSaving);
  }, [isSaving, onBusyChange]);
  useEffect(() => () => onBusyChange(false), [onBusyChange]);

  // ---- Bản nháp (B-GLV-04) ----
  const draftChangedCount = useMemo(() => {
    if (!draft) return 0;
    return studentIds.filter((id) => {
      const value = draft.data[id];
      return isAttendanceStatus(value) && value !== (saved[id] ?? "PRESENT");
    }).length;
  }, [draft, studentIds, saved]);
  const showDraftBanner = Boolean(draft) && !draftHandled && draftChangedCount > 0;

  // Mỗi thay đổi khi đang "dirty" → ghi nháp; hết dirty (và không chờ quyết định banner) → xóa nháp
  useEffect(() => {
    if (isDirty) saveDraft(current);
    else if (!showDraftBanner) clearDraft();
  }, [current, isDirty, showDraftBanner, saveDraft, clearDraft]);

  const handleRestoreDraft = () => {
    if (!draft) return;
    const next: AttendanceMap = { ...saved };
    studentIds.forEach((id) => {
      const value = draft.data[id];
      if (isAttendanceStatus(value)) next[id] = value;
    });
    setCurrent(next);
    setPhase("IDLE");
    setDraftHandled(true);
    toast.success(`Đã khôi phục bản nháp (${draftChangedCount} em có thay đổi)`);
  };

  const handleDismissDraft = () => {
    setDraftHandled(true);
    clearDraft();
  };

  // ---- Đổi trạng thái từng em (B-GLV-02) ----
  const handleStatusChange = useCallback((studentId: string, next: AttendanceStatus) => {
    setCurrent((prev) => (prev[studentId] === next ? prev : { ...prev, [studentId]: next }));
    setPhase((p) => (p === "SAVING" ? p : "IDLE"));
  }, []);

  // ---- Thao tác hàng loạt + Hoàn tác (B-GLV-03) ----
  const applyBulk = (next: AttendanceMap, message: string, unchangedMessage: string) => {
    if (sameMap(studentIds, current, next)) {
      toast.info(unchangedMessage);
      return;
    }
    const previous = current;
    haptic();
    setCurrent(next);
    setPhase("IDLE");
    toast.success(message, {
      action: {
        label: "Hoàn tác",
        onClick: () => {
          if (!mountedRef.current) return;
          setCurrent(previous);
          setPhase("IDLE");
        },
      },
    });
  };

  const markAll = (status: AttendanceStatus): AttendanceMap => {
    const next: AttendanceMap = { ...current };
    studentIds.forEach((id) => {
      next[id] = status;
    });
    return next;
  };

  const handleMarkAllPresent = () =>
    applyBulk(markAll("PRESENT"), `Đã đánh dấu ${studentIds.length} em có mặt`, "Cả lớp đã được đánh dấu có mặt");

  const handleMarkAllAbsent = () =>
    applyBulk(markAll("ABSENT"), `Đã đánh dấu ${studentIds.length} em vắng`, "Cả lớp đã được đánh dấu vắng");

  const handleReset = () =>
    applyBulk({ ...saved }, "Đã đặt lại theo dữ liệu đã lưu", "Không có thay đổi để đặt lại");

  // ---- Lưu (lỗi mạng giữ nguyên dữ liệu) ----
  const handleSave = () => {
    if (!isDirty || isSaving) return;
    const snapshot: AttendanceMap = { ...current };
    setPhase("SAVING");
    setErrorMessage(undefined);

    later(() => {
      const offline = typeof navigator !== "undefined" && navigator.onLine === false;
      if (failSaves || offline) {
        setPhase("ERROR");
        setErrorMessage("Không kết nối được máy chủ. Dữ liệu vẫn được giữ trên máy.");
        toast.error("Chưa lưu được điểm danh. Dữ liệu vẫn được giữ, hãy bấm Thử lại.");
        return;
      }
      MOCK_SAVED_STORE.set(sessionKey, snapshot);
      setSaved(snapshot);
      setCurrent(snapshot);
      clearDraft();
      setDraftHandled(true);
      setPhase("SAVED");
      const savedSummary = summarizeAttendance(studentIds, snapshot);
      toast.success(`${classInfo.name} · ${savedSummary.present}/${savedSummary.total} em có mặt`, {
        title: "Đã lưu điểm danh",
      });
      later(() => setPhase((p) => (p === "SAVED" ? "IDLE" : p)), 2800);
    }, SAVE_LATENCY_MS);
  };

  const revealRef = useReveal<HTMLDivElement>();

  return (
    <div ref={revealRef} className="space-y-4 sm:space-y-5">
      {showDraftBanner && draft && (
        <div data-reveal>
          <AttendanceDraftBanner
            savedAt={draft.savedAt}
            changedCount={draftChangedCount}
            onRestore={handleRestoreDraft}
            onDismiss={handleDismissDraft}
          />
        </div>
      )}

      <section data-reveal aria-label="Tổng quan buổi điểm danh">
        <AttendanceSummary
          summary={summary}
          activeFilter={statusFilter === "NOT_PRESENT" ? "ALL" : statusFilter}
          onFilterChange={setStatusFilter}
        />
      </section>

      <section data-reveal aria-label="Thao tác nhanh cho cả lớp">
        <AttendanceBulkAction
          onMarkAllPresent={handleMarkAllPresent}
          onMarkAllAbsent={handleMarkAllAbsent}
          onReset={handleReset}
          disabled={isSaving}
          hasChanges={isDirty}
        />
      </section>

      <section data-reveal aria-labelledby="attendance-list-heading" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-1">
          <h2 id="attendance-list-heading" className="text-lg font-semibold tracking-tight text-ink">
            Danh sách lớp <span className="font-mono text-base font-medium text-ink-3">{students.length}</span>
          </h2>
          <p className="text-sm text-ink-3 md:hidden">Chạm vào trạng thái để đổi</p>
        </div>
        <AttendanceList
          students={students}
          attendanceMap={current}
          initialAttendanceMap={saved}
          onStatusChange={handleStatusChange}
          disabled={isSaving}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </section>

      {/* Chừa chỗ để hàng cuối không bị SaveBar nổi che */}
      <div aria-hidden="true" className="h-24" />

      <AttendanceSaveBar
        totalStudents={summary.total}
        markedCount={summary.total}
        dirtyCount={dirtyCount}
        state={saveState}
        onSave={handleSave}
        onRetry={handleSave}
        errorMessage={errorMessage}
        summary={summary}
      />
    </div>
  );
};
