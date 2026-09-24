import { useState } from "react";
import { AppShell } from "./components/layout";
import {
  RouteGuard,
  PermissionGate,
  Forbidden403,
} from "./components/auth";
import {
  Button,
  Badge,
  StatCard,
  ToastProvider,
  useToast,
  KitoVuaLogo,
} from "./components/ui";
import { AttendancePage } from "./components/attendance";
import { TeacherScoresPage } from "./pages/teacher/scores";
import { ParentDashboard } from "./pages/parent";
import { ParentProvider } from "./context/ParentContext";
import {
  AuthProvider,
  useAuth,
  ROLE_DEFAULT_PATHS,
} from "./context/AuthContext";
import { UserRole, AppPermission, BreadcrumbItem } from "./types";
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Monitor,
  Users,
  CheckSquare,
  FileSpreadsheet,
  Lock,
  Trash2,
  Download,
  LogOut,
  LogIn,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

// ============================================================================
// ROUTE TO ROLE MAPPING CONTRACT TABLE DATA (§2, §7, §14, §19)
// ============================================================================
interface RouteMapping {
  route: string;
  name: string;
  allowedRoles: UserRole[];
  requiredPermission?: AppPermission;
  defaultRedirect?: string;
  notes: string;
}

const ROUTE_ROLE_MAPPINGS: RouteMapping[] = [
  {
    route: "/admin/dashboard",
    name: "Admin Dashboard",
    allowedRoles: ["ADMIN"],
    defaultRedirect: "/admin/dashboard",
    notes: "Tổng quan toàn đoàn, KPI 4 cột, chart chuyên cần & điểm, cảnh báo",
  },
  {
    route: "/admin/users",
    name: "Quản lý Người dùng",
    allowedRoles: ["ADMIN"],
    requiredPermission: "user:view",
    notes: "CRUD tài khoản GLV, Phụ huynh, Học sinh (§3)",
  },
  {
    route: "/admin/classes",
    name: "Quản lý Lớp học",
    allowedRoles: ["ADMIN"],
    notes: "Tạo lớp, phân công GLV, cấu hình khối lớp",
  },
  {
    route: "/admin/settings",
    name: "Cài đặt Hệ thống",
    allowedRoles: ["ADMIN"],
    requiredPermission: "settings:update",
    notes: "Thông tin Giáo xứ, niên khóa, quy tắc tính điểm",
  },
  {
    route: "/teacher/dashboard",
    name: "GLV Dashboard",
    allowedRoles: ["GLV"],
    defaultRedirect: "/teacher/dashboard",
    notes: "Truy cập nhanh Điểm danh & Nhập điểm trong tối đa 1 thao tác",
  },
  {
    route: "/teacher/attendance",
    name: "GLV Điểm danh",
    allowedRoles: ["ADMIN", "GLV"],
    requiredPermission: "attendance:update",
    notes: "Điểm danh 1 chạm (Có mặt, Vắng, Phép, Muộn) + Lưu nhanh",
  },
  {
    route: "/teacher/scores",
    name: "GLV Nhập điểm",
    allowedRoles: ["ADMIN", "GLV"],
    requiredPermission: "score:update",
    notes: "Nhập điểm hàng loạt, hỗ trợ phím số, Import Excel",
  },
  {
    route: "/dashboard",
    name: "Parent/Student Dashboard",
    allowedRoles: ["PARENT", "STUDENT"],
    defaultRedirect: "/dashboard",
    notes: "Điểm trung bình, chuyên cần, nhận xét GLV, thành tích gamification",
  },
  {
    route: "/parent/scores",
    name: "Phụ huynh Xem Bảng điểm",
    allowedRoles: ["PARENT", "STUDENT"],
    requiredPermission: "score:view",
    notes: "Xem điểm con, đổi học sinh con đang xem (Child Switcher)",
  },
  {
    route: "/parent/attendance",
    name: "Lịch sử Điểm danh",
    allowedRoles: ["PARENT", "STUDENT"],
    requiredPermission: "attendance:view",
    notes: "Tỷ lệ chuyên cần, danh sách các buổi học Chúa Nhật",
  },
  {
    route: "/parent/notifications",
    name: "Thông báo Xứ đoàn",
    allowedRoles: ["PARENT", "STUDENT"],
    requiredPermission: "notification:view",
    notes: "Thông báo chung, lớp học, học sinh (điểm danh/điểm số) và tin khẩn",
  },
];

