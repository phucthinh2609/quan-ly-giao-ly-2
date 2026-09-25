import { AlertTriangle, GraduationCap, Info, Megaphone, School, type LucideIcon } from "lucide-react";
import { NotificationData, NotificationType } from "../../types";
import type { Tone } from "../ui/tone";
import { relativeTime } from "../../lib/format";

// ============================================================================
// NOTIFICATION META (03 §11) — nhãn, tone, icon cho từng loại thông báo.
// Thứ tự hiển thị: Khẩn → Học sinh → Lớp → Chung → Hệ thống.
// ============================================================================

export interface NotificationTypeMeta {
  label: string;
  tone: Tone;
  icon: LucideIcon;
}

export const NOTIFICATION_TYPE_META: Record<NotificationType, NotificationTypeMeta> = {
  URGENT: { label: "Khẩn", tone: "danger", icon: AlertTriangle },
  STUDENT: { label: "Học sinh", tone: "info", icon: GraduationCap },
  CLASS: { label: "Lớp", tone: "mint", icon: School },
  GENERAL: { label: "Chung", tone: "neutral", icon: Megaphone },
  SYSTEM: { label: "Hệ thống", tone: "grape", icon: Info },
};

export const NOTIFICATION_TYPE_ORDER: NotificationType[] = ["URGENT", "STUDENT", "CLASS", "GENERAL", "SYSTEM"];

export function getNotificationTypeMeta(type: NotificationType): NotificationTypeMeta {
  return NOTIFICATION_TYPE_META[type] ?? NOTIFICATION_TYPE_META.GENERAL;
}

const DATE_PATTERN = /(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\D+(\d{1,2}):(\d{2}))?/;

/** Thời điểm gửi thông báo (nếu đọc được từ dữ liệu). */
export function getNotificationDate(
  notification: Pick<NotificationData, "timestamp" | "formattedDate">
): Date | null {
  if (/^\d{4}-\d{2}-\d{2}/.test(notification.timestamp)) {
    const iso = new Date(notification.timestamp);
    if (!Number.isNaN(iso.getTime())) return iso;
  }
  const match = notification.formattedDate?.match(DATE_PATTERN);
  if (match && match[4] !== undefined) {
    const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), Number(match[4]), Number(match[5]));
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

/**
 * Thời gian tương đối ("2 giờ trước", "Hôm qua") qua relativeTime();
 * dữ liệu không có giờ cụ thể thì dùng nguyên nhãn timestamp có sẵn.
 */
export function getNotificationTimeLabel(
  notification: Pick<NotificationData, "timestamp" | "formattedDate">,
  now: Date = new Date()
): string {
  const date = getNotificationDate(notification);
  if (date && date.getTime() <= now.getTime()) return relativeTime(date, now);
  return notification.timestamp || notification.formattedDate || "";
}
