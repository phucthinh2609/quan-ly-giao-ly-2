import React from "react";
import { StatCard, StatCardProps } from "../ui/StatCard";

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
 * KPIGroup Component (§25 03_Component_Library & Wireframe A §4–5)
 *
 * Ràng buộc:
 * - Mobile 1 cột (grid-cols-1)
 * - Tablet 2 cột (md:grid-cols-2)
 * - Desktop 4 cột (lg:grid-cols-4 hoặc xl:grid-cols-4)
 */
export const KPIGroup: React.FC<KPIGroupProps> = ({
  items,
  children,
  title,
  className = "",
}) => {
  return (
    <section aria-label={title || "Chỉ số hoạt động chính"} className={`space-y-2.5 ${className}`}>
      {title && (
        <h3 className="text-[13px] font-semibold tracking-wider uppercase text-[#78716C]">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {items
          ? items.map((item, idx) => (
              <StatCard key={idx} {...item} />
            ))
          : children}
      </div>
    </section>
  );
};
