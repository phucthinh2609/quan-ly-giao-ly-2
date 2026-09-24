import React from "react";
import { UserRole, AppPermission } from "../../types";
import { useAuth, ROLE_DEFAULT_PATHS } from "../../context/AuthContext";
import { Forbidden403 } from "./Forbidden403";
import { Button } from "../ui";
import { Lock, LogIn } from "lucide-react";

export interface RouteGuardProps {
  children: React.ReactNode;
  /**
   * Roles permitted to access this route. If omitted, any authenticated user can access.
   */
  allowedRoles?: UserRole[];
  /**
   * Optional specific permission required in format "resource:action" (§29)
   */
  requiredPermission?: AppPermission;
  /**
   * Current path for logging/redirection context.
   */
  currentPath?: string;
  /**
   * Navigation handler invoked when redirecting to /login or /403 or home.
   */
  onNavigate?: (path: string) => void;
  /**
   * Custom message for 403 state.
   * Default: "Bạn không có quyền truy cập trang này." (§7)
   */
  forbiddenMessage?: string;
}

/**
 * RouteGuard (§7 Navigation Contract)
 *
 * Implements pseudo-logic:
 * if !authenticated
 *     → /login
 * else if role == ADMIN
 *     → /admin/dashboard
 * else if role == GLV
 *     → /teacher/dashboard
 * else if role == STUDENT
 *     → /dashboard
 * else if role == PARENT
 *     → /dashboard
 *
 * Unauthorized:
 * /403
 * → "Bạn không có quyền truy cập trang này."
 * → [Quay về trang chủ]
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  currentPath: _currentPath,
  onNavigate,
  forbiddenMessage = "Bạn không có quyền truy cập trang này.",
}) => {
  const { isAuthenticated, role, hasPermission, login } = useAuth();

  // 1. Unauthenticated Check -> /login
  if (!isAuthenticated) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 bg-white rounded-[16px] border border-[#E7E5E4] shadow-xs">
        <div className="max-w-md w-full text-center space-y-5 animate-in fade-in duration-200">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#B4232C]">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#1C1917] font-serif">
              Yêu cầu đăng nhập
            </h2>
            <p className="text-[14px] text-[#78716C] mt-1">
              Bạn cần đăng nhập tài khoản Đoàn Kitô Vua để truy cập trang này.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<LogIn className="w-4 h-4" />}
              onClick={() => {
                if (onNavigate) {
                  onNavigate("/login");
                } else {
                  login("GLV");
                }
              }}
              className="w-full sm:w-auto"
            >
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Role Check (§7)
  const isRoleAllowed = !allowedRoles || allowedRoles.includes(role);

  // 3. Permission Check (§29)
  const isPermissionAllowed = !requiredPermission || hasPermission(requiredPermission);

  // 4. Unauthorized Access -> /403
  if (!isRoleAllowed || !isPermissionAllowed) {
    const handleGoHome = (targetHomePath: string) => {
      if (onNavigate) {
        onNavigate(targetHomePath);
      } else {
        const home = ROLE_DEFAULT_PATHS[role] || "/dashboard";
        window.location.href = home;
      }
    };

    return (
      <Forbidden403
        role={role}
        message={forbiddenMessage}
        onGoHome={handleGoHome}
      />
    );
  }

  // 5. Access Granted
  return <>{children}</>;
};

/**
 * Helper function to resolve default landing redirect based on UserRole (§7)
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
