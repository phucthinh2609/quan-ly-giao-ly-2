import React, { useMemo } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  PenLine,
  Users,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { IconTile } from "../../components/ui/IconTile";
import { ClassCard } from "../../components/class/ClassCard";
import { AttendanceSummary } from "../../components/attendance/AttendanceSummary";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { NotificationCard } from "../../components/notification/NotificationCard";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/cn";
import { formatWeekdayDate, givenName, greeting } from "../../lib/format";
import { useReveal } from "../../lib/motion";
import { NotificationData, AttendanceSummaryData } from "../../types";
import {
  MOCK_CLASSES,
  MOCK_TEACHER_ACTIVITIES,
} from "../../services/dashboardMockData";

export interface TeacherDashboardProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

const SESSION_TIME = "08:00";

/** Chúa Nhật gần nhất sắp tới (hôm nay nếu hôm nay là Chúa Nhật). */
function nextSunday(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  return d;
}

/** Chúa Nhật đã qua gần nhất (trước hôm nay). */
function previousSunday(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() - (d.getDay() === 0 ? 7 : d.getDay()));
  return d;
}

/**
 * TeacherDashboard (04 §7, B-GLV-01) — hero "Buổi học tới" với CTA 1 chạm Điểm danh / Nhập điểm.
 */
