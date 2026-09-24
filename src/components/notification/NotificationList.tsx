import React, { useState, useMemo } from "react";
import { CheckCheck, Inbox, RotateCcw } from "lucide-react";
import { NotificationData } from "../../types";
import { NotificationCard } from "./NotificationCard";
import { NotificationDetailModal } from "./NotificationDetailModal";
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

/**
 * NotificationList (§24, §30, Wireframe §11)
 *
 * Features:
 * - Sorting priority: URGENT → STUDENT → CLASS → GENERAL → SYSTEM
 * - Filter: Tất cả / Chưa đọc
 * - Action: Đánh dấu tất cả đã đọc (RULE-012: text + icon)
 * - Controls: Touch target >= 52-56px, font-size >= 18px (RULE-010)
 */
export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onSelectNotification,
  onMarkAllRead,
  onNavigateAction,
  isLoading = false,
  className = "",
}) => {
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);

  // Strictly sort by priority: URGENT -> STUDENT -> CLASS -> GENERAL -> SYSTEM
  const sortedNotifications = useMemo(() => {
    return sortNotificationsByPriority(notifications);
  }, [notifications]);

  // Apply "Tất cả" vs "Chưa đọc" filter
  const filteredList = useMemo(() => {
    if (filterMode === "UNREAD") {
      return sortedNotifications.filter((n) => !n.isRead);
    }
    return sortedNotifications;
  }, [sortedNotifications, filterMode]);

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
    <div className={`space-y-4 ${className}`}>
      {/* Controls Bar: Filter [Tất cả] [Chưa đọc] & [Đánh dấu đã đọc] */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[16px] border border-[#E7E5E4] shadow-xs">
        {/* Filter buttons - touch target >= 52px, font-size >= 18px (RULE-010) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode("ALL")}
            className={`min-h-[52px] px-5 sm:px-6 rounded-[12px] font-semibold text-[17px] sm:text-[18px] transition-all cursor-pointer flex items-center justify-center gap-2 border ${
              filterMode === "ALL"
                ? "bg-[#B4232C] text-white border-[#B4232C] shadow-xs"
                : "bg-white text-[#57534E] border-[#E7E5E4] hover:bg-[#FAFAF9]"
            }`}
          >
            <span>Tất cả</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[13px] font-bold ${
                filterMode === "ALL"
                  ? "bg-white/20 text-white"
                  : "bg-[#F5F5F4] text-[#78716C]"
              }`}
            >
              {notifications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("UNREAD")}
            className={`min-h-[52px] px-5 sm:px-6 rounded-[12px] font-semibold text-[17px] sm:text-[18px] transition-all cursor-pointer flex items-center justify-center gap-2 border ${
              filterMode === "UNREAD"
                ? "bg-[#B4232C] text-white border-[#B4232C] shadow-xs"
                : "bg-white text-[#57534E] border-[#E7E5E4] hover:bg-[#FAFAF9]"
            }`}
          >
            <span>Chưa đọc</span>
            {unreadCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[13px] font-bold ${
                  filterMode === "UNREAD"
                    ? "bg-white/20 text-white"
                    : "bg-[#FFF1F2] text-[#B4232C]"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Mark All Read Action - NO ICON ONLY (RULE-012), min-h >= 52px */}
        {unreadCount > 0 && onMarkAllRead && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="min-h-[52px] px-4 py-2 rounded-[12px] font-semibold text-[16px] sm:text-[17px] text-[#57534E] hover:text-[#B4232C] hover:bg-[#FFF1F2] border border-[#E7E5E4] hover:border-[#FECDD3] transition-colors cursor-pointer flex items-center justify-center gap-2 self-stretch sm:self-auto"
          >
            <CheckCheck className="w-5 h-5 text-[#B4232C]" />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-[14px] bg-white border border-[#E7E5E4] animate-pulse flex items-start gap-3.5 min-h-[64px]"
            >
              <div className="w-12 h-12 rounded-[12px] bg-[#E7E5E4]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#E7E5E4] rounded-md w-1/4" />
                <div className="h-5 bg-[#E7E5E4] rounded-md w-3/4" />
                <div className="h-4 bg-[#E7E5E4] rounded-md w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-[16px] border border-[#E7E5E4] p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center mx-auto text-[#A8A29E]">
            <Inbox className="w-8 h-8" />
          </div>
          <h4 className="text-[18px] font-bold text-[#1C1917] font-serif">
            {filterMode === "UNREAD"
              ? "Không có thông báo chưa đọc"
              : "Chưa có thông báo nào"}
          </h4>
          <p className="text-[15px] text-[#78716C] max-w-sm mx-auto">
            {filterMode === "UNREAD"
              ? "Quý phụ huynh đã đọc toàn bộ thông báo. Hãy chuyển sang mục 'Tất cả' để xem lại lịch sử."
              : "Các thông báo từ Ban Giáo lý và Xứ đoàn sẽ hiển thị tại đây khi có tin tức mới."}
          </p>
          {filterMode === "UNREAD" && (
            <button
              type="button"
              onClick={() => setFilterMode("ALL")}
              className="min-h-[52px] px-6 rounded-[12px] font-semibold text-[17px] text-[#B4232C] bg-[#FFF1F2] hover:bg-[#FFE4E6] transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Xem tất cả thông báo</span>
            </button>
          )}
        </div>
      ) : (
        /* Notification List */
        <div className="space-y-3">
          {filteredList.map((item) => (
            <NotificationCard
              key={item.id}
              notification={item}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Full Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        onActionClick={onNavigateAction}
      />
    </div>
  );
};
