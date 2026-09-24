import React, { useState, useMemo } from "react";
import { Search, CheckSquare, Square, X, Filter, Users } from "lucide-react";
import { StudentRow } from "./StudentRow";
import { Student } from "../../types";
import { Button } from "../ui/Button";

export interface StudentSelectorProps {
  /**
   * Danh sách toàn bộ học sinh có sẵn
   */
  students: Student[];
  /**
   * Danh sách ID học sinh đang được chọn
   */
  selectedIds: string[];
  /**
   * Callback khi danh sách chọn thay đổi
   */
  onChange: (selectedIds: string[]) => void;
  /**
   * Tiêu đề của khối chọn học sinh
   */
  title?: string;
  /**
   * Placeholder ô tìm kiếm
   */
  placeholder?: string;
  /**
   * Có cho phép lọc theo lớp học hay không
   */
  showClassFilter?: boolean;
  /**
   * Chiều cao tối đa danh sách cuộn
   */
  maxHeight?: string;
  className?: string;
}

/**
 * StudentSelector Component (§19 03_Component_Library)
 *
 * Ràng buộc bắt buộc:
 * - Search: Lọc trực tiếp theo tên, tên Thánh, mã học sinh
 * - Select All: Chọn toàn bộ kết quả lọc hoặc toàn bộ danh sách
 * - Individual Select: Tích chọn từng dòng học sinh
 * - Selected Count: Hiển thị số lượng "Đã chọn X/Y học sinh"
 * - Clear: Nút xoá toàn bộ lựa chọn hiện thời
 */
export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedIds,
  onChange,
  title = "Chọn học sinh",
  placeholder = "Tìm theo tên, tên Thánh, mã số...",
  showClassFilter = true,
  maxHeight = "max-h-[380px]",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");

  // Extract unique classes for filter
  const classList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set);
  }, [students]);

  // Filter students by search term and class
  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return students.filter((s) => {
      const matchClass = selectedClass === "ALL" || s.className === selectedClass;
      if (!matchClass) return false;

      if (!term) return true;
      const matchName = s.name.toLowerCase().includes(term);
      const matchChristian = s.christianName?.toLowerCase().includes(term);
      const matchCode = s.code.toLowerCase().includes(term);
      return matchName || matchChristian || matchCode;
    });
  }, [students, searchTerm, selectedClass]);

  const allFilteredSelected = useMemo(() => {
    if (filteredStudents.length === 0) return false;
    return filteredStudents.every((s) => selectedIds.includes(s.id));
  }, [filteredStudents, selectedIds]);

  const someFilteredSelected = useMemo(() => {
    return filteredStudents.some((s) => selectedIds.includes(s.id));
  }, [filteredStudents, selectedIds]);

  // Actions
  const handleSelectAll = () => {
    if (allFilteredSelected) {
      // Unselect all filtered students
      const filteredIdSet = new Set(filteredStudents.map((s) => s.id));
      const next = selectedIds.filter((id) => !filteredIdSet.has(id));
      onChange(next);
    } else {
      // Select all filtered students
      const merged = new Set([...selectedIds, ...filteredStudents.map((s) => s.id)]);
      onChange(Array.from(merged));
    }
  };

  const handleClear = () => {
    onChange([]);
  };

  const handleToggleStudent = (id: string, select: boolean) => {
    if (select) {
      if (!selectedIds.includes(id)) {
        onChange([...selectedIds, id]);
      }
    } else {
      onChange(selectedIds.filter((item) => item !== id));
    }
  };

  return (
    <div
      className={`bg-white rounded-[14px] border border-[#E7E5E4] p-4 sm:p-5 shadow-xs space-y-4 ${className}`}
    >
      {/* Header: Title + Selected Count + Clear */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F5F4]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#B4232C]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1C1917] font-serif">
              {title}
            </h3>
            <p className="text-[12px] text-[#78716C]">
              Đã chọn: <span className="font-bold text-[#B4232C]">{selectedIds.length}</span> / {students.length} học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              leftIcon={<X className="w-3.5 h-3.5" />}
              className="text-[#DC4C4C] hover:text-[#A52D2D] hover:bg-[#FEF2F2] border-[#FEE2E2]"
            >
              Bỏ chọn tất cả ({selectedIds.length})
            </Button>
          )}

          <Button
            variant={allFilteredSelected ? "secondary" : "outline"}
            size="sm"
            onClick={handleSelectAll}
            disabled={filteredStudents.length === 0}
            leftIcon={
              allFilteredSelected ? (
                <CheckSquare className="w-3.5 h-3.5 text-[#B4232C]" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )
            }
          >
            {allFilteredSelected ? "Bỏ chọn trang này" : "Chọn tất cả lọc"}
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 py-2 text-[13.5px] rounded-lg border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#B4232C]/30 focus:border-[#B4232C] transition-all bg-[#FAFAF9]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#57534E] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Class Filter (Optional) */}
        {showClassFilter && classList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#78716C] hidden sm:inline" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="py-2 px-3 text-[13px] rounded-lg border border-[#E7E5E4] bg-[#FAFAF9] text-[#292524] focus:outline-none focus:ring-2 focus:ring-[#B4232C]/30 cursor-pointer"
            >
              <option value="ALL">Tất cả lớp ({students.length})</option>
              {classList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Student List */}
      <div className={`space-y-2 overflow-y-auto pr-1 ${maxHeight}`}>
        {filteredStudents.length === 0 ? (
          <div className="py-8 text-center text-[#78716C] text-[13px] bg-[#FAFAF9] rounded-xl border border-dashed border-[#E7E5E4]">
            Không tìm thấy học sinh nào phù hợp từ khóa &quot;{searchTerm}&quot;
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            return (
              <StudentRow
                key={student.id}
                student={student}
                selected={isSelected}
                onSelect={handleToggleStudent}
                showCheckbox={true}
              />
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-[#F5F5F4] flex items-center justify-between text-[12px] text-[#78716C]">
        <span>
          Đang hiển thị {filteredStudents.length} / {students.length} học sinh
        </span>
        {someFilteredSelected && !allFilteredSelected && (
          <span className="text-[#B4232C] font-medium">
            (Một phần đã được chọn)
          </span>
        )}
      </div>
    </div>
  );
};
