import React, { useState, useMemo, useCallback } from "react";
import { Student, AttendanceStatus, AttendanceSaveState, ClassInfo, AttendanceSummaryData } from "../../types";
import { PageHeader } from "../ui/PageHeader";
import { Badge } from "../ui/Badge";
import { useToast } from "../ui/Toast";
import { AttendanceDateSelector, getTodayDateString } from "./AttendanceDateSelector";
import { ClassSelector } from "./ClassSelector";
import { AttendanceSummary } from "./AttendanceSummary";
import { AttendanceBulkAction } from "./AttendanceBulkAction";
import { AttendanceList } from "./AttendanceList";
import { AttendanceSaveBar } from "./AttendanceSaveBar";
import { Wifi, WifiOff } from "lucide-react";

// ============================================================================
// MOCK DATA: DANH SÁCH LỚP HỌC & HỌC SINH GIÁO LÝ ĐOÀN KITÔ VUA
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
    // Realistic distribution: mostly PRESENT, 1-2 ABSENT, 1 EXCUSED, 1 LATE
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

/**
 * AttendancePage Component (§30 - 03_Component_Library & §8 - Sitemap)
 *
 * Cây component bắt buộc:
 * <AttendancePage>
 * ├── <PageHeader />
 * ├── <AttendanceDateSelector />
 * ├── <ClassSelector />
 * ├── <AttendanceSummary />
 * ├── <AttendanceBulkAction />
 * ├── <AttendanceList>
 * │   └── <AttendanceRow />
 * ├── <SaveBar />
 * └── <Toast />
 *
 * QUY TẮC BẮT BUỘC:
 * - Khi lưu bị lỗi mạng: KHÔNG ĐƯỢC RESET DỮ LIỆU LOCAL đã đánh dấu!
 * - Hỗ trợ thao tác 1 chạm nhanh cho Giáo lý viên
 * - Đầy đủ các trạng thái SaveBar: NO_CHANGES, DIRTY, SAVING, SAVED, ERROR
 */
