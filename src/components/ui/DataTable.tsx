import React from "react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  /**
   * Hàm trích xuất giá trị hoặc custom render cell
   */
  accessor?: (item: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
  /**
   * Ẩn cột này trên giao diện card mobile nếu cần
   */
  hideOnMobileCard?: boolean;
}

export interface DataTableProps<T> {
  /**
   * Mảng dữ liệu nguồn
   */
  data: T[];
  /**
   * Cấu hình các cột của bảng
   */
  columns: ColumnDef<T>[];
  /**
   * Hàm lấy ID duy nhất của mỗi dòng
   */
  keyExtractor: (item: T, index: number) => string | number;
  /**
   * Trạng thái đang tải dữ liệu (ưu tiên Skeleton)
   */
  loading?: boolean;
  /**
   * Số lượng dòng Skeleton giả lập khi đang tải (mặc định: 5)
   */
  loadingRowsCount?: number;
  /**
   * Giao diện hiển thị khi dữ liệu rỗng
   */
  emptyState?: React.ReactNode;
  /**
   * Callback khi người dùng nhấn vào một dòng
   */
  onRowClick?: (item: T, index: number) => void;
  /**
   * Chế độ hiển thị trên thiết bị di động (<768px):
   * 'card' (chuyển đổi thành thẻ) hoặc 'scroll' (cuộn ngang)
   */
  mobileViewMode?: "card" | "scroll";
  /**
   * Tùy biến toàn bộ giao diện thẻ mobile (nếu mobileViewMode = 'card')
   */
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

/**
 * DataTable Component (§17, §20 - 03_Component_Library & Responsive Matrix)
 * - Desktop/Tablet (≥768px): Hiển thị dạng bảng (Table) hoàn chỉnh.
 * - Mobile (<768px): Chuyển đổi linh hoạt sang Card dạng danh sách hoặc Horizontal Scroll.
 */
export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  loadingRowsCount = 5,
  emptyState,
  onRowClick,
  mobileViewMode = "card",
  renderMobileCard,
  className = "",
}: DataTableProps<T>): React.ReactElement {
  // Trạng thái Loading: Hiển thị Skeleton Rows
  if (loading) {
    return (
      <div className={`bg-white rounded-[14px] border border-[#E7E5E4] overflow-hidden ${className}`}>
        <div className="p-4 space-y-3">
          <div className="flex gap-4 pb-3 border-b border-[#E7E5E4]">
            {columns.map((col, idx) => (
              <Skeleton key={idx} width={col.width || "20%"} height={20} />
            ))}
          </div>
          {Array.from({ length: loadingRowsCount }).map((_, rIdx) => (
            <div key={rIdx} className="flex gap-4 py-2 border-b border-[#F5F5F4] last:border-none">
              {columns.map((col, cIdx) => (
                <Skeleton key={cIdx} width={col.width || "20%"} height={24} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Trạng thái Dữ liệu rỗng (Empty)
  if (!data || data.length === 0) {
    return (
      <div className={className}>
        {emptyState || (
          <EmptyState
            title="Chưa có dữ liệu"
            description="Hiện không tìm thấy bản ghi nào phù hợp với bộ lọc hiện tại."
          />
        )}
      </div>
    );
  }

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 1. DESKTOP & TABLET VIEW (≥768px) - Chuẩn Semantic Table */}
      <div className="hidden md:block bg-white rounded-[14px] border border-[#E7E5E4] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E7E5E4] text-[13px] font-semibold text-[#57534E] uppercase tracking-wider">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={`py-3.5 px-4 ${alignClasses[col.align || "left"]} ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4] text-[14px] sm:text-[15px] text-[#292524]">
              {data.map((item, rowIndex) => {
                const key = keyExtractor(item, rowIndex);
                const isClickable = Boolean(onRowClick);

                return (
                  <tr
                    key={key}
                    onClick={isClickable ? () => onRowClick?.(item, rowIndex) : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onKeyDown={
                      isClickable
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onRowClick?.(item, rowIndex);
                            }
                          }
                        : undefined
                    }
                    className={`
                      transition-colors duration-100
                      ${isClickable ? "cursor-pointer hover:bg-[#FAFAF9] active:bg-[#F5F5F4] focus-visible:ring-2 focus-visible:ring-[#B4232C]/30 outline-none" : "hover:bg-[#FAFAF9]/60"}
                    `}
                  >
                    {columns.map((col) => {
                      const cellValue = col.accessor
                        ? col.accessor(item, rowIndex)
                        : (item as Record<string, unknown>)[col.key] as React.ReactNode;

                      return (
                        <td
                          key={col.key}
                          className={`py-3.5 px-4 align-middle ${alignClasses[col.align || "left"]} ${col.className || ""}`}
                        >
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. MOBILE VIEW (<768px) */}
      <div className="block md:hidden">
        {mobileViewMode === "card" ? (
          /* Mobile Card View (Mặc định cho trải nghiệm mượt mà, không bị tràn ngang) */
          <div className="space-y-3">
            {data.map((item, index) => {
              const key = keyExtractor(item, index);
              const isClickable = Boolean(onRowClick);

              if (renderMobileCard) {
                return (
                  <div
                    key={key}
                    onClick={() => onRowClick?.(item, index)}
                    className={isClickable ? "cursor-pointer" : ""}
                  >
                    {renderMobileCard(item, index)}
                  </div>
                );
              }

              // Fallback thẻ tự động theo columns
              const primaryCol = columns[0];
              const otherCols = columns.slice(1).filter((c) => !c.hideOnMobileCard);

              return (
                <div
                  key={key}
                  onClick={isClickable ? () => onRowClick?.(item, index) : undefined}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={
                    isClickable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onRowClick?.(item, index);
                          }
                        }
                      : undefined
                  }
                  className={`
                    bg-white p-4 rounded-[12px] border border-[#E7E5E4] shadow-xs space-y-2.5 transition-colors
                    ${isClickable ? "active:scale-[0.99] active:bg-[#FAFAF9] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#B4232C]/30 outline-none" : ""}
                  `}
                >
                  {/* Dòng chính đầu tiên */}
                  {primaryCol && (
                    <div className="flex items-center justify-between font-semibold text-[15px] text-[#1C1917] pb-2 border-b border-[#F5F5F4]">
                      <span className="text-[#78716C] text-[13px] font-normal">{primaryCol.header}:</span>
                      <span>
                        {primaryCol.accessor
                          ? primaryCol.accessor(item, index)
                          : (item as Record<string, unknown>)[primaryCol.key] as React.ReactNode}
                      </span>
                    </div>
                  )}

                  {/* Các thuộc tính còn lại */}
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    {otherCols.map((col) => (
                      <div key={col.key} className="flex flex-col">
                        <span className="text-[#78716C] text-[12px]">{col.header}</span>
                        <span className="font-medium text-[#292524] mt-0.5">
                          {col.accessor
                            ? col.accessor(item, index)
                            : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Mobile Horizontal Scroll View */
          <div className="bg-white rounded-[12px] border border-[#E7E5E4] overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-[#FAFAF9] border-b border-[#E7E5E4] text-[12px] font-semibold text-[#57534E] uppercase">
                  {columns.map((col) => (
                    <th key={col.key} className="py-2.5 px-3">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F4] text-[13px]">
                {data.map((item, rowIndex) => (
                  <tr key={keyExtractor(item, rowIndex)} className="hover:bg-[#FAFAF9]">
                    {columns.map((col) => (
                      <td key={col.key} className="py-2.5 px-3 whitespace-nowrap">
                        {col.accessor
                          ? col.accessor(item, rowIndex)
                          : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
