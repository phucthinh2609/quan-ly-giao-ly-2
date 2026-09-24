import React, { useState } from "react";
import {
  Home,
  Users,
  School,
  CheckSquare,
  FileSpreadsheet,
  Bell,
  MoreHorizontal,
  Settings,
  BarChart3,
  History,
  GraduationCap,
  X,
} from "lucide-react";
import { MobileBottomNavProps, NavigationItem, UserRole } from "../../types";

// ============================================================================
// MOBILE BOTTOM NAVIGATION MAPPING (MAX 5 ITEMS) (§13)
// ============================================================================
export const MOBILE_BOTTOM_NAV_ITEMS: Record<UserRole, NavigationItem[]> = {
  ADMIN: [
    {
      id: "admin-home",
      label: "Home",
      path: "/admin/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "admin-users",
      label: "Người dùng",
      path: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "admin-classes",
      label: "Lớp học",
      path: "/admin/classes",
      icon: <School className="w-5 h-5" />,
    },
    {
      id: "admin-more",
      label: "Thêm",
      path: "#more",
      icon: <MoreHorizontal className="w-5 h-5" />,
    },
  ],

  GLV: [
    {
      id: "teacher-home",
      label: "Home",
      path: "/teacher/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "teacher-classes",
      label: "Lớp học",
      path: "/teacher/classes",
      icon: <School className="w-5 h-5" />,
    },
    {
      id: "teacher-attendance",
      label: "Điểm danh",
      path: "/teacher/attendance",
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      id: "teacher-scores",
      label: "Điểm số",
      path: "/teacher/scores",
      icon: <FileSpreadsheet className="w-5 h-5" />,
    },
  ],

  PARENT: [
    {
      id: "parent-home",
      label: "Home",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "parent-scores",
      label: "Bảng điểm",
      path: "/parent/scores",
      icon: <FileSpreadsheet className="w-5 h-5" />,
    },
    {
      id: "parent-attendance",
      label: "Điểm danh",
      path: "/parent/attendance",
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      id: "parent-notifications",
      label: "Thông báo",
      path: "/parent/notifications",
      icon: <Bell className="w-5 h-5" />,
      badge: 1,
    },
  ],

  STUDENT: [
    {
      id: "student-home",
      label: "Home",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "student-scores",
      label: "Bảng điểm",
      path: "/student/scores",
      icon: <FileSpreadsheet className="w-5 h-5" />,
    },
    {
      id: "student-attendance",
      label: "Điểm danh",
      path: "/student/attendance",
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      id: "student-notifications",
      label: "Thông báo",
      path: "/student/notifications",
      icon: <Bell className="w-5 h-5" />,
    },
  ],
};

// Admin "More" drawer extra items (§17 Wireframe)
const ADMIN_MORE_ITEMS = [
  { label: "Quản lý Học sinh", path: "/admin/students", icon: <GraduationCap className="w-5 h-5 text-[#B4232C]" /> },
  { label: "Điểm danh toàn đoàn", path: "/admin/attendance", icon: <CheckSquare className="w-5 h-5 text-[#168154]" /> },
  { label: "Bảng điểm & Thống kê", path: "/admin/scores", icon: <FileSpreadsheet className="w-5 h-5 text-[#2563EB]" /> },
  { label: "Báo cáo tổng hợp", path: "/admin/reports", icon: <BarChart3 className="w-5 h-5 text-[#7C5CFC]" /> },
  { label: "Thông báo & Tin tức", path: "/admin/notifications", icon: <Bell className="w-5 h-5 text-[#D9901A]" /> },
  { label: "Cài đặt hệ thống", path: "/admin/settings", icon: <Settings className="w-5 h-5 text-[#57534E]" /> },
  { label: "Nhật ký Activity Log", path: "/admin/activity-log", icon: <History className="w-5 h-5 text-[#78716C]" /> },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  role,
  currentPath,
  onNavigate,
  notificationCount = 0,
  onMoreClick,
  className = "",
}) => {
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);
  const items = MOBILE_BOTTOM_NAV_ITEMS[role] || [];

  const handleItemClick = (item: NavigationItem) => {
    if (item.path === "#more") {
      if (onMoreClick) {
        onMoreClick();
      } else {
        setIsMoreDrawerOpen(true);
      }
      return;
    }
    onNavigate(item.path);
  };

  return (
    <>
      <nav
        aria-label="Thanh điều hướng dưới di động"
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E5E4] shadow-lg
          pb-[max(8px,env(safe-area-inset-bottom))] pt-1 transition-all duration-200 select-none ${className}
        `}
      >
        <div className="flex items-center justify-around h-14 px-2 max-w-lg mx-auto">
          {items.map((item) => {
            const isMoreButton = item.path === "#more";
            const isActive =
              !isMoreButton &&
              (currentPath === item.path ||
                (item.path !== "/" &&
                  currentPath.startsWith(item.path) &&
                  item.path !== "/admin" &&
                  item.path !== "/teacher"));

            // Dynamic badge count for notification item
            const displayBadge =
              item.id.includes("notifications") && notificationCount > 0
                ? notificationCount
                : item.badge;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 rounded-[10px]
                  transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4232C]/30
                  ${
                    isActive
                      ? "text-[#B4232C] font-bold"
                      : "text-[#78716C] hover:text-[#1C1917] active:text-[#B4232C]"
                  }
                `}
              >
                {/* Active Indicator Top Pill / Pip (Emphasis not only relying on color) */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 w-8 h-1 bg-[#B4232C] rounded-full shadow-xs animate-in fade-in zoom-in-75 duration-150"
                  />
                )}

                {/* Icon Container with Badge & Emphasis */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`transition-transform duration-150 ${
                      isActive ? "scale-110 text-[#B4232C]" : "text-[#78716C]"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Badge */}
                  {displayBadge ? (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 bg-[#B4232C] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                    >
                      {displayBadge}
                    </span>
                  ) : null}
                </div>

                {/* Label with emphasis */}
                <span
                  className={`text-[11px] mt-0.5 tracking-tight truncate max-w-[70px] ${
                    isActive ? "font-bold text-[#B4232C]" : "font-medium text-[#78716C]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Admin "More" Action Drawer (§17) */}
      {isMoreDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Các chức năng quản trị mở rộng"
          className="fixed inset-0 z-50 md:hidden flex flex-col justify-end"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMoreDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative bg-white rounded-t-[20px] border-t border-[#E7E5E4] shadow-2xl z-10 max-h-[80vh] overflow-y-auto pb-[max(20px,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#F5F5F4] px-5 py-3 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1C1917] font-serif">
                  Chức năng mở rộng (Admin)
                </h3>
                <p className="text-[12px] text-[#78716C]">
                  Truy cập nhanh các phân hệ quản lý đoàn
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreDrawerOpen(false)}
                aria-label="Đóng bảng"
                className="w-8 h-8 rounded-full bg-[#F5F5F4] text-[#78716C] flex items-center justify-center hover:bg-[#E7E5E4] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Item list */}
            <div className="p-3 space-y-1">
              {ADMIN_MORE_ITEMS.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    setIsMoreDrawerOpen(false);
                    onNavigate(item.path);
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[12px] text-[14px] font-medium text-[#1C1917] hover:bg-[#F5F5F4] active:bg-[#E7E5E4] transition-colors cursor-pointer text-left"
                >
                  <div className="p-2 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E4]">
                    {item.icon}
                  </div>
                  <span className="flex-1 font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
