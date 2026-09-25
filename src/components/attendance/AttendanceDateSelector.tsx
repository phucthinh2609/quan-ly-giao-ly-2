import React, { useLayoutEffect, useMemo, useRef } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "../../lib/cn";
import { IconButton } from "../ui/IconButton";

export interface AttendanceDateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  disabled?: boolean;
  className?: string;
  /** Số Chúa Nhật gần nhất hiển thị trong dải chip (mặc định 6) */
  recentCount?: number;
}

const WEEKDAYS = ["Chúa Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const WEEKDAYS_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

function toDateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Utility: format YYYY-MM-DD sang tiếng Việt dạng "Chúa Nhật, 24/09/2026"
export function formatVietnameseDate(dateStr: string): {
  dayOfWeek: string;
  formattedDate: string;
  isToday: boolean;
} {
  const date = parseDate(dateStr);
  const now = new Date();
  const isToday =
    now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return {
    dayOfWeek: WEEKDAYS[date.getDay()],
    formattedDate: `${dd}/${mm}/${date.getFullYear()}`,
    isToday,
  };
}

export function shiftDate(dateStr: string, daysToAdd: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + daysToAdd);
  return toDateString(date);
}

export function getTodayDateString(): string {
  return toDateString(new Date());
}

/** Các Chúa Nhật gần nhất (tăng dần), kết thúc ở Chúa Nhật ≤ ngày mốc. */
export function getRecentSundays(count = 6, from: string = getTodayDateString()): string[] {
  const anchor = parseDate(from);
  anchor.setDate(anchor.getDate() - anchor.getDay());
  const result: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - i * 7);
    result.push(toDateString(d));
  }
  return result;
}

/**
 * AttendanceDateSelector (03 §7): dải chip ngang các Chúa Nhật gần nhất + nút lịch (input date gốc).
 * Chip đang chọn nền night; hôm nay có chấm đỏ và nhãn "Hôm nay".
 */
export const AttendanceDateSelector: React.FC<AttendanceDateSelectorProps> = ({
  selectedDate,
  onDateChange,
  disabled = false,
  className,
  recentCount = 6,
}) => {
  const todayStr = getTodayDateString();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dates = useMemo(() => {
    const set = new Set(getRecentSundays(recentCount, todayStr));
    set.add(todayStr);
    if (selectedDate) set.add(selectedDate);
    return Array.from(set).sort();
  }, [recentCount, todayStr, selectedDate]);

  // Đưa chip đang chọn vào giữa dải (không cuộn dọc trang)
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const chip = scroller.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!chip) return;
    scroller.scrollLeft = chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2;
  }, [selectedDate, dates]);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input || disabled) return;
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }
    } catch {
      // Trình duyệt chặn showPicker → dùng cách dự phòng bên dưới
    }
    input.focus();
    input.click();
  };

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <div
        ref={scrollerRef}
        role="group"
        aria-label="Chọn buổi học"
        className="no-scrollbar relative -mx-1 -my-1.5 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 py-1.5"
      >
        {dates.map((date) => {
          const d = parseDate(date);
          const selected = date === selectedDate;
          const isToday = date === todayStr;
          const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
          const { dayOfWeek, formattedDate } = formatVietnameseDate(date);
          return (
            <button
              key={date}
              type="button"
              aria-pressed={selected}
              aria-label={`${isToday ? "Hôm nay, " : ""}${dayOfWeek} ${formattedDate}`}
              disabled={disabled}
              onClick={() => !selected && onDateChange(date)}
              className={cn(
                "relative inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap",
                "transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2",
                selected
                  ? "border-transparent bg-night text-on-night shadow-xs dark:border-on-night/25"
                  : isToday
                  ? "border-primary/30 bg-primary-soft text-primary-ink hover:bg-primary-soft/70"
                  : "border-line bg-surface text-ink-2 hover:bg-surface-2 hover:text-ink",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {isToday && (
                <span
                  aria-hidden="true"
                  className={cn("size-1.5 shrink-0 rounded-full", selected ? "bg-on-night" : "bg-primary")}
                />
              )}
              <span className={cn(selected ? "text-on-night/75" : isToday ? "text-primary-ink" : "text-ink-3")}>
                {isToday ? "Hôm nay" : WEEKDAYS_SHORT[d.getDay()]}
              </span>
              <span className="font-mono tabular-nums">{dayLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="relative shrink-0">
        <IconButton
          aria-label="Chọn ngày khác trên lịch"
          variant="outline"
          size="md"
          disabled={disabled}
          onClick={openPicker}
          icon={<CalendarDays />}
        />
        <input
          ref={inputRef}
          type="date"
          value={selectedDate}
          max={todayStr}
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
          onChange={(e) => e.target.value && onDateChange(e.target.value)}
          className="pointer-events-none absolute inset-0 size-full opacity-0"
        />
      </div>
    </div>
  );
};
