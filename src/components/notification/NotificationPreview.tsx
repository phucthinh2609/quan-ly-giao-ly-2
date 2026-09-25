import React, { useId, useMemo, useState } from "react";
import { ArrowRight, BellOff } from "lucide-react";
import { NotificationData } from "../../types";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { IconTile } from "../ui/IconTile";
import { NotificationCard } from "./NotificationCard";
import { NotificationCardSkeleton } from "./NotificationList";
import { NotificationDetailModal } from "./NotificationDetailModal";
import { sortNotificationsByPriority } from "../../services/parentMockData";

export interface NotificationPreviewProps {
  notifications: NotificationData[];
  onViewAll?: () => void;
  onSelectNotification?: (item: NotificationData) => void;
  isLoading?: boolean;
  className?: string;
  /** Tiêu đề khối (mặc định "Thông báo mới") */
  title?: string;
  /** Số thông báo hiển thị (mặc định 3) */
  limit?: number;
  /** Hành động liên quan trong chi tiết; không truyền → mở "Xem tất cả" */
  onNavigateAction?: (path?: string) => void;
}

/**
 * NotificationPreview (03 §11) — danh sách gọn các thông báo ưu tiên cao nhất
 * (Khẩn ghim đầu) + nút "Xem tất cả".
 */
export const NotificationPreview: React.FC<NotificationPreviewProps> = ({
  notifications,
  onViewAll,
  onSelectNotification,
  isLoading = false,
  className,
  title = "Thông báo mới",
  limit = 3,
  onNavigateAction,
}) => {
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);

  const topNotifications = useMemo(
    () => sortNotificationsByPriority(notifications).slice(0, limit),
    [notifications, limit]
  );

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const handleCardClick = (item: NotificationData) => {
    setSelectedNotification(item);
    onSelectNotification?.(item);
  };

  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <h2 id={headingId} className="text-xl font-semibold tracking-tight text-ink">
            {title}
          </h2>
          <p className="text-sm text-ink-2">
            {isLoading
              ? "Đang tải thông báo"
              : unreadCount > 0
              ? `${unreadCount} thông báo chưa đọc`
              : "Bạn đã đọc hết thông báo"}
          </p>
        </div>

        {onViewAll && (
          <Button variant="ghost" rightIcon={<ArrowRight />} onClick={onViewAll} className="-mr-3">
            Xem tất cả
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2.5" role="status" aria-label="Đang tải thông báo">
          {[0, 1].map((i) => (
            <NotificationCardSkeleton key={i} compact />
          ))}
        </div>
      ) : topNotifications.length === 0 ? (
        <div className="flex items-center gap-3 rounded-card border border-line bg-surface p-4">
          <IconTile icon={<BellOff />} tone="neutral" size="md" />
          <p className="text-base text-ink-2">Chưa có thông báo nào.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {topNotifications.map((item) => (
            <li key={item.id}>
              <NotificationCard notification={item} compact onClick={handleCardClick} />
            </li>
          ))}
        </ul>
      )}

      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        onActionClick={(path) => {
          if (onNavigateAction) onNavigateAction(path);
          else onViewAll?.();
        }}
      />
    </section>
  );
};
