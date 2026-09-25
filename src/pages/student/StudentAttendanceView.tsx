import React, { useMemo } from "react";
import { CalendarCheck, Flame } from "lucide-react";
import type { AttendanceStatus } from "../../types";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { Card } from "../../components/ui/Card";
import { IconTile } from "../../components/ui/IconTile";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { CountUp } from "../../components/ui/CountUp";
import { TONE_BORDER, TONE_SOFT } from "../../components/ui/tone";
import type { SundayAttendance } from "../../services/studentPortalMockData";
import { StudentViewHeader } from "./StudentViewHeader";
import { ATTENDANCE_META, formatDayMonth, summarizeAttendance } from "./studentUtils";

export interface StudentAttendanceViewProps {
  records: SundayAttendance[];
  /** Mốc chuỗi của huy hiệu kế tiếp (VD 7 Chúa Nhật) */
  nextStreakGoal?: number;
  className?: string;
}

function encouragement(rate: number): string {
  if (rate >= 90) return "Tuyệt vời! Em gần như không vắng buổi nào.";
  if (rate >= 75) return "Em đi học rất đều. Cố lên nhé!";
  if (rate >= 50) return "Em đang cố gắng. Chúa Nhật nào cũng đến lớp nha!";
  return "Mỗi Chúa Nhật là một khởi đầu mới. Em đến lớp nhé!";
}

const STATUS_ORDER: AttendanceStatus[] = ["PRESENT", "LATE", "EXCUSED", "ABSENT"];

/** "Chuyên cần của em": tỉ lệ đi học, chuỗi Chúa Nhật và lịch 12 Chúa Nhật gần nhất. */
export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({
  records,
  nextStreakGoal = 7,
  className,
}) => {
  const ref = useReveal<HTMLDivElement>();
  const summary = useMemo(() => summarizeAttendance(records), [records]);

  const months = useMemo(() => {
    const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
    const groups: { key: string; label: string; items: SundayAttendance[] }[] = [];
    sorted.forEach((record) => {
      const [yyyy, mm] = record.date.split("-");
      const key = `${yyyy}-${mm}`;
      let group = groups.find((g) => g.key === key);
      if (!group) {
        group = { key, label: `Tháng ${Number(mm)}`, items: [] };
        groups.push(group);
      }
      group.items.push(record);
    });
    return groups;
  }, [records]);

  const latestDate = months.length > 0 ? months[months.length - 1].items.slice(-1)[0]?.date : undefined;
  const toGoal = Math.max(0, nextStreakGoal - summary.streak);

  return (
    <div ref={ref} className={cn("space-y-8", className)}>
      <StudentViewHeader
        title="Chuyên cần của em"
        subtitle={`${summary.total} Chúa Nhật gần nhất`}
        icon={<CalendarCheck />}
        tone="mint"
      />

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {/* Tỉ lệ đi học */}
        <Card as="section" data-reveal padding="lg" radius="card-lg" aria-label="Tỉ lệ đi học">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <ProgressRing
              value={summary.rate}
              max={100}
              tone="success"
              size="xl"
              thickness={10}
              label={`Tỉ lệ đi học ${summary.rate}%`}
            >
              <CountUp value={summary.rate} suffix="%" className="font-mono text-3xl font-bold text-ink" />
              <span className="text-sm text-ink-2">đi học</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="text-xl font-bold tracking-tight text-ink">
                Em đi học {summary.attended}/{summary.total} buổi
              </p>
              <p className="mt-1.5 text-base text-ink-2">{encouragement(summary.rate)}</p>
            </div>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-2.5">
            {STATUS_ORDER.map((status) => {
              const meta = ATTENDANCE_META[status];
              return (
                <li
                  key={status}
                  className={cn(
                    "flex min-h-13 items-center gap-2.5 rounded-control px-3.5 [&_svg]:size-5",
                    TONE_SOFT[meta.tone]
                  )}
                >
                  <span aria-hidden="true">{meta.icon}</span>
                  <span className="min-w-0 flex-1 text-sm font-semibold">{meta.label}</span>
                  <span className="font-mono text-lg font-bold text-ink">{summary.counts[status]}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Chuỗi Chúa Nhật */}
        <Card
          as="section"
          data-reveal
          variant="soft"
          tone="sun"
          padding="lg"
          radius="card-lg"
          aria-label="Chuỗi Chúa Nhật liên tiếp"
          className="flex flex-col justify-center text-ink"
        >
          <IconTile icon={<Flame className="fill-current" />} tone="sun" solid size="xl" />
          <p className="mt-5 text-3xl leading-tight font-bold tracking-tight text-ink">
            <CountUp value={summary.streak} className="font-mono" /> Chúa Nhật liên tiếp
          </p>
          <p className="mt-2 text-base text-ink">
            {summary.streak === 0
              ? "Chúa Nhật này đi học để bắt đầu chuỗi mới nhé!"
              : toGoal > 0
                ? `Đi thêm ${toGoal} buổi nữa để nhận huy hiệu Chuỗi ${nextStreakGoal} Chúa Nhật!`
                : "Em giữ chuỗi thật giỏi. Tiếp tục nhé!"}
          </p>
        </Card>
      </div>

      {/* Lịch Chúa Nhật */}
      <section aria-labelledby="student-sundays-heading" className="space-y-5">
        <h2 id="student-sundays-heading" data-reveal className="text-xl font-bold tracking-tight text-ink">
          Lịch Chúa Nhật của em
        </h2>

        {months.map((month) => (
          <div key={month.key} data-reveal>
            <h3 className="text-base font-semibold text-ink-2">{month.label}</h3>
            <ul className="mt-2.5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {month.items.map((record) => {
                const meta = ATTENDANCE_META[record.status];
                const isLatest = record.date === latestDate;
                return (
                  <li
                    key={record.date}
                    className={cn(
                      "relative flex min-h-24 flex-col items-center justify-center gap-1 rounded-control border p-2.5 text-center [&_svg]:size-6",
                      TONE_SOFT[meta.tone],
                      TONE_BORDER[meta.tone],
                      isLatest && "ring-2 ring-primary/40 ring-offset-2 ring-offset-canvas"
                    )}
                    title={record.lesson}
                  >
                    <span aria-hidden="true">{meta.icon}</span>
                    <span className="font-mono text-base font-bold text-ink">
                      <span className="sr-only">Chúa Nhật </span>
                      {formatDayMonth(record.date)}
                    </span>
                    <span className="text-sm leading-tight font-semibold">{meta.label}</span>
                    {isLatest && <span className="sr-only">(buổi gần nhất)</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};
