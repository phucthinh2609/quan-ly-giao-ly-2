import React, { useId } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { AchievementBadge, AchievementBadgeProps } from "./AchievementBadge";

export interface BadgeShelfProps {
  badges: AchievementBadgeProps[];
  /** Chạm huy hiệu → mở chi tiết (BottomSheet do trang quản lý) */
  onSelect?: (id: string) => void;
  title?: string;
  /** Dòng phụ dưới tiêu đề, VD "Em có 6/12 huy hiệu" */
  subtitle?: React.ReactNode;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  /** Nội dung khi chưa có huy hiệu nào */
  emptyText?: string;
  className?: string;
}

/** BadgeShelf (03 §10) — kệ huy hiệu cuộn ngang có snap; cuộn bên trong, không làm tràn trang. */
export const BadgeShelf: React.FC<BadgeShelfProps> = ({
  badges,
  onSelect,
  title = "Huy hiệu của em",
  subtitle,
  onSeeAll,
  seeAllLabel = "Xem hết",
  emptyText = "Em chưa có huy hiệu nào. Đi học Chúa Nhật này để nhận huy hiệu đầu tiên nhé!",
  className,
}) => {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={cn("min-w-0", className)}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 id={headingId} className="text-xl font-bold tracking-tight text-ink">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-base text-ink-2">{subtitle}</p>}
        </div>
        {onSeeAll && (
          <Button
            variant="ghost"
            size="md"
            rightIcon={<ChevronRight />}
            onClick={onSeeAll}
            className="-mr-2 min-h-13 shrink-0 text-ink"
          >
            {seeAllLabel}
          </Button>
        )}
      </div>

      {badges.length === 0 ? (
        <p className="mt-4 rounded-card border border-dashed border-line-strong bg-surface-2/60 p-5 text-base text-ink-2">
          {emptyText}
        </p>
      ) : (
        <div className="relative mt-4">
          <ul
            aria-label={title}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pt-1 pb-3 [scrollbar-width:thin]"
          >
            {badges.map((badge) => (
              <li key={badge.id} className="w-28 shrink-0 snap-start sm:w-32">
                <AchievementBadge
                  {...badge}
                  size="sm"
                  className="h-full"
                  onClick={onSelect ? () => onSelect(badge.id) : badge.onClick}
                />
              </li>
            ))}
            {/* Khoảng đệm cuối để thẻ cuối không bị lớp mờ che */}
            <li aria-hidden="true" className="w-6 shrink-0" />
          </ul>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-canvas to-transparent"
          />
        </div>
      )}
    </section>
  );
};
