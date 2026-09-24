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
