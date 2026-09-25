import { Suspense, lazy, useEffect } from "react";
import { AppShell, NOTIFICATION_PATHS } from "./components/layout";
import { RouteGuard } from "./components/auth";
import { ToastProvider, useToast } from "./components/ui";

// Pages
import { AttendancePage } from "./components/attendance";
import { TeacherScoresPage } from "./pages/teacher/scores";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { StudentPortal } from "./pages/student/StudentPortal";
import { ParentDashboard } from "./pages/parent";
import { ClassListPage } from "./pages/classes/ClassListPage";
import { ClassDetailPage } from "./pages/classes/ClassDetailPage";
import { StudentListPage } from "./pages/students/StudentListPage";
import { StudentDetailPage } from "./pages/students/StudentDetailPage";
import { NotificationListPage } from "./pages/notifications/NotificationListPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { UsersManagementPage } from "./pages/admin/UsersManagementPage";
import { ActivityLogPage } from "./pages/admin/ActivityLogPage";
// Bề mặt marketing (GSAP ScrollTrigger) tách chunk riêng — người dùng đã đăng nhập không phải tải
const WelcomePage = lazy(() => import("./pages/public").then((m) => ({ default: m.WelcomePage })));
const LoginPage = lazy(() => import("./pages/public").then((m) => ({ default: m.LoginPage })));

// Demo tooling (không thuộc UI sản phẩm)
import { DemoPanel } from "./dev/DemoPanel";
import { MobileFramePreview } from "./dev/MobileFramePreview";

// Contexts
import { ParentProvider, useParentContext } from "./context/ParentContext";
import { AuthProvider, useAuth, ROLE_DEFAULT_PATHS, MOCK_USERS } from "./context/AuthContext";
import { PreferencesProvider, usePreferences } from "./context/PreferencesContext";
import { RouterProvider, useRouter } from "./context/RouterContext";
import { PUBLIC_PATHS, buildBreadcrumbs, findRouteConfig } from "./routes";
import { ExamType, UserRole } from "./types";
import { givenName } from "./lib/format";

/** App đang chạy bên trong khung điện thoại của Demo Panel */
const IS_EMBED =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1";

const STATIC_NOTIFICATION_COUNT: Record<UserRole, number> = {
  ADMIN: 3,
  GLV: 2,
  PARENT: 0,
  STUDENT: 1,
};

