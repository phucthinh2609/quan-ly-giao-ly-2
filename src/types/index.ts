import { ReactNode } from "react";

// ============================================================================
// USER ROLES & PERMISSIONS (§1, §7, §29)
// ============================================================================

export type UserRole = "ADMIN" | "GLV" | "PARENT" | "STUDENT";

/**
 * Standard Permission Keys (§29)
 * Format: resource:action
 */
export type AppPermission =
  | "student:view"
  | "student:create"
  | "student:update"
  | "student:delete"
  | "attendance:view"
  | "attendance:create"
  | "attendance:update"
  | "score:view"
  | "score:create"
  | "score:update"
  | "score:export"
  | "notification:view"
  | "notification:create"
  | "user:view"
  | "user:create"
  | "user:update"
  | "user:delete"
  | "settings:view"
  | "settings:update"
  | (string & {});

export interface User {
  id: string;
  name: string;
  christianName?: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
  assignedClass?: string; // For GLV
  childrenIds?: string[]; // For PARENT
}

// ============================================================================
// DOMAIN: STUDENT & ATTENDANCE (§21, §30, §31)
// ============================================================================

export type AttendanceStatus = "PRESENT" | "ABSENT" | "EXCUSED" | "LATE";

export interface Student {
  id: string;
  code: string; // Mã học sinh / STT (e.g. "HS001" or "01")
  orderNumber: number; // Số thứ tự trong sổ điểm
  name: string; // Họ và tên
  christianName?: string; // Tên Thánh (e.g. "Maria", "Giuse", "Têrêsa", "Phanxicô")
  gender?: "MALE" | "FEMALE";
  dateOfBirth?: string;
  classId?: string;
  className?: string;
  avatarUrl?: string | null;
  parentPhone?: string;
  parentName?: string;
  note?: string;
}

export type AttendanceSaveState =
  | "NO_CHANGES"
  | "DIRTY"
  | "SAVING"
  | "SAVED"
  | "ERROR";

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
  updatedAt?: string;
}

export interface AttendanceSummaryData {
  total: number;
  present: number;
  absent: number;
  excused: number;
  late: number;
  presentRate: number; // 0 - 100
}

export interface ClassInfo {
  id: string;
  name: string; // e.g. "Lớp Rước Lễ 1A"
  grade: string; // "Khối Rước Lễ"
  academicYear: string; // "2026 - 2027"
  studentCount: number;
  room?: string;
  teachers?: string[];
}

// ============================================================================
// DOMAIN: SCORES & EXCEL IMPORT (§22, §23, §30)
// ============================================================================

export type ExamType = "MIENG" | "PHUT_15" | "GIUA_KY" | "CUOI_KY";

export interface ExamTypeOption {
  id: ExamType;
  label: string;
  weight: number;
}

export interface SubjectOption {
  id: string;
  name: string;
  code: string;
}

export type ScoreSaveState =
  | "NO_CHANGES"
  | "DIRTY"
  | "SAVING"
  | "SAVED"
  | "ERROR";

export interface ScoreEntry {
  studentId: string;
  score: number | null;
  rawInput?: string;
  previousScore?: number | null;
  error?: string | null;
  isDirty?: boolean;
}

export interface ScoreValidationItem {
  studentId: string;
  studentName: string;
  orderNumber: number;
  score: number | string | null;
  error: string;
}

export interface ExcelRowError {
  rowNumber: number;
  studentName?: string;
  studentCode?: string;
  message: string;
  scoreRaw?: string | number;
}

export interface ExcelImportResult {
  fileName: string;
  totalRows: number;
  validCount: number;
  errorCount: number;
  errors: ExcelRowError[];
  validData: {
    studentId: string;
    studentName: string;
    studentCode: string;
    score: number;
    rowNumber: number;
  }[];
}


// ============================================================================
// NAVIGATION & LAYOUT TYPES (§10–13, §14)
// ============================================================================

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  requiredPermission?: AppPermission;
  allowedRoles?: UserRole[];
  section?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  notificationCount?: number;
  user?: User;
  onBack?: () => void;
  onNotificationClick?: () => void;
  onMobileMenuToggle?: () => void;
  onLogout?: () => void;
  actions?: ReactNode;
  scrolled?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  /** v2: vai trò hiện tại — Phụ huynh hiển thị nhãn "Cỡ chữ" cạnh nút Aa */
  role?: UserRole;
}

export interface SidebarProps {
  role: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  user?: User;
  className?: string;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export interface MobileBottomNavProps {
  role: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  notificationCount?: number;
  onMoreClick?: () => void;
  className?: string;
}

export interface AppShellProps {
  role: UserRole;
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  notificationCount?: number;
  user?: User;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: ReactNode;
  /** v2: xử lý đăng xuất (mặc định điều hướng /welcome) */
  onLogout?: () => void;
  /** v2: route thông báo theo vai trò cho nút chuông */
  notificationPath?: string;
}

// ============================================================================
// DOMAIN: NOTIFICATIONS (§24, §30, Wireframe §11)
// ============================================================================

export type NotificationType =
  | "URGENT"
  | "STUDENT"
  | "CLASS"
  | "GENERAL"
  | "SYSTEM";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  preview: string;
  content: string;
  timestamp: string;
  formattedDate?: string;
  isRead: boolean;
  studentId?: string;
  studentName?: string;
  className?: string;
  actionLabel?: string;
  actionPath?: string;
}

// Priority rank for sorting: URGENT (1) -> STUDENT (2) -> CLASS (3) -> GENERAL (4) -> SYSTEM (5)
export const NOTIFICATION_TYPE_PRIORITY: Record<NotificationType, number> = {
  URGENT: 1,
  STUDENT: 2,
  CLASS: 3,
  GENERAL: 4,
  SYSTEM: 5,
};

// ============================================================================
// DOMAIN: PARENT & GRADE OVERVIEW (§27, §30, Wireframe C)
// ============================================================================

export type AcademicPeriod = "HK1" | "HK2" | "FULL_YEAR";

export interface AcademicPeriodOption {
  id: AcademicPeriod;
  label: string;
  academicYear: string;
}

export interface LinkedStudent {
  id: string;
  name: string;
  christianName?: string;
  className: string;
  code: string;
  avatarUrl?: string | null;
  grade?: string;
}

export interface SubjectScoreSummary {
  subjectId: string;
  subjectName: string;
  icon: string; // Tên icon Lucide hoặc chuỗi rỗng (không dùng emoji)
  averageScore: number;
  midtermScore: number | null; // GK
  finalScore: number | null; // CK
  oralScore?: number | null; // Miệng
  quizScore?: number | null; // 15 phút
  comment?: string;
}

export interface ParentAttendanceSummary {
  totalSessions: number;
  attendedSessions: number;
  absentSessions: number;
  excusedSessions: number;
  attendanceRate: number; // e.g. 90%
}

export interface StudentAcademicReport {
  studentId: string;
  period: AcademicPeriod;
  periodLabel: string;
  academicYear: string;
  gpa: number;
  rankLabel: string; // "Xuất sắc", "Tốt", "Khá", "Đạt"
  rankColor?: "gold" | "success" | "neutral";
  subjects: SubjectScoreSummary[];
  teacherComment: string;
  teacherName: string;
  attendance: ParentAttendanceSummary;
}

