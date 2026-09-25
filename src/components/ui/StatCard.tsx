import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from "lucide-react";
import { Card } from "./Card";
import { IconTile } from "./IconTile";
import { CountUp } from "./CountUp";
import { Skeleton } from "./Skeleton";
import { cn } from "../../lib/cn";
import { TONE_SOFT, Tone } from "./tone";

export type TrendType = "positive" | "negative" | "neutral";

export interface StatCardProps {
  /** Tiêu đề chỉ số (VD: Tổng học sinh, Chuyên cần hôm nay) */
  title: string;
  /** Giá trị (VD: 128, "94%", 8.5). Số sẽ được đếm động bằng CountUp. */
  value: React.ReactNode;
  /** Icon đại diện (bọc trong IconTile) */
  icon?: React.ReactNode;
  /** Chuỗi xu hướng (VD: "+5 so với tháng trước", "-2%") */
  trend?: string;
  /** Loại xu hướng: positive (success), negative (danger), neutral */
  trendType?: TrendType;
  /** Đang tải (Skeleton) */
  loading?: boolean;
  /** Lỗi tải dữ liệu cho thẻ */
  error?: string | null;
  /** Chú thích bổ sung */
  subtitle?: React.ReactNode;
  /** Nhấn vào thẻ (thẻ tương tác) */
  onClick?: () => void;
  className?: string;
  /** Tone của IconTile (mặc định primary) */
  tone?: Tone;
  /** Số chữ số thập phân khi value là số (mặc định tự suy ra, tối đa 2) */
  decimals?: number;
  /** Hậu tố khi value là số (VD "%", " em") */
  suffix?: string;
}

const trendConfig: Record<TrendType, { tone: Tone; Icon: React.ElementType; srLabel: string }> = {
  positive: { tone: "success", Icon: ArrowUpRight, srLabel: "Tăng" },
  negative: { tone: "danger", Icon: ArrowDownRight, srLabel: "Giảm" },
  neutral: { tone: "neutral", Icon: Minus, srLabel: "Không đổi" },
};

function inferDecimals(value: number): number {
  if (Number.isInteger(value)) return 0;
  const fraction = String(value).split(".")[1] ?? "";
  return Math.min(2, Math.max(1, fraction.length));
}

/**
 * StatCard (03 §5): Card + IconTile + giá trị CountUp + trend pill.
 * Trạng thái: Default, Loading (Skeleton), Error; tương tác khi có onClick.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = "neutral",
  loading = false,
  error = null,
  subtitle,
  onClick,
  className = "",
  tone = "primary",
  decimals,
  suffix = "",
}) => {
  if (loading) {
    return (
      <Card padding="md" className={cn("flex flex-col", className)} aria-busy="true">
        <div className="flex items-start justify-between">
          <Skeleton width={40} height={40} className="rounded-control" />
          <Skeleton width={64} height={24} className="rounded-full" />
        </div>
        <Skeleton width="55%" height={14} className="mt-4" />
        <Skeleton width="45%" height={32} className="mt-2" />
        <Skeleton width="70%" height={14} className="mt-2" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding="md" role="alert" className={cn("flex flex-col border-danger/30", className)}>
        <div className="flex items-center gap-3">
          <IconTile icon={<AlertCircle />} tone="danger" size="md" />
          <span className="min-w-0 text-sm font-medium text-ink-2">{title}</span>
        </div>
        <p className="mt-3 text-sm text-danger">{error || "Không thể tải số liệu"}</p>
      </Card>
    );
  }

  const { tone: trendTone, Icon: TrendIcon, srLabel } = trendConfig[trendType];

  const renderedValue =
    typeof value === "number" ? (
      <CountUp value={value} decimals={decimals ?? inferDecimals(value)} suffix={suffix} />
    ) : (
      value
    );

  return (
    <Card
      padding="md"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={cn("flex flex-col", className)}
    >
      {icon ? (
        <IconTile icon={icon} tone={tone} size="md" />
      ) : (
        <span className="min-w-0 text-sm font-medium text-ink-2">{title}</span>
      )}

      {icon && <p className="mt-4 text-sm font-medium text-ink-2">{title}</p>}

      <div className={cn("text-3xl leading-tight font-bold tracking-tight text-ink tabular-nums", icon ? "mt-1" : "mt-2")}>
        {renderedValue}
      </div>

      {/* Trend nằm dưới giá trị và được xuống dòng — không đẩy card rộng ra ở cột hẹp (375px) */}
      {trend && (
        <span
          className={cn(
            "mt-2 inline-flex w-fit max-w-full items-start gap-1 rounded-sm px-2 py-1 text-sm leading-snug font-semibold",
            TONE_SOFT[trendTone]
          )}
        >
          <TrendIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span className="sr-only">{srLabel}:</span>
          <span className="min-w-0 tabular-nums">{trend}</span>
        </span>
      )}

      {subtitle && <p className="mt-1 text-sm text-ink-3">{subtitle}</p>}
    </Card>
  );
};
