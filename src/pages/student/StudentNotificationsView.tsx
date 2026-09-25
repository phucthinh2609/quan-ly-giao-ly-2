import React, { useState } from "react";
import { Bell, BellOff, CheckCheck, ChevronRight, MailOpen } from "lucide-react";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { relativeTime } from "../../lib/format";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { IconTile } from "../../components/ui/IconTile";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { EmptyState } from "../../components/ui/EmptyState";
import type { StudentNotification } from "../../services/studentPortalMockData";
import { StudentViewHeader } from "./StudentViewHeader";
import { renderKidIcon } from "./kidIcons";

type NotificationFilter = "ALL" | "UNREAD";

export interface StudentNotificationsViewProps {
  notifications: StudentNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (path: string) => void;
  className?: string;
}

/** Thông báo cho học sinh: danh sách thân thiện, chạm để đọc. */
export const StudentNotificationsView: React.FC<StudentNotificationsViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
  className,
}) => {
  const [filter, setFilter] = useState<NotificationFilter>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  // Tin vừa mở vẫn ở lại danh sách "Chưa đọc" để em đọc tiếp, không biến mất đột ngột.
  const visible =
    filter === "UNREAD" ? notifications.filter((n) => !n.read || n.id === expandedId) : notifications;

  const pageRef = useReveal<HTMLDivElement>();
  const listRef = useReveal<HTMLUListElement>({ selector: "[data-reveal-item]", deps: [filter] });

  const handleOpen = (item: StudentNotification) => {
    if (!item.read) onMarkRead(item.id);
    if (item.link) {
      onNavigate(item.link);
      return;
    }
    setExpandedId((current) => (current === item.id ? null : item.id));
  };

  return (
    <div ref={pageRef} className={cn("space-y-8", className)}>
      <StudentViewHeader
        title="Thông báo"
        subtitle={unreadCount > 0 ? `Em có ${unreadCount} tin mới` : "Em đã đọc hết tin rồi"}
        icon={<Bell />}
        tone="sky"
        aside={
          unreadCount > 0 ? (
            <Button variant="soft" size="md" leftIcon={<CheckCheck />} onClick={onMarkAllRead} className="min-h-13">
              Đã đọc hết
            </Button>
          ) : undefined
        }
      />

      <div data-reveal>
        <SegmentedControl<NotificationFilter>
          ariaLabel="Lọc thông báo"
          value={filter}
          onChange={setFilter}
          size="lg"
          fullWidth
          className="max-w-md [&_button]:px-2 sm:[&_button]:px-4"
          options={[
            { value: "ALL", label: "Tất cả" },
            { value: "UNREAD", label: "Chưa đọc" },
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={filter === "UNREAD" ? <MailOpen /> : <BellOff />}
          title={filter === "UNREAD" ? "Em đã đọc hết tin rồi!" : "Chưa có thông báo nào"}
          description={
            filter === "UNREAD"
              ? "Giỏi lắm! Khi có tin mới, em sẽ thấy ở đây nhé."
              : "Khi GLV gửi tin mới, em sẽ thấy ở đây nhé!"
          }
        />
      ) : (
        <ul ref={listRef} className="space-y-3">
          {visible.map((item) => {
            const expanded = expandedId === item.id;
            return (
              <li key={item.id} data-reveal-item>
                <Card
                  interactive
                  padding="md"
                  onClick={() => handleOpen(item)}
                  aria-expanded={item.link ? undefined : expanded}
                  className={cn("min-h-13", !item.read && "border-primary/30 bg-primary-soft/50")}
                >
                  <div className="flex gap-4">
                    <IconTile icon={renderKidIcon(item.icon)} tone={item.tone} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className={cn(
                            "text-base leading-snug text-ink sm:text-lg",
                            item.read ? "font-semibold" : "font-bold"
                          )}
                        >
                          {item.title}
                        </p>
                        {!item.read && (
                          <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-primary px-2.5 text-xs font-bold text-on-primary">
                            <span className="size-1.5 rounded-full bg-on-primary" aria-hidden="true" />
                            Mới
                          </span>
                        )}
                      </div>
                      <p className={cn("mt-1 text-base text-ink-2", !expanded && "line-clamp-2")}>{item.body}</p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-ink-3">{relativeTime(item.createdAt)}</span>
                        {item.link && item.linkLabel && (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-ink">
                            {item.linkLabel}
                            <ChevronRight className="size-4" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
