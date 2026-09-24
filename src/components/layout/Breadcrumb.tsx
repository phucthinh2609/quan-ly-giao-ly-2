import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "../../types";

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
  onItemClick?: (item: BreadcrumbItem) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHomeIcon = true,
  className = "",
  onItemClick,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Đường dẫn trang (Breadcrumb)"
      className={`flex items-center space-x-1.5 text-[13px] text-[#78716C] overflow-x-auto py-1 no-scrollbar ${className}`}
    >
      <ol className="flex items-center space-x-1.5 flex-nowrap whitespace-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center space-x-1.5">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-[#A8A29E] flex-shrink-0 select-none"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-[#1C1917] select-none truncate max-w-[200px] sm:max-w-xs"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    if (onItemClick) onItemClick(item);
                  }}
                  className="inline-flex items-center gap-1 text-[#78716C] hover:text-[#B4232C] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4232C]/30 rounded px-1 py-0.5 transition-colors cursor-pointer"
                >
                  {isFirst && showHomeIcon && (
                    <Home className="w-3.5 h-3.5 flex-shrink-0 text-[#78716C]" aria-hidden="true" />
                  )}
                  <span className="truncate max-w-[120px] sm:max-w-[180px]">{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
