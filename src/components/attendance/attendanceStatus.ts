import { CheckCircle2, Clock, FileCheck2, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AttendanceStatus, AttendanceSummaryData } from "../../types";
import type { Tone } from "../ui/tone";

// ============================================================================
// ATTENDANCE STATUS META (01 §3.5) — nguồn chuẩn cho nhãn, tone, icon.
// Có phép dùng tone info (v1 dùng vàng, dễ nhầm với Đi muộn).
// ============================================================================

export interface AttendanceStatusMeta {
  status: AttendanceStatus;
  label: string;
  shortLabel: string;
  tone: Tone;
  Icon: LucideIcon;
}

export const ATTENDANCE_STATUS_META: Record<AttendanceStatus, AttendanceStatusMeta> = {
  PRESENT: { status: "PRESENT", label: "Có mặt", shortLabel: "Có", tone: "success", Icon: CheckCircle2 },
  ABSENT: { status: "ABSENT", label: "Vắng", shortLabel: "Vắng", tone: "danger", Icon: XCircle },
  EXCUSED: { status: "EXCUSED", label: "Có phép", shortLabel: "Phép", tone: "info", Icon: FileCheck2 },
  LATE: { status: "LATE", label: "Đi muộn", shortLabel: "Muộn", tone: "warning", Icon: Clock },
};

/** Chu trình 1 chạm: Có mặt → Vắng → Có phép → Đi muộn → Có mặt */
export const ATTENDANCE_CYCLE: AttendanceStatus[] = ["PRESENT", "ABSENT", "EXCUSED", "LATE"];

export function getNextAttendanceStatus(current: AttendanceStatus): AttendanceStatus {
  const currentIndex = ATTENDANCE_CYCLE.indexOf(current);
  if (currentIndex === -1) return "PRESENT";
  return ATTENDANCE_CYCLE[(currentIndex + 1) % ATTENDANCE_CYCLE.length];
}

export function isAttendanceStatus(value: unknown): value is AttendanceStatus {
  return typeof value === "string" && (ATTENDANCE_CYCLE as string[]).includes(value);
}

/**
 * Chuẩn hóa chuỗi để tìm kiếm không dấu: "Nguyễn Đức" → "nguyen duc".
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tóm tắt ngắn cho SaveBar / toast: "3 vắng · 1 muộn · 1 có phép" hoặc "Có mặt đủ 16 em". */
export function formatAttendanceBrief(summary: AttendanceSummaryData): string {
  const parts: string[] = [];
  if (summary.absent > 0) parts.push(`${summary.absent} vắng`);
  if (summary.late > 0) parts.push(`${summary.late} muộn`);
  if (summary.excused > 0) parts.push(`${summary.excused} có phép`);
  if (parts.length === 0) return summary.total > 0 ? `Có mặt đủ ${summary.total} em` : "Chưa có học sinh";
  return parts.join(" · ");
}

/** Tone của vòng tỷ lệ có mặt. */
export function presentRateTone(rate: number): Tone {
  if (rate >= 85) return "success";
  if (rate >= 65) return "warning";
  return "danger";
}

export function summarizeAttendance(
  studentIds: string[],
  map: Record<string, AttendanceStatus>
): AttendanceSummaryData {
  let present = 0;
  let absent = 0;
  let excused = 0;
  let late = 0;
  studentIds.forEach((id) => {
    const status = map[id] ?? "PRESENT";
    if (status === "PRESENT") present++;
    else if (status === "ABSENT") absent++;
    else if (status === "EXCUSED") excused++;
    else late++;
  });
  const total = studentIds.length;
  return { total, present, absent, excused, late, presentRate: total > 0 ? (present / total) * 100 : 0 };
}
