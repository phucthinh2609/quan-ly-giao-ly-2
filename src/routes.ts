import { matchPath } from "./context/RouterContext";
import { AppPermission, BreadcrumbItem, UserRole } from "./types";

// ============================================================================
// ROUTE DEFINITIONS & PERMISSION MATRIX (02 §1, §20)
// `name` là tiêu đề trang (hiện trên Header khi cuộn).
// ============================================================================

export interface RouteConfig {
  pattern: string;
  name: string;
  allowedRoles: UserRole[];
  requiredPermission?: AppPermission;
  description: string;
}

const ALL: UserRole[] = ["ADMIN", "GLV", "PARENT", "STUDENT"];

export const PUBLIC_PATHS = ["/welcome", "/login"];

export const ROUTE_CONFIGS: RouteConfig[] = [
  // Chung
  { pattern: "/dashboard", name: "Trang chủ", allowedRoles: ALL, description: "Trang chủ theo vai trò" },
  { pattern: "/classes", name: "Lớp học", allowedRoles: ["ADMIN", "GLV"], description: "Toàn bộ lớp hoặc lớp được phân công" },
  { pattern: "/classes/:classId", name: "Chi tiết lớp", allowedRoles: ["ADMIN", "GLV"], description: "Thông tin lớp, danh sách học sinh" },
  { pattern: "/classes/:classId/attendance", name: "Điểm danh", allowedRoles: ["ADMIN", "GLV"], requiredPermission: "attendance:update", description: "Điểm danh 1 chạm, query date=YYYY-MM-DD" },
  { pattern: "/classes/:classId/scores", name: "Nhập điểm", allowedRoles: ["ADMIN", "GLV"], requiredPermission: "score:update", description: "Nhập điểm theo môn (subject) và loại điểm (type)" },
  { pattern: "/classes/:classId/students", name: "Học sinh của lớp", allowedRoles: ["ADMIN", "GLV"], description: "Danh sách học sinh trong lớp" },
  { pattern: "/students", name: "Học sinh", allowedRoles: ALL, description: "Danh sách học sinh theo quyền dữ liệu" },
  { pattern: "/students/:studentId", name: "Hồ sơ học sinh", allowedRoles: ALL, description: "Kết quả học tập và chuyên cần" },
  { pattern: "/attendance", name: "Điểm danh", allowedRoles: ["ADMIN", "GLV"], requiredPermission: "attendance:update", description: "Điểm danh nhanh" },
  { pattern: "/scores", name: "Nhập điểm", allowedRoles: ["ADMIN", "GLV"], requiredPermission: "score:update", description: "Nhập điểm và nhập từ Excel" },
  { pattern: "/notifications", name: "Thông báo", allowedRoles: ALL, description: "Tin tức, sinh hoạt, thông báo khẩn" },
  { pattern: "/reports", name: "Báo cáo", allowedRoles: ["ADMIN", "GLV"], description: "Thống kê chuyên cần và điểm số" },
  { pattern: "/settings", name: "Cài đặt", allowedRoles: ["ADMIN"], requiredPermission: "settings:update", description: "Thông tin xứ đoàn, quy tắc tính điểm" },

  // Admin
  { pattern: "/admin/dashboard", name: "Tổng quan", allowedRoles: ["ADMIN"], description: "KPI, biểu đồ toàn đoàn" },
  { pattern: "/admin/users", name: "Người dùng", allowedRoles: ["ADMIN"], requiredPermission: "user:view", description: "Tài khoản GLV, phụ huynh, học sinh" },
  { pattern: "/admin/classes", name: "Lớp học", allowedRoles: ["ADMIN"], description: "Quản trị lớp học" },
  { pattern: "/admin/students", name: "Học sinh", allowedRoles: ["ADMIN"], description: "Toàn bộ thiếu nhi" },
  { pattern: "/admin/attendance", name: "Điểm danh", allowedRoles: ["ADMIN"], requiredPermission: "attendance:update", description: "Điểm danh và kiểm tra chuyên cần" },
  { pattern: "/admin/scores", name: "Bảng điểm", allowedRoles: ["ADMIN"], requiredPermission: "score:update", description: "Nhập và tổng hợp điểm" },
  { pattern: "/admin/reports", name: "Báo cáo", allowedRoles: ["ADMIN"], description: "Thống kê và xuất Excel" },
  { pattern: "/admin/notifications", name: "Thông báo", allowedRoles: ["ADMIN"], requiredPermission: "notification:create", description: "Tạo và gửi thông báo" },
  { pattern: "/admin/settings", name: "Cài đặt", allowedRoles: ["ADMIN"], requiredPermission: "settings:update", description: "Cấu hình xứ đoàn và năm học" },
  { pattern: "/admin/activity-log", name: "Nhật ký hoạt động", allowedRoles: ["ADMIN"], description: "Lịch sử thao tác toàn hệ thống" },

  // GLV
  { pattern: "/teacher/dashboard", name: "Trang chủ", allowedRoles: ["GLV", "ADMIN"], description: "Không gian làm việc của Giáo lý viên" },
  { pattern: "/teacher/classes", name: "Lớp của tôi", allowedRoles: ["GLV", "ADMIN"], description: "Các lớp được phân công" },
  { pattern: "/teacher/attendance", name: "Điểm danh", allowedRoles: ["GLV", "ADMIN"], requiredPermission: "attendance:update", description: "Điểm danh 1 chạm" },
  { pattern: "/teacher/scores", name: "Nhập điểm", allowedRoles: ["GLV", "ADMIN"], requiredPermission: "score:update", description: "Bảng nhập điểm theo lớp" },
  { pattern: "/teacher/students", name: "Học sinh", allowedRoles: ["GLV", "ADMIN"], description: "Học sinh lớp phụ trách" },
  { pattern: "/teacher/notifications", name: "Thông báo", allowedRoles: ["GLV", "ADMIN"], description: "Thông báo dành cho Giáo lý viên" },

  // Phụ huynh
  { pattern: "/parent/scores", name: "Bảng điểm", allowedRoles: ["PARENT", "ADMIN"], requiredPermission: "score:view", description: "Điểm của con và nhận xét GLV" },
  { pattern: "/parent/attendance", name: "Điểm danh", allowedRoles: ["PARENT", "ADMIN"], requiredPermission: "attendance:view", description: "Chuyên cần của con" },
  { pattern: "/parent/notifications", name: "Thông báo", allowedRoles: ["PARENT", "ADMIN"], requiredPermission: "notification:view", description: "Thông báo liên quan đến con" },
  { pattern: "/parent/achievements", name: "Thành tích", allowedRoles: ["PARENT", "ADMIN"], description: "Huy hiệu và tiến bộ của con" },

  // Học sinh
  { pattern: "/student/portal", name: "Góc của em", allowedRoles: ["STUDENT", "PARENT", "ADMIN"], description: "Level, XP, huy hiệu, nhiệm vụ" },
  { pattern: "/student/scores", name: "Điểm của em", allowedRoles: ["STUDENT", "ADMIN"], description: "Điểm các môn học" },
  { pattern: "/student/attendance", name: "Chuyên cần", allowedRoles: ["STUDENT", "ADMIN"], description: "Lịch đi học Chúa Nhật" },
  { pattern: "/student/achievements", name: "Huy hiệu", allowedRoles: ["STUDENT", "ADMIN"], description: "Thành tích và nhiệm vụ" },
  { pattern: "/student/notifications", name: "Thông báo", allowedRoles: ["STUDENT", "ADMIN"], description: "Tin tức xứ đoàn" },
];

