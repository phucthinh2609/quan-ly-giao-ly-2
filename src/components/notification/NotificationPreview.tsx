import React, { useState, useMemo } from "react";
import { Bell, ArrowRight } from "lucide-react";
import { NotificationData } from "../../types";
import { NotificationCard } from "./NotificationCard";
import { NotificationDetailModal } from "./NotificationDetailModal";
import { sortNotificationsByPriority } from "../../services/parentMockData";

export interface NotificationPreviewProps {
  notifications: NotificationData[];
  onViewAll?: () => void;
  onSelectNotification?: (item: NotificationData) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * NotificationPreview (§24, §30 ParentDashboard, Wireframe §11)
 *
 * Hiển thị 2-3 thông báo nổi bật ưu tiên cao nhất:
 * URGENT → STUDENT → CLASS → GENERAL
 */
export const NotificationPreview: React.FC<NotificationPreviewProps> = ({
  notifications,
  onViewAll,
  onSelectNotification,
  isLoading = false,
  className = "",
}) => {
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);

  const topNotifications = useMemo(() => {
    const sorted = sortNotificationsByPriority(notifications);
    return sorted.slice(0, 3);
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const handleCardClick = (item: NotificationData) => {
    setSelectedNotification(item);
    if (onSelectNotification) {
      onSelectNotification(item);
    }
  };

  return (
    <section aria-labelledby="notification-preview-heading" className={`space-y-3 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[10px] bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#B4232C]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3
              id="notification-preview-heading"
              className="text-[19px] sm:text-[20px] font-bold text-[#1C1917] font-serif"
            >
              Thông báo mới
            </h3>
            <p className="text-[13px] text-[#78716C]">
              {unreadCount > 0
                ? `Có ${unreadCount} thông báo chưa đọc`
                : "Tất cả thông báo đã xem"}
            </p>
          </div>
        </div>

        {/* View all button - RULE-010: touch target >= 52px, RULE-012: text + icon */}
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="min-h-[52px] px-4 py-2 text-[16px] sm:text-[17px] font-bold text-[#B4232C] hover:text-[#9B1C24] hover:bg-[#FFF1F2] rounded-[12px] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Cards List or Skeleton */}
      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-[14px] bg-white border border-[#E7E5E4] animate-pulse flex items-center gap-3 min-h-[56px]"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#E7E5E4]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-[#E7E5E4] rounded-md w-1/3" />
                <div className="h-4 bg-[#E7E5E4] rounded-md w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : topNotifications.length === 0 ? (
        <div className="p-5 text-center bg-white rounded-[14px] border border-[#E7E5E4] text-[#78716C] text-[15px]">
          Chưa có thông báo nào dành cho học sinh.
        </div>
      ) : (
        <div className="space-y-2.5">
          {topNotifications.map((item) => (
            <NotificationCard
              key={item.id}
              notification={item}
              compact
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        onActionClick={() => {
          if (onViewAll) onViewAll();
        }}
      />
    </section>
  );
};
