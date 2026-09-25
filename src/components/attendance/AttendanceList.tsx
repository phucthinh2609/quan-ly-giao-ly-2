import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { Student, AttendanceStatus } from "../../types";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { SearchBar } from "../ui/SearchBar";
import { Skeleton } from "../ui/Skeleton";
import { TONE_TEXT } from "../ui/tone";
import { AttendanceRow, studentFullName } from "./AttendanceRow";
import { ATTENDANCE_STATUS_META, normalizeSearchText } from "./attendanceStatus";

/** Bộ lọc danh sách: "NOT_PRESENT" = Chưa có mặt (Vắng + Có phép + Đi muộn) */
export type AttendanceListFilter = AttendanceStatus | "ALL" | "NOT_PRESENT";

export interface AttendanceListProps {
  students: Student[];
  attendanceMap: Record<string, AttendanceStatus>;
  initialAttendanceMap: Record<string, AttendanceStatus>;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  disabled?: boolean;
  isLoading?: boolean;
  statusFilter?: AttendanceListFilter;
  /** Có truyền → bộ lọc được điều khiển từ ngoài (VD bấm ô thống kê) */
  onStatusFilterChange?: (filter: AttendanceListFilter) => void;
  errorStudentIds?: Set<string>;
  /** Ẩn ô tìm + chip lọc (VD khi nhúng danh sách rút gọn) */
  hideToolbar?: boolean;
  className?: string;
}

const EMPTY_SET: Set<string> = new Set();

const FILTERS: { value: AttendanceListFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "NOT_PRESENT", label: "Chưa có mặt" },
  { value: "ABSENT", label: ATTENDANCE_STATUS_META.ABSENT.label },
  { value: "EXCUSED", label: ATTENDANCE_STATUS_META.EXCUSED.label },
  { value: "LATE", label: ATTENDANCE_STATUS_META.LATE.label },
];

function matchesFilter(status: AttendanceStatus, filter: AttendanceListFilter): boolean {
  if (filter === "ALL") return true;
  if (filter === "NOT_PRESENT") return status !== "PRESENT";
  return status === filter;
}

/**
 * AttendanceList (03 §7): ô tìm tên không dấu + chip lọc trạng thái có đếm số,
 * danh sách hàng min-h-15 trong một bề mặt rounded-card.
 * Em vừa đổi trạng thái vẫn được giữ trên danh sách đang lọc cho đến khi đổi bộ lọc,
 * để hàng không "biến mất" dưới ngón tay.
 */
