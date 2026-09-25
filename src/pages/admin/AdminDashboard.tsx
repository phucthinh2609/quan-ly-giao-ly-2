import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCheck2,
  GraduationCap,
  School,
  TrendingUp,
  UserCheck,
  XCircle,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CountUp } from "../../components/ui/CountUp";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { SegmentedControl, SegmentedOption } from "../../components/ui/SegmentedControl";
import { TONE_SOFT, TONE_TEXT, Tone } from "../../components/ui/tone";
import { useToast } from "../../components/ui/Toast";
import { KPIGroup, ChartCard, ChartCardStatus, ActivityFeed, SectionHeader } from "../../components/dashboard";
import { ClassCard } from "../../components/class/ClassCard";
import { useAuth } from "../../context/AuthContext";
import { usePreferences } from "../../context/PreferencesContext";
import { cn } from "../../lib/cn";
import { givenName, greeting } from "../../lib/format";
import { useReveal } from "../../lib/motion";
import {
  MOCK_CLASSES,
  MOCK_ADMIN_ACTIVITIES,
  MOCK_ADMIN_NOTIFICATIONS,
} from "../../services/dashboardMockData";

export interface AdminDashboardProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

interface StatusTile {
  key: string;
  label: string;
  value: number;
  tone: Tone;
  icon: React.ReactNode;
}

interface ScoreBand {
  label: string;
  range: string;
  count: number;
  tone: Tone;
}

// Phân bố điểm học kỳ I (dữ liệu mẫu) — tổng 175 em, khớp sĩ số toàn đoàn
const SCORE_BANDS: ScoreBand[] = [
  { label: "Xuất sắc", range: "9,0 – 10", count: 48, tone: "success" },
  { label: "Giỏi", range: "8,0 – 8,9", count: 76, tone: "info" },
  { label: "Khá", range: "6,5 – 7,9", count: 38, tone: "grape" },
  { label: "Đạt", range: "5,0 – 6,4", count: 10, tone: "warning" },
  { label: "Cần cố gắng", range: "dưới 5,0", count: 3, tone: "primary" },
];

const CHART_STATUS_OPTIONS: SegmentedOption<ChartCardStatus>[] = [
  { value: "ready", label: "Sẵn sàng" },
  { value: "loading", label: "Đang tải" },
  { value: "empty", label: "Trống" },
  { value: "error", label: "Lỗi" },
];

