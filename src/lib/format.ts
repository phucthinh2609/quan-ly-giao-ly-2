import { UserRole } from "../types";

// ============================================================================
// FORMAT HELPERS — nhãn tiếng Việt dùng chung
// ============================================================================

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Quản trị viên",
  GLV: "Giáo lý viên",
  PARENT: "Phụ huynh",
  STUDENT: "Học sinh",
};

/**
 * Tên gọi (tên riêng) từ họ tên tiếng Việt: "Giuse Trần Văn Minh" → "Minh".
 */
export function givenName(fullName?: string | null): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] ?? "";
}

/** Lời chào theo giờ trong ngày. */
export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

/** "Chúa Nhật, 27/09" | "Thứ Hai, 28/09" */
export function formatWeekdayDate(date: Date = new Date()): string {
  const weekdays = ["Chúa Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${weekdays[date.getDay()]}, ${dd}/${mm}`;
}

/** Thời gian tương đối ngắn gọn: "Vừa xong", "5 phút trước", "Hôm qua", "12/09". */
export function relativeTime(input: string | Date, now: Date = new Date()): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";
  const diffMin = Math.round((now.getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay === 1) return "Hôm qua";
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** "HH:mm" từ ISO string. */
export function formatTime(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/** Xếp loại học lực theo thang 10 (dùng chung Phụ huynh / Học sinh). */
export function scoreGrade(score: number | null | undefined): {
  label: string;
  kidLabel: string;
  stars: number;
  tone: "success" | "info" | "warning" | "danger";
} {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return { label: "Chưa có điểm", kidLabel: "Chưa có điểm", stars: 0, tone: "info" };
  }
  if (score >= 9) return { label: "Xuất sắc", kidLabel: "Xuất sắc!", stars: 5, tone: "success" };
  if (score >= 8) return { label: "Giỏi", kidLabel: "Giỏi lắm!", stars: 4, tone: "success" };
  if (score >= 6.5) return { label: "Khá", kidLabel: "Khá tốt", stars: 3, tone: "info" };
  if (score >= 5) return { label: "Đạt", kidLabel: "Đạt rồi", stars: 2, tone: "warning" };
  return { label: "Cần cố gắng", kidLabel: "Cố gắng thêm nhé", stars: 1, tone: "danger" };
}