export const AttendanceList: React.FC<AttendanceListProps> = ({
  students,
  attendanceMap,
  initialAttendanceMap,
  onStatusChange,
  disabled = false,
  isLoading = false,
  statusFilter,
  onStatusFilterChange,
  errorStudentIds = EMPTY_SET,
  hideToolbar = false,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [innerFilter, setInnerFilter] = useState<AttendanceListFilter>(statusFilter ?? "ALL");
  const [keepVisible, setKeepVisible] = useState<Set<string>>(EMPTY_SET);

  const isControlled = onStatusFilterChange !== undefined;
  const filter: AttendanceListFilter = isControlled ? statusFilter ?? "ALL" : innerFilter;

  // Đồng bộ khi cha đổi statusFilter ở chế độ không điều khiển
  useEffect(() => {
    if (!isControlled && statusFilter !== undefined) setInnerFilter(statusFilter);
  }, [isControlled, statusFilter]);

  // Đổi bộ lọc / từ khóa / lớp → bỏ danh sách giữ tạm
  useEffect(() => {
    setKeepVisible(EMPTY_SET);
  }, [filter, searchQuery, students]);

  const setFilter = (next: AttendanceListFilter) => {
    if (isControlled) onStatusFilterChange?.(next);
    else setInnerFilter(next);
  };

  const handleStatusChange = useCallback(
    (studentId: string, next: AttendanceStatus) => {
      if (filter !== "ALL") {
        setKeepVisible((prev) => {
          if (prev.has(studentId)) return prev;
          const copy = new Set(prev);
          copy.add(studentId);
          return copy;
        });
      }
      onStatusChange(studentId, next);
    },
    [filter, onStatusChange]
  );

  const counts = useMemo(() => {
    const result: Record<AttendanceListFilter, number> = {
      ALL: students.length,
      NOT_PRESENT: 0,
      PRESENT: 0,
      ABSENT: 0,
      EXCUSED: 0,
      LATE: 0,
    };
    students.forEach((s) => {
      const st = attendanceMap[s.id] ?? "PRESENT";
      result[st]++;
      if (st !== "PRESENT") result.NOT_PRESENT++;
    });
    return result;
  }, [students, attendanceMap]);

  const searchIndex = useMemo(
    () =>
      new Map(students.map((s) => [s.id, normalizeSearchText(`${studentFullName(s)} ${s.code}`)] as const)),
    [students]
  );

  const filteredStudents = useMemo(() => {
    const terms = normalizeSearchText(searchQuery).split(" ").filter(Boolean);
    return students.filter((s) => {
      const status = attendanceMap[s.id] ?? "PRESENT";
      if (!matchesFilter(status, filter) && !keepVisible.has(s.id)) return false;
      if (terms.length === 0) return true;
      const haystack = searchIndex.get(s.id) ?? "";
      return terms.every((term) => haystack.includes(term));
    });
  }, [students, attendanceMap, filter, keepVisible, searchQuery, searchIndex]);

  const isFiltered = filter !== "ALL" || searchQuery.trim() !== "";

  const clearAll = () => {
    setSearchQuery("");
    setFilter("ALL");
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)} aria-busy="true">
        <Skeleton variant="rectangular" height="2.75rem" className="w-full rounded-control" />
        <div className="divide-y divide-line rounded-card border border-line bg-surface">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex min-h-15 items-center gap-3 px-4 py-2.5">
              <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height="0.875rem" />
                <Skeleton variant="text" width="30%" height="0.75rem" />
              </div>
              <Skeleton variant="rectangular" width="6.5rem" height="2.75rem" className="rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {!hideToolbar && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            debounceMs={120}
            placeholder="Tìm tên, tên Thánh hoặc mã"
            ariaLabel="Tìm học sinh theo tên"
            disabled={disabled}
            className="lg:w-72 lg:shrink-0"
          />

          <div
            role="group"
            aria-label="Lọc theo trạng thái"
            className="no-scrollbar -mx-1 -my-1.5 flex min-w-0 gap-2 overflow-x-auto px-1 py-1.5"
          >
            {FILTERS.map((option) => {
              const selected = filter === option.value;
              const meta = option.value === "ALL" || option.value === "NOT_PRESENT" ? null : ATTENDANCE_STATUS_META[option.value];
              const Icon = meta?.Icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap",
                    "transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2",
                    selected
                      ? "border-transparent bg-night text-on-night dark:border-on-night/25"
                      : "border-line bg-surface text-ink-2 hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  {Icon && meta && (
                    <Icon
                      aria-hidden="true"
                      className={cn("size-4 shrink-0", selected ? "text-on-night" : TONE_TEXT[meta.tone])}
                    />
                  )}
                  <span>{option.label}</span>
                  <span
                    className={cn(
                      "min-w-6 rounded-full px-1.5 py-0.5 text-center font-mono text-xs tabular-nums",
                      selected ? "bg-on-night/15 text-on-night" : "bg-surface-2 text-ink-2"
                    )}
                  >
                    {counts[option.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isFiltered && (
        <div className="flex items-center justify-between gap-3 px-1 text-sm text-ink-2" aria-live="polite">
          <span>
            Đang hiện <span className="font-mono font-semibold text-ink">{filteredStudents.length}</span>/
            <span className="font-mono">{students.length}</span> em
          </span>
          <button
            type="button"
            onClick={clearAll}
            className="min-h-11 rounded-full px-3 font-semibold text-primary-ink transition-colors hover:bg-primary-soft"
          >
            Bỏ lọc
          </button>
        </div>
      )}

      {filteredStudents.length > 0 ? (
        <div
          role="list"
          aria-label="Danh sách học sinh điểm danh"
          className="divide-y divide-line rounded-card border border-line bg-surface shadow-card"
        >
          {filteredStudents.map((student) => {
            const currentStatus = attendanceMap[student.id] ?? "PRESENT";
            const initialStatus = initialAttendanceMap[student.id];
            const isDirty = initialStatus !== undefined && initialStatus !== currentStatus;
            return (
              <AttendanceRow
                key={student.id}
                student={student}
                status={currentStatus}
                disabled={disabled}
                onStatusChange={handleStatusChange}
                isDirty={isDirty}
                isSaved={!isDirty && initialStatus !== undefined}
                hasError={errorStudentIds.has(student.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-card border border-line bg-surface px-4 py-8">
          <EmptyState
            size="sm"
            icon={<SearchX className="size-8" aria-hidden="true" />}
            title={students.length === 0 ? "Lớp chưa có học sinh" : "Không có em nào phù hợp"}
            description={
              students.length === 0
                ? "Thêm học sinh vào lớp để bắt đầu điểm danh."
                : searchQuery.trim()
                ? `Không tìm thấy tên khớp với "${searchQuery.trim()}".`
                : "Không có em nào ở trạng thái này."
            }
            action={
              isFiltered ? (
                <Button variant="outline" size="md" onClick={clearAll}>
                  Bỏ lọc
                </Button>
              ) : undefined
            }
          />
        </div>
      )}
    </div>
  );
};
