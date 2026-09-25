import React, { useEffect, useRef, useState } from "react";
import { Award, CalendarCheck, Download, FileSpreadsheet, GraduationCap } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CountUp } from "../../components/ui/CountUp";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SegmentedControl, SegmentedOption } from "../../components/ui/SegmentedControl";
import { useToast } from "../../components/ui/Toast";
import { ChartCard, KPIGroup, SectionHeader, TableShell, TABLE_CLASSES } from "../../components/dashboard";
import { attendanceTone } from "../../components/class/ClassCard";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";

type ReportPeriod = "HK1" | "HK2" | "FULL_YEAR";

const PERIOD_OPTIONS: SegmentedOption<ReportPeriod>[] = [
  { value: "HK1", label: "Học kỳ I" },
  { value: "HK2", label: "Học kỳ II" },
  { value: "FULL_YEAR", label: "Cả năm" },
];

interface GradeRow {
  grade: string;
  classes: string;
  count: number;
  rate: number;
  gpa: number;
  passRate: number;
}

// Tổng sĩ số 24 + 65 + 60 + 16 = 165 (khớp KPI)
const GRADE_ROWS: GradeRow[] = [
  { grade: "Khối Khai Tâm", classes: "Chiên Con 1", count: 24, rate: 88, gpa: 8.2, passRate: 100 },
  { grade: "Khối Rước Lễ", classes: "Lớp 3B, 4A", count: 65, rate: 96, gpa: 8.6, passRate: 98.5 },
  { grade: "Khối Thêm Sức", classes: "Lớp 7A, 8A", count: 60, rate: 94, gpa: 8.4, passRate: 96.7 },
  { grade: "Khối Bao Đồng", classes: "Bao Đồng 1", count: 16, rate: 92, gpa: 8.1, passRate: 93.8 },
];

const TOTAL_KEY = "Tổng hợp toàn đoàn";