// Standard keys from 03_Component_Library.md §29
const PERMISSION_TEST_KEYS: { key: AppPermission; label: string; icon: string }[] = [
  { key: "student:view", label: "Xem học sinh (student:view)", icon: "👥" },
  { key: "attendance:update", label: "Cập nhật điểm danh (attendance:update)", icon: "✅" },
  { key: "score:update", label: "Cập nhật điểm (score:update)", icon: "📝" },
  { key: "score:export", label: "Xuất Excel điểm (score:export)", icon: "📊" },
  { key: "user:create", label: "Tạo người dùng (user:create)", icon: "➕" },
  { key: "user:delete", label: "Xóa người dùng (user:delete)", icon: "🗑️" },
  { key: "settings:update", label: "Cập nhật cài đặt (settings:update)", icon: "⚙️" },
];

function Phase3Showcase() {
  const toast = useToast();
  const { role, user, isAuthenticated, switchRole, logout, login, hasPermission } = useAuth();

  // Navigation simulation state
  const [currentPath, setCurrentPath] = useState<string>(ROLE_DEFAULT_PATHS[role]);
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile_sim">("desktop");
  const [activeTab, setActiveTab] = useState<"showcase" | "attendance" | "scores" | "parent" | "matrix" | "guard_test">("showcase");

  // Breadcrumb generator based on current route
  const getBreadcrumbs = (path: string): BreadcrumbItem[] => {
    if (path.startsWith("/admin")) {
      return [
        { label: "Admin Portal", onClick: () => handleNavigate("/admin/dashboard") },
        { label: path.includes("users") ? "Người dùng" : path.includes("classes") ? "Lớp học" : "Tổng quan" },
      ];
    }
    if (path.startsWith("/teacher")) {
      return [
        { label: "Giáo lý viên", onClick: () => handleNavigate("/teacher/dashboard") },
        { label: path.includes("attendance") ? "Điểm danh" : path.includes("scores") ? "Nhập điểm" : "Lớp của tôi" },
      ];
    }
    return [
      { label: "Trang chủ", onClick: () => handleNavigate("/dashboard") },
      { label: path.includes("scores") ? "Bảng điểm" : path.includes("attendance") ? "Chuyên cần" : "Tổng quan học tập" },
    ];
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    const newHome = ROLE_DEFAULT_PATHS[newRole];
    setCurrentPath(newHome);
    toast.info(`Đã đổi vai trò sang: ${newRole} · Điều hướng về: ${newHome}`);
  };

  // Find mapping for current route
  const currentRouteMeta = ROUTE_ROLE_MAPPINGS.find((r) => r.route === currentPath) || {
    route: currentPath,
    name: currentPath,
    allowedRoles: ["ADMIN", "GLV", "PARENT", "STUDENT"] as UserRole[],
    notes: "Trang điều hướng linh hoạt",
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#292524] flex flex-col font-sans">
      {/* ===================================================================== */}
      {/* TOP CONTROL BAR: ROLE SWITCHER, AUTH STATUS, VIEWPORT SIMULATOR */}
      {/* ===================================================================== */}
      <div className="bg-[#1C1917] text-white px-4 py-2.5 sm:px-6 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[13px]">
          {/* Brand & Phase indicator */}
          <div className="flex items-center gap-2.5">
            <KitoVuaLogo size={26} />
            <span className="font-bold tracking-tight font-serif text-[14px]">
              Quản lý Giáo lý - Đoàn Kitô Vua
            </span>
            <Badge variant="primary" size="sm">Gx. Đức Mẹ Hằng Cứu Giúp</Badge>
          </div>

          {/* Role Switching Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[#A8A29E] text-[12px] hidden sm:inline">Vai trò:</span>
            <div className="flex items-center bg-[#292524] rounded-lg p-0.5 border border-[#44403C]">
              {(["ADMIN", "GLV", "PARENT", "STUDENT"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
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

            {/* Viewport Simulator Button */}
            <div className="hidden lg:flex items-center bg-[#292524] rounded-lg p-0.5 border border-[#44403C] ml-2">
              <button
                type="button"
                onClick={() => setViewportMode("desktop")}
                title="Desktop (Header + Sidebar + Content)"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewportMode === "desktop" ? "bg-[#44403C] text-white" : "text-[#A8A29E]"
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("mobile_sim")}
                title="Mô phỏng Mobile 375px (Header + Content + MobileBottomNav)"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewportMode === "mobile_sim" ? "bg-[#44403C] text-white" : "text-[#A8A29E]"
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-header Navigation Tabs for Testing */}
      <div className="bg-white border-b border-[#E7E5E4] px-4 py-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("showcase")}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "showcase"
                  ? "bg-[#FFF1F2] text-[#B4232C]"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              🏛️ AppShell & Layout Live Preview
            </button>
            <button
              onClick={() => {
                setActiveTab("attendance");
                handleNavigate("/teacher/attendance");
              }}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "attendance"
                  ? "bg-[#B4232C] text-white shadow-xs"
                  : "bg-[#FFF1F2] text-[#B4232C] hover:bg-[#FFE4E6]"
              }`}
            >
              <span>✅</span>
              <span>Điểm Danh (Phase 4)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("scores");
                handleNavigate("/teacher/scores");
              }}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "scores"
                  ? "bg-[#B4232C] text-white shadow-xs"
                  : "bg-[#FFF1F2] text-[#B4232C] hover:bg-[#FFE4E6]"
              }`}
            >
              <span>📝</span>
              <span>Nhập Điểm GLV (Phase 5)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("parent");
                switchRole("PARENT");
                handleNavigate("/dashboard");
              }}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "parent"
                  ? "bg-[#B4232C] text-white shadow-xs"
                  : "bg-[#FFF1F2] text-[#B4232C] hover:bg-[#FFE4E6]"
              }`}
            >
              <span>👨‍👩‍👧</span>
              <span>Phụ Huynh & Bảng Điểm (Phase 6)</span>
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "matrix"
                  ? "bg-[#FFF1F2] text-[#B4232C]"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              📑 Bảng Route → Role Mapping (§19)
            </button>
            <button
              onClick={() => setActiveTab("guard_test")}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "guard_test"
                  ? "bg-[#FFF1F2] text-[#B4232C]"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              🛡️ RouteGuard & PermissionGate Tests (§7, §29)
            </button>
          </div>

          {/* Quick Route Switcher */}
          <div className="flex items-center gap-1.5 text-[12px] flex-shrink-0">
            <span className="text-[#78716C]">Route:</span>
            <span className="font-mono bg-[#FAFAF9] px-2 py-0.5 rounded border border-[#E7E5E4] text-[#B4232C] font-semibold">
              {currentPath}
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: APPSHELL SHOWCASE */}
      {/* ===================================================================== */}
      {activeTab === "showcase" && (
        <div className="flex-1 flex justify-center p-2 sm:p-4">
          <div
            className={`w-full transition-all duration-300 ${
              viewportMode === "mobile_sim"
                ? "max-w-[390px] shadow-2xl rounded-[32px] overflow-hidden border-8 border-[#292524] bg-white my-4 min-h-[780px]"
                : "max-w-full"
            }`}
          >
            {/* The AppShell receives prop role: UserRole */}
            <AppShell
              role={role}
              user={user || undefined}
              title={
                currentPath.includes("admin")
                  ? "Admin Dashboard"
                  : currentPath.includes("teacher")
                  ? "Không gian GLV"
                  : "Học tập & Điểm số"
              }
              currentPath={currentPath}
              onNavigate={handleNavigate}
              notificationCount={role === "ADMIN" ? 3 : role === "GLV" ? 2 : 1}
              breadcrumbs={getBreadcrumbs(currentPath)}
              showBackButton={currentPath !== ROLE_DEFAULT_PATHS[role]}
              onBack={() => handleNavigate(ROLE_DEFAULT_PATHS[role])}
              headerActions={
                <Badge variant="gold" icon="★">
                  {role === "ADMIN" ? "Quản trị đoàn" : role === "GLV" ? "Lớp Rước Lễ 1" : "Maria Mai"}
                </Badge>
              }
            >
              {/* Wrapped in RouteGuard (§7) */}
              <RouteGuard
                allowedRoles={currentRouteMeta.allowedRoles}
                requiredPermission={currentRouteMeta.requiredPermission}
                currentPath={currentPath}
                onNavigate={handleNavigate}
              >
                {/* Route: Điểm danh hôm nay (/teacher/attendance) */}
                {currentPath === "/teacher/attendance" ? (
                  <AttendancePage
                    onBack={() => handleNavigate(role === "GLV" ? "/teacher/dashboard" : "/admin/dashboard")}
                  />
                ) : currentPath === "/teacher/scores" ? (
                  <TeacherScoresPage
                    onBack={() => handleNavigate(role === "GLV" ? "/teacher/dashboard" : "/admin/dashboard")}
                  />
                ) : role === "PARENT" || currentPath === "/dashboard" || currentPath.startsWith("/parent") ? (
                  <ParentDashboard
                    currentPath={currentPath}
                    onNavigate={handleNavigate}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Banner / Current Context */}
                    <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#E7E5E4] shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F5F5F4]">
                        <div className="flex items-center gap-2">
                          <Badge variant="primary">{currentRouteMeta.name}</Badge>
                          <span className="text-[12px] text-[#78716C] font-mono">{currentPath}</span>
                        </div>
                        <Badge variant="success" dot>
                          RouteGuard: Hợp lệ ({role})
                        </Badge>
                      </div>

                      <p className="text-[14px] text-[#57534E]">
                        {currentRouteMeta.notes}
                      </p>

                      {/* Quick navigation buttons inside content */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        <span className="text-[12px] font-semibold text-[#78716C] flex items-center mr-1">
                          Chuyển nhanh trang:
                        </span>
                        {ROUTE_ROLE_MAPPINGS.map((item) => (
                          <button
                            key={item.route}
                            type="button"
                            onClick={() => handleNavigate(item.route)}
                            className={`px-2.5 py-1 text-[12px] font-medium rounded-[6px] border transition-colors cursor-pointer ${
                              currentPath === item.route
                                ? "bg-[#B4232C] text-white border-[#B4232C]"
                                : "bg-white text-[#57534E] border-[#E7E5E4] hover:bg-[#F5F5F4]"
                            }`}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* GLV 1-Touch Quick Action Card (Sitemap §8 & Wireframe) */}
                    {(role === "GLV" || role === "ADMIN") && (
                      <div className="p-4 sm:p-5 rounded-[16px] bg-gradient-to-r from-[#FFF1F2] via-white to-[#FFFBEB] border border-[#FECDD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="primary" dot>Truy cập 1 thao tác GLV</Badge>
                            <span className="text-[12px] font-bold text-[#B4232C]">Chúa Nhật hôm nay</span>
                          </div>
                          <h2 className="text-[17px] sm:text-[19px] font-bold text-[#1C1917] font-serif">
                            Điểm danh Giáo lý — Lớp Rước Lễ 1A
                          </h2>
                          <p className="text-[13px] text-[#57534E]">
                            Thao tác 1 chạm: Có mặt → Vắng → Có phép → Đi muộn. Lưu nhanh chống mất dữ liệu khi mất mạng.
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          size="lg"
                          leftIcon={<CalendarCheck className="w-5 h-5" />}
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                          onClick={() => handleNavigate("/teacher/attendance")}
                          className="!min-h-[50px] px-6 font-bold shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          Điểm danh hôm nay
                        </Button>
                      </div>
                    )}

                    {/* Sample KPI Cards in AppShell */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard
                        title="Tổng học sinh"
                        value={128}
                        icon={<Users className="w-5 h-5" />}
                        trend="+5 tháng này"
                        trendType="positive"
                      />
                      <StatCard
                        title="Chuyên cần đoàn"
                        value="94.2%"
                        icon={<CheckSquare className="w-5 h-5" />}
                        trend="+1.2%"
                        trendType="positive"
                      />
                      <StatCard
                        title="Điểm TB khối"
                        value="8.4"
                        icon={<FileSpreadsheet className="w-5 h-5" />}
                        trend="Kỳ I"
                        trendType="neutral"
                      />
                      <StatCard
                        title="Cảnh báo vắng"
                        value="3 em"
                        icon={<ShieldAlert className="w-5 h-5" />}
                        subtitle="Vắng > 2 buổi"
                        trendType="negative"
                      />
                    </div>

                    {/* PermissionGate Demo Cards */}
                    <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#E7E5E4] shadow-xs space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F4]">
                        <div>
                          <h3 className="font-bold text-[16px] text-[#1C1917] font-serif">
                            PermissionGate (§29) · Thao tác nghiệp vụ theo quyền
                          </h3>
                          <p className="text-[12px] text-[#78716C] mt-0.5">
                            Các nút bên dưới tự động ẩn/hiện hoặc fallback dựa theo quyền thực tế của role ({role})
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Permission: attendance:update */}
                        <PermissionGate
                          permission="attendance:update"
                          fallback={
                            <div className="p-3 rounded-[10px] bg-[#FAFAF9] border border-[#E7E5E4] text-[12px] text-[#A8A29E] flex items-center gap-2">
                              <Lock className="w-4 h-4 text-[#A8A29E]" />
                              <span>Khóa: attendance:update</span>
                            </div>
                          }
                        >
                          <div className="p-3 rounded-[10px] bg-[#ECFDF3] border border-[#A7F3D0] flex items-center justify-between">
                            <div className="text-[13px] font-semibold text-[#168154]">
                              ✅ Điểm danh hôm nay
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                handleNavigate("/teacher/attendance");
                                toast.success("Đã mở màn hình Điểm danh hôm nay");
                              }}
                            >
                              Thực hiện
                            </Button>
                          </div>
                        </PermissionGate>

                        {/* Permission: score:export */}
                        <PermissionGate
                          permission="score:export"
                          fallback={
                            <div className="p-3 rounded-[10px] bg-[#FAFAF9] border border-[#E7E5E4] text-[12px] text-[#A8A29E] flex items-center gap-2">
                              <Lock className="w-4 h-4 text-[#A8A29E]" />
                              <span>Khóa: score:export</span>
                            </div>
                          }
                        >
                          <div className="p-3 rounded-[10px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between">
                            <div className="text-[13px] font-semibold text-[#1D4ED8]">
                              📊 Xuất file Excel điểm
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Download className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                              onClick={() => toast.info("Đang kết xuất báo cáo Excel...")}
                            >
                              Xuất
                            </Button>
                          </div>
                        </PermissionGate>

                        {/* Permission: user:delete */}
                        <PermissionGate
                          permission="user:delete"
                          fallback={
                            <div className="p-3 rounded-[10px] bg-[#FAFAF9] border border-[#E7E5E4] text-[12px] text-[#A8A29E] flex items-center gap-2">
                              <Lock className="w-4 h-4 text-[#A8A29E]" />
                              <span>Khóa: user:delete (Chỉ Admin)</span>
                            </div>
                          }
                        >
                          <div className="p-3 rounded-[10px] bg-[#FEF2F2] border border-[#FECDD3] flex items-center justify-between">
                            <div className="text-[13px] font-semibold text-[#C73A3A]">
                              🗑️ Xóa tài khoản
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                              onClick={() => toast.error("Đã kích hoạt quyền xóa người dùng")}
                            >
                              Xóa
                            </Button>
                          </div>
                        </PermissionGate>
                      </div>
                    </div>
                  </div>
                )}
              </RouteGuard>
            </AppShell>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB: ATTENDANCE MODULE (PHASE 4) (§21, §30, §31, §8) */}
      {/* ===================================================================== */}
      {activeTab === "attendance" && (
        <div className="flex-1">
          <AttendancePage
            onBack={() => {
              setActiveTab("showcase");
              handleNavigate(ROLE_DEFAULT_PATHS[role]);
            }}
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB: SCORE ENTRY MODULE (PHASE 5) (§22, §23, §30, §9, §10) */}
      {/* ===================================================================== */}
      {activeTab === "scores" && (
        <div className="flex-1">
          <TeacherScoresPage
            onBack={() => {
              setActiveTab("showcase");
              handleNavigate(ROLE_DEFAULT_PATHS[role]);
            }}
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB: PARENT DASHBOARD & GRADE OVERVIEW (PHASE 6) (§24, §27, §30)       */}
      {/* ===================================================================== */}
      {activeTab === "parent" && (
        <div className="flex-1 flex justify-center p-2 sm:p-4">
          <div
            className={`w-full transition-all duration-300 ${
              viewportMode === "mobile_sim"
                ? "max-w-[420px] shadow-2xl rounded-[32px] overflow-hidden border-8 border-[#292524] bg-[#FAFAF9] my-4 min-h-[820px]"
                : "max-w-4xl"
            }`}
          >
            <ParentDashboard
              currentPath={currentPath}
              onNavigate={(path) => {
                handleNavigate(path);
              }}
            />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: ROUTE TO ROLE MAPPING TABLE (§19 NAVIGATION CONTRACT) */}
      {/* ===================================================================== */}
      {activeTab === "matrix" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
          <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-[#E7E5E4] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F5F4]">
              <div>
                <h2 className="text-[20px] font-bold text-[#1C1917] font-serif">
                  Bảng Route → Role Mapping Contract (§2, §7, §14, §19)
                </h2>
                <p className="text-[13px] text-[#78716C] mt-1">
                  Định nghĩa rõ quyền hạn truy cập từng route, vai trò tương ứng và luồng RouteGuard.
                </p>
              </div>
              <Badge variant="primary">Navigation Contract §19</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-[#57534E]">
                    <th className="py-3 px-4 font-semibold">Route Path</th>
                    <th className="py-3 px-4 font-semibold">Tên Màn Hình</th>
                    <th className="py-3 px-4 font-semibold">Vai Trò Được Phép</th>
                    <th className="py-3 px-4 font-semibold">Yêu Cầu Quyền (§29)</th>
                    <th className="py-3 px-4 font-semibold">Mô Tả & Ghi Chú</th>
                    <th className="py-3 px-4 font-semibold text-right">Thử Nghiệm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F4]">
                  {ROUTE_ROLE_MAPPINGS.map((mapping) => {
                    const isAllowed = mapping.allowedRoles.includes(role);
                    return (
                      <tr
                        key={mapping.route}
                        className={`hover:bg-[#FAFAF9] transition-colors ${
                          currentPath === mapping.route ? "bg-[#FFF1F2]/50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#B4232C]">
                          {mapping.route}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#1C1917]">
                          {mapping.name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {mapping.allowedRoles.map((r) => (
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
                          {mapping.requiredPermission ? (
                            <Badge variant="neutral" size="sm">
                              {mapping.requiredPermission}
                            </Badge>
                          ) : (
                            <span className="text-[#A8A29E]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#57534E] max-w-xs">
                          {mapping.notes}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant={isAllowed ? "primary" : "outline"}
                            size="sm"
                            onClick={() => {
                              handleNavigate(mapping.route);
                              setActiveTab("showcase");
                            }}
                          >
                            {isAllowed ? "Truy cập" : "Thử chặn (403)"}
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

      {/* ===================================================================== */}
      {/* TAB 3: ROUTEGUARD & PERMISSIONGATE INTERACTIVE TESTING */}
      {/* ===================================================================== */}
      {activeTab === "guard_test" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
          {/* Permission Matrix Checker for Current Role */}
          <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-[#E7E5E4] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F5F5F4] gap-2">
              <div>
                <h3 className="text-[18px] font-bold text-[#1C1917] font-serif">
                  Trình Kiểm Tra Quyền (§29) theo Vai Trò ({role})
                </h3>
                <p className="text-[13px] text-[#78716C] mt-0.5">
                  Kiểm tra trực tiếp hàm `hasPermission("resource:action")` trên tầng Auth Layer.
                </p>
              </div>
              <Badge variant={role === "ADMIN" ? "primary" : role === "GLV" ? "gold" : "info"}>
                Đang đăng nhập: {role}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {PERMISSION_TEST_KEYS.map(({ key, label }) => {
                const allowed = hasPermission(key);
                return (
                  <div
                    key={key}
                    className={`p-3.5 rounded-[12px] border transition-all flex items-start gap-2.5 ${
                      allowed
                        ? "bg-[#ECFDF3] border-[#A7F3D0] text-[#146C47]"
                        : "bg-[#FAFAF9] border-[#E7E5E4] text-[#A8A29E] opacity-75"
                    }`}
                  >
                    <div className="mt-0.5">
                      {allowed ? (
                        <ShieldCheck className="w-5 h-5 text-[#168154]" />
                      ) : (
                        <Lock className="w-5 h-5 text-[#A8A29E]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[13px] truncate">{label}</div>
                      <div className="text-[11px] mt-0.5 font-bold uppercase">
                        {allowed ? "ĐƯỢC PHÉP" : "BỊ TỪ CHỐI"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 403 Forbidden Component Test */}
          <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-[#E7E5E4] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
              <div>
                <h3 className="text-[18px] font-bold text-[#1C1917] font-serif">
                  Kiểm Thử Màn Hình Lỗi 403 Forbidden (§7)
                </h3>
                <p className="text-[13px] text-[#78716C] mt-0.5">
                  Đúng câu từ quy định: "Bạn không có quyền truy cập trang này." + nút "Quay về trang chủ"
                </p>
              </div>
              <Badge variant="warning">Mẫu hiển thị 403 tiêu chuẩn</Badge>
            </div>

            <Forbidden403
              role={role}
              message="Bạn không có quyền truy cập trang này."
              onGoHome={(home) => {
                handleNavigate(home);
                toast.success(`Đã quay về trang chủ theo vai trò: ${home}`);
                setActiveTab("showcase");
              }}
            />
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
          <Phase3Showcase />
        </ParentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
