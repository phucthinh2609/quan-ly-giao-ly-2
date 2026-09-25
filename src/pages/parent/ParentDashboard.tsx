import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Trophy } from "lucide-react";
import { ParentChildSwitcher } from "../../components/parent/ParentChildSwitcher";
import { WelcomeSummary } from "../../components/parent/WelcomeSummary";
import { ShortcutGrid } from "../../components/parent/ShortcutGrid";
import { ParentGradeOverview } from "../../components/parent/ParentGradeOverview";
import { AcademicPeriodSelector } from "../../components/parent/AcademicPeriodSelector";
import { AttendanceSummaryCard } from "../../components/parent/AttendanceSummaryCard";
import { AttendanceHistoryList } from "../../components/parent/AttendanceHistoryList";
import { ChildAchievements } from "../../components/parent/ChildAchievements";
import { deriveChildMilestones } from "../../components/parent/parentInsights";
import { NotificationPreview } from "../../components/notification/NotificationPreview";
import { NotificationList } from "../../components/notification/NotificationList";
import { ErrorState } from "../../components/ui/ErrorState";
import { IconTile } from "../../components/ui/IconTile";
import { useParentContext } from "../../context/ParentContext";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/cn";
import { givenName } from "../../lib/format";
import { useReveal } from "../../lib/motion";
import { getChildCallName } from "../../services/parentMockData";
import { User } from "../../types";

export interface ParentDashboardProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  user?: User;
  onLogout?: () => void;
  className?: string;
}

type ParentView = "home" | "scores" | "attendance" | "notifications" | "achievements";

function resolveView(path: string): ParentView {
  if (path.includes("scores")) return "scores";
  if (path.includes("attendance")) return "attendance";
  if (path.includes("notifications")) return "notifications";
  if (path.includes("achievements")) return "achievements";
  return "home";
}

/** Tiêu đề trong nội dung (header app ẩn tiêu đề cho tới khi cuộn). */
const ViewHeading: React.FC<{ title: string; description?: React.ReactNode }> = ({ title, description }) => (
  <header data-reveal-static className="space-y-1">
    <h1 className="text-2xl font-bold tracking-tight text-balance text-ink sm:text-3xl">{title}</h1>
    {description && <p className="text-base leading-relaxed text-ink-2">{description}</p>}
  </header>
);

/**
 * ParentDashboard (02 §6 §13, 04 §10–12) — khu Phụ huynh theo route:
 * /dashboard · /parent/scores · /parent/attendance · /parent/notifications · /parent/achievements
 *
 * Đổi con (chip) → ParentContext tải lại báo cáo + thông báo; trong lúc chờ hiển thị
 * khung chờ đúng hình dạng, khi có dữ liệu thì nội dung xuất hiện lại theo nhịp.
 */
