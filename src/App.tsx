import { useState } from "react";
import { AppShell } from "./components/layout";
import { RouteGuard } from "./components/auth";
import {
  Button,
  Badge,
  ToastProvider,
  useToast,
  KitoVuaLogo,
} from "./components/ui";

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

// Contexts
import { ParentProvider } from "./context/ParentContext";
import {
  AuthProvider,
  useAuth,
  ROLE_DEFAULT_PATHS,
} from "./context/AuthContext";
import {
  RouterProvider,
  useRouter,
  matchPath,
} from "./context/RouterContext";
import { UserRole, AppPermission, BreadcrumbItem, ExamType } from "./types";
import {
  Smartphone,
  Monitor,
  LogOut,
  LogIn,
} from "lucide-react";

// ============================================================================
// ROUTE DEFINITIONS & PERMISSION MATRIX (§1, §14, §16)
// ============================================================================
interface RouteConfig {
  pattern: string;
  name: string;
  allowedRoles: UserRole[];
  requiredPermission?: AppPermission;
  description: string;
}

const ROUTE_CONFIGS: RouteConfig[] = [
  // General
  { pattern: "/dashboard", name: "Dashboard", allowedRoles: ["ADMIN", "GLV", "PARENT", "STUDENT"], description: "Trang chủ tương ứng theo vai trò người dùng" },
  { pattern: "/classes", name: "Danh sách Lớp học", allowedRoles: ["ADMIN", "GLV"], description: "Danh sách toàn bộ hoặc các lớp được phân công" },
  { pattern: "/classes/:classId", name: "Chi tiết Lớp học", allowedRoles: ["ADMIN", "GLV"], description: "Thông tin lớp, danh sách học sinh" },
  { pattern: "/classes/:classId/attendance", name: "Điểm danh theo lớp", allowedRoles: ["ADMIN", "GLV"], requiredPermission: "attendance:update", description: "Điểm danh 1 chạm với query date=YYYY-MM-DD" },
  { pattern: "/classes/:classId/scores", name: "Nhập điểm theo lớp", allowedRoles: ["ADMIN", "GLV"], requiredPermission: "score:update", description: "Bảng nhập điểm theo môn và loại điểm" },
  { pattern: "/classes/:classId/students", name: "Học sinh theo lớp", allowedRoles: ["ADMIN", "GLV"], description: "Danh sách học sinh trong lớp" },
  { pattern: "/students", name: "Danh sách Học sinh", allowedRoles: ["ADMIN", "GLV", "PARENT", "STUDENT"], description: "Danh sách thiếu nhi theo Data Ownership (§14)" },
  { pattern: "/students/:studentId", name: "Hồ sơ Học sinh", allowedRoles: ["ADMIN", "GLV", "PARENT", "STUDENT"], description: "Chi tiết kết quả học tập và chuyên cần" },
  { pattern: "/attendance", name: "Điểm danh Giáo lý", allowedRoles: ["ADMIN", "GLV"], requiredPermission: "attendance:update", description: "Màn hình điểm danh nhanh" },
  { pattern: "/scores", name: "Nhập điểm Giáo lý", allowedRoles: ["ADMIN", "GLV"], requiredPermission: "score:update", description: "Nhập điểm và import Excel" },
  { pattern: "/notifications", name: "Thông báo Xứ đoàn", allowedRoles: ["ADMIN", "GLV", "PARENT", "STUDENT"], description: "Tin tức, sinh hoạt và thông báo khẩn" },
  { pattern: "/reports", name: "Báo cáo Tổng hợp", allowedRoles: ["ADMIN", "GLV"], description: "Thống kê chuyên cần và điểm số" },
  { pattern: "/settings", name: "Cài đặt Hệ thống", allowedRoles: ["ADMIN"], requiredPermission: "settings:update", description: "Thông tin xứ đoàn và quy tắc tính điểm" },

  // Admin Routes
  { pattern: "/admin/dashboard", name: "Admin Dashboard", allowedRoles: ["ADMIN"], description: "Tổng quan toàn đoàn, KPI, biểu đồ" },
  { pattern: "/admin/users", name: "Quản lý Người dùng", allowedRoles: ["ADMIN"], requiredPermission: "user:view", description: "CRUD tài khoản GLV, Phụ huynh, Học sinh" },
  { pattern: "/admin/classes", name: "Quản lý Lớp học", allowedRoles: ["ADMIN"], description: "Danh sách và quản trị lớp học" },
  { pattern: "/admin/students", name: "Quản lý Học sinh", allowedRoles: ["ADMIN"], description: "Danh sách toàn bộ thiếu nhi" },
  { pattern: "/admin/attendance", name: "Điểm danh toàn đoàn", allowedRoles: ["ADMIN"], requiredPermission: "attendance:update", description: "Điểm danh và kiểm tra chuyên cần" },
  { pattern: "/admin/scores", name: "Bảng điểm toàn đoàn", allowedRoles: ["ADMIN"], requiredPermission: "score:update", description: "Nhập và tổng hợp điểm" },
  { pattern: "/admin/reports", name: "Báo cáo Tổng hợp", allowedRoles: ["ADMIN"], description: "Thống kê và xuất file Excel" },
  { pattern: "/admin/notifications", name: "Quản lý Thông báo", allowedRoles: ["ADMIN"], requiredPermission: "notification:create", description: "Tạo và gửi thông báo" },
  { pattern: "/admin/settings", name: "Cài đặt Hệ thống", allowedRoles: ["ADMIN"], requiredPermission: "settings:update", description: "Cấu hình xứ đoàn và năm học" },
  { pattern: "/admin/activity-log", name: "Nhật ký Hoạt động", allowedRoles: ["ADMIN"], description: "Audit trail toàn hệ thống" },

  // GLV Routes
  { pattern: "/teacher/dashboard", name: "GLV Dashboard", allowedRoles: ["GLV", "ADMIN"], description: "Không gian làm việc của Giáo lý viên" },
  { pattern: "/teacher/classes", name: "Lớp của tôi", allowedRoles: ["GLV", "ADMIN"], description: "Các lớp được phân công phụ trách" },
  { pattern: "/teacher/attendance", name: "Điểm danh hôm nay", allowedRoles: ["GLV", "ADMIN"], requiredPermission: "attendance:update", description: "Điểm danh 1 chạm" },
  { pattern: "/teacher/scores", name: "Nhập điểm GLV", allowedRoles: ["GLV", "ADMIN"], requiredPermission: "score:update", description: "Bảng nhập điểm theo lớp" },
  { pattern: "/teacher/students", name: "Danh sách Học sinh", allowedRoles: ["GLV", "ADMIN"], description: "Danh sách học sinh trong lớp phụ trách" },
  { pattern: "/teacher/notifications", name: "Thông báo GLV", allowedRoles: ["GLV", "ADMIN"], description: "Thông báo dành cho giáo lý viên" },

  // Parent Routes
  { pattern: "/parent/scores", name: "Bảng điểm Con", allowedRoles: ["PARENT", "ADMIN"], requiredPermission: "score:view", description: "Xem điểm con và nhận xét GLV" },
  { pattern: "/parent/attendance", name: "Lịch sử Điểm danh", allowedRoles: ["PARENT", "ADMIN"], requiredPermission: "attendance:view", description: "Tỷ lệ chuyên cần của con" },
  { pattern: "/parent/notifications", name: "Thông báo Giáo xứ", allowedRoles: ["PARENT", "ADMIN"], requiredPermission: "notification:view", description: "Thông báo liên quan đến con" },
  { pattern: "/parent/achievements", name: "Góc Thành Tích", allowedRoles: ["PARENT", "ADMIN"], description: "Huy hiệu và tiến trình hoa thiêng" },

  // Student Routes
  { pattern: "/student/portal", name: "Góc Thiếu Nhi Gamification", allowedRoles: ["STUDENT", "PARENT", "ADMIN"], description: "Gia tài thành tích, cấp độ XP, huy hiệu" },
  { pattern: "/student/scores", name: "Bảng điểm Của Tôi", allowedRoles: ["STUDENT", "ADMIN"], description: "Xem điểm các môn học" },
  { pattern: "/student/attendance", name: "Chuyên cần", allowedRoles: ["STUDENT", "ADMIN"], description: "Lịch sử đi học Chúa Nhật" },
  { pattern: "/student/achievements", name: "Huy hiệu & XP", allowedRoles: ["STUDENT", "ADMIN"], description: "Thành tích và nhiệm vụ" },
  { pattern: "/student/notifications", name: "Thông báo Học sinh", allowedRoles: ["STUDENT", "ADMIN"], description: "Tin tức xứ đoàn" },
];

