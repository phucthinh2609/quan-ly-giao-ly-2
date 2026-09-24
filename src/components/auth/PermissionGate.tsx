import React from "react";
import { AppPermission } from "../../types";
import { useAuth } from "../../context/AuthContext";

export interface PermissionGateProps {
  /**
   * Permission key string in standard format: "resource:action" (§29)
   * Example: "student:view", "attendance:update", "score:export", "user:delete", "settings:update"
   */
  permission: AppPermission;
  /**
   * Optional fallback UI to render when user lacks permission.
   * Defaults to null (completely hidden).
   */
  fallback?: React.ReactNode;
  /**
   * Children components rendered when permission is granted.
   */
  children: React.ReactNode;
}

/**
 * PermissionGate (§29, §19)
 *
 * Enforces the Navigation & Authorization Contract:
 * "UI component KHÔNG được tự quyết định quyền — quyền chỉ nằm ở Auth/Permission Layer + Route Guard."
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  fallback = null,
  children,
}) => {
  const { hasPermission } = useAuth();

  const isAllowed = hasPermission(permission);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