const formatPercent = (value: number, decimals = 1) =>
  value.toLocaleString("vi-VN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * AdminDashboard (04 §6, B-AD-01) — bento gapless, KPI đếm số động.
 */
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, className }) => {
  const { user } = useAuth();
  const { demoMode } = usePreferences();
  const toast = useToast();
  const revealRef = useReveal<HTMLDivElement>();

  const [attendanceChartStatus, setAttendanceChartStatus] = useState<ChartCardStatus>("ready");
  const [scoreChartStatus, setScoreChartStatus] = useState<ChartCardStatus>("ready");
  const [exporting, setExporting] = useState(false);
  const exportTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(exportTimer.current), []);

  const go = (path: string) => onNavigate?.(path);

  // ---- Tổng hợp số liệu ----------------------------------------------------
  const classes = MOCK_CLASSES;
  const totalStudents = classes.reduce((acc, c) => acc + c.studentCount, 0);
  const totalPresent = classes.reduce((acc, c) => acc + c.presentCount, 0);
  const attendanceRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
  const notPresent = Math.max(0, totalStudents - totalPresent);
  const excused = Math.min(5, notPresent);
  const late = Math.min(3, notPresent - excused);
  const absent = Math.max(0, notPresent - excused - late);

  const attendanceTiles: StatusTile[] = [
    { key: "present", label: "Có mặt", value: totalPresent, tone: "success", icon: <CheckCircle2 /> },
    { key: "absent", label: "Vắng", value: absent, tone: "danger", icon: <XCircle /> },
    { key: "excused", label: "Có phép", value: excused, tone: "info", icon: <FileCheck2 /> },
    { key: "late", label: "Đi muộn", value: late, tone: "warning", icon: <Clock /> },
  ];

  const scoreTotal = SCORE_BANDS.reduce((acc, b) => acc + b.count, 0);
  const passCount = SCORE_BANDS.filter((b) => b.tone !== "primary").reduce((acc, b) => acc + b.count, 0);
  const passRate = scoreTotal > 0 ? (passCount / scoreTotal) * 100 : 0;

  const lowAttendanceClasses = [...classes]
    .filter((c) => c.attendanceRate < 90)
    .sort((a, b) => a.attendanceRate - b.attendanceRate);
  const upcomingDeadline = MOCK_ADMIN_NOTIFICATIONS.find((n) => n.type === "SYSTEM");
  const overviewClasses = classes.slice(0, 4);

  const handleExport = () => {
    setExporting(true);
    window.clearTimeout(exportTimer.current);
    exportTimer.current = window.setTimeout(() => {
      setExporting(false);
      toast.success("Đã xuất báo cáo tổng hợp toàn đoàn (Excel).");
    }, 900);
  };

  const title = user?.name ? `${greeting()}, ${givenName(user.name)}` : greeting();

  return (
    <div className={cn("space-y-6", className)}>
      <PageHeader
        title={title}
        description="Tổng quan Đoàn Kitô Vua · Năm học 2026–2027"
        actions={
          <Button leftIcon={<Download />} loading={exporting} onClick={handleExport}>
            Xuất báo cáo
          </Button>
        }
      />

      {/* Công cụ kiểm thử trạng thái thẻ — chỉ hiện khi bật Chế độ demo (MIG-10) */}
      {demoMode && (
        <Card variant="outline" padding="sm" className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="text-sm font-semibold text-ink-2">Chế độ demo: trạng thái thẻ biểu đồ</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-3">Điểm danh</span>
            <SegmentedControl
              ariaLabel="Trạng thái thẻ Điểm danh hôm nay"
              size="sm"
              value={attendanceChartStatus}
              onChange={setAttendanceChartStatus}
              options={CHART_STATUS_OPTIONS}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-3">Học tập</span>
            <SegmentedControl
              ariaLabel="Trạng thái thẻ Kết quả học tập"
              size="sm"
              value={scoreChartStatus}
              onChange={setScoreChartStatus}
              options={CHART_STATUS_OPTIONS}
            />
          </div>
        </Card>
      )}

      {/*
        BENTO GAPLESS — grid-flow-dense, kiểm tra tổng ô = cột × hàng:
        - Mobile (1 cột): mọi khối 1 ô, xếp chồng. KPI tự chia 2 cột bên trong KPIGroup.
        - md (2 cột): KPI 2 | Điểm danh 2 | Học tập 2 | Cảnh báo 1 + Hoạt động 1 | Lớp học 2
          = 2 + 2 + 2 + 2 + 2 = 10 ô = 2 × 5.
        - lg (4 cột, còn hẹp vì sidebar): KPI 4 | Điểm danh 2×2 + Học tập 2×2 = 8 | Lớp học 4 | Cảnh báo 2 + Hoạt động 2
          = 4 + 8 + 4 + 4 = 20 ô = 4 × 5.
        - xl (4 cột): KPI 4 | Điểm danh 2×2 + Học tập 2×2 = 8 | Lớp học 2 + Cảnh báo 1 + Hoạt động 1 = 4
          = 4 + 8 + 4 = 16 ô = 4 × 4.
        Thứ tự DOM theo mobile (Cảnh báo, Hoạt động trước Lớp học); từ lg dùng order để Lớp học đứng trước.
      */}
      <div
        ref={revealRef}
        className="grid grid-flow-dense grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* KPI row — 4 × 1 cột trên desktop */}
        <div className="md:col-span-2 lg:col-span-4">
          <KPIGroup
            items={[
              {
                title: "Học sinh",
                value: <CountUp value={totalStudents} />,
                icon: <GraduationCap className="size-5" />,
                trend: "+8 so với HK trước",
                trendType: "positive",
                subtitle: `${classes.length} lớp · 4 khối`,
                onClick: () => go("/admin/students"),
              },
              {
                title: "Lớp học",
                value: <CountUp value={classes.length} />,
                icon: <School className="size-5" />,
                trend: "Đủ GLV phụ trách",
                trendType: "neutral",
                subtitle: "Khai Tâm đến Bao Đồng",
                onClick: () => go("/admin/classes"),
              },
              {
                title: "Giáo lý viên",
                value: <CountUp value={18} />,
                icon: <UserCheck className="size-5" />,
                trend: "1 GLV / 10 em",
                trendType: "neutral",
                subtitle: "Đang phục vụ năm học này",
                onClick: () => go("/admin/users"),
              },
              {
                title: "Chuyên cần",
                value: <CountUp value={attendanceRate} suffix="%" />,
                icon: <CalendarCheck className="size-5" />,
                trend: "+2% so với tuần trước",
                trendType: "positive",
                subtitle: `${totalPresent}/${totalStudents} em có mặt`,
                onClick: () => go("/admin/attendance"),
              },
            ]}
          />
        </div>

        {/* Điểm danh hôm nay — 2 × 2 */}
        <div data-reveal className="@container md:col-span-2 lg:row-span-2">
          <ChartCard
            title="Điểm danh hôm nay"
            subtitle={`Chúa Nhật 24/09 · ${classes.length}/${classes.length} lớp đã điểm danh`}
            status={attendanceChartStatus}
            onRetry={() => setAttendanceChartStatus("ready")}
            badge={
              <Badge variant={attendanceRate >= 90 ? "success" : "warning"} size="sm" dot>
                {attendanceRate >= 90 ? "Đạt mục tiêu" : "Dưới mục tiêu"}
              </Badge>
            }
          >
            <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-1 flex-col items-center gap-5 @md:flex-row">
                <ProgressRing value={attendanceRate} size="xl" tone="success" thickness={9} label={`Tỷ lệ có mặt ${attendanceRate}%`}>
                  <span className="text-3xl font-bold tracking-tight text-ink">
                    <CountUp value={attendanceRate} suffix="%" />
                  </span>
                  <span className="text-xs text-ink-3">có mặt</span>
                </ProgressRing>
                <ul className="grid w-full flex-1 grid-cols-2 gap-2.5">
                  {attendanceTiles.map((tile) => (
                    <li key={tile.key} className={cn("rounded-control p-3", TONE_SOFT[tile.tone])}>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-ink-2 [&_svg]:size-4">
                        <span className={cn("inline-flex", TONE_TEXT[tile.tone])} aria-hidden="true">
                          {tile.icon}
                        </span>
                        {tile.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold tracking-tight">
                        <CountUp value={tile.value} />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                <p className="text-sm text-ink-3">
                  <span className="font-mono font-semibold text-ink">
                    {totalPresent}/{totalStudents}
                  </span>{" "}
                  em có mặt · cập nhật 08:30
                </p>
                <Button
                  variant="ghost"
                  rightIcon={<ArrowRight />}
                  onClick={() => go("/admin/attendance")}
                  className="-mr-3 px-3 text-primary-ink hover:text-primary-ink"
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Kết quả học tập — 2 × 2 */}
        <div data-reveal className="md:col-span-2 lg:row-span-2">
          <ChartCard
            title="Kết quả học tập"
            subtitle="Học kỳ I · thang điểm 10"
            status={scoreChartStatus}
            onRetry={() => setScoreChartStatus("ready")}
          >
            <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-ink-2">Điểm trung bình toàn đoàn</p>
                  <p className="text-4xl font-bold tracking-tight text-ink">
                    <CountUp value={8.2} decimals={1} />
                  </p>
                </div>
                <Badge variant="success" icon={<TrendingUp className="size-3.5" />}>
                  +0,4 so với HK trước
                </Badge>
              </div>

              <ul className="space-y-3.5" aria-label="Phân bố điểm">
                {SCORE_BANDS.map((band) => {
                  const pct = scoreTotal > 0 ? Math.round((band.count / scoreTotal) * 100) : 0;
                  return (
                    <li key={band.label} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate">
                          <span className="font-medium text-ink">{band.label}</span>
                          <span className="text-ink-3"> · {band.range}</span>
                        </span>
                        <span className="shrink-0 text-ink-2">
                          <span className="font-mono font-semibold text-ink">{band.count}</span> em · {pct}%
                        </span>
                      </div>
                      <ProgressBar value={band.count} max={scoreTotal} tone={band.tone} size="md" label={`${band.label}: ${band.count} em`} />
                    </li>
                  );
                })}
              </ul>

              <p className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3 text-sm text-ink-3">
                <span>Tỷ lệ đạt chuẩn (từ 5,0)</span>
                <span className="font-mono font-semibold text-ink">{formatPercent(passRate)}%</span>
              </p>
            </div>
          </ChartCard>
        </div>

        {/* Cảnh báo — 1 ô từ xl (2 ô ở lg) */}
        <div data-reveal className="lg:order-2 lg:col-span-2 xl:col-span-1">
          <Card padding="md" className="flex h-full flex-col gap-4">
            <SectionHeader
              title="Cần chú ý"
              description={`${lowAttendanceClasses.length} lớp vắng trên 10%`}
              icon={<AlertTriangle />}
              iconTone="warning"
            />
            {lowAttendanceClasses.length === 0 ? (
              <p className="flex items-center gap-2 rounded-control bg-success-soft p-3 text-sm text-ink">
                <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                Tất cả các lớp đều đạt chuyên cần từ 90%.
              </p>
            ) : (
              <ul className="-mx-2 space-y-1">
                {lowAttendanceClasses.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => go(`/classes/${c.id}`)}
                      className="group flex min-h-11 w-full items-center gap-3 rounded-control px-2 py-2 text-left transition-colors hover:bg-surface-2 focus-visible:outline-3"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{c.name}</span>
                        <span className="block truncate text-xs text-ink-3">
                          Vắng {c.studentCount - c.presentCount} em · {c.grade}
                        </span>
                      </span>
                      <Badge variant="warning" size="sm">
                        {c.attendanceRate}%
                      </Badge>
                      <ChevronRight
                        className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {upcomingDeadline && (
              <div className="rounded-control bg-info-soft p-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-info">
                  <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
                  Sắp đến hạn
                </p>
                <p className="mt-1 text-sm text-ink">{upcomingDeadline.title}</p>
              </div>
            )}
            <Button
              variant="ghost"
              rightIcon={<ArrowRight />}
              onClick={() => go("/admin/notifications")}
              className="-mx-3 mt-auto self-start px-3 text-primary-ink hover:text-primary-ink"
            >
              Xem thông báo
            </Button>
          </Card>
        </div>

        {/* Hoạt động — 1 ô từ xl (2 ô ở lg) */}
        <div data-reveal className="lg:order-3 lg:col-span-2 xl:col-span-1">
          <ActivityFeed
            activities={MOCK_ADMIN_ACTIVITIES}
            title="Hoạt động"
            maxItems={4}
            onViewAll={() => go("/admin/activity-log")}
            className="h-full"
          />
        </div>

        {/* Lớp học — 2 ô từ xl (4 ô ở lg) */}
        <div data-reveal className="md:col-span-2 lg:order-1 lg:col-span-4 xl:col-span-2">
          <Card variant="muted" padding="md" className="flex h-full flex-col gap-4">
            <SectionHeader
              title="Lớp học"
              description="Sĩ số, GLV phụ trách và chuyên cần hôm nay"
              icon={<School />}
              action={
                <Button
                  variant="ghost"
                  rightIcon={<ArrowRight />}
                  onClick={() => go("/admin/classes")}
                  className="-mr-3 px-3 text-primary-ink hover:text-primary-ink"
                >
                  Tất cả lớp
                </Button>
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {overviewClasses.map((cls) => (
                <ClassCard key={cls.id} classInfo={cls} onClick={(id) => go(`/classes/${id}`)} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