function findRouteConfig(pathname: string): RouteConfig {
  for (const cfg of ROUTE_CONFIGS) {
    if (cfg.pattern === pathname) return cfg;
    const match = matchPath(cfg.pattern, pathname);
    if (match.matches) return cfg;
  }
  return {
    pattern: pathname,
    name: "Quản lý Giáo lý",
    allowedRoles: ["ADMIN", "GLV", "PARENT", "STUDENT"],
    description: "Trang hệ thống",
  };
}

function MainRouterView() {
  const toast = useToast();
  const { role, user, isAuthenticated, switchRole, logout, login } = useAuth();
  const { pathname, fullPath, query, params, navigate, goBack } = useRouter();

  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile_sim">("desktop");
  const [activeTab, setActiveTab] = useState<"app" | "routing_table" | "data_ownership_matrix">("app");

  const currentConfig = findRouteConfig(pathname);

  // Generate dynamic Breadcrumbs based on URL Hierarchy
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: role === "ADMIN" ? "Admin" : role === "GLV" ? "GLV" : "Trang chủ",
        onClick: () => navigate(ROLE_DEFAULT_PATHS[role]),
      },
    ];

    if (pathname.includes("/classes")) {
      items.push({ label: "Lớp học", onClick: () => navigate("/classes") });
      if (params.classId) {
        items.push({ label: params.classId, onClick: () => navigate(`/classes/${params.classId}`) });
      }
      if (pathname.includes("/attendance")) items.push({ label: "Điểm danh" });
      if (pathname.includes("/scores")) items.push({ label: "Bảng điểm" });
    } else if (pathname.includes("/students")) {
      items.push({ label: "Học sinh", onClick: () => navigate("/students") });
      if (params.studentId) items.push({ label: params.studentId });
    } else if (pathname.includes("/attendance")) {
      items.push({ label: "Điểm danh" });
    } else if (pathname.includes("/scores")) {
      items.push({ label: "Bảng điểm" });
    } else if (pathname.includes("/notifications")) {
      items.push({ label: "Thông báo" });
    } else if (pathname.includes("/reports")) {
      items.push({ label: "Báo cáo" });
    } else if (pathname.includes("/settings")) {
      items.push({ label: "Cài đặt" });
    } else if (pathname.includes("/users")) {
      items.push({ label: "Người dùng" });
    } else if (pathname.includes("/activity-log")) {
      items.push({ label: "Activity Log" });
    }

    return items;
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    const newHome = ROLE_DEFAULT_PATHS[newRole];
    navigate(newHome);
    toast.info(`Đã đổi vai trò sang: ${newRole} · Điều hướng về: ${newHome}`);
  };

  // Render Component corresponding to exact URL (§16)
  const renderPageComponent = () => {
    // 1. Attendance Routes
    if (
      pathname === "/attendance" ||
      pathname === "/teacher/attendance" ||
      pathname === "/admin/attendance" ||
      pathname.match(/^\/classes\/[^/]+\/attendance$/)
    ) {
      const classId = params.classId || (role === "GLV" ? "cls-7a" : "class-rl1a");
      const date = query.date || new Date().toISOString().split("T")[0];
      return (
        <AttendancePage
          initialClassId={classId}
          initialDate={date}
          onBack={() => navigate(ROLE_DEFAULT_PATHS[role])}
        />
      );
    }

    // 2. Score Routes
    if (
      pathname === "/scores" ||
      pathname === "/teacher/scores" ||
      pathname === "/admin/scores" ||
      pathname.match(/^\/classes\/[^/]+\/scores$/)
    ) {
      const classId = params.classId || "cls-7a";
      const subjectId = query.subject || "sub-gl";
      const examType = (query.type as ExamType) || "MIENG";
      return (
        <TeacherScoresPage
          initialClassId={classId}
          initialSubjectId={subjectId}
          initialExamType={examType}
          onBack={() => navigate(ROLE_DEFAULT_PATHS[role])}
        />
      );
    }

    // 3. Class Routes
    if (pathname === "/classes" || pathname === "/admin/classes" || pathname === "/teacher/classes") {
      return <ClassListPage />;
    }

    if (pathname.match(/^\/classes\/[^/]+$/) || pathname.match(/^\/classes\/[^/]+\/students$/)) {
      return <ClassDetailPage />;
    }

    // 4. Student Routes
    if (pathname === "/students" || pathname === "/admin/students" || pathname === "/teacher/students") {
      return <StudentListPage />;
    }

    if (pathname.match(/^\/students\/[^/]+$/)) {
      return <StudentDetailPage />;
    }

    // 5. Notifications
    if (
      pathname === "/notifications" ||
      pathname === "/admin/notifications" ||
      pathname === "/teacher/notifications"
    ) {
      return <NotificationListPage />;
    }

    // 6. Reports
    if (pathname === "/reports" || pathname === "/admin/reports") {
      return <ReportsPage />;
    }

    // 7. Settings
    if (pathname === "/settings" || pathname === "/admin/settings") {
      return <SettingsPage />;
    }

    // 8. Admin Specific: Users & Activity Log
    if (pathname === "/admin/users") {
      return <UsersManagementPage />;
    }

    if (pathname === "/admin/activity-log") {
      return <ActivityLogPage />;
    }

    // 9. Dashboards by Role
    if (pathname === "/admin/dashboard" || (role === "ADMIN" && pathname === "/dashboard")) {
      return <AdminDashboard onNavigate={navigate} />;
    }

    if (pathname === "/teacher/dashboard" || (role === "GLV" && pathname === "/dashboard")) {
      return <TeacherDashboard onNavigate={navigate} />;
    }

    if (
      pathname === "/student/portal" ||
      pathname.startsWith("/student") ||
      (role === "STUDENT" && pathname === "/dashboard")
    ) {
      return <StudentPortal onNavigate={navigate} />;
    }

    if (
      role === "PARENT" ||
      pathname === "/dashboard" ||
      pathname.startsWith("/parent")
    ) {
      return (
        <ParentDashboard
          currentPath={pathname}
          onNavigate={navigate}
        />
      );
    }

    // Fallback default
    return <AdminDashboard onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#292524] flex flex-col font-sans">
      {/* Top Bar with Role Switcher & Real Routing Controls */}
      <header className="bg-[#1C1917] text-white px-4 py-2.5 sm:px-6 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[13px]">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate(ROLE_DEFAULT_PATHS[role])}
          >
            <KitoVuaLogo size={26} />
            <span className="font-bold tracking-tight font-serif text-[14px]">
              Quản lý Giáo lý — Đoàn Kitô Vua
            </span>
            <Badge variant="primary" size="sm">Phase 8 Complete</Badge>
          </div>

          {/* Role Switching & Auth */}
          <div className="flex items-center gap-2">
            <span className="text-[#A8A29E] text-[12px] hidden sm:inline">Vai trò:</span>
            <div className="flex items-center bg-[#292524] rounded-lg p-0.5 border border-[#44403C]">
              {(["ADMIN", "GLV", "PARENT", "STUDENT"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSwitch(r)}
                  className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all cursor-pointer ${
                    role === r
                      ? "bg-[#B4232C] text-white shadow-xs"
                      : "text-[#A8A29E] hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Auth Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  logout();
                  toast.warning("Đã đăng xuất tài khoản!");
                } else {
                  login(role);
                  toast.success(`Đã đăng nhập với vai trò ${role}`);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold transition-colors cursor-pointer border ${
                isAuthenticated
                  ? "bg-[#168154]/20 border-[#168154] text-[#D1FAE5] hover:bg-[#168154]/30"
                  : "bg-[#DC4C4C]/20 border-[#DC4C4C] text-[#FEE2E2] hover:bg-[#DC4C4C]/30"
              }`}
            >
              {isAuthenticated ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
              <span>{isAuthenticated ? "Đăng xuất" : "Đăng nhập"}</span>
            </button>

            {/* Viewport Mode */}
            <div className="hidden lg:flex items-center bg-[#292524] rounded-lg p-0.5 border border-[#44403C] ml-2">
              <button
                type="button"
                onClick={() => setViewportMode("desktop")}
                title="Desktop View"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewportMode === "desktop" ? "bg-[#44403C] text-white" : "text-[#A8A29E]"
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("mobile_sim")}
                title="Mobile 375px Simulation"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewportMode === "mobile_sim" ? "bg-[#44403C] text-white" : "text-[#A8A29E]"
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-header with URL & Fast Links */}
      <div className="bg-white border-b border-[#E7E5E4] px-4 py-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          {/* Quick Route Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setActiveTab("app");
                navigate(ROLE_DEFAULT_PATHS[role]);
              }}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "app"
                  ? "bg-[#B4232C] text-white shadow-xs"
                  : "bg-[#F5F5F4] text-[#57534E] hover:bg-[#E7E5E4]"
              }`}
            >
              🚀 Ứng dụng ({role})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("app");
                navigate("/classes/cls-7a/attendance?date=2026-09-24");
              }}
              className={`px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                pathname.includes("attendance")
                  ? "bg-[#ECFDF3] text-[#168154] font-bold border border-[#A7F3D0]"
                  : "bg-[#FAFAF9] text-[#57534E] hover:bg-[#F5F5F4] border border-[#E7E5E4]"
              }`}
            >
              ✅ Điểm danh 7A (§16 URL)
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("app");
                navigate("/classes/cls-7a/scores?subject=sub-gl&type=MIENG");
              }}
              className={`px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                pathname.includes("scores")
                  ? "bg-[#EFF6FF] text-[#1D4ED8] font-bold border border-[#BFDBFE]"
                  : "bg-[#FAFAF9] text-[#57534E] hover:bg-[#F5F5F4] border border-[#E7E5E4]"
              }`}
            >
              📝 Nhập điểm 7A (§16 URL)
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("app");
                navigate("/classes");
              }}
              className={`px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                pathname === "/classes"
                  ? "bg-[#FFF1F2] text-[#B4232C] font-bold border border-[#FECDD3]"
                  : "bg-[#FAFAF9] text-[#57534E] hover:bg-[#F5F5F4] border border-[#E7E5E4]"
              }`}
            >
              🏫 Danh sách Lớp
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("app");
                navigate("/students");
              }}
              className={`px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                pathname === "/students"
                  ? "bg-[#FFF1F2] text-[#B4232C] font-bold border border-[#FECDD3]"
                  : "bg-[#FAFAF9] text-[#57534E] hover:bg-[#F5F5F4] border border-[#E7E5E4]"
              }`}
            >
              👥 Danh sách Học sinh
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("app");
                navigate("/notifications");
              }}
              className={`px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                pathname === "/notifications"
                  ? "bg-[#FFFBEB] text-[#8B6419] font-bold border border-[#FDE68A]"
                  : "bg-[#FAFAF9] text-[#57534E] hover:bg-[#F5F5F4] border border-[#E7E5E4]"
              }`}
            >
              🔔 Thông báo
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("routing_table")}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "routing_table"
                  ? "bg-[#FFF1F2] text-[#B4232C] font-bold border border-[#FECDD3]"
                  : "text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              📑 Bảng Route Mapping §16
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("data_ownership_matrix")}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "data_ownership_matrix"
                  ? "bg-[#FFF1F2] text-[#B4232C] font-bold border border-[#FECDD3]"
                  : "text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              🛡️ Data Ownership §14 & Permission Matrix §1
            </button>
          </div>

          {/* Current URL indicator */}
          <div className="flex items-center gap-1.5 text-[12px] flex-shrink-0">
            <span className="text-[#78716C]">URL:</span>
            <span className="font-mono bg-[#FAFAF9] px-2.5 py-1 rounded-md border border-[#E7E5E4] text-[#B4232C] font-bold">
              {fullPath}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      {activeTab === "app" && (
        <div className="flex-1 flex justify-center p-2 sm:p-4">
          <div
            className={`w-full transition-all duration-300 ${
              viewportMode === "mobile_sim"
                ? "max-w-[400px] shadow-2xl rounded-[32px] overflow-hidden border-8 border-[#292524] bg-white my-4 min-h-[800px]"
                : "max-w-full"
            }`}
          >
            <AppShell
              role={role}
              user={user || undefined}
              title={currentConfig.name}
              currentPath={pathname}
              onNavigate={navigate}
              notificationCount={role === "ADMIN" ? 3 : role === "GLV" ? 2 : 1}
              breadcrumbs={getBreadcrumbs()}
              showBackButton={pathname !== ROLE_DEFAULT_PATHS[role]}
              onBack={goBack}
              headerActions={
                <Badge variant="gold" icon="★">
                  {role === "ADMIN" ? "Quản trị đoàn" : role === "GLV" ? "GLV Lớp 7A" : "Maria Mai"}
                </Badge>
              }
            >
              {/* RouteGuard enforcing Permission Matrix §1 & Roles */}
              <RouteGuard
                allowedRoles={currentConfig.allowedRoles}
                requiredPermission={currentConfig.requiredPermission}
                currentPath={pathname}
                onNavigate={navigate}
              >
                {renderPageComponent()}
              </RouteGuard>
            </AppShell>
          </div>
        </div>
      )}

      {/* TAB 2: ROUTING CONVENTION TABLE (§16) */}
      {activeTab === "routing_table" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
          <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-[#E7E5E4] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F5F4]">
              <div>
                <h2 className="text-[20px] font-bold text-[#1C1917] font-serif">
                  Bảng Cấu Hình Định Tuyến Thực Tế (URL Convention §16)
                </h2>
                <p className="text-[13px] text-[#78716C] mt-1">
                  Tuân thủ cấu trúc lowercase + kebab/resource hierarchy và chuẩn query parameters.
                </p>
              </div>
              <Badge variant="primary">URL Convention §16</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-[#57534E]">
                    <th className="py-3 px-4 font-semibold">Cấu Trúc URL Pattern</th>
                    <th className="py-3 px-4 font-semibold">Tên Màn Hình</th>
                    <th className="py-3 px-4 font-semibold">Vai Trò Hợp Lệ</th>
                    <th className="py-3 px-4 font-semibold">Quyền Bắt Buộc (§1)</th>
                    <th className="py-3 px-4 font-semibold">Mô Tả & Query Params Hỗ Trợ</th>
                    <th className="py-3 px-4 font-semibold text-right">Điều Hướng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F4]">
                  {ROUTE_CONFIGS.map((cfg) => {
                    const isAllowed = cfg.allowedRoles.includes(role);
                    const sampleUrl = cfg.pattern
                      .replace(":classId", "cls-7a")
                      .replace(":studentId", "stu-001");

                    return (
                      <tr
                        key={cfg.pattern}
                        className={`hover:bg-[#FAFAF9] transition-colors ${
                          pathname === cfg.pattern ? "bg-[#FFF1F2]/50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#B4232C]">
                          {cfg.pattern}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#1C1917]">
                          {cfg.name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {cfg.allowedRoles.map((r) => (
                              <span
                                key={r}
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  r === "ADMIN"
                                    ? "bg-[#FFF1F2] text-[#B4232C]"
                                    : r === "GLV"
                                    ? "bg-[#FFFBEB] text-[#8B6419]"
                                    : "bg-[#EFF6FF] text-[#1D4ED8]"
                                }`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[12px] text-[#57534E]">
                          {cfg.requiredPermission ? (
                            <Badge variant="neutral" size="sm">
                              {cfg.requiredPermission}
                            </Badge>
                          ) : (
                            <span className="text-[#A8A29E]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#57534E]">
                          {cfg.description}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant={isAllowed ? "primary" : "outline"}
                            size="sm"
                            onClick={() => {
                              navigate(sampleUrl);
                              setActiveTab("app");
                            }}
                          >
                            {isAllowed ? "Truy cập" : "Thử 403"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA OWNERSHIP MATRIX (§14) */}
      {activeTab === "data_ownership_matrix" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
          <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-[#E7E5E4] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
              <div>
                <h2 className="text-[20px] font-bold text-[#1C1917] font-serif">
                  Quy Định Phân Quyền Dữ Liệu (Data Ownership §14)
                </h2>
                <p className="text-[13px] text-[#78716C] mt-1">
                  Đảm bảo mỗi vai trò chỉ truy vấn và tương tác đúng phạm vi dữ liệu được phép.
                </p>
              </div>
              <Badge variant="success">Enforced in Service Layer</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* ADMIN */}
              <div className="p-4 rounded-[14px] bg-[#FFF1F2] border border-[#FECDD3] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#B4232C]">ADMIN</span>
                  <Badge variant="primary" size="sm">All Data</Badge>
                </div>
                <h4 className="font-bold text-[14px] text-[#1C1917]">Quản trị toàn đoàn</h4>
                <p className="text-[12px] text-[#57534E]">
                  Toàn bộ tổ chức: tất cả lớp, học sinh, điểm danh, điểm số, tài khoản, cấu hình và activity log.
                </p>
              </div>

              {/* GLV */}
              <div className="p-4 rounded-[14px] bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8B6419]">GLV</span>
                  <Badge variant="gold" size="sm">Assigned Only</Badge>
                </div>
                <h4 className="font-bold text-[14px] text-[#1C1917]">Lớp phân công</h4>
                <p className="text-[12px] text-[#57534E]">
                  Chỉ query & cập nhật học sinh, điểm danh, điểm số thuộc lớp được phân công (VD: Lớp 7A, 8A).
                </p>
              </div>

              {/* PARENT */}
              <div className="p-4 rounded-[14px] bg-[#EFF6FF] border border-[#BFDBFE] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1D4ED8]">PARENT</span>
                  <Badge variant="info" size="sm">Linked Children</Badge>
                </div>
                <h4 className="font-bold text-[14px] text-[#1C1917]">Con cái liên kết</h4>
                <p className="text-[12px] text-[#57534E]">
                  Chỉ xem bảng điểm, chuyên cần và thông báo của các con được liên kết vào tài khoản.
                </p>
              </div>

              {/* STUDENT */}
              <div className="p-4 rounded-[14px] bg-[#F5F3FF] border border-[#DDD6FE] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#6D28D9]">STUDENT</span>
                  <Badge variant="neutral" size="sm">Self Data Only</Badge>
                </div>
                <h4 className="font-bold text-[14px] text-[#1C1917]">Dữ liệu bản thân</h4>
                <p className="text-[12px] text-[#57534E]">
                  Chỉ xem thông tin, điểm số, chuyên cần và tiến trình XP/huy hiệu của chính mình.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider initialRole="ADMIN" initialAuth={true}>
        <ParentProvider>
          <RouterProvider>
            <MainRouterView />
          </RouterProvider>
        </ParentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
