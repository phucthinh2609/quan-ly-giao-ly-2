import React, { useRef, useState } from "react";
import { ArrowLeft, Bell, ChevronDown, LogOut } from "lucide-react";
import { HeaderProps } from "../../types";
import { Breadcrumb } from "./Breadcrumb";
import { TextSizeControl, ThemeToggle, useDismiss, usePopoverEnter } from "./PreferenceControls";
import { Avatar, Badge, KitoVuaLogo } from "../ui";
import { ROLE_LABELS } from "../../lib/format";
import { cn } from "../../lib/cn";

// ============================================================================
// HEADER v2 (03 §6.2) — sticky glass.
// Tiêu đề chỉ hiện khi cuộn (kiểu "large title"): tiêu đề lớn nằm trong nội dung trang.
// ============================================================================

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  notificationCount = 0,
  user,
  onBack,
  onNotificationClick,
  onLogout,
  actions,
  scrolled = false,
  breadcrumbs,
  role,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  useDismiss(menuOpen, () => setMenuOpen(false), menuWrapRef);
  usePopoverEnter(menuOpen, menuPanelRef);

  const effectiveRole = role ?? user?.role;
  const isParent = effectiveRole === "PARENT";
  const hasBreadcrumbs = !!breadcrumbs && breadcrumbs.length > 1;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled ? "border-line bg-canvas/80 backdrop-blur-xl" : "border-transparent bg-canvas"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        {/* Left: Back | Logo (mobile) + tiêu đề / breadcrumb */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
          {showBackButton ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Quay lại trang trước"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink active:scale-95"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
          ) : (
            <span className="shrink-0 pl-1 lg:hidden">
              <KitoVuaLogo size={32} showText={false} />
            </span>
          )}

          <div className="relative min-w-0 flex-1">
            {hasBreadcrumbs && (
              <div
                className={cn(
                  "hidden transition-[opacity,transform] duration-300 lg:block",
                  scrolled && "pointer-events-none -translate-y-1 opacity-0"
                )}
              >
                <Breadcrumb items={breadcrumbs!} />
              </div>
            )}
            <p
              aria-hidden={!scrolled}
              className={cn(
                "truncate text-lg font-semibold tracking-tight text-ink transition-[opacity,transform] duration-300",
                hasBreadcrumbs && "lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2",
                scrolled ? "opacity-100" : "translate-y-1 opacity-0"
              )}
            >
              {title}
            </p>
          </div>
        </div>

        {/* Right: actions · cỡ chữ · giao diện · thông báo · tài khoản */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {actions && <div className="mr-1 hidden items-center gap-2 md:flex">{actions}</div>}

          <TextSizeControl showLabel={isParent} />
          <ThemeToggle className="hidden min-[400px]:inline-flex" />

          <button
            type="button"
            onClick={onNotificationClick}
            aria-label={notificationCount > 0 ? `Thông báo, ${notificationCount} tin mới` : "Thông báo"}
            title="Thông báo"
            className="relative inline-flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink active:scale-95"
          >
            <Bell className="size-5" aria-hidden="true" />
            {notificationCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-1 right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] leading-none font-bold text-on-primary ring-2 ring-canvas"
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          {user && (
            <div className="relative ml-0.5" ref={menuWrapRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label={`Tài khoản: ${user.name}`}
                className={cn(
                  "flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-surface-2 lg:py-1 lg:pr-3 lg:pl-1",
                  menuOpen && "bg-surface-2"
                )}
              >
                <Avatar name={user.name} src={user.avatarUrl || undefined} size="sm" />
                <span className="hidden max-w-36 truncate text-sm font-semibold text-ink lg:inline">{user.name}</span>
                <ChevronDown className="hidden size-4 text-ink-3 lg:inline" aria-hidden="true" />
              </button>

              {menuOpen && (
                <div
                  ref={menuPanelRef}
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-72 rounded-card border border-line bg-surface p-2 shadow-float"
                >
                  <div className="flex items-center gap-3 rounded-control bg-surface-2 p-3">
                    <Avatar name={user.name} src={user.avatarUrl || undefined} size="md" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{user.name}</p>
                      {user.email && <p className="truncate text-sm text-ink-3">{user.email}</p>}
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge variant="night" size="sm">
                          {ROLE_LABELS[user.role]}
                        </Badge>
                        {user.assignedClass && (
                          <Badge variant="neutral" size="sm">
                            {user.assignedClass}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between rounded-control px-3 py-1 min-[400px]:hidden">
                    <span className="text-sm font-medium text-ink-2">Giao diện</span>
                    <ThemeToggle />
                  </div>

                  {onLogout && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                      className="mt-1 flex min-h-12 w-full items-center gap-3 rounded-control px-3 text-left font-medium text-danger transition-colors hover:bg-danger-soft"
                    >
                      <LogOut className="size-5" aria-hidden="true" />
                      Đăng xuất
                    </button>
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
