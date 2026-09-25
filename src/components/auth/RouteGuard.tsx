import React from "react";
import { UserRole, AppPermission } from "../../types";
import { useAuth, ROLE_DEFAULT_PATHS } from "../../context/AuthContext";
import { Forbidden403 } from "./Forbidden403";
import { Button, IconTile } from "../ui";
import { Lock, LogIn } from "lucide-react";

export interface RouteGuardProps {
  children: React.ReactNode;
  /**
   * Roles permitted to access this route. If omitted, any authenticated user can access.
   */
  allowedRoles?: UserRole[];
  /**
   * Optional specific permission required in format "resource:action"
   */
  requiredPermission?: AppPermission;
  /**
   * Current path for logging/redirection context.
   */
  currentPath?: string;
  /**
   * Navigation handler invoked when redirecting to /login or home.
   */
  onNavigate?: (path: string) => void;
  /**
   * Custom message for 403 state.
   */
  forbiddenMessage?: string;
}

/**
 * RouteGuard (02 §9 Route Guard v2)
 * - Chưa đăng nhập → mời đăng nhập (/login)
 * - Không đủ vai trò/quyền → <Forbidden403 />
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  currentPath: _currentPath,
  onNavigate,
  forbiddenMessage = "Trang này dành cho vai trò khác.",
}) => {
  const { isAuthenticated, role, hasPermission, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-5 text-center">
          <IconTile icon={<Lock />} tone="primary" size="xl" className="mx-auto" />
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Cần đăng nhập</h2>
            <p className="text-ink-2">Bạn cần đăng nhập tài khoản Đoàn Kitô Vua để xem trang này.</p>
          </div>
          <Button
            size="lg"
            leftIcon={<LogIn />}
            onClick={() => (onNavigate ? onNavigate("/login") : login("GLV"))}
            className="w-full sm:w-auto"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const isRoleAllowed = !allowedRoles || allowedRoles.includes(role);
  const isPermissionAllowed = !requiredPermission || hasPermission(requiredPermission);

  if (!isRoleAllowed || !isPermissionAllowed) {
    const handleGoHome = (targetHomePath: string) => {
      if (onNavigate) {
        onNavigate(targetHomePath);
      } else {
        window.location.href = ROLE_DEFAULT_PATHS[role] || "/dashboard";
      }
    };

    return <Forbidden403 role={role} message={forbiddenMessage} onGoHome={handleGoHome} />;
  }

  return <>{children}</>;
};

/**
 * Helper function to resolve default landing redirect based on UserRole
 */
export function resolveRoleHomeRoute(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "GLV":
      return "/teacher/dashboard";
    case "STUDENT":
    case "PARENT":
    default:
      return "/dashboard";
  }
}
