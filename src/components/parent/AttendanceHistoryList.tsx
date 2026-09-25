import React, { useState } from "react";
import { CalendarX2, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import type { ParentAttendanceSession } from "../../services/parentMockData";
import { AttendanceStatusPill, formatSessionDate } from "./AttendanceSummaryCard";

export interface AttendanceHistoryListProps {
  sessions: ParentAttendanceSession[];
  isLoading?: boolean;
  /** Số buổi hiện ban đầu, còn lại mở bằng "Xem thêm" (mặc định 8) */
  initialCount?: number;
  className?: string;
}

/**
 * AttendanceHistoryList (04 §12) — lịch sử từng buổi Chúa Nhật, mới nhất trước,
 * mỗi dòng có chip trạng thái icon + nhãn.
 */
export const AttendanceHistoryList: React.FC<AttendanceHistoryListProps> = ({
  sessions,
  isLoading = false,
  initialCount = 8,
  className,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div aria-hidden="true" className={cn("rounded-card border border-line bg-surface p-5 shadow-card sm:p-6", className)}>
        <Skeleton className="h-6 w-24 rounded-full" />
        <div className="mt-3 divide-y divide-line">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/5 rounded-full" />
                <Skeleton className="h-4 w-1/4 rounded-full" />
              </div>
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        className={className}
        icon={<CalendarX2 />}
        title="Chưa có buổi học nào"
        description="Lịch sử điểm danh sẽ hiện khi GLV điểm danh buổi học đầu tiên."
      />
    );
  }

  const visible = expanded ? sessions : sessions.slice(0, initialCount);
  const hiddenCount = sessions.length - visible.length;

  return (
    <section
      aria-labelledby="attendance-history-heading"
      className={cn("rounded-card border border-line bg-surface p-5 shadow-card sm:p-6", className)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="attendance-history-heading" className="text-xl font-semibold tracking-tight text-ink">
          Lịch sử
        </h2>
        <p className="text-sm text-ink-3 tabular-nums">{sessions.length} buổi</p>
      </div>

      <ol className="mt-2 divide-y divide-line">
        {visible.map((session) => (
          <li key={session.id} className="flex min-h-16 items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-base font-semibold text-ink tabular-nums">{formatSessionDate(session.date)}</p>
              {session.note && <p className="text-sm text-ink-2">{session.note}</p>}
            </div>
            <AttendanceStatusPill status={session.status} />
          </li>
        ))}
      </ol>

      {sessions.length > initialCount && (
        <Button
          variant="ghost"
          fullWidth
          rightIcon={<ChevronDown className={cn("transition-transform duration-200", expanded && "rotate-180")} />}
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="mt-2"
        >
          {expanded ? "Thu gọn" : `Xem thêm ${hiddenCount} buổi`}
        </Button>
      )}
    </section>
  );
};
