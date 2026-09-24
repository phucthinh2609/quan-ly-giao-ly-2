import React, { createContext, useContext, useState, useMemo } from "react";
import { User, UserRole, AppPermission } from "../types";

// ============================================================================
// ROLE DEFAULT HOME PATHS (§7)
// ============================================================================
export const ROLE_DEFAULT_PATHS: Record<UserRole, string> = {
  ADMIN: "/admin/dashboard",
  GLV: "/teacher/dashboard",
  STUDENT: "/dashboard",
  PARENT: "/dashboard",
};

// ============================================================================
// ROLE PERMISSIONS MATRIX (§1, §14, §29)
// ============================================================================
export const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  ADMIN: [
    "student:view",
    "student:create",
    "student:update",
    "student:delete",
    "attendance:view",
    "attendance:create",
    "attendance:update",
    "score:view",
    "score:create",
    "score:update",
    "score:export",
    "notification:view",
    "notification:create",
    "user:view",
    "user:create",
    "user:update",
    "user:delete",
    "settings:view",
    "settings:update",
  ],
  GLV: [
    "student:view",
    "student:update",
    "attendance:view",
    "attendance:create",
    "attendance:update",
    "score:view",
    "score:create",
    "score:update",
    "score:export",
    "notification:view",
  ],
  PARENT: [
    "student:view",
    "attendance:view",
    "score:view",
    "notification:view",
  ],
  STUDENT: [
    "student:view",
    "attendance:view",
    "score:view",
    "notification:view",
  ],
};

// ============================================================================
// MOCK USERS FOR PREVIEW & TESTING
// ============================================================================
export const MOCK_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: "usr-admin-01",
    name: "Tôma Nguyễn Quản Trị",
    christianName: "Tôma",
    email: "admin@kito-vua.edu.vn",
    role: "ADMIN",
    avatarUrl: "",
  },
  GLV: {
    id: "usr-glv-02",
    name: "Giuse Trần Văn Minh",
    christianName: "Giuse",
    email: "glv.minh@kito-vua.edu.vn",
    role: "GLV",
    assignedClass: "Lớp Rước Lễ 1 (7A)",
    avatarUrl: "",
  },
  PARENT: {
    id: "usr-parent-03",
    name: "Maria Lê Thị Mai",
    christianName: "Maria",
    email: "phuhuynh.mai@gmail.com",
    role: "PARENT",
    childrenIds: ["s-01", "s-02"],
    avatarUrl: "",
  },
  STUDENT: {
    id: "usr-student-04",
    name: "Phanxicô Hoàng Gia Bảo",
    christianName: "Phanxicô",
    email: "hs.bao@kito-vua.edu.vn",
    role: "STUDENT",
    assignedClass: "Bao Đồng 1",
    avatarUrl: "",
  },
};

// ============================================================================
// AUTH CONTEXT INTERFACE
// ============================================================================
interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  permissions: AppPermission[];
  hasPermission: (permission: AppPermission) => boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  getDefaultHomePath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialRole = "ADMIN",
  initialAuth = true,
}: {
  children: React.ReactNode;
  initialRole?: UserRole;
  initialAuth?: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [user, setUser] = useState<User | null>(
    initialAuth ? MOCK_USERS[initialRole] : null
  );

  const permissions = useMemo(() => {
    if (!isAuthenticated || !role) return [];
    return ROLE_PERMISSIONS[role] || [];
  }, [isAuthenticated, role]);

  const hasPermission = (permission: AppPermission): boolean => {
    if (!isAuthenticated) return false;
    if (role === "ADMIN") return true; // Super admin has all privileges
    return permissions.includes(permission);
  };

  const login = (targetRole: UserRole = "ADMIN") => {
    setRole(targetRole);
    setUser(MOCK_USERS[targetRole]);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setUser(MOCK_USERS[newRole]);
    setIsAuthenticated(true);
  };

  const getDefaultHomePath = () => {
    return ROLE_DEFAULT_PATHS[role] || "/dashboard";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        permissions,
        hasPermission,
        login,
        logout,
        switchRole,
        getDefaultHomePath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
