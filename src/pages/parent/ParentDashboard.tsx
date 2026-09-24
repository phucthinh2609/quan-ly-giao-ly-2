import React, { useState } from "react";
import {
  Header,
  MobileBottomNav,
} from "../../components/layout";
import {
  ParentChildSwitcher,
  WelcomeSummary,
  ParentGradeOverview,
  AttendanceSummaryCard,
} from "../../components/parent";
import {
  NotificationPreview,
  NotificationList,
} from "../../components/notification";
import { useParentContext } from "../../context/ParentContext";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../types";
import {
  FileSpreadsheet,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";

export interface ParentDashboardProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  user?: User;
  onLogout?: () => void;
  className?: string;
}

/**
 * ParentDashboard (Tier 5 Feature Component - §30, Wireframe C, Sitemap §5–6, §11)
 *
 * Exact Tree Hierarchy:
 * <ParentDashboard>
 * ├── <Header />
 * ├── <ParentChildSwitcher />
 * ├── <WelcomeSummary />
 * ├── <ParentGradeOverview />
 * ├── <AttendanceSummaryCard />
 * ├── <NotificationPreview />
 * └── <ParentBottomNav /> (MobileBottomNav)
 *
 * Ràng buộc:
 * - ParentChildSwitcher: đổi con → BẮT BUỘC refresh context dashboard/score/attendance/notification
 *   (gọi lại toàn bộ data fetch liên quan, không chỉ đổi label hiển thị).
 * - Toàn bộ control khu vực Parent: font-size ≥18px (body-lg), touch target ≥52–56px (RULE-010);
 *   KHÔNG dùng icon-only cho action nghiệp vụ quan trọng (RULE-012).
 */