export function findRouteConfig(pathname: string): RouteConfig {
  for (const cfg of ROUTE_CONFIGS) {
    if (cfg.pattern === pathname || matchPath(cfg.pattern, pathname).matches) return cfg;
  }
  return { pattern: pathname, name: "Quản lý Giáo lý", allowedRoles: ALL, description: "Trang hệ thống" };
}

/** Breadcrumb theo cấp URL (02 §17). */
export function buildBreadcrumbs(
  pathname: string,
  params: Record<string, string>,
  role: UserRole,
  homePath: string,
  navigate: (path: string) => void
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: role === "ADMIN" ? "Tổng quan" : role === "STUDENT" ? "Góc của em" : "Trang chủ", onClick: () => navigate(homePath) },
  ];

  if (pathname.includes("/classes")) {
    items.push({ label: "Lớp học", onClick: () => navigate(role === "GLV" ? "/teacher/classes" : "/classes") });
    if (params.classId) items.push({ label: params.classId.toUpperCase(), onClick: () => navigate(`/classes/${params.classId}`) });
    if (pathname.endsWith("/attendance")) items.push({ label: "Điểm danh" });
    if (pathname.endsWith("/scores")) items.push({ label: "Nhập điểm" });
  } else if (pathname.includes("/students")) {
    items.push({ label: "Học sinh", onClick: () => navigate("/students") });
    if (params.studentId) items.push({ label: params.studentId.toUpperCase() });
  } else if (pathname !== homePath) {
    const cfg = findRouteConfig(pathname);
    if (cfg.name !== items[0].label) items.push({ label: cfg.name });
  }

  return items;
}