export const AttendancePage: React.FC<AttendancePageProps> = ({
  onBack,
  initialClassId = "class-rl1a",
  initialDate,
  className = "",
}) => {
  const toast = useToast();

  // 1. Ngày & Lớp đang chọn
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getTodayDateString());
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);

  // 2. Danh sách học sinh theo lớp
  const students = useMemo(() => {
    return MOCK_STUDENTS_BY_CLASS[selectedClassId] || MOCK_STUDENTS_BY_CLASS["class-rl1a"];
  }, [selectedClassId]);

  // 3. Trạng thái điểm danh: Initial đã lưu trên server vs Current trạng thái local
  const [savedAttendanceMap, setSavedAttendanceMap] = useState<Record<string, AttendanceStatus>>(() => {
    return generateInitialAttendance(students);
  });

  const [currentAttendanceMap, setCurrentAttendanceMap] = useState<Record<string, AttendanceStatus>>(() => {
    return generateInitialAttendance(students);
  });

  // 4. Trạng thái SaveBar: NO_CHANGES | DIRTY | SAVING | SAVED | ERROR
  const [saveState, setSaveState] = useState<AttendanceSaveState>("NO_CHANGES");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 5. Công cụ kiểm thử mạng (Simulate Network Error)
  const [simulateNetworkError, setSimulateNetworkError] = useState<boolean>(false);

  // 6. Bộ lọc hiển thị (ALL | PRESENT | ABSENT | EXCUSED | LATE)
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "ALL">("ALL");

  // Đổi lớp -> nạp lại dữ liệu tương ứng
  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    const newStudents = MOCK_STUDENTS_BY_CLASS[newClassId] || [];
    const newInitial = generateInitialAttendance(newStudents);
    setSavedAttendanceMap(newInitial);
    setCurrentAttendanceMap(newInitial);
    setSaveState("NO_CHANGES");
    setStatusFilter("ALL");
  };

  // Đổi ngày -> cập nhật và đặt lại trạng thái lưu
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const refreshed = generateInitialAttendance(students);
    setSavedAttendanceMap(refreshed);
    setCurrentAttendanceMap(refreshed);
    setSaveState("NO_CHANGES");
  };

  // Đếm số lượng thay đổi chưa lưu (dirty)
  const dirtyCount = useMemo(() => {
    let count = 0;
    students.forEach((s) => {
      if (currentAttendanceMap[s.id] !== savedAttendanceMap[s.id]) {
        count++;
      }
    });
    return count;
  }, [students, currentAttendanceMap, savedAttendanceMap]);

  // Tính toán AttendanceSummaryData
  const summaryData: AttendanceSummaryData = useMemo(() => {
    let present = 0;
    let absent = 0;
    let excused = 0;
    let late = 0;

    students.forEach((s) => {
      const st = currentAttendanceMap[s.id] || "PRESENT";
      if (st === "PRESENT") present++;
      else if (st === "ABSENT") absent++;
      else if (st === "EXCUSED") excused++;
      else if (st === "LATE") late++;
    });

    const total = students.length;
    const presentRate = total > 0 ? (present / total) * 100 : 0;

    return {
      total,
      present,
      absent,
      excused,
      late,
      presentRate,
    };
  }, [students, currentAttendanceMap]);

  // Cập nhật trạng thái điểm danh cho 1 học sinh
  const handleStatusChange = useCallback(
    (studentId: string, nextStatus: AttendanceStatus) => {
      setCurrentAttendanceMap((prev) => {
        const next = { ...prev, [studentId]: nextStatus };
        // Kiểm tra xem có thay đổi so với savedAttendanceMap không
        const isNowDirty = Object.keys(next).some(
          (id) => next[id] !== savedAttendanceMap[id]
        );
        setSaveState(isNowDirty ? "DIRTY" : "NO_CHANGES");
        return next;
      });
    },
    [savedAttendanceMap]
  );

  // Thao tác hàng loạt: Đánh dấu tất cả Có mặt
  const handleMarkAllPresent = useCallback(() => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      updated[s.id] = "PRESENT";
    });
    setCurrentAttendanceMap(updated);

    const isNowDirty = Object.keys(updated).some(
      (id) => updated[id] !== savedAttendanceMap[id]
    );
    setSaveState(isNowDirty ? "DIRTY" : "NO_CHANGES");
    toast.info(`Đã chuyển toàn bộ ${students.length} em sang trạng thái [Có mặt]`);
  }, [students, savedAttendanceMap, toast]);

  // Thao tác hàng loạt: Đánh dấu tất cả Vắng
  const handleMarkAllAbsent = useCallback(() => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      updated[s.id] = "ABSENT";
    });
    setCurrentAttendanceMap(updated);

    const isNowDirty = Object.keys(updated).some(
      (id) => updated[id] !== savedAttendanceMap[id]
    );
    setSaveState(isNowDirty ? "DIRTY" : "NO_CHANGES");
    toast.warning(`Đã chuyển toàn bộ ${students.length} em sang trạng thái [Vắng]`);
  }, [students, savedAttendanceMap, toast]);

  // Thao tác hàng loạt: Reset (Khôi phục dữ liệu ban đầu trước khi sửa)
  const handleReset = useCallback(() => {
    setCurrentAttendanceMap({ ...savedAttendanceMap });
    setSaveState("NO_CHANGES");
    toast.info("Đã hoàn tác và khôi phục trạng thái điểm danh ban đầu.");
  }, [savedAttendanceMap, toast]);

  // Lưu điểm danh lên máy chủ (Mock API Call)
  const handleSave = async () => {
    if (saveState === "NO_CHANGES") return;

    setSaveState("SAVING");

    // Giả lập độ trễ mạng 700ms
    setTimeout(() => {
      if (simulateNetworkError) {
        // Lỗi mạng giả lập: QUAN TRỌNG: KHÔNG ĐƯỢC RESET currentAttendanceMap!
        setSaveState("ERROR");
        setErrorMessage("Lỗi kết nối mạng (Simulated). Dữ liệu đánh dấu vẫn được giữ an toàn.");
        toast.error(
          "Lỗi mạng: Không thể gửi dữ liệu lên máy chủ. Dữ liệu đã đánh dấu của bạn KHÔNG bị mất. Vui lòng bấm 'Thử lại'."
        );
      } else {
        // Lưu thành công
        setSavedAttendanceMap({ ...currentAttendanceMap });
        setSaveState("SAVED");
        toast.success(`Đã lưu thành công điểm danh ${summaryData.total} học sinh!`);

        // Sau 3 giây chuyển về NO_CHANGES
        setTimeout(() => {
          setSaveState("NO_CHANGES");
        }, 3000);
      }
    }, 700);
  };

  const currentClassInfo = MOCK_CLASSES.find((c) => c.id === selectedClassId) || MOCK_CLASSES[0];

  return (
    <div
      className={`min-h-screen bg-[#F5F5F4] flex flex-col font-sans pb-28 ${className}`}
      data-testid="attendance-page"
    >
      {/* 1. PageHeader (§14, §30) */}
      <div className="bg-white border-b border-[#E7E5E4] px-4 py-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Điểm danh Giáo lý"
            description="Điểm danh nhanh 1 chạm cho buổi học Chúa Nhật. Chạm để xoay vòng trạng thái hoặc dùng menu chọn trực tiếp."
            showBackButton={Boolean(onBack)}
            onBack={onBack}
            backAriaLabel="Quay về Dashboard GLV"
            badge={
              <Badge variant="primary" dot>
                {currentClassInfo.name}
              </Badge>
            }
            actions={
              /* Simulator toggles & Controls */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSimulateNetworkError((prev) => !prev);
                    toast.info(
                      !simulateNetworkError
                        ? "Đã BẬT giả lập lỗi mạng khi lưu"
                        : "Đã TẮT giả lập lỗi mạng"
                    );
                  }}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-bold border transition-colors cursor-pointer
                    ${
                      simulateNetworkError
                        ? "bg-[#FEF2F2] border-[#FECDD3] text-[#C73A3A]"
                        : "bg-[#FAFAF9] border-[#E7E5E4] text-[#78716C] hover:bg-[#F5F5F4]"
                    }
                  `}
                  title="Kiểm thử quy tắc: khi lưu bị lỗi mạng, KHÔNG được reset dữ liệu local đã đánh dấu"
                >
                  {simulateNetworkError ? (
                    <WifiOff className="w-3.5 h-3.5 text-[#C73A3A]" />
                  ) : (
                    <Wifi className="w-3.5 h-3.5 text-[#168154]" />
                  )}
                  <span>{simulateNetworkError ? "Lỗi mạng: BẬT" : "Lỗi mạng: TẮT"}</span>
                </button>
              </div>
            }
          />
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 space-y-4 flex-1">
        {/* Banner lưu ý khi đang bật test lỗi mạng */}
        {simulateNetworkError && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECDD3] rounded-[12px] text-[13px] text-[#C73A3A] flex items-center justify-between">
            <span>
              ⚠️ Đang bật chế độ <strong>Giả lập Lỗi Mạng</strong> để kiểm tra tính toàn vẹn: Dữ liệu local không bao giờ bị xóa khi lưu thất bại.
            </span>
            <button
              type="button"
              onClick={() => setSimulateNetworkError(false)}
              className="text-[12px] underline font-bold ml-2 cursor-pointer"
            >
              Tắt ngay
            </button>
          </div>
        )}

        {/* 2. AttendanceDateSelector */}
        <section aria-label="Bộ chọn ngày điểm danh">
          <AttendanceDateSelector
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            disabled={saveState === "SAVING"}
          />
        </section>

        {/* 3. ClassSelector */}
        <section aria-label="Bộ chọn lớp học">
          <ClassSelector
            classes={MOCK_CLASSES}
            selectedClassId={selectedClassId}
            onSelectClass={handleClassChange}
            disabled={saveState === "SAVING"}
          />
        </section>

        {/* 4. AttendanceSummary */}
        <section aria-label="Thống kê chuyên cần">
          <AttendanceSummary
            summary={summaryData}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </section>

        {/* 5. AttendanceBulkAction */}
        <section aria-label="Thao tác nhanh hàng loạt">
          <AttendanceBulkAction
            onMarkAllPresent={handleMarkAllPresent}
            onMarkAllAbsent={handleMarkAllAbsent}
            onReset={handleReset}
            disabled={saveState === "SAVING"}
            hasChanges={dirtyCount > 0}
          />
        </section>

        {/* 6. AttendanceList (chứa các AttendanceRow) */}
        <section aria-label="Danh sách học sinh điểm danh">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[16px] font-bold text-[#1C1917] font-serif">
                Danh sách học sinh ({students.length} em)
              </h2>
              <span className="text-[12px] text-[#78716C]">
                Chạm nút để đổi: Có mặt → Vắng → Có phép → Đi muộn
              </span>
            </div>

            <AttendanceList
              students={students}
              attendanceMap={currentAttendanceMap}
              initialAttendanceMap={savedAttendanceMap}
              onStatusChange={handleStatusChange}
              disabled={saveState === "SAVING"}
              statusFilter={statusFilter}
            />
          </div>
        </section>
      </main>

      {/* 7. Attendance SaveBar (Sticky footer) */}
      <AttendanceSaveBar
        totalStudents={summaryData.total}
        markedCount={summaryData.total}
        dirtyCount={dirtyCount}
        state={saveState}
        onSave={handleSave}
        onRetry={handleSave}
        errorMessage={errorMessage}
      />
    </div>
  );
};
