import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Student, AttendanceStatus } from "../../types";
import { AttendanceRow } from "./AttendanceRow";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";

export interface AttendanceListProps {
  students: Student[];
  attendanceMap: Record<string, AttendanceStatus>;
  initialAttendanceMap: Record<string, AttendanceStatus>;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  disabled?: boolean;
  isLoading?: boolean;
  statusFilter?: AttendanceStatus | "ALL";
  errorStudentIds?: Set<string>;
  className?: string;
}

/**
 * AttendanceList Component (§21, §30)
 *
 * Hiển thị danh sách học sinh kèm thanh tìm kiếm tức thì và các trạng thái:
 * - Loading Skeleton
 * - Empty State (khi không tìm thấy học sinh)
 * - Row list với AttendanceRow
 */
export const AttendanceList: React.FC<AttendanceListProps> = ({
  students,
  attendanceMap,
  initialAttendanceMap,
  onStatusChange,
  disabled = false,
  isLoading = false,
  statusFilter = "ALL",
  errorStudentIds = new Set(),
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Lọc học sinh theo từ khóa tìm kiếm & trạng thái điểm danh
  const filteredStudents = useMemo(() => {
    let list = students;

    // Lọc theo trạng thái điểm danh
    if (statusFilter !== "ALL") {
      list = list.filter((s) => (attendanceMap[s.id] || "PRESENT") === statusFilter);
    }

    // Lọc theo từ khóa tìm kiếm (họ tên, tên thánh, mã số)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s) => {
        const nameMatch = s.name.toLowerCase().includes(q);
        const codeMatch = s.code.toLowerCase().includes(q);
        const christianMatch = s.christianName?.toLowerCase().includes(q);
        return nameMatch || codeMatch || christianMatch;
      });
    }

    return list;
  }, [students, attendanceMap, statusFilter, searchQuery]);

  // Trạng thái Loading Skeleton
  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="h-12 bg-white rounded-[12px] border border-[#E7E5E4] p-3 animate-pulse" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-[14px] border border-[#E7E5E4] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width="40px" height="40px" />
              <div className="space-y-2">
                <Skeleton variant="text" width="120px" height="14px" />
                <Skeleton variant="text" width="80px" height="12px" />
              </div>
            </div>
            <Skeleton variant="rectangular" width="130px" height="44px" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Thanh tìm kiếm học sinh nhanh */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo tên học sinh, Tên Thánh (Maria, Giuse...), mã số..."
          disabled={disabled}
          className="
            w-full min-h-[46px] sm:min-h-[48px] pl-10 pr-4 py-2.5 rounded-[12px]
            bg-white border border-[#E7E5E4] text-[#1C1917]
            text-[14px] sm:text-[15px] placeholder:text-[#A8A29E]
            focus:outline-none focus:ring-2 focus:ring-[#B4232C] focus:border-transparent
            shadow-xs
          "
        />
        <Search className="w-5 h-5 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#78716C] hover:text-[#1C1917] px-1.5 py-0.5 rounded cursor-pointer"
          >
            Xóa tìm
          </button>
        )}
      </div>

      {/* Thông tin số lượng hiển thị */}
      <div className="flex items-center justify-between text-[12px] text-[#78716C] px-1">
        <span>
          Hiển thị <strong className="text-[#1C1917]">{filteredStudents.length}</strong> / {students.length} học sinh
        </span>
        {searchQuery && (
          <span className="text-[#B4232C]">
            Kết quả khớp với &quot;{searchQuery}&quot;
          </span>
        )}
      </div>

      {/* Danh sách các hàng AttendanceRow */}
      {filteredStudents.length > 0 ? (
        <div className="space-y-2.5" role="list" aria-label="Danh sách học sinh điểm danh">
          {filteredStudents.map((student) => {
            const currentStatus = attendanceMap[student.id] || "PRESENT";
            const initialStatus = initialAttendanceMap[student.id];
            const isDirty = initialStatus !== undefined && initialStatus !== currentStatus;
            const hasError = errorStudentIds.has(student.id);

            return (
              <AttendanceRow
                key={student.id}
                student={student}
                status={currentStatus}
                disabled={disabled}
                onStatusChange={onStatusChange}
                isDirty={isDirty}
                isSaved={!isDirty && initialStatus !== undefined}
                hasError={hasError}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State khi không tìm thấy học sinh */
        <div className="py-8 bg-white rounded-[16px] border border-[#E7E5E4] p-6 text-center">
          <EmptyState
            title="Không tìm thấy học sinh phù hợp"
            description={
              searchQuery
                ? `Không có học sinh nào khớp với từ khóa "${searchQuery}". Vui lòng thử tìm với từ khóa khác.`
                : "Không có học sinh nào trong bộ lọc này."
            }
            action={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-[#FFF1F2] text-[#B4232C] rounded-[10px] text-[14px] font-semibold hover:bg-[#FFE4E6] cursor-pointer"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              ) : undefined
            }
          />
        </div>
      )}
    </div>
  );
};
