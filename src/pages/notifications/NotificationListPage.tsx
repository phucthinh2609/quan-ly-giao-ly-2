import React, { useEffect, useMemo, useState } from "react";
import { BellOff, CheckCheck, LayoutList, RotateCcw } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { useToast } from "../../components/ui/Toast";
import { NotificationCard } from "../../components/notification/NotificationCard";
import { NotificationCardSkeleton } from "../../components/notification/NotificationList";
import { NotificationDetailModal } from "../../components/notification/NotificationDetailModal";
import { getNotificationTypeMeta } from "../../components/notification/notificationMeta";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { notificationService } from "../../services/api";
import { sortNotificationsByPriority } from "../../services/parentMockData";
import { NotificationData, NotificationType } from "../../types";

type TypeFilter = NotificationType | "ALL";
type ReadFilter = "ALL" | "UNREAD";

/** Thứ tự chip: Khẩn → Học sinh → Lớp → Chung (04 §16). */
const TYPE_FILTERS: TypeFilter[] = ["ALL", "URGENT", "STUDENT", "CLASS", "GENERAL"];

export const NotificationListPage: React.FC = () => {
  const { user } = useAuth();
  const { query, setQueryParams, navigate } = useRouter();
  const toast = useToast();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotif, setSelectedNotif] = useState<NotificationData | null>(null);
  const [readFilter, setReadFilter] = useState<ReadFilter>("ALL");
  const [markingAll, setMarkingAll] = useState(false);

  const typeParam = (query.type as TypeFilter) || "ALL";
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
    } catch (err: unknown) {
      setError(err instanceof Error && err.message ? err.message : "Không thể tải thông báo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, typeParam, searchParam]);

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc.");
    } catch {
      toast.error("Không thể cập nhật trạng thái đã đọc.");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleSelectNotif = async (n: NotificationData) => {
    setSelectedNotif(n);
    if (!n.isRead) {
      await notificationService.markAsRead(n.id);
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)));
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Khẩn luôn ghim trên cùng, rồi Học sinh → Lớp → Chung (B-PH-04)
  const visibleNotifications = useMemo(() => {
    const sorted = sortNotificationsByPriority(notifications);
    return readFilter === "UNREAD" ? sorted.filter((n) => !n.isRead) : sorted;
  }, [notifications, readFilter]);

  const listRef = useReveal<HTMLUListElement>({ deps: [loading, typeParam, readFilter] });

  const isFiltered = typeParam !== "ALL" || readFilter === "UNREAD";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thông báo"
        description="Tin từ Ban Giáo lý, lịch sinh hoạt và nhắc nhở chuyên cần. Tin khẩn luôn nằm trên cùng."
        badge={
          loading ? undefined : unreadCount > 0 ? (
            <Badge variant="primary" size="lg" dot>
              {unreadCount} chưa đọc
            </Badge>
          ) : (
            <Badge variant="success" size="lg" icon={<CheckCheck />}>
              Đã đọc hết
            </Badge>
          )
        }
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              leftIcon={<CheckCheck />}
              loading={markingAll}
              onClick={handleMarkAllRead}
              className="h-auto min-h-(--control) py-2 whitespace-normal"
            >
              Đánh dấu đã đọc tất cả
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-3">
        <SegmentedControl<ReadFilter>
          ariaLabel="Lọc theo trạng thái đọc"
          size="lg"
          value={readFilter}
          onChange={setReadFilter}
          options={[
            { value: "ALL", label: "Tất cả" },
            { value: "UNREAD", label: unreadCount > 0 ? `Chưa đọc ${unreadCount}` : "Chưa đọc" },
          ]}
        />

        {/* Chip loại thông báo — lưu trên URL (?type=) */}
        <div role="group" aria-label="Lọc theo loại thông báo" className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((type) => {
            const active = typeParam === type;
            const meta = type === "ALL" ? null : getNotificationTypeMeta(type);
            const Icon = meta ? meta.icon : LayoutList;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => setQueryParams({ type: type === "ALL" ? undefined : type })}
                className={cn(
                  "inline-flex min-h-12 items-center gap-2 rounded-full border px-4 text-base font-semibold select-none parent:min-h-13",
                  "transition-[background-color,border-color,color,transform] duration-200 ease-out-soft active:scale-[0.97]",
                  "focus-visible:outline-3 focus-visible:outline-offset-2",
                  active
                    ? "border-night bg-night text-on-night"
                    : "border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink"
                )}
              >
                <Icon className={cn("size-5", !active && type === "URGENT" && "text-danger")} aria-hidden="true" />
                {meta ? meta.label : "Tất cả loại"}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Đang tải thông báo">
          {[0, 1, 2, 3].map((i) => (
            <NotificationCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Không thể tải thông báo" message={error} onRetry={fetchNotifs} />
      ) : visibleNotifications.length === 0 ? (
        <EmptyState
          icon={<BellOff />}
          title={isFiltered ? "Không có thông báo phù hợp" : "Chưa có thông báo nào"}
          description={
            isFiltered
              ? "Thử chọn bộ lọc khác để xem thêm thông báo."
              : "Thông báo mới từ Ban Giáo lý sẽ hiện ở đây."
          }
          action={
            isFiltered ? (
              <Button
                variant="soft"
                leftIcon={<RotateCcw />}
                onClick={() => {
                  setReadFilter("ALL");
                  if (typeParam !== "ALL") setQueryParams({ type: undefined });
                }}
              >
                Xem tất cả thông báo
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul ref={listRef} className="space-y-3" aria-label="Danh sách thông báo">
          {visibleNotifications.map((n) => (
            <li key={n.id} data-reveal>
              <NotificationCard notification={n} onClick={handleSelectNotif} />
            </li>
          ))}
        </ul>
      )}

      <NotificationDetailModal
        isOpen={Boolean(selectedNotif)}
        notification={selectedNotif}
        onClose={() => setSelectedNotif(null)}
        onActionClick={(path) => {
          setSelectedNotif(null);
          if (path) navigate(path);
        }}
      />
    </div>
  );
};
