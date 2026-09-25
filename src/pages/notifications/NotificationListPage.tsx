import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { NotificationDetailModal } from "../../components/notification/NotificationDetailModal";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { notificationService } from "../../services/api";
import { NotificationData, NotificationType } from "../../types";

export const NotificationListPage: React.FC = () => {
  const { user } = useAuth();
  const { query, setQueryParams, navigate } = useRouter();
  const toast = useToast();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotif, setSelectedNotif] = useState<NotificationData | null>(null);

  const typeParam = (query.type as NotificationType | "ALL") || "ALL";
  const searchParam = query.search || "";

  const fetchNotifs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications(user, {
        type: typeParam,
        search: searchParam,
      });
      setNotifications(res);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông báo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [user, typeParam, searchParam]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc.");
    } catch {
      toast.error("Không thể cập nhật trạng thái đã đọc.");
    }
  };

  const handleSelectNotif = async (n: NotificationData) => {
    setSelectedNotif(n);
    if (!n.isRead) {
      await notificationService.markAsRead(n.id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Thông Báo Xứ Đoàn"
        description="Tin tức, sinh hoạt giáo lý, nhắc nhở chuyên cần và thông báo khẩn cấp từ Ban Điều Hành"
        badge={
          unreadCount > 0 ? (
            <Badge variant="primary" dot>
              {unreadCount} chưa đọc
            </Badge>
          ) : (
            <Badge variant="success">Tất cả đã đọc</Badge>
          )
        }
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-4 h-4" />}
              onClick={handleMarkAllRead}
            >
              Đánh dấu đã đọc tất cả
            </Button>
          ) : undefined
        }
      />

      {/* Filter Tabs (§11 Notification priority: URGENT → STUDENT → CLASS → GENERAL) */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 rounded-[14px] border border-[#E7E5E4] shadow-xs overflow-x-auto">
        {[
          { id: "ALL", label: "Tất cả thông báo" },
          { id: "URGENT", label: "🚨 Khẩn cấp" },
          { id: "STUDENT", label: "👦 Học sinh" },
          { id: "CLASS", label: "🏫 Lớp học" },
          { id: "GENERAL", label: "📢 Chung đoàn" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setQueryParams({ type: tab.id === "ALL" ? undefined : tab.id })}
            className={`px-3.5 py-2 text-[13px] font-semibold rounded-[10px] transition-colors cursor-pointer whitespace-nowrap ${
              typeParam === tab.id
                ? "bg-[#B4232C] text-white shadow-xs"
                : "text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1C1917]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-[14px] border border-[#E7E5E4] space-y-2">
              <Skeleton className="h-5 w-1/3 rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Không thể tải thông báo"
          message={error}
          onRetry={fetchNotifs}
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-12 h-12 text-[#A8A29E]" />}
          title="Không có thông báo nào"
          description="Hiện tại không có thông báo nào trong danh mục đã chọn."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleSelectNotif(n)}
              className={`p-4 rounded-[14px] border transition-all cursor-pointer hover:shadow-xs ${
                !n.isRead
                  ? "bg-white border-[#FECDD3] shadow-xs"
                  : "bg-white/80 border-[#E7E5E4] opacity-90"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="mt-0.5">
                    {n.type === "URGENT" ? (
                      <span className="w-8 h-8 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center font-bold text-[14px] border border-[#FECDD3]">
                        !
                      </span>
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-[#FFF1F2] text-[#B4232C] flex items-center justify-center font-bold text-[14px]">
                        🔔
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-[15px] font-bold truncate ${
                          !n.isRead ? "text-[#1C1917]" : "text-[#57534E]"
                        }`}
                      >
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#B4232C] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[13px] text-[#78716C] mt-1 line-clamp-2">
                      {n.preview || n.content}
                    </p>
                    <div className="text-[11px] text-[#A8A29E] mt-2 flex items-center gap-2">
                      <span>{n.timestamp}</span>
                      {n.className && <span>· {n.className}</span>}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Chi tiết →
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedNotif && (
        <NotificationDetailModal
          isOpen={Boolean(selectedNotif)}
          notification={selectedNotif}
          onClose={() => setSelectedNotif(null)}
          onActionClick={(path) => {
            setSelectedNotif(null);
            if (path) navigate(path);
          }}
        />
      )}
    </div>
  );
};
