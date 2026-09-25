import React, { useState } from "react";
import { Check, ChevronDown, Users } from "lucide-react";
import { LinkedStudent } from "../../types";
import { cn } from "../../lib/cn";
import { haptic } from "../../lib/motion";
import { Avatar } from "../ui/Avatar";
import { BottomSheet } from "../ui/BottomSheet";
import { getChildCallName } from "../../services/parentMockData";

export interface ParentChildSwitcherProps {
  children?: LinkedStudent[]; // or linkedStudents
  students?: LinkedStudent[]; // alias
  selectedChildId: string;
  onChange: (childId: string) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

/** Tối đa số con hiển thị dạng chip; nhiều hơn → nút "Chọn con" mở sheet (02 §8). */
const MAX_CHIPS = 4;

/** Avatar có vòng sáng khi đang chọn (không phụ thuộc prop mới của Avatar). */
const ChildAvatar: React.FC<{ child: LinkedStudent; selected: boolean; size?: "md" | "lg" }> = ({
  child,
  selected,
  size = "md",
}) => (
  <span
    className={cn(
      "inline-flex shrink-0 rounded-full",
      selected && "ring-2 ring-gold ring-offset-2 ring-offset-night"
    )}
  >
    <Avatar src={child.avatarUrl} name={child.name} alt="" size={size} />
  </span>
);

/**
 * ParentChildSwitcher (B-PH-01, 02 §8, 03 §9)
 * - ≤ 4 con: chip ngang có ảnh, 1 chạm; chip đang chọn nền night.
 * - > 4 con: nút "Chọn con" mở BottomSheet.
 * Đổi con → context tải lại dashboard / điểm / điểm danh / thông báo.
 */
export const ParentChildSwitcher: React.FC<ParentChildSwitcherProps> = ({
  children,
  students,
  selectedChildId,
  onChange,
  isLoading = false,
  className,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const studentList = children || students || [];
  const currentChild = studentList.find((s) => s.id === selectedChildId) || studentList[0];

  if (!currentChild) return null;

  const select = (childId: string) => {
    setSheetOpen(false);
    if (childId !== currentChild.id) {
      haptic();
      void onChange(childId);
    }
  };

  // ------------------------------------------------------------------ > 4 con
  if (studentList.length > MAX_CHIPS) {
    return (
      <div className={className} aria-busy={isLoading || undefined}>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          className={cn(
            "flex min-h-16 w-full items-center gap-3 rounded-card border border-line bg-surface p-2 pr-4 text-left shadow-xs",
            "transition-[border-color,box-shadow] duration-200 ease-out-soft hover:border-line-strong hover:shadow-card",
            "focus-visible:outline-3 focus-visible:outline-offset-2 sm:w-auto sm:min-w-80"
          )}
        >
          <ChildAvatar child={currentChild} selected={false} />
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink-3">Đang xem</span>
            <span className="block truncate text-lg font-semibold text-ink">
              {getChildCallName(currentChild)}
              <span className="font-normal text-ink-2"> · {currentChild.className}</span>
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-base font-semibold text-primary-ink">
            <Users className="size-5" aria-hidden="true" />
            Chọn con
            <ChevronDown className="size-5" aria-hidden="true" />
          </span>
        </button>

        <BottomSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Chọn con"
          description={`${studentList.length} con đã liên kết với tài khoản`}
        >
          <ul aria-label="Danh sách con" className="space-y-2 pb-2">
            {studentList.map((child) => {
              const selected = child.id === currentChild.id;
              return (
                <li key={child.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => select(child.id)}
                    className={cn(
                      "flex min-h-16 w-full items-center gap-3 rounded-control border p-3 text-left",
                      "transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-2",
                      selected
                        ? "border-night bg-night text-on-night"
                        : "border-line bg-surface text-ink hover:bg-surface-2"
                    )}
                  >
                    <ChildAvatar child={child} selected={selected} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-lg font-semibold">
                        {child.christianName ? `${child.christianName} ` : ""}
                        {child.name}
                      </span>
                      <span className={cn("block text-sm", selected ? "text-on-night/75" : "text-ink-2")}>
                        {child.className}
                        {child.grade ? ` · ${child.grade}` : ""}
                      </span>
                    </span>
                    {selected && (
                      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
                        <Check className="size-5" aria-hidden="true" />
                        Đang xem
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </BottomSheet>
      </div>
    );
  }

  // ------------------------------------------------------------------ ≤ 4 con
  return (
    <div
      role="group"
      aria-label="Chọn con"
      aria-busy={isLoading || undefined}
      className={cn("-mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-1.5 no-scrollbar", className)}
    >
      {studentList.map((child) => {
        const selected = child.id === currentChild.id;
        return (
          <button
            key={child.id}
            type="button"
            aria-pressed={selected}
            aria-label={`${child.name}, ${child.className}`}
            onClick={() => select(child.id)}
            className={cn(
              "flex min-h-14 shrink-0 snap-start items-center gap-2.5 rounded-full border py-1.5 pr-5 pl-1.5 text-left select-none",
              "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out-soft active:scale-[0.97]",
              "focus-visible:outline-3 focus-visible:outline-offset-2",
              selected
                ? "border-night bg-night text-on-night shadow-card"
                : "border-line bg-surface text-ink hover:border-line-strong hover:shadow-xs"
            )}
          >
            <ChildAvatar child={child} selected={selected} />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-semibold whitespace-nowrap">{getChildCallName(child)}</span>
              <span className={cn("text-sm whitespace-nowrap", selected ? "text-on-night/75" : "text-ink-3")}>
                {child.className}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
