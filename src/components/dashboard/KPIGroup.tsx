import React from "react";
import { StatCard, StatCardProps } from "../ui/StatCard";
import { cn } from "../../lib/cn";

export interface KPIGroupProps {
  /**
   * Danh sách các chỉ số KPI cần hiển thị dưới dạng StatCard
   */
  items?: StatCardProps[];
  /**
   * Cho phép truyền trực tiếp các con (custom StatCard elements)
   */
  children?: React.ReactNode;
  /**
   * Tiêu đề nhóm chỉ số (tuỳ chọn)
   */
  title?: string;
  className?: string;
}

/**
 * KPIGroup (03 §11) — lưới KPI 2 cột trên mobile/tablet, 4 cột trên desktop.
 * Mỗi ô có `data-reveal` để xuất hiện theo nhịp khi trang cha dùng useReveal.
 */
export const KPIGroup: React.FC<KPIGroupProps> = ({ items, children, title, className }) => {
  return (
    <section aria-label={title || "Chỉ số hoạt động chính"} className={cn("space-y-3", className)}>
      {title && <h2 className="text-sm font-semibold text-ink-2">{title}</h2>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items
          ? items.map((item, idx) => (
              <div key={idx} data-reveal className="min-w-0">
                <StatCard {...item} className={cn("h-full", item.className)} />
              </div>
            ))
          : children}
      </div>
    </section>
  );
};
