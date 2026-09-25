import React, { useMemo } from "react";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { SidebarProps } from "../../types";
import { Avatar, KitoVuaLogo } from "../ui";
import { ROLE_NAVIGATION, NavEntry, isNavActive } from "./navigation";
import { ROLE_LABELS } from "../../lib/format";
import { cn } from "../../lib/cn";

// ============================================================================
// SIDEBAR v2 (03 §6.3) — panel nổi, chỉ hiện từ lg; thu gọn còn icon.
// ============================================================================

interface SidebarExtraProps {
  notificationCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps & SidebarExtraProps> = ({
  role,
  currentPath,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  user,
  className = "",
  notificationCount = 0,
  onLogout,
}) => {
  const items = ROLE_NAVIGATION[role] || [];

  const sections = useMemo(() => {
    const map = new Map<string, NavEntry[]>();
    for (const item of items) {
      const key = item.section || "Chung";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <aside
      className={cn(
        "hidden shrink-0 transition-[width] duration-300 ease-out-soft lg:block",
        collapsed ? "w-24" : "w-72",
        className
      )}
    >
      <div className="sticky top-0 h-dvh p-3">
        <div className="flex h-full flex-col overflow-hidden rounded-card-lg border border-line bg-surface shadow-card">
          {/* Brand */}
          <div className={cn("flex h-18 shrink-0 items-center gap-2 px-4", collapsed && "justify-center px-0")}>
            <button
              type="button"
              onClick={() => onNavigate(items[0]?.path ?? "/dashboard")}
              className="min-w-0 flex-1 rounded-control text-left"
              aria-label="Về trang chủ"
            >
              <KitoVuaLogo size={40} showText={!collapsed} subtitle="Gx. Đức Mẹ Hằng Cứu Giúp" />
            </button>
          </div>

          {/* Navigation */}
          <nav aria-label="Điều hướng chính" className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-3 py-2">
            {sections.map(([section, sectionItems]) => (
              <div key={section} className="space-y-1">
                <p
                  className={cn(
                    "px-3 pb-1 text-xs font-medium text-ink-3 transition-opacity duration-200",
                    collapsed && "sr-only"
                  )}
                >
                  {section}
                </p>
                {sectionItems.map((item) => {
                  const active = isNavActive(item, currentPath);
                  const Icon = item.icon;
                  const badge = item.showNotificationCount && notificationCount > 0 ? notificationCount : null;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item.path)}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex min-h-11 w-full items-center gap-3 rounded-control px-3 text-[0.9375rem] font-medium transition-colors duration-200",
                        collapsed && "justify-center px-0",
                        active ? "bg-night text-on-night shadow-xs" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5 shrink-0 transition-transform duration-200",
                          !active && "group-hover:scale-110"
                        )}
                        aria-hidden="true"
                      />
                      {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                      {badge !== null && (
                        <span
                          className={cn(
                            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                            active ? "bg-primary text-on-primary" : "bg-primary-soft text-primary-ink",
                            collapsed && "absolute top-1 right-3"
                          )}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer: người dùng + thu gọn */}
          <div className="shrink-0 space-y-2 border-t border-line p-3">
            {user && (
              <div className={cn("flex items-center gap-3 rounded-control bg-surface-2 p-2", collapsed && "justify-center bg-transparent p-0")}>
                <Avatar name={user.name} src={user.avatarUrl || undefined} size="sm" />
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-3">{ROLE_LABELS[role]}</p>
                  </div>
                )}
                {!collapsed && onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    aria-label="Đăng xuất"
                    title="Đăng xuất"
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
                className={cn(
                  "flex min-h-10 w-full items-center gap-2 rounded-control px-3 text-sm font-medium text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink",
                  collapsed && "justify-center px-0"
                )}
              >
                {collapsed ? (
                  <ChevronsRight className="size-4" aria-hidden="true" />
                ) : (
                  <>
                    <ChevronsLeft className="size-4" aria-hidden="true" />
                    Thu gọn
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
