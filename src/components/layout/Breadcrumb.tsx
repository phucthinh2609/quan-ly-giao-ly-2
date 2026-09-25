import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "../../types";
import { cn } from "../../lib/cn";

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
  onItemClick?: (item: BreadcrumbItem) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, showHomeIcon = true, className = "", onItemClick }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Đường dẫn trang" className={cn("no-scrollbar overflow-x-auto", className)}>
      <ol className="flex flex-nowrap items-center gap-1 text-sm whitespace-nowrap text-ink-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-3.5 shrink-0 text-line-strong" aria-hidden="true" />}

              {isLast ? (
                <span aria-current="page" className="max-w-56 truncate font-medium text-ink" title={item.label}>
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    item.onClick?.();
                    onItemClick?.(item);
                  }}
                  className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {isFirst && showHomeIcon && <Home className="size-3.5 shrink-0" aria-hidden="true" />}
                  <span className="max-w-44 truncate">{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
