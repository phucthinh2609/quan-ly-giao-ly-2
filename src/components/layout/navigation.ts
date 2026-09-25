import {
  Award,
  BarChart3,
  Bell,
  CalendarCheck,
  ClipboardCheck,
  GraduationCap,
  History,
  Home,
  LayoutDashboard,
  LayoutGrid,
  PenLine,
  School,
  Settings,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { UserRole } from "../../types";

// ============================================================================
// NAVIGATION CONFIG v2 (02 §4–7) — dùng chung cho Sidebar và MobileBottomNav
// ============================================================================

export interface NavEntry {
  id: string;
  label: string;
  /** Nhãn ngắn cho bottom nav */
  shortLabel?: string;
  path: string;
  icon: LucideIcon;
  /** Nhóm trong sidebar (sentence case) */
  section?: string;
  /** Các route khác cũng làm mục này active */
  match?: RegExp[];
  /** Hiển thị số thông báo chưa đọc */
  showNotificationCount?: boolean;
  /** Nút trung tâm nổi (GLV: Điểm danh) */
  primary?: boolean;
}

const CLASS_ROUTES = [/^\/classes$/, /^\/classes\/[^/]+$/, /^\/classes\/[^/]+\/students$/];
const ATTENDANCE_ROUTES = [/^\/attendance$/, /^\/classes\/[^/]+\/attendance$/];
const SCORE_ROUTES = [/^\/scores$/, /^\/classes\/[^/]+\/scores$/];
const STUDENT_ROUTES = [/^\/students(\/[^/]+)?$/];
const NOTIFICATION_ROUTES = [/^\/notifications$/];

export const ROLE_NAVIGATION: Record<UserRole, NavEntry[]> = {
  ADMIN: [
    { id: "admin-dashboard", label: "Tổng quan", path: "/admin/dashboard", icon: LayoutDashboard, section: "Tổng quan", match: [/^\/dashboard$/] },
    { id: "admin-users", label: "Người dùng", shortLabel: "Tài khoản", path: "/admin/users", icon: Users, section: "Quản lý" },
    { id: "admin-classes", label: "Lớp học", path: "/admin/classes", icon: School, section: "Quản lý", match: CLASS_ROUTES },
    { id: "admin-students", label: "Học sinh", path: "/admin/students", icon: GraduationCap, section: "Quản lý", match: STUDENT_ROUTES },
    { id: "admin-attendance", label: "Điểm danh", path: "/admin/attendance", icon: ClipboardCheck, section: "Học tập", match: ATTENDANCE_ROUTES },
    { id: "admin-scores", label: "Bảng điểm", path: "/admin/scores", icon: PenLine, section: "Học tập", match: SCORE_ROUTES },
    { id: "admin-reports", label: "Báo cáo", path: "/admin/reports", icon: BarChart3, section: "Học tập", match: [/^\/reports$/] },
    { id: "admin-notifications", label: "Thông báo", path: "/admin/notifications", icon: Bell, section: "Truyền thông", match: NOTIFICATION_ROUTES, showNotificationCount: true },
    { id: "admin-settings", label: "Cài đặt", path: "/admin/settings", icon: Settings, section: "Hệ thống", match: [/^\/settings$/] },
    { id: "admin-activity-log", label: "Nhật ký hoạt động", shortLabel: "Nhật ký", path: "/admin/activity-log", icon: History, section: "Hệ thống" },
  ],

  GLV: [
    { id: "teacher-dashboard", label: "Trang chủ", path: "/teacher/dashboard", icon: Home, section: "Tổng quan", match: [/^\/dashboard$/] },
    { id: "teacher-classes", label: "Lớp của tôi", shortLabel: "Lớp", path: "/teacher/classes", icon: School, section: "Lớp học", match: CLASS_ROUTES },
    { id: "teacher-attendance", label: "Điểm danh", path: "/teacher/attendance", icon: ClipboardCheck, section: "Lớp học", match: ATTENDANCE_ROUTES, primary: true },
    { id: "teacher-scores", label: "Nhập điểm", shortLabel: "Điểm", path: "/teacher/scores", icon: PenLine, section: "Lớp học", match: SCORE_ROUTES },
    { id: "teacher-students", label: "Học sinh", path: "/teacher/students", icon: GraduationCap, section: "Lớp học", match: STUDENT_ROUTES },
    { id: "teacher-notifications", label: "Thông báo", path: "/teacher/notifications", icon: Bell, section: "Truyền thông", match: NOTIFICATION_ROUTES, showNotificationCount: true },
  ],

  PARENT: [
    { id: "parent-dashboard", label: "Trang chủ", path: "/dashboard", icon: Home, section: "Con của tôi" },
    { id: "parent-scores", label: "Bảng điểm", path: "/parent/scores", icon: Star, section: "Con của tôi" },
    { id: "parent-attendance", label: "Điểm danh", path: "/parent/attendance", icon: CalendarCheck, section: "Con của tôi" },
    { id: "parent-achievements", label: "Thành tích", path: "/parent/achievements", icon: Award, section: "Con của tôi" },
    { id: "parent-notifications", label: "Thông báo", path: "/parent/notifications", icon: Bell, section: "Giáo xứ", match: NOTIFICATION_ROUTES, showNotificationCount: true },
  ],

  STUDENT: [
    { id: "student-dashboard", label: "Góc của em", shortLabel: "Nhà của em", path: "/dashboard", icon: Sparkles, section: "Của em", match: [/^\/student\/portal$/] },
    { id: "student-scores", label: "Điểm của em", shortLabel: "Điểm", path: "/student/scores", icon: Star, section: "Của em" },
    { id: "student-attendance", label: "Chuyên cần", path: "/student/attendance", icon: CalendarCheck, section: "Của em" },
    { id: "student-achievements", label: "Huy hiệu", path: "/student/achievements", icon: Award, section: "Của em" },
    { id: "student-notifications", label: "Thông báo", path: "/student/notifications", icon: Bell, section: "Tin tức", match: NOTIFICATION_ROUTES, showNotificationCount: true },
  ],
};

/** Bottom nav (tối đa 5 mục, 02 §4–7). "#more" mở sheet các mục còn lại. */
export const MOBILE_BOTTOM_NAV_ITEMS: Record<UserRole, NavEntry[]> = {
  ADMIN: [
    ...ROLE_NAVIGATION.ADMIN.filter((i) =>
      ["admin-dashboard", "admin-users", "admin-classes", "admin-notifications"].includes(i.id)
    ),
    { id: "admin-more", label: "Thêm", path: "#more", icon: LayoutGrid },
  ],
  GLV: ROLE_NAVIGATION.GLV.filter((i) => i.id !== "teacher-students"),
  PARENT: ROLE_NAVIGATION.PARENT.filter((i) => i.id !== "parent-achievements"),
  STUDENT: ROLE_NAVIGATION.STUDENT.filter((i) => i.id !== "student-attendance"),
};

/** Các mục admin không có trên bottom nav → hiển thị trong sheet "Thêm". */
export const ADMIN_MORE_ITEMS: NavEntry[] = ROLE_NAVIGATION.ADMIN.filter(
  (i) => !MOBILE_BOTTOM_NAV_ITEMS.ADMIN.some((b) => b.id === i.id)
);

export function isNavActive(entry: NavEntry, currentPath: string): boolean {
  if (entry.path.startsWith("#")) return false;
  if (currentPath === entry.path || currentPath.startsWith(`${entry.path}/`)) return true;
  return entry.match?.some((re) => re.test(currentPath)) ?? false;
}

export const NOTIFICATION_PATHS: Record<UserRole, string> = {
  ADMIN: "/admin/notifications",
  GLV: "/teacher/notifications",
  PARENT: "/parent/notifications",
  STUDENT: "/student/notifications",
};
