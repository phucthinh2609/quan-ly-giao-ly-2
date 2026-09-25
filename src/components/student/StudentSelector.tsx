import React, { useState, useMemo, useId } from "react";
import { Search, SquareCheckBig, Square, X, Filter, Users } from "lucide-react";
import { cn } from "../../lib/cn";
import { StudentRow } from "./StudentRow";
import { Student } from "../../types";
import { Button } from "../ui/Button";
import { IconTile } from "../ui/IconTile";

export interface StudentSelectorProps {
  /** Danh sách toàn bộ học sinh có sẵn */
  students: Student[];
  /** Danh sách ID học sinh đang được chọn */
  selectedIds: string[];
  /** Callback khi danh sách chọn thay đổi */
  onChange: (selectedIds: string[]) => void;
  /** Tiêu đề của khối chọn học sinh */
  title?: string;
  /** Placeholder ô tìm kiếm */
  placeholder?: string;
  /** Có cho phép lọc theo lớp học hay không */
  showClassFilter?: boolean;
  /** Class chiều cao tối đa danh sách cuộn (VD "max-h-96") */
  maxHeight?: string;
  className?: string;
}

/**
 * StudentSelector (03 §10) — dùng trong trang quản lý.
 * - Tìm theo tên, tên Thánh, mã học sinh
 * - Chọn tất cả kết quả lọc / bỏ chọn
 * - Chọn từng em
 * - Đếm "Đã chọn X/Y học sinh"
 * - Bỏ chọn tất cả
 */
export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedIds,
  onChange,
  title = "Chọn học sinh",
  placeholder = "Tìm theo tên, tên Thánh, mã số...",
  showClassFilter = true,
  maxHeight = "max-h-96",
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const searchId = useId();
  const classFilterId = useId();

  const classList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set);
  }, [students]);

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

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIdSet = new Set(filteredStudents.map((s) => s.id));
      onChange(selectedIds.filter((id) => !filteredIdSet.has(id)));
    } else {
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
    <div className={cn("space-y-4 rounded-card border border-line bg-surface p-4 shadow-card sm:p-5", className)}>
      {/* Tiêu đề + số đã chọn + hành động */}
      <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <IconTile icon={<Users />} tone="primary" size="md" />
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
            <p className="text-sm text-ink-2" aria-live="polite">
              Đã chọn <span className="font-mono font-semibold text-ink">{selectedIds.length}</span> / {students.length}{" "}
              học sinh
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {selectedIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              leftIcon={<X />}
              className="text-danger hover:bg-danger-soft hover:text-danger"
            >
              Bỏ chọn tất cả ({selectedIds.length})
            </Button>
          )}

          <Button
            variant={allFilteredSelected ? "soft" : "outline"}
            size="sm"
            onClick={handleSelectAll}
            disabled={filteredStudents.length === 0}
            leftIcon={allFilteredSelected ? <SquareCheckBig /> : <Square />}
          >
            {allFilteredSelected ? "Bỏ chọn kết quả lọc" : "Chọn tất cả kết quả"}
          </Button>
        </div>
      </div>

      {/* Tìm kiếm + lọc lớp */}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor={searchId} className="sr-only">
            Tìm học sinh
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-3"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="h-12 w-full rounded-full border border-line bg-surface-2 pr-11 pl-11 text-base text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Xóa từ khóa"
              className="absolute top-1/2 right-1.5 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 hover:bg-surface-3 hover:text-ink focus-visible:outline-3"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {showClassFilter && classList.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            <Filter className="hidden size-4 text-ink-3 sm:inline" aria-hidden="true" />
            <label htmlFor={classFilterId} className="sr-only">
              Lọc theo lớp
            </label>
            <select
              id={classFilterId}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-12 w-full cursor-pointer rounded-control border border-line-strong bg-surface px-4 text-base text-ink focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none sm:w-auto"
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

      {/* Danh sách */}
      <div className={cn("space-y-2 overflow-y-auto pr-1", maxHeight)}>
        {filteredStudents.length === 0 ? (
          <div className="rounded-control border border-dashed border-line-strong bg-surface-2 px-4 py-8 text-center text-sm text-ink-2">
            Không tìm thấy học sinh nào phù hợp{searchTerm ? ` với từ khóa "${searchTerm}"` : ""}
          </div>
        ) : (
          filteredStudents.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              selected={selectedIds.includes(student.id)}
              onSelect={handleToggleStudent}
              showCheckbox={true}
            />
          ))
        )}
      </div>

      {/* Chân */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm text-ink-2">
        <span>
          Đang hiển thị <span className="font-mono">{filteredStudents.length}</span> / {students.length} học sinh
        </span>
        {someFilteredSelected && !allFilteredSelected && (
          <span className="font-medium text-primary-ink">Một phần đã được chọn</span>
        )}
      </div>
    </div>
  );
};
