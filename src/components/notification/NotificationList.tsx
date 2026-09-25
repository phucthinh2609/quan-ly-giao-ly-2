import React, { useMemo, useState } from "react";
import { CheckCheck, Inbox, RotateCcw } from "lucide-react";
import { NotificationData, NotificationType } from "../../types";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { NotificationCard } from "./NotificationCard";
import { NotificationDetailModal } from "./NotificationDetailModal";
import { NOTIFICATION_TYPE_ORDER, getNotificationTypeMeta } from "./notificationMeta";
import { sortNotificationsByPriority } from "../../services/parentMockData";

export interface NotificationListProps {
  notifications: NotificationData[];
  onSelectNotification?: (item: NotificationData) => void;
  onMarkAllRead?: () => void;
  onNavigateAction?: (path?: string) => void;
  isLoading?: boolean;
  className?: string;
}

type FilterMode = "ALL" | "UNREAD";

/** Skeleton đúng hình dạng NotificationCard. */
export const NotificationCardSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div
    aria-hidden="true"
    className={cn("flex items-start gap-3 rounded-card border border-line bg-surface sm:gap-4", compact ? "p-4" : "p-4 sm:p-5")}
  >
    <Skeleton className="size-10 shrink-0 rounded-control" />
    <div className="flex-1 space-y-2.5 pt-1">
      <Skeleton className="h-4 w-1/3 rounded-full" />
      <Skeleton className="h-5 w-4/5 rounded-full" />
      {!compact && <Skeleton className="h-4 w-2/3 rounded-full" />}
    </div>
  </div>
);

/**
 * NotificationList (03 §11, 04 §16)
 * - Tab "Tất cả" / "Chưa đọc n" (SegmentedControl)
 * - Chip lọc theo loại (Khẩn · Học sinh · Lớp · Chung)
 * - Khẩn luôn ghim trên cùng: URGENT → STUDENT → CLASS → GENERAL → SYSTEM
 * - "Đánh dấu đã đọc tất cả" có icon + chữ
 */
export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onSelectNotification,
  onMarkAllRead,
  onNavigateAction,
  isLoading = false,
  className,
}) => {
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");
  const [category, setCategory] = useState<NotificationType | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);

  const sortedNotifications = useMemo(() => sortNotificationsByPriority(notifications), [notifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<NotificationType, number>();
    notifications.forEach((n) => counts.set(n.type, (counts.get(n.type) ?? 0) + 1));
    return counts;
  }, [notifications]);

  const availableCategories = NOTIFICATION_TYPE_ORDER.filter((type) => (categoryCounts.get(type) ?? 0) > 0);

  const filteredList = useMemo(
    () =>
      sortedNotifications.filter(
        (n) => (filterMode === "ALL" || !n.isRead) && (category === null || n.type === category)
      ),
    [sortedNotifications, filterMode, category]
  );

  const listRef = useReveal<HTMLUListElement>({ selector: "[data-reveal-item]", deps: [filterMode, category, isLoading] });

  const handleCardClick = (item: NotificationData) => {
    setSelectedNotification(item);
    onSelectNotification?.(item);
  };

  const isFiltered = filterMode === "UNREAD" || category !== null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tabs + đánh dấu đã đọc */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl<FilterMode>
          ariaLabel="Lọc thông báo theo trạng thái đọc"
          size="lg"
          value={filterMode}
          onChange={setFilterMode}
          className="self-start"
          options={[
            { value: "ALL", label: "Tất cả" },
            { value: "UNREAD", label: unreadCount > 0 ? `Chưa đọc ${unreadCount}` : "Chưa đọc" },
          ]}
        />

        {unreadCount > 0 && onMarkAllRead && (
          <Button
            variant="ghost"
            leftIcon={<CheckCheck />}
            onClick={onMarkAllRead}
            className="h-auto min-h-(--control) self-start py-2 whitespace-normal"
          >
            Đánh dấu đã đọc tất cả
          </Button>
        )}
      </div>

      {/* Chip loại thông báo */}
      {availableCategories.length > 1 && (
        <div role="group" aria-label="Lọc theo loại thông báo" className="flex flex-wrap gap-2">
          {availableCategories.map((type) => {
            const meta = getNotificationTypeMeta(type);
            const Icon = meta.icon;
            const active = category === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(active ? null : type)}
                className={cn(
                  "inline-flex min-h-13 items-center gap-2 rounded-full border px-4 text-base font-semibold select-none",
                  "transition-[background-color,border-color,color,transform] duration-200 ease-out-soft active:scale-[0.97]",
                  "focus-visible:outline-3 focus-visible:outline-offset-2",
                  active
                    ? "border-night bg-night text-on-night"
                    : "border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink"
                )}
              >
                <Icon className={cn("size-5", !active && type === "URGENT" && "text-danger")} aria-hidden="true" />
                <span>{meta.label}</span>
                <span className={cn("tabular-nums", active ? "text-on-night/70" : "text-ink-3")}>
                  {categoryCounts.get(type)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Danh sách */}
      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Đang tải thông báo">
          {[0, 1, 2].map((i) => (
            <NotificationCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <EmptyState
          icon={<Inbox />}
          title={isFiltered ? "Không có thông báo phù hợp" : "Chưa có thông báo nào"}
          description={
            isFiltered
              ? filterMode === "UNREAD" && category === null
                ? "Bạn đã đọc hết thông báo."
                : "Thử chọn bộ lọc khác để xem thêm."
              : "Thông báo từ Ban Giáo lý và lớp học sẽ hiện ở đây."
          }
          action={
            isFiltered ? (
              <Button
                variant="soft"
                leftIcon={<RotateCcw />}
                onClick={() => {
                  setFilterMode("ALL");
                  setCategory(null);
                }}
              >
                Xem tất cả thông báo
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul ref={listRef} className="space-y-3" aria-label="Danh sách thông báo">
          {filteredList.map((item) => (
            <li key={item.id} data-reveal-item>
              <NotificationCard notification={item} onClick={handleCardClick} />
            </li>
          ))}
        </ul>
      )}

      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        onActionClick={onNavigateAction}
      />
    </div>
  );
};
