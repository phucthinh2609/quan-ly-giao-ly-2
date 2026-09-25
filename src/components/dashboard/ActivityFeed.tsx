import React from "react";
import { ArrowRight, Bell, CheckCircle2, History, PenLine, Shield, UserPlus } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconTile } from "../ui/IconTile";
import { TONE_BG, TONE_TEXT, Tone } from "../ui/tone";
import { cn } from "../../lib/cn";
import { relativeTime } from "../../lib/format";
import { SectionHeader } from "./SectionHeader";

export type ActivityType = "attendance" | "score" | "notification" | "system" | "user";

export interface ActivityItem {
  id: string;
  /**
   * Tên người thực hiện (User)
   */
  userName: string;
  /**
   * Tên Thánh (nếu có)
   */
  christianName?: string;
  /**
   * Ảnh đại diện
   */
  userAvatar?: string | null;
  /**
   * Vai trò người thực hiện (GLV, Quản trị, ...)
   */
  userRole?: string;
  /**
   * Hành động đã thực hiện (Action)
   */
  action: string;
  /**
   * Đối tượng tác động (Target - VD: Lớp 7A, Học sinh Maria Linh, Bài 15 phút)
   */
  target: string;
  /**
   * Thời gian hiển thị sẵn (VD: 10 phút trước) — dùng khi không có timestamp
   */
  time: string;
  /**
   * Thời điểm ISO (tùy chọn). Khi có, hiển thị bằng thời gian tương đối tự tính.
   */
  timestamp?: string;
  /**
   * Phân loại hành động
   */
  type?: ActivityType;
}

export interface ActivityFeedProps {
  /**
   * Danh sách các hoạt động gần đây
   */
  activities: ActivityItem[];
  /**
   * Tiêu đề khối
   */
  title?: string;
  /**
   * Mô tả ngắn dưới tiêu đề (tùy chọn)
   */
  description?: string;
  /**
   * Số lượng hiển thị tối đa
   */
  maxItems?: number;
  /**
   * Callback khi nhấn "Xem tất cả"
   */
  onViewAll?: () => void;
  /**
   * "card" (mặc định) bọc trong Card có tiêu đề; "plain" chỉ hiển thị dòng thời gian
   */
  variant?: "card" | "plain";
  /**
   * Thông điệp khi chưa có hoạt động
   */
  emptyMessage?: string;
  className?: string;
}

const TYPE_META: Record<ActivityType, { tone: Tone; label: string; icon: React.ReactNode }> = {
  attendance: { tone: "success", label: "Điểm danh", icon: <CheckCircle2 aria-hidden="true" /> },
  score: { tone: "info", label: "Điểm số", icon: <PenLine aria-hidden="true" /> },
  notification: { tone: "primary", label: "Thông báo", icon: <Bell aria-hidden="true" /> },
  user: { tone: "gold", label: "Tài khoản", icon: <UserPlus aria-hidden="true" /> },
  system: { tone: "neutral", label: "Hệ thống", icon: <Shield aria-hidden="true" /> },
};

const displayName = (item: ActivityItem) =>
  item.christianName ? `${item.christianName} ${item.userName}` : item.userName;

const timeLabel = (item: ActivityItem) => {
  if (item.timestamp) {
    const relative = relativeTime(item.timestamp);
    if (relative) return relative;
  }
  return item.time;
};

/**
 * ActivityFeed (03 §11) — dòng thời gian dọc: chấm tone + avatar + "Ai · làm gì · ở đâu" + thời gian tương đối.
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = "Hoạt động gần đây",
  description,
  maxItems = 5,
  onViewAll,
  variant = "card",
  emptyMessage = "Chưa có hoạt động nào được ghi nhận gần đây.",
  className,
}) => {
  const displayed = activities.slice(0, maxItems);

  const list =
    displayed.length === 0 ? (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
        <IconTile icon={<History />} tone="neutral" size="lg" />
        <p className="max-w-xs text-sm text-ink-3">{emptyMessage}</p>
      </div>
    ) : (
      <ol className="relative">
        {displayed.map((item) => {
          const meta = TYPE_META[item.type ?? "system"];
          return (
            <li
              key={item.id}
              className={cn(
                "relative flex gap-3 pb-5 last:pb-0",
                // Đường nối dọc của timeline: nối từ chấm này tới chấm kế tiếp
                "before:absolute before:top-0 before:bottom-0 before:left-[0.3125rem] before:w-px before:bg-line",
                "first:before:top-4 last:before:bottom-auto last:before:h-4 only:before:hidden"
              )}
            >
              <span
                aria-hidden="true"
                className={cn("relative mt-3.5 size-2.5 shrink-0 rounded-full ring-4 ring-surface", TONE_BG[meta.tone])}
              />
              <Avatar name={item.userName} src={item.userAvatar || undefined} size="sm" className="shrink-0" />
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm leading-snug text-ink-2">
                  <span className="font-semibold text-ink">{displayName(item)}</span>
                  <span aria-hidden="true" className="text-ink-3">
                    {" "}
                    ·{" "}
                  </span>
                  <span>{item.action}</span>
                  <span aria-hidden="true" className="text-ink-3">
                    {" "}
                    ·{" "}
                  </span>
                  <span className="font-medium text-ink">{item.target}</span>
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-ink-3">
                  <span className={cn("inline-flex items-center gap-1 font-medium [&_svg]:size-3.5", TONE_TEXT[meta.tone])}>
                    {meta.icon}
                    {meta.label}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={item.timestamp}>{timeLabel(item)}</time>
                  {item.userRole && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{item.userRole}</span>
                    </>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    );

  if (variant === "plain") {
    return <div className={className}>{list}</div>;
  }

  return (
    <Card padding="md" className={cn("flex flex-col gap-4", className)}>
      <SectionHeader
        title={title}
        description={description}
        icon={<History />}
        action={
          onViewAll ? (
            <Button
              variant="ghost"
              onClick={onViewAll}
              rightIcon={<ArrowRight />}
              className="-mr-3 px-3 text-primary-ink hover:text-primary-ink"
            >
              Xem tất cả
            </Button>
          ) : undefined
        }
      />
      {list}
    </Card>
  );
};
