import React, { useEffect, useState } from "react";
import { AppShellProps } from "../../types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { NOTIFICATION_PATHS } from "./navigation";
import { usePageEnter } from "../../lib/motion";

// ============================================================================
// APP SHELL v2 (03 §6.1)
// data-role trên root → mật độ, bo góc, chiều cao control theo vai trò (01 §12).
// ============================================================================

const SIDEBAR_KEY = "qlgl.sidebarCollapsed";

export const AppShell: React.FC<AppShellProps> = ({
  role,
  children,
  title = "Đoàn Kitô Vua",
  showBackButton = false,
  onBack,
  notificationCount = 0,
  user,
  currentPath = "/dashboard",
  onNavigate = () => {},
  breadcrumbs,
  headerActions,
  onLogout,
  notificationPath,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const pageRef = usePageEnter<HTMLDivElement>(currentPath);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mỗi lần đổi trang: cuộn về đầu
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPath]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleLogout = onLogout ?? (() => onNavigate("/welcome"));

  return (
    <div data-role={role} className="min-h-dvh bg-canvas text-ink lg:flex">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-night focus:px-4 focus:py-2 focus:text-on-night"
      >
        Bỏ qua, đến nội dung chính
      </a>

      <Sidebar
        role={role}
        currentPath={currentPath}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        user={user}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <Header
          title={title}
          role={role}
          showBackButton={showBackButton}
          notificationCount={notificationCount}
          user={user}
          onBack={onBack}
          onNotificationClick={() => onNavigate(notificationPath ?? NOTIFICATION_PATHS[role])}
          onLogout={handleLogout}
          actions={headerActions}
          scrolled={isScrolled}
          breadcrumbs={breadcrumbs}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl flex-1 px-4 pt-2 pb-32 outline-none sm:px-6 lg:px-8 lg:pt-4 lg:pb-12"
        >
          <div ref={pageRef}>{children}</div>
        </main>
      </div>

      <MobileBottomNav
        role={role}
        currentPath={currentPath}
        onNavigate={onNavigate}
        notificationCount={notificationCount}
      />
    </div>
  );
};
