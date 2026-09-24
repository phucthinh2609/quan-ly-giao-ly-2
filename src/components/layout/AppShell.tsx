import React, { useState, useEffect } from "react";
import { AppShellProps } from "../../types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";

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
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#292524] flex flex-col md:flex-row antialiased font-sans">
      {/* Desktop Sidebar (Persistent on md+, hidden on mobile) */}
      <Sidebar
        role={role}
        currentPath={currentPath}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        isOpenOnMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Column: Header + Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <Header
          title={title}
          showBackButton={showBackButton}
          notificationCount={notificationCount}
          user={user}
          onBack={onBack}
          onNotificationClick={() => onNavigate(role === "ADMIN" ? "/admin/notifications" : "/parent/notifications")}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          onLogout={() => onNavigate("/login")}
          actions={headerActions}
          scrolled={isScrolled}
          breadcrumbs={breadcrumbs}
        />

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 px-4 py-4 sm:px-6 sm:py-6 md:px-8 max-w-7xl w-full mx-auto pb-24 md:pb-10 transition-all duration-150"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Visible on mobile, hidden on md+) */}
      <MobileBottomNav
        role={role}
        currentPath={currentPath}
        onNavigate={onNavigate}
        notificationCount={notificationCount}
      />
    </div>
  );
};
