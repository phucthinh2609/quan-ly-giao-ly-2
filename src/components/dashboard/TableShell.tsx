import React from "react";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";

/**
 * Class dùng chung cho bảng dữ liệu mật độ cao (B-AD-02):
 * header dính (sticky) trong vùng cuộn riêng, hàng hover rõ, viền token.
 * Dùng border-separate để viền dưới của header sticky không bị mất khi cuộn.
 */
export const TABLE_CLASSES = {
  table: "w-full border-separate border-spacing-0 text-left text-sm",
  th: "sticky top-0 z-10 whitespace-nowrap border-b border-line bg-surface-2 px-4 py-3 text-sm font-semibold text-ink-2 first:pl-5 last:pr-5",
  tr: "group transition-colors duration-150 hover:bg-surface-2/60",
  trClickable:
    "cursor-pointer focus-visible:bg-surface-2/60 focus-visible:outline-3 focus-visible:-outline-offset-3 active:bg-surface-2",
  td: "border-b border-line px-4 py-3 align-middle text-ink first:pl-5 last:pr-5 group-last:border-b-0",
} as const;

export interface TableShellProps {
  children: React.ReactNode;
  /** Chiều rộng tối thiểu của bảng trước khi cuộn ngang trong khung (VD "min-w-[44rem]") */
  minWidthClassName?: string;
  /** Giới hạn chiều cao vùng cuộn để header dính hoạt động */
  maxHeightClassName?: string;
  /** Nội dung dưới bảng (phân trang, tổng kết) */
  footer?: React.ReactNode;
  /** Nhãn cho vùng cuộn (screen reader) */
  label?: string;
  className?: string;
}

/**
 * Khung bảng: Card bề mặt bo góc + vùng cuộn riêng (header sticky, không gây cuộn ngang toàn trang).
 */
export const TableShell: React.FC<TableShellProps> = ({
  children,
  minWidthClassName = "min-w-[40rem]",
  maxHeightClassName = "max-h-[70vh]",
  footer,
  label,
  className,
}) => (
  <Card padding="none" className={cn("overflow-hidden", className)}>
    <div
      className={cn("overflow-auto overscroll-contain", maxHeightClassName)}
      role={label ? "region" : undefined}
      aria-label={label}
      tabIndex={label ? 0 : undefined}
    >
      <table className={cn(TABLE_CLASSES.table, minWidthClassName)}>{children}</table>
    </div>
    {footer && <div className="border-t border-line px-4 py-3 sm:px-5">{footer}</div>}
  </Card>
);
