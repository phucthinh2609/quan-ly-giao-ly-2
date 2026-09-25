import { NotificationData, NotificationType, User } from "../../types";
import { dbStore, delay } from "./mockStorage";

export const notificationService = {
  /**
   * Get notifications with role & audience filtering
   */
  async getNotifications(
    currentUser?: User | null,
    filters?: {
      type?: NotificationType | "ALL";
      unreadOnly?: boolean;
      search?: string;
    }
  ): Promise<NotificationData[]> {
    await delay(120);

    let list = [...dbStore.notifications];

    // Data Ownership & Role filtering
    if (currentUser) {
      if (currentUser.role === "PARENT") {
        const allowedStudentIds = currentUser.childrenIds || ["s-01", "s-02"];
        list = list.filter(
          (n) =>
            n.type === "GENERAL" ||
            n.type === "URGENT" ||
            (n.studentId && allowedStudentIds.includes(n.studentId)) ||
            (n.className && ["Lớp 7A", "Lớp 3B"].includes(n.className))
        );
      } else if (currentUser.role === "STUDENT") {
        list = list.filter(
          (n) =>
            n.type === "GENERAL" ||
            n.type === "URGENT" ||
            n.studentId === "s-01" ||
            n.className === "Lớp 7A"
        );
      }
    }

    if (filters?.type && filters.type !== "ALL") {
      list = list.filter((n) => n.type === filters.type);
    }

    if (filters?.unreadOnly) {
      list = list.filter((n) => !n.isRead);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }

    return list;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    await delay(80);
    const item = dbStore.notifications.find((n) => n.id === notificationId);
    if (item) {
      item.isRead = true;
      dbStore.persistNotifications();
      return true;
    }
    return false;
  },

  /**
   * Mark all as read
   */
  async markAllAsRead(): Promise<boolean> {
    await delay(120);
    dbStore.notifications.forEach((n) => {
      n.isRead = true;
    });
    dbStore.persistNotifications();
    return true;
  },

  /**
   * Create notification (Admin / GLV)
   */
  async createNotification(data: Partial<NotificationData>): Promise<NotificationData> {
    await delay(250);
    const newNotif: NotificationData = {
      id: `notif-${Date.now()}`,
      title: data.title || "Thông báo mới",
      type: data.type || "GENERAL",
      content: data.content || "",
      preview: data.preview || (data.content ? data.content.slice(0, 80) + "..." : ""),
      timestamp: "Vừa xong",
      formattedDate: new Date().toLocaleDateString("vi-VN"),
      isRead: false,
      studentId: data.studentId,
      studentName: data.studentName,
      className: data.className,
      actionLabel: data.actionLabel,
      actionPath: data.actionPath,
    };

    dbStore.notifications.unshift(newNotif);
    dbStore.persistNotifications();
    return newNotif;
  },
};
