import React from "react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconTile } from "../ui/IconTile";
import { cn } from "../../lib/cn";

export type ChartCardStatus = "loading" | "ready" | "empty" | "error";

export interface ChartCardProps {
  /**
   * Tiêu đề của biểu đồ / thẻ thống kê
   */
  title: string;
  /**
   * Phụ đề hoặc mô tả ngắn gọn
   */
  subtitle?: string;
  /**
   * Trạng thái hiển thị dữ liệu: loading | ready | empty | error
   */
  status?: ChartCardStatus;
  /**
   * Thông điệp lỗi khi status === 'error'
   */
  errorMessage?: string;
  /**
   * Thông điệp khi không có dữ liệu (status === 'empty')
   */
  emptyMessage?: string;
  /**
   * Callback khi người dùng nhấn "Thử lại" lúc gặp lỗi
   */
  onRetry?: () => void;
  /**
   * Nút hành động hoặc bộ lọc góc phải tiêu đề (VD: Chọn tuần, Chọn học kỳ)
   */
  action?: React.ReactNode;
  /**
   * Huy hiệu hoặc thông tin bổ sung bên cạnh tiêu đề
   */
  badge?: React.ReactNode;
  /**
   * Nội dung biểu đồ khi dữ liệu sẵn sàng (status === 'ready')
   */
  children?: React.ReactNode;
  /**
   * Class chiều cao tối thiểu của khu vực nội dung (mặc định "min-h-56")
   */
  minHeight?: string;
  className?: string;
}

const LOADING_WIDTHS = ["82%", "64%", "48%", "30%"];

/**
 * ChartCard (03 §11) — Card có header (tiêu đề, phụ đề, hành động) và 4 trạng thái:
 * Loading (skeleton đúng hình), Ready, Empty, Error (Thử lại).
 */
export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  status = "ready",
  errorMessage = "Kiểm tra kết nối và thử lại.",
  emptyMessage = "Chưa có dữ liệu thống kê trong giai đoạn này.",
  onRetry,
  action,
  badge,
  children,
  minHeight = "min-h-56",
  className,
}) => {
  return (
    <Card padding="md" className={cn("flex h-full flex-col gap-4", className)} aria-busy={status === "loading" || undefined}>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-ink sm:text-lg">{title}</h2>
            {badge}
          </div>
          {subtitle && <p className="text-sm text-ink-3">{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>

      <div className={cn("flex flex-1 flex-col", minHeight)}>
        {status === "loading" && (
          <div role="status" aria-label="Đang tải dữ liệu" className="flex flex-1 flex-col justify-center gap-5 py-2">
            {LOADING_WIDTHS.map((width, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-3 w-28 rounded-full" />
                  <Skeleton className="h-3 w-12 rounded-full" />
                </div>
                <Skeleton className="h-2.5 rounded-full" width={width} />
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 py-6 text-center">
            <IconTile icon={<AlertCircle />} tone="danger" size="lg" />
            <div className="max-w-xs space-y-1">
              <p className="font-semibold text-ink">Không thể tải dữ liệu</p>
              <p className="text-sm text-ink-3">{errorMessage}</p>
            </div>
            {onRetry && (
              <Button variant="outline" onClick={onRetry} leftIcon={<RefreshCw />} className="mt-1">
                Thử lại
              </Button>
            )}
          </div>
        )}

        {status === "empty" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-6 text-center">
            <IconTile icon={<Inbox />} tone="neutral" size="lg" />
            <div className="max-w-xs space-y-1">
              <p className="font-semibold text-ink">Chưa có dữ liệu</p>
              <p className="text-sm text-ink-3">{emptyMessage}</p>
            </div>
          </div>
        )}

        {status === "ready" && children}
      </div>
    </Card>
  );
};