const formatNumber = (value: number, decimals = 1) =>
  value.toLocaleString("vi-VN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** 100 → "100", 98.5 → "98,5" */
const formatPercent = (value: number) => (Number.isInteger(value) ? String(value) : formatNumber(value));

export const ReportsPage: React.FC = () => {
  const toast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("HK1");
  const [exportingKey, setExportingKey] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleExport = (reportType: string) => {
    if (exportingKey) return;
    setExportingKey(reportType);
    toast.info(`Đang xuất ${reportType} ra file Excel...`);
    timer.current = window.setTimeout(() => {
      setExportingKey(null);
      toast.success(`Đã xuất báo cáo ${reportType}. File kito_vua_${selectedPeriod}.xlsx đã sẵn sàng.`);
    }, 1200);
  };

  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label ?? "";

  return (
    <div ref={revealRef} className="space-y-6">
      <PageHeader
        title="Báo cáo"
        description="Chuyên cần, phổ điểm học tập và xuất báo cáo Excel cho Ban Giáo lý"
        badge={<Badge variant="neutral">Năm học 2026–2027</Badge>}
        actions={
          <Button
            leftIcon={<Download />}
            loading={exportingKey === TOTAL_KEY}
            disabled={Boolean(exportingKey) && exportingKey !== TOTAL_KEY}
            onClick={() => handleExport(TOTAL_KEY)}
          >
            Xuất Excel tổng hợp
          </Button>
        }
      />

      <div data-reveal className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-2">Kỳ báo cáo</p>
        <SegmentedControl
          ariaLabel="Chọn kỳ báo cáo"
          value={selectedPeriod}
          onChange={setSelectedPeriod}
          options={PERIOD_OPTIONS}
        />
      </div>

      <KPIGroup
        items={[
          {
            title: "Tổng sĩ số",
            value: <CountUp value={165} />,
            subtitle: "4 khối · 6 lớp giáo lý",
            icon: <GraduationCap className="size-5" />,
            trend: "+5 em (3,2%)",
            trendType: "positive",
          },
          {
            title: "Chuyên cần chung",
            value: <CountUp value={93.8} decimals={1} suffix="%" />,
            subtitle: "Mục tiêu từ 90%",
            icon: <CalendarCheck className="size-5" />,
            trend: "+1,4%",
            trendType: "positive",
          },
          {
            title: "Điểm TB toàn đoàn",
            value: <CountUp value={8.4} decimals={1} />,
            subtitle: "Thang điểm 10",
            icon: <FileSpreadsheet className="size-5" />,
            trend: periodLabel,
            trendType: "neutral",
          },
          {
            title: "Xuất sắc và Giỏi",
            value: <CountUp value={118} suffix=" em" />,
            subtitle: "Chiếm 71,5% tổng số",
            icon: <Award className="size-5" />,
            trendType: "positive",
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div data-reveal>
          <ChartCard title="Chuyên cần theo khối" subtitle={`${periodLabel} · tỷ lệ có mặt`} minHeight="min-h-48">
            <ul className="space-y-4">
              {GRADE_ROWS.map((row) => (
                <li key={row.grade} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-ink">{row.grade}</span>
                    <span className="shrink-0 font-mono font-semibold text-ink">{row.rate}%</span>
                  </div>
                  <ProgressBar value={row.rate} tone={attendanceTone(row.rate)} label={`${row.grade}: chuyên cần ${row.rate}%`} />
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
        <div data-reveal>
          <ChartCard title="Điểm trung bình theo khối" subtitle={`${periodLabel} · thang điểm 10`} minHeight="min-h-48">
            <ul className="space-y-4">
              {GRADE_ROWS.map((row) => (
                <li key={row.grade} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-ink">{row.grade}</span>
                    <span className="shrink-0 font-mono font-semibold text-ink">{formatNumber(row.gpa)}</span>
                  </div>
                  <ProgressBar value={row.gpa} max={10} tone="info" label={`${row.grade}: điểm trung bình ${formatNumber(row.gpa)}`} />
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      </div>

      <section data-reveal aria-labelledby="grade-table-heading" className="space-y-3">
        <SectionHeader
          id="grade-table-heading"
          title="Thống kê chi tiết theo khối"
          description="Sĩ số, chuyên cần, điểm trung bình và tỷ lệ đạt chuẩn"
        />

        {/* Desktop / tablet */}
        <TableShell className="hidden md:block" minWidthClassName="min-w-[46rem]" label="Thống kê theo khối">
          <thead>
            <tr>
              <th scope="col" className={TABLE_CLASSES.th}>
                Khối
              </th>
              <th scope="col" className={cn(TABLE_CLASSES.th, "text-right")}>
                Sĩ số
              </th>
              <th scope="col" className={cn(TABLE_CLASSES.th, "w-48")}>
                Chuyên cần
              </th>
              <th scope="col" className={cn(TABLE_CLASSES.th, "text-right")}>
                Điểm TB
              </th>
              <th scope="col" className={cn(TABLE_CLASSES.th, "text-right")}>
                Đạt chuẩn
              </th>
              <th scope="col" className={cn(TABLE_CLASSES.th, "text-right")}>
                <span className="sr-only">Xuất báo cáo</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {GRADE_ROWS.map((row) => (
              <tr key={row.grade} className={TABLE_CLASSES.tr}>
                <td className={TABLE_CLASSES.td}>
                  <p className="font-semibold text-ink">{row.grade}</p>
                  <p className="text-xs text-ink-3">{row.classes}</p>
                </td>
                <td className={cn(TABLE_CLASSES.td, "text-right font-mono")}>{row.count}</td>
                <td className={TABLE_CLASSES.td}>
                  <div className="flex items-center gap-3">
                    <ProgressBar
                      value={row.rate}
                      size="sm"
                      tone={attendanceTone(row.rate)}
                      label={`Chuyên cần ${row.rate}%`}
                      className="flex-1"
                    />
                    <span className="w-10 shrink-0 text-right font-mono text-ink">{row.rate}%</span>
                  </div>
                </td>
                <td className={cn(TABLE_CLASSES.td, "text-right font-mono font-semibold")}>{formatNumber(row.gpa)}</td>
                <td className={cn(TABLE_CLASSES.td, "text-right font-mono")}>{formatPercent(row.passRate)}%</td>
                <td className={cn(TABLE_CLASSES.td, "text-right")}>
                  <Button
                    variant="outline"
                    leftIcon={<Download />}
                    loading={exportingKey === row.grade}
                    disabled={Boolean(exportingKey) && exportingKey !== row.grade}
                    onClick={() => handleExport(row.grade)}
                    aria-label={`Xuất Excel ${row.grade}`}
                  >
                    Xuất Excel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>

        {/* Mobile */}
        <ul className="space-y-3 md:hidden">
          {GRADE_ROWS.map((row) => (
            <Card key={row.grade} as="li" padding="md" className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{row.grade}</p>
                  <p className="text-sm text-ink-3">{row.classes}</p>
                </div>
                <Badge variant={row.rate >= 90 ? "success" : "warning"} size="sm">
                  {row.rate}% chuyên cần
                </Badge>
              </div>
              <dl className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-control bg-surface-2 p-2.5">
                  <dt className="text-xs text-ink-3">Sĩ số</dt>
                  <dd className="font-mono text-lg font-semibold text-ink">{row.count}</dd>
                </div>
                <div className="rounded-control bg-surface-2 p-2.5">
                  <dt className="text-xs text-ink-3">Điểm TB</dt>
                  <dd className="font-mono text-lg font-semibold text-ink">{formatNumber(row.gpa)}</dd>
                </div>
                <div className="rounded-control bg-surface-2 p-2.5">
                  <dt className="text-xs text-ink-3">Đạt chuẩn</dt>
                  <dd className="font-mono text-lg font-semibold text-ink">{formatPercent(row.passRate)}%</dd>
                </div>
              </dl>
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Download />}
                loading={exportingKey === row.grade}
                disabled={Boolean(exportingKey) && exportingKey !== row.grade}
                onClick={() => handleExport(row.grade)}
              >
                Xuất Excel {row.grade}
              </Button>
            </Card>
          ))}
        </ul>
      </section>
    </div>
  );
};
