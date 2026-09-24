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
}