export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate, className }) => {
  const { user } = useAuth();
  const revealRef = useReveal<HTMLDivElement>();

  const today = useMemo(() => new Date(), []);
  const upcoming = useMemo(() => nextSunday(today), [today]);
  const lastSession = useMemo(() => previousSunday(today), [today]);
  const isToday = upcoming.toDateString() === today.toDateString();

  // GLV phụ trách lớp 7A và 8A
  const myClasses = MOCK_CLASSES.filter((c) => c.id === "cls-7a" || c.id === "cls-8a");
  const primaryClass = myClasses[0] || MOCK_CLASSES[0];

  // Chuyên cần buổi trước của lớp chính
  const classSummary: AttendanceSummaryData = {
    total: primaryClass.studentCount,
    present: primaryClass.presentCount,
    absent: 1,
    excused: 1,
    late: 0,
    presentRate: (primaryClass.presentCount / primaryClass.studentCount) * 100,
  };
  const lastRate = Math.round(classSummary.presentRate);

  // Nhắc việc khẩn từ Ban Giáo lý
  const upcomingNotice: NotificationData = {
    id: "glv-notice-01",
    type: "URGENT",
    title: "Hạn chót hoàn thành nhập điểm Giữa kỳ I",
    preview: "Còn 2 ngày để hoàn tất điểm 15 phút và Giữa kỳ cho học sinh Lớp 7A.",
    content:
      "Kính gửi quý Giáo lý viên lớp 7A, theo lịch học vụ chung của Đoàn Kitô Vua, bảng điểm giữa kỳ cần được chốt trước 23:59 ngày 26/09 để phụ huynh có thể theo dõi kết quả của các em.",
    timestamp: "1 giờ trước",
    formattedDate: "24/09/2026 · 09:00",
    isRead: false,
    className: "Lớp 7A",
    actionLabel: "Nhập điểm ngay",
    actionPath: "/teacher/scores",
  };

  const go = (path: string) => onNavigate?.(path);

  const title = user?.name ? `${greeting()}, ${givenName(user.name)}` : greeting();
  const sessionDay = isToday ? `Hôm nay, ${formatWeekdayDate(upcoming).split(", ")[1]}` : formatWeekdayDate(upcoming);

  return (
    <div ref={revealRef} className={cn("space-y-6", className)}>
      <div data-reveal>
        <PageHeader title={title} description={formatWeekdayDate(today)} />
      </div>

      {/* Hero "Buổi học tới" — khối night, CTA lớn trong vùng ngón cái */}
      <section
        data-reveal
        aria-labelledby="next-session-heading"
        className="grain relative overflow-hidden rounded-card-lg bg-night p-5 text-on-night shadow-float sm:p-7"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-primary/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 size-64 rounded-full bg-gold/10 blur-3xl"
        />

        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium text-on-night/70">
              <CalendarDays className="size-4" aria-hidden="true" />
              Buổi học tới
            </p>
            <h2 id="next-session-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {primaryClass.name}
              <span className="font-semibold text-on-night/60"> · {primaryClass.grade}</span>
            </h2>

            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-on-night/80">
              <li className="flex items-center gap-1.5">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  {sessionDay} · <span className="font-mono">{SESSION_TIME}</span>
                </span>
              </li>
              {primaryClass.room && (
                <li className="flex min-w-0 items-center gap-1.5">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{primaryClass.room}</span>
                </li>
              )}
              <li className="flex items-center gap-1.5">
                <Users className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-mono">{primaryClass.studentCount}</span> em
                </span>
              </li>
            </ul>

            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-on-night/10 px-3 py-1.5 text-sm">
              <CheckCircle2 className="size-4 text-on-night/70" aria-hidden="true" />
              <span>
                Đã điểm danh{" "}
                <span className="font-mono font-semibold">0/{primaryClass.studentCount}</span>
              </span>
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                rightIcon={<ArrowRight />}
                onClick={() => go("/teacher/attendance")}
                className="w-full sm:w-auto"
              >
                Bắt đầu điểm danh
              </Button>
              <Button
                size="lg"
                variant="outline"
                leftIcon={<PenLine />}
                onClick={() => go("/teacher/scores")}
                className="w-full border-on-night/30 bg-transparent text-on-night hover:border-on-night/60 hover:bg-on-night/10 sm:w-auto"
              >
                Nhập điểm
              </Button>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm text-on-night/70">Buổi trước</p>
            <p className="font-mono text-4xl font-semibold tracking-tight">{lastRate}%</p>
            <p className="text-sm text-on-night/70">
              {classSummary.present}/{classSummary.total} em có mặt
            </p>
          </div>
        </div>
      </section>

      {/* Lớp của tôi — rail cuộn ngang có snap trên mobile/tablet, lưới trên desktop */}
      <section data-reveal aria-labelledby="my-classes-heading" className="space-y-3">
        <SectionHeader
          id="my-classes-heading"
          title="Lớp của tôi"
          description={`${myClasses.length} lớp được phân công`}
          action={
            <Button
              variant="ghost"
              rightIcon={<ArrowRight />}
              onClick={() => go("/teacher/classes")}
              className="-mr-3 px-3 text-primary-ink hover:text-primary-ink"
            >
              Xem tất cả
            </Button>
          }
        />
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-3 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0">
          {myClasses.map((cls) => (
            <li key={cls.id} className="w-72 max-w-[85vw] shrink-0 snap-start lg:w-auto lg:max-w-none">
              <ClassCard classInfo={cls} onClick={(id) => go(`/classes/${id}`)} />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          {/* Chuyên cần buổi trước */}
          <section data-reveal aria-labelledby="attendance-summary-heading" className="space-y-3">
            <SectionHeader
              id="attendance-summary-heading"
              title="Chuyên cần buổi trước"
              description={`${primaryClass.name} · ${formatWeekdayDate(lastSession)}`}
              action={
                <Button variant="outline" onClick={() => go("/teacher/attendance")}>
                  Chi tiết
                </Button>
              }
            />
            <AttendanceSummary summary={classSummary} />
          </section>

          {/* Thông báo từ Ban Giáo lý */}
          <section data-reveal aria-labelledby="glv-notice-heading" className="space-y-3">
            <SectionHeader
              id="glv-notice-heading"
              title="Thông báo từ Ban Giáo lý"
              icon={<Bell />}
              iconTone="primary"
              action={
                <Button
                  variant="ghost"
                  rightIcon={<ArrowRight />}
                  onClick={() => go("/teacher/notifications")}
                  className="-mr-3 px-3 text-primary-ink hover:text-primary-ink"
                >
                  Tất cả
                </Button>
              }
            />
            <NotificationCard
              notification={upcomingNotice}
              onClick={(n) => go(n.actionPath || "/teacher/notifications")}
            />
            <Card padding="sm" className="flex items-center gap-3">
              <IconTile icon={<CalendarDays />} tone="info" size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">Họp Huynh trưởng tháng 10</p>
                <p className="text-sm text-ink-3">
                  Thứ Sáu, 02/10 · <span className="font-mono">19:30</span> · Văn phòng Giáo xứ
                </p>
              </div>
            </Card>
          </section>
        </div>

        <div data-reveal>
          <ActivityFeed activities={MOCK_TEACHER_ACTIVITIES} title="Hoạt động gần đây" description="Lớp bạn phụ trách" />
        </div>
      </div>
    </div>
  );
};
