import React from "react";
import { ClassInfo } from "../../types";
import { Select, SelectOption } from "../ui/Select";

export interface ClassSelectorProps {
  classes: ClassInfo[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  disabled?: boolean;
  className?: string;
  /** Nhãn hiển thị phía trên (mặc định "Lớp giáo lý") */
  label?: string;
}

/**
 * ClassSelector (03 §7): chọn lớp bằng Select dùng chung (sheet trên mobile nếu Select hỗ trợ).
 */
export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
  disabled = false,
  className,
  label = "Lớp giáo lý",
}) => {
  const options: SelectOption[] = classes.map((cls) => ({
    value: cls.id,
    label: cls.name,
    description: [cls.grade, cls.room].filter(Boolean).join(" · "),
  }));

  return (
    <Select
      id="attendance-class-select"
      label={label}
      value={selectedClassId}
      options={options}
      onChange={onSelectClass}
      disabled={disabled}
      size="md"
      className={className}
    />
  );
};
