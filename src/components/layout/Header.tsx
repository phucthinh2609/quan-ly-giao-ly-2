import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  Menu,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { HeaderProps, UserRole } from "../../types";
import { Breadcrumb } from "./Breadcrumb";
import { Avatar, Badge, IconButton, AvatarRole } from "../ui";

const ROLE_BADGE_CONFIG: Record<
  UserRole,
  { label: string; variant: "primary" | "warning" | "info" | "gold" | "neutral" }
> = {
  ADMIN: { label: "Admin", variant: "primary" },
  GLV: { label: "GLV", variant: "gold" },
  PARENT: { label: "Phụ huynh", variant: "info" },
  STUDENT: { label: "Học sinh", variant: "neutral" },
};

function mapToAvatarRole(role?: UserRole): AvatarRole | undefined {
  if (!role) return undefined;
  if (role === "ADMIN") return "ADMIN";
  if (role === "GLV") return "GLV";
  if (role === "PARENT") return "PH";
  if (role === "STUDENT") return "HS";
  return undefined;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  notificationCount = 0,
  user,
  onBack,
  onNotificationClick,
  onMobileMenuToggle,
  onLogout,
  actions,
  scrolled = false,
  breadcrumbs,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const roleInfo = user?.role ? ROLE_BADGE_CONFIG[user.role] : null;

  return (
    <header
      className={`sticky top-0 z-30 w-full bg-white transition-all duration-200 border-b ${
        scrolled
          ? "border-[#E7E5E4] shadow-sm bg-white/95 backdrop-blur-md"
          : "border-[#E7E5E4] shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left Section: Back / Mobile Menu + Title + Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Menu Button (visible on mobile if onMobileMenuToggle provided) */}
          {onMobileMenuToggle && !showBackButton && (
            <button
              type="button"
              onClick={onMobileMenuToggle}
              aria-label="Mở danh mục điều hướng"
              className="md:hidden flex items-center justify-center w-11 h-11 -ml-1.5 rounded-[10px] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4] active:bg-[#E7E5E4] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Back Button */}
          {showBackButton && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Quay về trang trước"
              className="flex items-center justify-center w-11 h-11 -ml-1.5 rounded-[10px] text-[#57534E] hover:text-[#B4232C] hover:bg-[#FFF1F2] active:bg-[#FFE4E6] transition-colors cursor-pointer flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Title Area & Breadcrumb Context */}
          <div className="min-w-0 flex flex-col justify-center">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="hidden sm:block -mb-0.5">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}
            <h1 className="text-[17px] sm:text-[20px] font-bold text-[#1C1917] font-serif tracking-tight truncate leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Section: Actions + Notifications + User Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Custom Action Slots */}
          {actions && <div className="hidden sm:flex items-center gap-2">{actions}</div>}

          {/* Notification Button with badge */}
          <div className="relative">
            <IconButton
              aria-label={
                notificationCount > 0
                  ? `Thông báo (${notificationCount} tin mới)`
                  : "Thông báo"
              }
              variant="ghost"
              size="md"
              onClick={onNotificationClick}
              className="text-[#57534E] hover:text-[#B4232C] hover:bg-[#FFF1F2]"
              icon={
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#B4232C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50 duration-150"
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </div>
              }
            />
          </div>

          {/* User Profile / Menu Dropdown */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label={`Menu tài khoản: ${user.name} (${user.role})`}
                className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-[10px] hover:bg-[#F5F5F4] active:bg-[#E7E5E4] transition-colors cursor-pointer border border-transparent hover:border-[#E7E5E4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4232C]/30"
              >
                <Avatar
                  name={user.name}
                  size="sm"
                  status="online"
                  roleBadge={mapToAvatarRole(user.role)}
                />
                <div className="hidden lg:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-[#1C1917] max-w-[130px] truncate leading-none">
                      {user.christianName ? `${user.christianName} ` : ""}
                      {user.name}
                    </span>
                    {roleInfo && (
                      <Badge variant={roleInfo.variant} size="sm">
                        {roleInfo.label}
                      </Badge>
                    )}
                  </div>
                  {user.email && (
                    <span className="text-[11px] text-[#78716C] max-w-[140px] truncate mt-0.5">
                      {user.email}
                    </span>
                  )}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 mt-2 w-64 rounded-[12px] bg-white border border-[#E7E5E4] shadow-lg py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
                >
                  <div className="px-3.5 py-2.5 border-b border-[#F5F5F4] bg-[#FAFAF9]/50">
                    <div className="font-semibold text-[14px] text-[#1C1917] truncate">
                      {user.christianName ? `${user.christianName} ` : ""}
                      {user.name}
                    </div>
                    <div className="text-[12px] text-[#78716C] truncate">{user.email}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {roleInfo && (
                        <Badge variant={roleInfo.variant} size="sm">
                          Vai trò: {roleInfo.label}
                        </Badge>
                      )}
                      {user.assignedClass && (
                        <span className="text-[11px] text-[#78716C] bg-white px-1.5 py-0.5 rounded border border-[#E7E5E4] truncate">
                          {user.assignedClass}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E]">
                      Tài khoản
                    </div>
                    <div className="px-3.5 py-1.5 text-[13px] text-[#57534E] flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-[#78716C]" />
                      <span>Mã: {user.id}</span>
                    </div>
                  </div>

                  {onLogout && (
                    <div className="pt-1 border-t border-[#F5F5F4]">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-3.5 py-2 text-left text-[13px] font-medium text-[#C73A3A] hover:bg-[#FEF2F2] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
