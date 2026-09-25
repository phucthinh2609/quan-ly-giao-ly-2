import React, { useRef, useState } from "react";
import { MobileBottomNavProps } from "../../types";
import { BottomSheet } from "../ui";
import { MOBILE_BOTTOM_NAV_ITEMS, ADMIN_MORE_ITEMS, NavEntry, isNavActive } from "./navigation";
import { gsap, prefersReducedMotion } from "../../lib/motion";
import { cn } from "../../lib/cn";

// ============================================================================
// MOBILE BOTTOM NAV v2 (03 §6.4) — floating glass pill, luôn có nhãn chữ.
// GLV có nút trung tâm nổi "Điểm danh".
// ============================================================================

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  role,
  currentPath,
  onNavigate,
  notificationCount = 0,
  onMoreClick,
  className = "",
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const items = MOBILE_BOTTOM_NAV_ITEMS[role] || [];
  const roomy = role === "PARENT" || role === "STUDENT";

  const handleClick = (item: NavEntry, el: HTMLElement | null) => {
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(el, { scale: 0.86 }, { scale: 1, duration: 0.45, ease: "back.out(2.2)" });
    }
    if (item.path === "#more") {
      if (onMoreClick) onMoreClick();
      else setMoreOpen(true);
      return;
    }
    onNavigate(item.path);
  };

  const moreActive = role === "ADMIN" && ADMIN_MORE_ITEMS.some((i) => isNavActive(i, currentPath));

  return (
    <>
      <nav
        aria-label="Điều hướng chính"
        className={cn(
          "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-lg select-none lg:hidden",
          className
        )}
      >
        <ul className="flex items-stretch justify-around rounded-card-lg border border-line bg-surface/85 p-1 shadow-float backdrop-blur-xl">
          {items.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={item.path === "#more" ? moreActive : isNavActive(item, currentPath)}
              roomy={roomy}
              badge={item.showNotificationCount && notificationCount > 0 ? notificationCount : null}
              onClick={handleClick}
            />
          ))}
        </ul>
      </nav>

      {role === "ADMIN" && (
        <BottomSheet
          isOpen={moreOpen}
          onClose={() => setMoreOpen(false)}
          title="Chức năng khác"
          description="Các phân hệ quản trị của đoàn"
        >
          <div className="grid grid-cols-2 gap-2 pb-2">
            {ADMIN_MORE_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item, currentPath);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigate(item.path);
                  }}
                  className={cn(
                    "flex min-h-24 flex-col items-start justify-between gap-3 rounded-card border p-4 text-left transition-colors",
                    active ? "border-transparent bg-night text-on-night" : "border-line bg-surface hover:bg-surface-2"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-control",
                      active ? "bg-on-night/10" : "bg-surface-2 text-ink-2"
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </BottomSheet>
      )}
    </>
  );
};

interface NavButtonProps {
  item: NavEntry;
  active: boolean;
  roomy: boolean;
  badge: number | null;
  onClick: (item: NavEntry, el: HTMLElement | null) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ item, active, roomy, badge, onClick }) => {
  const iconRef = useRef<HTMLSpanElement>(null);
  const Icon = item.icon;
  const label = item.shortLabel ?? item.label;

  if (item.primary) {
    // Nút trung tâm nổi (GLV: Điểm danh) — 1 chạm từ mọi màn hình
    return (
      <li className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={() => onClick(item, iconRef.current)}
          aria-current={active ? "page" : undefined}
          className="group -mt-7 flex flex-col items-center gap-1"
        >
          <span
            ref={iconRef}
            className={cn(
              "inline-flex size-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-glow ring-4 ring-canvas transition-colors group-hover:bg-primary-hover",
              active && "bg-primary-hover"
            )}
          >
            <Icon className="size-7" aria-hidden="true" />
          </span>
          <span className={cn("text-xs font-semibold", active ? "text-ink" : "text-ink-2")}>{label}</span>
        </button>
      </li>
    );
  }

  return (
    <li className="flex min-w-0 flex-1">
      <button
        type="button"
        onClick={() => onClick(item, iconRef.current)}
        aria-current={active ? "page" : undefined}
        className="group flex min-h-14 w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-card px-0.5 py-1"
      >
        <span
          ref={iconRef}
          className={cn(
            "relative inline-flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200",
            active ? "bg-primary-soft text-primary-ink" : "text-ink-3 group-hover:text-ink"
          )}
        >
          <Icon className={cn(roomy ? "size-6" : "size-5")} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
          {badge !== null && (
            <span
              aria-hidden="true"
              className="absolute -top-1 right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-bold text-on-primary ring-2 ring-surface"
            >
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </span>
        {/* text-xs co giãn theo cỡ chữ người dùng; cỡ Rất lớn thì nhãn xuống tối đa 2 dòng thay vì bị cắt */}
        <span
          className={cn(
            "line-clamp-2 max-w-full text-center text-xs leading-tight font-semibold tracking-tight",
            active ? "text-ink" : "text-ink-3"
          )}
        >
          {label}
        </span>
        {badge !== null && <span className="sr-only">, {badge} thông báo mới</span>}
      </button>
    </li>
  );
};
