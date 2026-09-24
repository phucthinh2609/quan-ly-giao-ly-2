import React from "react";
import { Clock, CheckCircle2, FileEdit, Bell, Shield, ArrowRight } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";

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
   * Vai trò người thực hiện (GLV, ADMIN, ...)
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
   * Thời gian thực hiện tương đối (Time - VD: 10 phút trước)
   */
  time: string;
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
   * Số lượng hiển thị tối đa
   */
  maxItems?: number;
  /**
   * Callback khi nhấn "Xem tất cả"
   */
  onViewAll?: () => void;
  className?: string;
}

const getActivityIcon = (type?: ActivityType) => {
  switch (type) {
    case "attendance":
      return <CheckCircle2 className="w-3.5 h-3.5 text-[#168154]" />;
    case "score":
      return <FileEdit className="w-3.5 h-3.5 text-[#2563EB]" />;
    case "notification":
      return <Bell className="w-3.5 h-3.5 text-[#B4232C]" />;
    case "system":
    default:
      return <Shield className="w-3.5 h-3.5 text-[#78716C]" />;
  }
};

/**
 * ActivityFeed Component (§25 03_Component_Library & Wireframe A §4–5)
 *
 * Hiển thị luồng hoạt động thời gian thực:
 * Cấu trúc bắt buộc: User + Action + Target + Time
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = "Hoạt động gần đây",
  maxItems = 5,
  onViewAll,
  className = "",
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div
      className={`bg-white rounded-[14px] border border-[#E7E5E4] p-4 sm:p-5 shadow-xs flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center text-[#78716C]">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1C1917] font-serif">
            {title}
          </h3>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[12px] font-semibold text-[#B4232C] hover:text-[#941D25] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Feed list */}
      <div className="mt-3 divide-y divide-[#F5F5F4]">
        {displayedActivities.length === 0 ? (
          <div className="py-8 text-center text-[#A8A29E] text-[13px]">
            Chưa có hoạt động nào được ghi nhận gần đây.
          </div>
        ) : (
          displayedActivities.map((item) => (
            <div
              key={item.id}
              className="py-3 first:pt-1 last:pb-1 flex items-start gap-3 transition-colors hover:bg-[#FAFAF9]/60 px-1 rounded-lg"
            >
              {/* User Avatar */}
              <div className="relative flex-shrink-0 pt-0.5">
                <Avatar
                  name={item.userName}
                  src={item.userAvatar || undefined}
                  size="sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs border border-[#E7E5E4]">
                  {getActivityIcon(item.type)}
                </div>
              </div>

              {/* Activity Details: User + Action + Target + Time */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-1 text-[13.5px] text-[#292524]">
                  <span className="font-semibold text-[#1C1917]">
                    {item.christianName ? `${item.christianName} ${item.userName}` : item.userName}
                  </span>
                  {item.userRole && (
                    <Badge variant="neutral" size="sm" className="text-[10px] px-1.5 py-0">
                      {item.userRole}
                    </Badge>
                  )}
                  <span className="text-[#57534E]">{item.action}</span>
                  <span className="font-semibold text-[#B4232C] bg-[#FFF1F2] px-1.5 py-0.2 rounded text-[12.5px] border border-[#FECDD3]/50">
                    {item.target}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11.5px] text-[#A8A29E]">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