export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onNavigate,
  currentPath = "/dashboard",
  user,
  className,
}) => {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;

  const {
    linkedChildren,
    selectedChildId,
    selectedChild,
    switchChild,
    selectedPeriod,
    switchPeriod,
    report,
    isLoadingReport,
    attendanceHistory,
    teacherContact,
    notifications,
    unreadCount,
    isLoadingNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isRefreshing,
    refreshAll,
  } = useParentContext();

  // Route hiện tại: theo prop từ router, vẫn chạy được khi không có onNavigate
  const [localPath, setLocalPath] = useState(currentPath);
  useEffect(() => {
    setLocalPath(currentPath);
  }, [currentPath]);
  const view = resolveView(localPath);

  const navigate = useCallback(
    (path: string) => {
      setLocalPath(path);
      onNavigate?.(path);
    },
    [onNavigate]
  );

  const callName = getChildCallName(selectedChild);
  const reportReady = Boolean(report) && !isLoadingReport && !isRefreshing;
  const notificationsReady = !isLoadingNotifications && !isRefreshing;
  const reportFailed = !report && !isLoadingReport && !isRefreshing;
  const ready =
    view === "home" ? reportReady && notificationsReady : view === "notifications" ? notificationsReady : reportReady;

  const achievedCount = useMemo(
    () => (report ? deriveChildMilestones(report).filter((m) => m.achieved).length : 0),
    [report]
  );

  // Nhịp xuất hiện: phần tĩnh chạy khi đổi màn; phần dữ liệu chạy lại khi đổi con / kỳ / có dữ liệu mới
  const staticRef = useReveal<HTMLDivElement>({ selector: "[data-reveal-static]", deps: [view] });
  const dataRef = useReveal<HTMLDivElement>({ deps: [view, selectedChildId, selectedPeriod, ready] });
  const revealWhenReady = ready ? "" : undefined;

  const switcher = (
    <div data-reveal-static>
      <ParentChildSwitcher
        children={linkedChildren}
        selectedChildId={selectedChildId}
        onChange={switchChild}
        isLoading={isRefreshing}
      />
    </div>
  );

  const reportError = (
    <ErrorState
      title="Không thể tải dữ liệu của con"
      message="Kiểm tra kết nối mạng rồi thử lại."
      onRetry={() => {
        void refreshAll();
      }}
    />
  );

  const renderHome = () => {
    const firstName = givenName(currentUser?.name);
    return (
      <>
        <div className="space-y-4">
          <ViewHeading
            title={firstName ? `Xin chào, ${firstName}` : "Xin chào"}
            description="Cùng xem tình hình học tập của con."
          />
          {switcher}
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-4 sm:space-y-5 lg:col-span-7">
            {reportFailed ? (
              reportError
            ) : (
              <WelcomeSummary selectedChild={selectedChild} report={report} isLoading={!ready} />
            )}

            <div data-reveal-static>
              <ShortcutGrid
                onNavigate={navigate}
                unreadCount={unreadCount}
                teacherTel={teacherContact?.tel}
                teacherPhone={teacherContact?.phone}
                teacherName={teacherContact?.name}
              />
            </div>

            <button
              type="button"
              data-reveal-static
              onClick={() => navigate("/parent/achievements")}
              className={cn(
                "flex min-h-18 w-full items-center gap-3 rounded-card border border-line bg-surface p-4 text-left shadow-card",
                "transition-[transform,box-shadow,border-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-float active:scale-[0.99]",
                "focus-visible:outline-3 focus-visible:outline-offset-2"
              )}
            >
              <IconTile icon={<Trophy />} tone="gold" size="lg" />
              <span className="min-w-0 flex-1">
                <span className="block text-lg leading-snug font-semibold text-ink">Thành tích của {callName}</span>
                <span className="block text-sm text-ink-2">
                  {reportReady ? `${achievedCount} mốc đã đạt trong kỳ này` : "Xem các mốc con đã đạt"}
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
            </button>
          </div>

          <div className="lg:col-span-5" data-reveal={revealWhenReady}>
            <NotificationPreview
              notifications={notifications}
              isLoading={!ready}
              onViewAll={() => navigate("/parent/notifications")}
              onSelectNotification={(n) => markNotificationAsRead(n.id)}
              onNavigateAction={(path) => {
                if (path) navigate(path);
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const renderScores = () => (
    <>
      <ViewHeading title="Bảng điểm" description={`Điểm từng môn và nhận xét của GLV dành cho ${callName}.`} />
      {reportFailed ? (
        <>
          {switcher}
          {reportError}
        </>
      ) : (
        <ParentGradeOverview
          linkedStudents={linkedChildren}
          selectedChildId={selectedChildId}
          onChildChange={switchChild}
          selectedPeriod={selectedPeriod}
          onPeriodChange={switchPeriod}
          report={report}
          isLoading={!ready}
        />
      )}
    </>
  );

  const renderAttendance = () => (
    <>
      <div className="space-y-4">
        <ViewHeading title="Điểm danh" description={`Các buổi học Chúa Nhật của ${callName}.`} />
        {switcher}
        <AcademicPeriodSelector selectedPeriod={selectedPeriod} onChange={switchPeriod} isLoading={!ready} />
      </div>

      {reportFailed ? (
        reportError
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal={revealWhenReady}>
            <AttendanceSummaryCard
              attendance={
                report?.attendance ?? {
                  totalSessions: 0,
                  attendedSessions: 0,
                  absentSessions: 0,
                  excusedSessions: 0,
                  attendanceRate: 0,
                }
              }
              studentName={callName}
              periodLabel={report?.periodLabel}
              sessions={attendanceHistory}
              isLoading={!ready}
            />
          </div>
          <div className="lg:col-span-7" data-reveal={revealWhenReady}>
            <AttendanceHistoryList sessions={attendanceHistory} isLoading={!ready} />
          </div>
        </div>
      )}
    </>
  );

  const renderNotifications = () => (
    <>
      <div className="space-y-4">
        <ViewHeading
          title="Thông báo"
          description={`Tin từ Ban Giáo lý và lớp của ${callName}. Tin khẩn luôn ở trên cùng.`}
        />
        {switcher}
      </div>
      <NotificationList
        notifications={notifications}
        isLoading={!ready}
        onSelectNotification={(n) => markNotificationAsRead(n.id)}
        onMarkAllRead={markAllNotificationsAsRead}
        onNavigateAction={(path) => {
          if (path) navigate(path);
        }}
      />
    </>
  );

  const renderAchievements = () => (
    <>
      <div className="space-y-4">
        <ViewHeading title="Thành tích" description={`Những mốc chuyên cần và học tập ${callName} đã đạt được.`} />
        {switcher}
        <AcademicPeriodSelector selectedPeriod={selectedPeriod} onChange={switchPeriod} isLoading={!ready} />
      </div>
      {reportFailed ? reportError : <ChildAchievements report={report} childName={callName} isLoading={!ready} />}
    </>
  );

  return (
    <div ref={staticRef} className={cn("w-full", className)}>
      <div ref={dataRef} className="space-y-8">
        {view === "home" && renderHome()}
        {view === "scores" && renderScores()}
        {view === "attendance" && renderAttendance()}
        {view === "notifications" && renderNotifications()}
        {view === "achievements" && renderAchievements()}
      </div>
    </div>
  );
};