function Root() {
  const toast = useToast();
  const { role, user, isAuthenticated, login, logout } = useAuth();
  const { pathname, fullPath, query, params, navigate, goBack } = useRouter();
  const { mobileFrame } = usePreferences();
  const { unreadCount } = useParentContext();

  const home = ROLE_DEFAULT_PATHS[role];
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Route guard cấp ứng dụng (02 §9)
  useEffect(() => {
    if (!isAuthenticated && !isPublic) {
      navigate("/welcome", { replace: true });
    } else if (isAuthenticated && (isPublic || pathname === "/")) {
      navigate(home, { replace: true });
    }
  }, [isAuthenticated, isPublic, pathname, home, navigate]);

  const handleLogin = (nextRole: UserRole) => {
    login(nextRole);
    navigate(ROLE_DEFAULT_PATHS[nextRole]);
    toast.success(`Xin chào, ${givenName(MOCK_USERS[nextRole].name)}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/welcome");
    toast.info("Đã đăng xuất");
  };

  const demoPanel = IS_EMBED ? null : <DemoPanel />;

  // ---------------------------------------------------------------------------
  // PUBLIC SURFACE
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <>
        <Suspense fallback={<div className="min-h-dvh bg-canvas" aria-busy="true" />}>
          {pathname === "/login" ? (
            <LoginPage onLogin={handleLogin} onNavigate={navigate} />
          ) : (
            <WelcomePage onLogin={handleLogin} onNavigate={navigate} />
          )}
        </Suspense>
        {demoPanel}
      </>
    );
  }

  if (isPublic || pathname === "/") return null; // đang chuyển hướng

  if (mobileFrame && !IS_EMBED) {
    return (
      <>
        <MobileFramePreview path={fullPath} />
        {demoPanel}
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // PRODUCT SURFACE
  // ---------------------------------------------------------------------------
  const currentConfig = findRouteConfig(pathname);
  const notificationCount = role === "PARENT" ? unreadCount : STATIC_NOTIFICATION_COUNT[role];

  const renderPageComponent = () => {
    // 1. Điểm danh
    if (
      pathname === "/attendance" ||
      pathname === "/teacher/attendance" ||
      pathname === "/admin/attendance" ||
      /^\/classes\/[^/]+\/attendance$/.test(pathname)
    ) {
      // Lớp mặc định = lớp phụ trách trong dữ liệu mock (class-*); ID lạ sẽ được trang tự chuyển về lớp đầu tiên
      const classId = params.classId || "class-rl1a";
      const date = query.date || new Date().toISOString().split("T")[0];
      return <AttendancePage initialClassId={classId} initialDate={date} onBack={() => navigate(home)} />;
    }

    // 2. Nhập điểm
    if (
      pathname === "/scores" ||
      pathname === "/teacher/scores" ||
      pathname === "/admin/scores" ||
      /^\/classes\/[^/]+\/scores$/.test(pathname)
    ) {
      return (
        <TeacherScoresPage
          initialClassId={params.classId || "class-rl1a"}
          initialSubjectId={query.subject || "giao_ly"}
          initialExamType={(query.type as ExamType) || "MIENG"}
          onBack={() => navigate(home)}
        />
      );
    }

    // 3. Lớp học
    if (pathname === "/classes" || pathname === "/admin/classes" || pathname === "/teacher/classes") {
      return <ClassListPage />;
    }
    if (/^\/classes\/[^/]+$/.test(pathname) || /^\/classes\/[^/]+\/students$/.test(pathname)) {
      return <ClassDetailPage />;
    }

    // 4. Học sinh
    if (pathname === "/students" || pathname === "/admin/students" || pathname === "/teacher/students") {
      return <StudentListPage />;
    }
    if (/^\/students\/[^/]+$/.test(pathname)) {
      return <StudentDetailPage />;
    }

    // 5. Thông báo
    if (pathname === "/notifications" || pathname === "/admin/notifications" || pathname === "/teacher/notifications") {
      return <NotificationListPage />;
    }

    // 6. Báo cáo · Cài đặt · Admin
    if (pathname === "/reports" || pathname === "/admin/reports") return <ReportsPage />;
    if (pathname === "/settings" || pathname === "/admin/settings") return <SettingsPage />;
    if (pathname === "/admin/users") return <UsersManagementPage />;
    if (pathname === "/admin/activity-log") return <ActivityLogPage />;

    // 7. Dashboard theo vai trò
    if (pathname === "/admin/dashboard" || (role === "ADMIN" && pathname === "/dashboard")) {
      return <AdminDashboard onNavigate={navigate} />;
    }
    if (pathname === "/teacher/dashboard" || (role === "GLV" && pathname === "/dashboard")) {
      return <TeacherDashboard onNavigate={navigate} />;
    }
    if (pathname.startsWith("/student") || (role === "STUDENT" && pathname === "/dashboard")) {
      return <StudentPortal onNavigate={navigate} currentPath={pathname} />;
    }
    if (role === "PARENT" || pathname === "/dashboard" || pathname.startsWith("/parent")) {
      return <ParentDashboard currentPath={pathname} onNavigate={navigate} />;
    }

    return <AdminDashboard onNavigate={navigate} />;
  };

  return (
    <>
      <AppShell
        role={role}
        user={user || undefined}
        title={currentConfig.name}
        currentPath={pathname}
        onNavigate={navigate}
        notificationCount={notificationCount}
        notificationPath={NOTIFICATION_PATHS[role]}
        breadcrumbs={buildBreadcrumbs(pathname, params, role, home, navigate)}
        showBackButton={pathname !== home}
        onBack={goBack}
        onLogout={handleLogout}
      >
        <RouteGuard
          allowedRoles={currentConfig.allowedRoles}
          requiredPermission={currentConfig.requiredPermission}
          currentPath={pathname}
          onNavigate={navigate}
        >
          {renderPageComponent()}
        </RouteGuard>
      </AppShell>
      {demoPanel}
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PreferencesProvider>
          <ParentProvider>
            <RouterProvider>
              <Root />
            </RouterProvider>
          </ParentProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
