import React from "react";
import { AlertCircle, RefreshCw, Inbox } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";
import { Button } from "../ui/Button";

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
   * Chiều cao tối thiểu của khu vực biểu đồ
   */
  minHeight?: string;
  className?: string;
}

/**
 * ChartCard Component (§25 03_Component_Library & Wireframe A §4–5)
 *
 * Quản lý chặt chẽ 4 trạng thái bắt buộc:
 * - Loading: Skeleton placeholder với layout mô phỏng cột/đường
 * - Ready: Render nội dung biểu đồ thực tế
 * - Empty: Trạng thái trống với biểu tượng và thông báo hướng dẫn
 * - Error: Báo lỗi trực quan + nút Retry tương tác
 */
export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  status = "ready",
  errorMessage = "Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.",
  emptyMessage = "Chưa có dữ liệu thống kê trong giai đoạn này.",
  onRetry,
  action,
  badge,
  children,
  minHeight = "min-h-[220px]",
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-[14px] border border-[#E7E5E4] p-4 sm:p-5 shadow-xs flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F5F4]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1C1917] font-serif">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-[13px] text-[#78716C]">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Main Content Area based on Status */}
      <div className={`mt-4 flex-1 flex flex-col justify-center ${minHeight}`}>
        {/* 1. LOADING STATE */}
        {status === "loading" && (
          <div className="space-y-4 py-2 w-full">
            <div className="flex items-end justify-between gap-3 h-36 px-4 pt-6">
              {[40, 75, 55, 90, 65, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <Skeleton
                    className="w-full rounded-t-md"
                    style={{ height: `${h}%` }}
                  />
                  <Skeleton className="w-8 h-3 rounded" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F4]">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-32 h-4 rounded" />
            </div>
          </div>
        )}

        {/* 2. ERROR STATE */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#DC4C4C]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-[14px] font-bold text-[#1C1917]">Lỗi tải dữ liệu</h4>
              <p className="text-[13px] text-[#78716C]">{errorMessage}</p>
            </div>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="mt-1"
              >
                Thử lại
              </Button>
            )}
          </div>
        )}

        {/* 3. EMPTY STATE */}
        {status === "empty" && (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2.5">
            <div className="w-11 h-11 rounded-full bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center text-[#A8A29E]">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-[14px] font-bold text-[#44403C]">Chưa có dữ liệu</h4>
              <p className="text-[13px] text-[#78716C]">{emptyMessage}</p>
            </div>
          </div>
        )}

        {/* 4. READY STATE */}
        {status === "ready" && children}
      </div>
    </div>
  );
};
