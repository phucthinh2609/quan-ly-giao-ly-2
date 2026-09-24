import React from "react";
import {
  Home,
  Users,
  School,
  ClipboardList,
  CheckSquare,
  FileSpreadsheet,
  BarChart3,
  Bell,
  Settings,
  History,
  Award,
  ChevronRight,
  X,
  GraduationCap,
} from "lucide-react";
import { SidebarProps, NavigationItem, UserRole } from "../../types";
import { KitoVuaLogo } from "../ui";

// ============================================================================
// NAVIGATION CONFIGURATION BY ROLE (§3, §4, §5)
// ============================================================================
export const ROLE_NAVIGATION: Record<UserRole, NavigationItem[]> = {
  ADMIN: [
    {
      id: "admin-dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <Home className="w-5 h-5" />,
      section: "TỔNG QUAN",
    },
    // Section: QUẢN LÝ
    {
      id: "admin-users",
      label: "Người dùng",
      path: "/admin/users",
      icon: <Users className="w-5 h-5" />,
      section: "QUẢN LÝ",
    },
    {
      id: "admin-classes",
      label: "Lớp học",
      path: "/admin/classes",
      icon: <School className="w-5 h-5" />,
      section: "QUẢN LÝ",
    },
    {
      id: "admin-students",
      label: "Học sinh",
      path: "/admin/students",
      icon: <GraduationCap className="w-5 h-5" />,
      section: "QUẢN LÝ",
    },
    // Section: HỌC TẬP
    {
      id: "admin-attendance",
      label: "Điểm danh",
      path: "/admin/attendance",
      icon: <CheckSquare className="w-5 h-5" />,
      section: "HỌC TẬP",
    },
    {
      id: "admin-scores",
      label: "Bảng điểm",
      path: "/admin/scores",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      section: "HỌC TẬP",
    },
    {
      id: "admin-reports",
      label: "Báo cáo",
      path: "/admin/reports",
      icon: <BarChart3 className="w-5 h-5" />,
      section: "HỌC TẬP",
    },
    // Section: TRUYỀN THÔNG
    {
      id: "admin-notifications",
      label: "Thông báo",
      path: "/admin/notifications",
      icon: <Bell className="w-5 h-5" />,
      badge: "3",
      section: "TRUYỀN THÔNG",
    },
    // Section: HỆ THỐNG
    {
      id: "admin-settings",
      label: "Cài đặt hệ thống",
      path: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
      section: "HỆ THỐNG",
    },
    {
      id: "admin-activity-log",
      label: "Activity Log",
      path: "/admin/activity-log",
      icon: <History className="w-5 h-5" />,
      section: "HỆ THỐNG",
    },
  ],

  GLV: [
    {
      id: "teacher-dashboard",
      label: "Trang chủ",
      path: "/teacher/dashboard",
      icon: <Home className="w-5 h-5" />,
      section: "TỔNG QUAN",
    },
    {
      id: "teacher-classes",
      label: "Lớp của tôi",
      path: "/teacher/classes",
      icon: <School className="w-5 h-5" />,
      section: "LỚP HỌC",
    },
    {
      id: "teacher-attendance",
      label: "Điểm danh hôm nay",
      path: "/teacher/attendance",
      icon: <CheckSquare className="w-5 h-5" />,
      section: "HỌC TẬP",
    },
    {
      id: "teacher-scores",
      label: "Nhập điểm",
      path: "/teacher/scores",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      section: "HỌC TẬP",
    },
    {
      id: "teacher-students",
      label: "Danh sách học sinh",
      path: "/teacher/students",
      icon: <ClipboardList className="w-5 h-5" />,
      section: "HỌC TẬP",
    },
    {
      id: "teacher-notifications",
      label: "Thông báo",
      path: "/teacher/notifications",
      icon: <Bell className="w-5 h-5" />,
      badge: "2",
      section: "TRUYỀN THÔNG",
    },
  ],

  PARENT: [
    {
      id: "parent-dashboard",
      label: "Trang chủ",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      section: "TỔNG QUAN",
    },
    {
      id: "parent-scores",
      label: "Bảng điểm con",
      path: "/parent/scores",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      section: "KẾT QUẢ HỌC TẬP",
    },
    {
      id: "parent-attendance",
      label: "Lịch sử điểm danh",
      path: "/parent/attendance",
      icon: <CheckSquare className="w-5 h-5" />,
      section: "KẾT QUẢ HỌC TẬP",
    },
    {
      id: "parent-notifications",
      label: "Thông báo giáo xứ",
      path: "/parent/notifications",
      icon: <Bell className="w-5 h-5" />,
      badge: "1",
      section: "TIN TỨC",
    },
    {
      id: "parent-achievements",
      label: "Huy hiệu & Thành tích",
      path: "/parent/achievements",
      icon: <Award className="w-5 h-5" />,
      section: "THÀNH TÍCH",
    },
  ],

  STUDENT: [
    {
      id: "student-dashboard",
      label: "Trang chủ",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      section: "TỔNG QUAN",
    },
    {
      id: "student-scores",
      label: "Bảng điểm của tôi",
      path: "/student/scores",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      section: "HỌC TẬP",
    },
    {
      id: "student-attendance",
      label: "Chuyên cần",
      path: "/student/attendance",
      icon: <CheckSquare className="w-5 h-5" />,
      section: "HỌC TẬP",
    },
    {
      id: "student-achievements",
      label: "Gia tài thành tích",
      path: "/student/achievements",
      icon: <Award className="w-5 h-5" />,
      section: "THÀNH TÍCH",
    },
    {
      id: "student-notifications",
      label: "Thông báo",
      path: "/student/notifications",
      icon: <Bell className="w-5 h-5" />,
      section: "TIN TỨC",
    },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentPath,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  user,
  className = "",
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const items = ROLE_NAVIGATION[role] || [];

  // Group items by section
  const sections = React.useMemo(() => {
    const map = new Map<string, NavigationItem[]>();
    for (const item of items) {
      const sec = item.section || "CHUNG";
      if (!map.has(sec)) {
        map.set(sec, []);
      }
      map.get(sec)!.push(item);
    }
    return Array.from(map.entries());
  }, [items]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E7E5E4] select-none">
      {/* Brand Header */}
      <div className="relative h-16 px-4 flex items-center border-b border-[#E7E5E4] bg-white transition-colors duration-300">
        <div
          className="flex items-center overflow-hidden cursor-pointer flex-1 min-w-0"
          onClick={collapsed ? onToggleCollapse : undefined}
          title={collapsed ? "Nhấn để mở rộng thanh điều hướng" : undefined}
        >
          <KitoVuaLogo
            size={40}
            showText={!collapsed}
            subtitle="Gx. Đức Mẹ Hằng Cứu Giúp"
          />
        </div>

        {/* Mobile close button */}
        {isOpenOnMobile && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Đóng thanh điều hướng"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-[8px] text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F5F4] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop collapse toggle */}
        {!isOpenOnMobile && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            className={`
              hidden md:flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out
              ${
                collapsed
                  ? "absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white border border-[#D6D3D1] shadow-xs text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F5F4] hover:border-[#A8A29E] hover:scale-110 active:scale-95"
                  : "w-8 h-8 rounded-[8px] text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F5F4]"
              }
            `}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                collapsed ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        )}
      </div>

      {/* Navigation Items grouped by section */}
      <nav
        aria-label="Thanh điều hướng chính"
        className="flex-1 overflow-y-auto py-4 px-3 space-y-6 no-scrollbar"
      >
        {sections.map(([sectionName, sectionItems]) => (
          <div key={sectionName} className="space-y-1">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                collapsed ? "max-h-0 opacity-0 pb-0" : "max-h-8 opacity-100 px-3 pb-1"
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A8A29E] whitespace-nowrap">
                {sectionName}
              </div>
            </div>

            <div className="space-y-1">
              {sectionItems.map((item) => {
                const isActive =
                  currentPath === item.path ||
                  (item.path !== "/" &&
                    currentPath.startsWith(item.path) &&
                    item.path !== "/admin" &&
                    item.path !== "/teacher");
                const isDisabled = item.disabled;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        onNavigate(item.path);
                        if (isOpenOnMobile && onCloseMobile) {
                          onCloseMobile();
                        }
                      }
                    }}
                    title={collapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-colors duration-200 relative group cursor-pointer
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4232C]/30
                      ${
                        isDisabled
                          ? "opacity-40 cursor-not-allowed text-[#A8A29E] bg-transparent"
                          : isActive
                          ? "bg-[#FFF1F2] text-[#B4232C] font-semibold shadow-xs"
                          : "text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1C1917] active:bg-[#E7E5E4]"
                      }
                    `}
                  >
                    {/* Active Indicator Bar (Emphasis not relying on color alone) */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#B4232C] rounded-r-full shadow-xs"
                      />
                    )}

                    {/* Icon with stable anchor wrapper - NO horizontal jumping */}
                    <div
                      className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-transform ${
                        isActive
                          ? "text-[#B4232C] scale-105"
                          : "text-[#78716C] group-hover:text-[#1C1917]"
                      }`}
                    >
                      {item.icon}
                    </div>

                    {/* Label & Badge: smooth max-width and opacity transition */}
                    <div
                      className={`flex-1 flex items-center justify-between min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
                        collapsed ? "max-w-0 opacity-0 pointer-events-none" : "max-w-[200px] opacity-100"
                      }`}
                    >
                      <span className="truncate text-left whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-2 px-2 py-0.5 text-[11px] font-bold rounded-full whitespace-nowrap ${
                            isActive
                              ? "bg-[#B4232C] text-white"
                              : "bg-[#F5F5F4] text-[#78716C] group-hover:bg-[#E7E5E4]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Role Info */}
      {user && (
        <div className="border-t border-[#E7E5E4] bg-[#FAFAF9] p-3 transition-colors duration-300">
          <div className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-[#E7E5E4] overflow-hidden">
            <div
              title={`${user.christianName ? `${user.christianName} ` : ""}${user.name} (${
                role === "ADMIN"
                  ? "Quản trị viên"
                  : role === "GLV"
                  ? "Giáo lý viên"
                  : role === "PARENT"
                  ? "Phụ huynh"
                  : "Học sinh"
              })`}
              className="w-8 h-8 rounded-full bg-[#FFF1F2] text-[#B4232C] border border-[#FECDD3] flex items-center justify-center font-bold text-[12px] flex-shrink-0"
            >
              {role.substring(0, 2)}
            </div>

            <div
              className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"
              }`}
            >
              <div className="text-[13px] font-semibold text-[#1C1917] truncate leading-tight whitespace-nowrap">
                {user.christianName ? `${user.christianName} ` : ""}
                {user.name}
              </div>
              <div className="text-[11px] text-[#78716C] truncate mt-0.5 whitespace-nowrap">
                {role === "ADMIN"
                  ? "Quản trị viên"
                  : role === "GLV"
                  ? "Giáo lý viên"
                  : role === "PARENT"
                  ? "Phụ huynh"
                  : "Học sinh"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block flex-shrink-0 transition-[width] duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        } ${className}`}
      >
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer (When opened on mobile) */}
      {isOpenOnMobile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Thanh điều hướng di động"
          className="fixed inset-0 z-50 md:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
