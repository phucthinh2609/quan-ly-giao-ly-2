import { User, UserRole } from "../../types";
import { dbStore, delay } from "./mockStorage";

export const userService = {
  /**
   * Get all users (Admin only)
   */
  async getUsers(roleFilter?: UserRole | "ALL"): Promise<User[]> {
    await delay(150);
    let users = [...dbStore.users];
    if (roleFilter && roleFilter !== "ALL") {
      users = users.filter((u) => u.role === roleFilter);
    }
    return users;
  },

  /**
   * Create user
   */
  async createUser(data: Partial<User>): Promise<User> {
    await delay(250);
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: data.name || "Người dùng mới",
      christianName: data.christianName,
      email: data.email || "user@kito-vua.edu.vn",
      role: data.role || "GLV",
      assignedClass: data.assignedClass,
      childrenIds: data.childrenIds,
      avatarUrl: data.avatarUrl || "",
    };

    dbStore.users.push(newUser);
    dbStore.persistUsers();
    return newUser;
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<boolean> {
    await delay(200);
    const idx = dbStore.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      dbStore.users.splice(idx, 1);
      dbStore.persistUsers();
      return true;
    }
    return false;
  },
};

export const activityService = {
  async getActivities(): Promise<any[]> {
    await delay(100);
    return dbStore.activities;
  },
};
