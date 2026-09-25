import React from "react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { cn } from "../../lib/cn";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  /** Trích xuất giá trị hoặc render cell tùy biến */
  accessor?: (item: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
  /** Ẩn cột này trên thẻ mobile */
  hideOnMobileCard?: boolean;
}

export interface DataTableProps<T> {
  /** Dữ liệu nguồn */
  data: T[];
  /** Cấu hình cột */
  columns: ColumnDef<T>[];
  /** Lấy khóa duy nhất cho mỗi dòng */
  keyExtractor: (item: T, index: number) => string | number;
  /** Đang tải (Skeleton) */
  loading?: boolean;
  /** Số dòng Skeleton khi đang tải (mặc định 5) */
  loadingRowsCount?: number;
  /** Giao diện khi rỗng */
  emptyState?: React.ReactNode;
  /** Nhấn vào một dòng */
  onRowClick?: (item: T, index: number) => void;
  /**
   * Chế độ trên mobile (< 768px): 'card' (danh sách thẻ) hoặc 'scroll' (cuộn ngang)
   */
  mobileViewMode?: "card" | "scroll";
  /** Tùy biến toàn bộ thẻ mobile (khi mobileViewMode = 'card') */
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  className?: string;
  /**
   * Giới hạn chiều cao vùng bảng (VD "max-h-[70dvh]") để cuộn dọc bên trong với header dính.
   * Không truyền: bảng cao theo nội dung.
   */
  maxHeight?: string;
  /** Chú thích bảng cho trình đọc màn hình */
  caption?: string;
}

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function getCellValue<T>(col: ColumnDef<T>, item: T, index: number): React.ReactNode {
  return col.accessor ? col.accessor(item, index) : ((item as Record<string, unknown>)[col.key] as React.ReactNode);
}

/**
 * DataTable (03 §5, 04 §20)
 * - >= md: bảng với header dính (bg-surface-2), hàng hover, đường chia border-line.
 * - < md: danh sách thẻ (mặc định) hoặc cuộn ngang.
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
  maxHeight,
  caption,
}: DataTableProps<T>): React.ReactElement {
  if (loading) {
    return (
      <div
        aria-busy="true"
        className={cn("overflow-hidden rounded-card border border-line bg-surface shadow-card", className)}
      >
        <div className="flex gap-4 border-b border-line bg-surface-2 px-4 py-3.5">
          {columns.map((col, idx) => (
            <Skeleton key={idx} width={col.width || "20%"} height={14} />
          ))}
        </div>
        <div className="divide-y divide-line">
          {Array.from({ length: loadingRowsCount }).map((_, rIdx) => (
            <div key={rIdx} className="flex gap-4 px-4 py-4">
              {columns.map((col, cIdx) => (
                <Skeleton key={cIdx} width={col.width || "20%"} height={18} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={className}>
        {emptyState || (
          <EmptyState
            title="Chưa có dữ liệu"
            description="Không tìm thấy bản ghi nào phù hợp với bộ lọc hiện tại."
          />
        )}
      </div>
    );
  }

  const isClickable = Boolean(onRowClick);

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLElement>, item: T, index: number) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick?.(item, index);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* >= md: bảng */}
      <div className="hidden overflow-hidden rounded-card border border-line bg-surface shadow-card md:block">
        <div className={cn("overflow-x-auto", maxHeight && cn("overflow-y-auto overscroll-contain", maxHeight))}>
          <table className="w-full border-collapse text-left">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={cn(
                      "sticky top-0 z-10 border-b border-line bg-surface-2 px-4 py-3 text-sm font-semibold whitespace-nowrap text-ink-2",
                      alignClasses[col.align || "left"],
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm text-ink">
              {data.map((item, rowIndex) => (
                <tr
                  key={keyExtractor(item, rowIndex)}
                  onClick={isClickable ? () => onRowClick?.(item, rowIndex) : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={isClickable ? (e) => handleRowKeyDown(e, item, rowIndex) : undefined}
                  className={cn(
                    "transition-colors duration-100 hover:bg-surface-2/60",
                    isClickable &&
                      "cursor-pointer outline-none active:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-primary/50"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3.5 align-middle", alignClasses[col.align || "left"], col.className)}
                    >
                      {getCellValue(col, item, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* < md */}
      <div className="block md:hidden">
        {mobileViewMode === "card" ? (
          <div className="space-y-3">
            {data.map((item, index) => {
              const key = keyExtractor(item, index);

              if (renderMobileCard) {
                return (
                  <div
                    key={key}
                    onClick={isClickable ? () => onRowClick?.(item, index) : undefined}
                    className={isClickable ? "cursor-pointer" : undefined}
                  >
                    {renderMobileCard(item, index)}
                  </div>
                );
              }

              // Thẻ tự động theo columns: cột đầu làm tiêu đề, các cột còn lại dạng lưới
              const primaryCol = columns[0];
              const otherCols = columns.slice(1).filter((c) => !c.hideOnMobileCard);

              return (
                <div
                  key={key}
                  onClick={isClickable ? () => onRowClick?.(item, index) : undefined}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={isClickable ? (e) => handleRowKeyDown(e, item, index) : undefined}
                  className={cn(
                    "rounded-card border border-line bg-surface p-4 shadow-xs",
                    isClickable &&
                      "cursor-pointer transition-[transform,background-color] duration-150 ease-out-soft active:scale-[0.99] active:bg-surface-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
                  )}
                >
                  {primaryCol && (
                    <div className="border-b border-line pb-3">
                      <span className="sr-only">{primaryCol.header}: </span>
                      <div className="text-base font-semibold text-ink">{getCellValue(primaryCol, item, index)}</div>
                    </div>
                  )}

                  {otherCols.length > 0 && (
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3">
                      {otherCols.map((col) => (
                        <div key={col.key} className="flex min-w-0 flex-col">
                          <dt className="text-sm text-ink-3">{col.header}</dt>
                          <dd className="mt-0.5 text-sm font-medium break-words text-ink">
                            {getCellValue(col, item, index)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-xs">
            <table className="w-full min-w-lg border-collapse text-left">
              {caption && <caption className="sr-only">{caption}</caption>}
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-ink-2"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm text-ink">
                {data.map((item, rowIndex) => (
                  <tr
                    key={keyExtractor(item, rowIndex)}
                    onClick={isClickable ? () => onRowClick?.(item, rowIndex) : undefined}
                    className={cn("hover:bg-surface-2/60", isClickable && "cursor-pointer active:bg-surface-2")}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-3 py-3 whitespace-nowrap">
                        {getCellValue(col, item, rowIndex)}
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
