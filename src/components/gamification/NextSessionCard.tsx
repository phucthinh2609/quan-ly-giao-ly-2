import React from "react";
import { BookOpen, CalendarDays, Clock, DoorOpen, UserRound } from "lucide-react";
import { cn } from "../../lib/cn";
import { IconTile } from "../ui/IconTile";

export interface NextSessionCardProps extends React.HTMLAttributes<HTMLElement> {
  /** VD "Chúa Nhật 04/10" */
  dateLabel: string;
  /** VD "08:00" */
  time: string;
  /** VD "Phòng 3" */
  room: string;
  /** VD "GLV Giuse Minh" */
  teacher: string;
  /** Tên bài học (tùy chọn) */
  lesson?: string;
  /** Nhãn đếm ngược, VD "Còn 9 ngày" */
  countdownLabel?: string;
  /** Tiêu đề thẻ */
  heading?: string;
}

/** NextSessionCard (03 §10) — buổi học tới: ngày · giờ · phòng · GLV. */
export const NextSessionCard: React.FC<NextSessionCardProps> = ({
  dateLabel,
  time,
  room,
  teacher,
  lesson,
  countdownLabel,
  heading = "Buổi học tới",
  className,
  ...rest
}) => {
  const details = [
    { key: "time", icon: <Clock />, label: "Giờ học", value: time, mono: true },
    { key: "room", icon: <DoorOpen />, label: "Phòng học", value: room, mono: false },
    { key: "teacher", icon: <UserRound />, label: "Giáo lý viên", value: teacher, mono: false },
  ];

  return (
    <section
      aria-label={heading}
      className={cn("@container rounded-card border border-line bg-surface p-5 shadow-card sm:p-6", className)}
      {...rest}
    >
      <div className="flex items-start gap-4">
        <IconTile icon={<CalendarDays />} tone="sky" size="xl" />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-ink-2">{heading}</h2>
          <p className="mt-0.5 text-xl leading-tight font-bold tracking-tight text-ink sm:text-2xl">{dateLabel}</p>
          {countdownLabel && (
            <span className="mt-2 inline-flex h-7 items-center rounded-full bg-sky-soft px-3 text-sm font-semibold text-ink">
              {countdownLabel}
            </span>
          )}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-2.5 @md:grid-cols-3">
        {details.map((item) => (
          <div key={item.key} className="flex min-h-14 items-center gap-3 rounded-control bg-surface-2 px-3.5 py-2.5">
            <span className="shrink-0 text-sky [&_svg]:size-5" aria-hidden="true">
              {item.icon}
            </span>
            <div className="min-w-0">
              <dt className="text-sm text-ink-2">{item.label}</dt>
              <dd className={cn("text-base font-semibold text-ink", item.mono && "font-mono")}>{item.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      {lesson && (
        <p className="mt-4 flex items-start gap-2.5 text-base text-ink-2">
          <BookOpen className="mt-0.5 size-5 shrink-0 text-grape" aria-hidden="true" />
          <span>{lesson}</span>
        </p>
      )}
    </section>
  );
};