export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onNavigate,
  currentPath = "/dashboard",
  user,
  onLogout,
  className = "",
}) => {
  const { user: authUser, logout } = useAuth();
  const currentUser = user || authUser;

  // Parent Context: holds real reactive state & async re-fetch on child switch
  const {
    linkedChildren,
    selectedChildId,
    selectedChild,
    switchChild,
    selectedPeriod,
    switchPeriod,
    report,
    isLoadingReport,
    notifications,
    unreadCount,
    isLoadingNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isRefreshing,
    refreshAll,
  } = useParentContext();

  // Active view tab within parent space: "dashboard" | "scores" | "attendance" | "notifications"
  const getInitialTab = (): "dashboard" | "scores" | "attendance" | "notifications" => {
    if (currentPath.includes("scores")) return "scores";
    if (currentPath.includes("attendance")) return "attendance";
    if (currentPath.includes("notifications")) return "notifications";
    return "dashboard";
  };

  const [activeParentTab, setActiveParentTab] = useState<
    "dashboard" | "scores" | "attendance" | "notifications"
  >(getInitialTab);

  // Handle bottom nav / internal routing
  const handleNav = (path: string) => {
    if (path.includes("scores")) {
      setActiveParentTab("scores");
    } else if (path.includes("attendance")) {
      setActiveParentTab("attendance");
    } else if (path.includes("notifications")) {
      setActiveParentTab("notifications");
    } else {
      setActiveParentTab("dashboard");
    }

    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`min-h-screen bg-[#FAFAF9] flex flex-col pb-24 md:pb-12 ${className}`}>
      {/* =================================================================== */}
      {/* 1. HEADER                                                           */}
      {/* =================================================================== */}
      <Header
        title={
          activeParentTab === "scores"
            ? "Bảng điểm học sinh"
            : activeParentTab === "attendance"
            ? "Điểm danh & Chuyên cần"
            : activeParentTab === "notifications"
            ? "Thông báo Xứ đoàn"
            : "Sổ Liên Lạc Điện Tử"
        }
        showBackButton={activeParentTab !== "dashboard"}
        onBack={() => setActiveParentTab("dashboard")}
        notificationCount={unreadCount}
        onNotificationClick={() => setActiveParentTab("notifications")}
        user={currentUser || undefined}
        onLogout={onLogout || logout}
        actions={
          <button
            type="button"
            disabled={isRefreshing}
            onClick={() => refreshAll()}
            aria-label="Làm mới dữ liệu"
            title="Làm mới dữ liệu"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E5E4] bg-white text-[#57534E] hover:text-[#B4232C] hover:bg-[#FFF1F2] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#B4232C]" : ""}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
        {/* ================================================================= */}
        {/* VIEW 1: PARENT DASHBOARD (Default Home View)                       */}
        {/* Exact Tree: ParentChildSwitcher -> WelcomeSummary ->              */}
        {/*             ParentGradeOverview -> AttendanceSummaryCard ->       */}
        {/*             NotificationPreview                                   */}
        {/* ================================================================= */}
        {activeParentTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Refreshing Banner Indicator */}
            {isRefreshing && (
              <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-[12px] flex items-center justify-center gap-2 text-[#B4232C] text-[14px] font-semibold animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang tải lại dữ liệu mới nhất cho {selectedChild.name}...</span>
              </div>
            )}

            {/* 2. PARENT CHILD SWITCHER (Trigger re-fetch of all domains) */}
            <section aria-label="Bộ chọn con">
              <ParentChildSwitcher
                children={linkedChildren}
                selectedChildId={selectedChildId}
                onChange={switchChild}
                isLoading={isRefreshing}
              />
            </section>

            {/* 3. WELCOME SUMMARY */}
            <section aria-label="Lời chào và tóm tắt">
              <WelcomeSummary
                parentName={currentUser?.name || "Quý Phụ huynh"}
                selectedChild={selectedChild}
              />
            </section>

            {/* 4. PARENT GRADE OVERVIEW */}
            {/* Information priority: Học sinh -> Kỳ -> Điểm TB -> Môn -> Chi tiết -> Nhận xét */}
            <section aria-label="Tổng quan điểm số">
              <div className="p-5 sm:p-6 rounded-[20px] bg-white border border-[#E7E5E4] shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
                  <div>
                    <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1C1917] font-serif">
                      Kết Quả Học Tập
                    </h3>
                    <p className="text-[14px] text-[#78716C]">
                      Bảng điểm Giáo lý và Kinh Thánh của con
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveParentTab("scores")}
                    className="min-h-[52px] px-4 py-2 rounded-[12px] text-[16px] font-bold text-[#B4232C] hover:bg-[#FFF1F2] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Xem đầy đủ</span>
                    <FileSpreadsheet className="w-4 h-4" />
                  </button>
                </div>

                <ParentGradeOverview
                  linkedStudents={linkedChildren}
                  selectedChildId={selectedChildId}
                  onChildChange={switchChild}
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={switchPeriod}
                  report={report}
                  isLoading={isLoadingReport || isRefreshing}
                />
              </div>
            </section>

            {/* 5. ATTENDANCE SUMMARY CARD */}
            {/* Format: "X/Y buổi", progress bar %, "Vắng: N" */}
            <section aria-label="Thẻ tóm tắt chuyên cần">
              <AttendanceSummaryCard
                attendance={
                  report?.attendance || {
                    totalSessions: 20,
                    attendedSessions: 18,
                    absentSessions: 2,
                    excusedSessions: 1,
                    attendanceRate: 90,
                  }
                }
                studentName={selectedChild.name}
                isLoading={isLoadingReport || isRefreshing}
                onViewHistory={() => setActiveParentTab("attendance")}
              />
            </section>

            {/* 6. NOTIFICATION PREVIEW */}
            <section aria-label="Xem trước thông báo">
              <div className="p-5 sm:p-6 rounded-[20px] bg-white border border-[#E7E5E4] shadow-xs">
                <NotificationPreview
                  notifications={notifications}
                  isLoading={isLoadingNotifications || isRefreshing}
                  onViewAll={() => setActiveParentTab("notifications")}
                  onSelectNotification={(n) => markNotificationAsRead(n.id)}
                />
              </div>
            </section>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: PARENT SCORES TAB                                         */}
        {/* Full Wireframe C Screen                                           */}
        {/* ================================================================= */}
        {activeParentTab === "scores" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveParentTab("dashboard")}
                className="min-h-[52px] px-4 py-2 rounded-[12px] text-[16px] font-semibold text-[#57534E] hover:bg-white border border-[#E7E5E4] transition-colors cursor-pointer flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Quay lại Trang chủ</span>
              </button>
              <span className="text-[14px] text-[#78716C] font-semibold">
                Bảng điểm chi tiết
              </span>
            </div>

            <div className="p-5 sm:p-6 rounded-[20px] bg-white border border-[#E7E5E4] shadow-xs space-y-6">
              <ParentGradeOverview
                linkedStudents={linkedChildren}
                selectedChildId={selectedChildId}
                onChildChange={switchChild}
                selectedPeriod={selectedPeriod}
                onPeriodChange={switchPeriod}
                report={report}
                isLoading={isLoadingReport || isRefreshing}
              />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: PARENT ATTENDANCE TAB                                     */}
        {/* Wireframe §10 Full Attendance History                             */}
        {/* ================================================================= */}
        {activeParentTab === "attendance" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveParentTab("dashboard")}
                className="min-h-[52px] px-4 py-2 rounded-[12px] text-[16px] font-semibold text-[#57534E] hover:bg-white border border-[#E7E5E4] transition-colors cursor-pointer flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Quay lại Trang chủ</span>
              </button>
              <span className="text-[14px] text-[#78716C] font-semibold">
                Lịch sử điểm danh
              </span>
            </div>

            <ParentChildSwitcher
              children={linkedChildren}
              selectedChildId={selectedChildId}
              onChange={switchChild}
              isLoading={isRefreshing}
            />

            <AttendanceSummaryCard
              attendance={
                report?.attendance || {
                  totalSessions: 20,
                  attendedSessions: 18,
                  absentSessions: 2,
                  excusedSessions: 1,
                  attendanceRate: 90,
                }
              }
              studentName={selectedChild.name}
              isLoading={isLoadingReport || isRefreshing}
            />

            {/* Attendance History Log List (§10 Wireframe) */}
            <div className="p-5 sm:p-6 rounded-[20px] bg-white border border-[#E7E5E4] shadow-xs space-y-4">
              <h3 className="text-[19px] sm:text-[20px] font-bold text-[#1C1917] font-serif">
                Lịch Sử Điểm Danh Các Chúa Nhật
              </h3>

              <div className="divide-y divide-[#F5F5F4]">
                {[
                  { date: "24/09/2026", status: "PRESENT", label: "Có mặt", icon: "🟢", note: "Tham dự đúng giờ" },
                  { date: "17/09/2026", status: "PRESENT", label: "Có mặt", icon: "🟢", note: "Tham dự đầy đủ" },
                  { date: "10/09/2026", status: "EXCUSED", label: "Có phép", icon: "🟡", note: "Gia đình có việc bận" },
                  { date: "03/09/2026", status: "ABSENT", label: "Vắng", icon: "🔴", note: "Nghỉ lễ đầu năm" },
                ].map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between text-[16px] sm:text-[18px]">
                    <div className="flex items-center gap-3">
                      <span className="text-[20px]">{item.icon}</span>
                      <div>
                        <span className="font-bold text-[#1C1917] font-serif">{item.date}</span>
                        <p className="text-[13px] text-[#78716C]">{item.note}</p>
                      </div>
                    </div>
                    <span
                      className={`font-bold px-3 py-1 rounded-full text-[14px] ${
                        item.status === "PRESENT"
                          ? "bg-[#ECFDF3] text-[#168154]"
                          : item.status === "EXCUSED"
                          ? "bg-[#FFFBEB] text-[#D97706]"
                          : "bg-[#FFF1F2] text-[#B4232C]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 4: PARENT NOTIFICATIONS TAB                                  */}
        {/* Full Notification List (§24 & Wireframe §11)                     */}
        {/* ================================================================= */}
        {activeParentTab === "notifications" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveParentTab("dashboard")}
                className="min-h-[52px] px-4 py-2 rounded-[12px] text-[16px] font-semibold text-[#57534E] hover:bg-white border border-[#E7E5E4] transition-colors cursor-pointer flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Quay lại Trang chủ</span>
              </button>
              <span className="text-[14px] text-[#78716C] font-semibold">
                Trung tâm thông báo
              </span>
            </div>

            <ParentChildSwitcher
              children={linkedChildren}
              selectedChildId={selectedChildId}
              onChange={switchChild}
              isLoading={isRefreshing}
            />

            <NotificationList
              notifications={notifications}
              isLoading={isLoadingNotifications || isRefreshing}
              onSelectNotification={(n) => markNotificationAsRead(n.id)}
              onMarkAllRead={markAllNotificationsAsRead}
              onNavigateAction={(path) => {
                if (path) handleNav(path);
              }}
            />
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* 7. PARENT BOTTOM NAVIGATION                                         */}
      {/* =================================================================== */}
      <MobileBottomNav
        role="PARENT"
        currentPath={
          activeParentTab === "scores"
            ? "/parent/scores"
            : activeParentTab === "attendance"
            ? "/parent/attendance"
            : activeParentTab === "notifications"
            ? "/parent/notifications"
            : "/dashboard"
        }
        onNavigate={handleNav}
        notificationCount={unreadCount}
      />
    </div>
  );
};
