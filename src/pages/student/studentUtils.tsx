import React from "react";
import { CheckCircle2, Clock, FileCheck2, XCircle } from "lucide-react";
import type { AttendanceStatus } from "../../types";
import type { Tone } from "../../components/ui/tone";
import type { AchievementBadgeProps } from "../../components/gamification/AchievementBadge";
import type { StudentBadge, SubjectScore, SundayAttendance } from "../../services/studentPortalMockData";
import { renderKidIcon } from "./kidIcons";

// ============================================================================
// Helpers dùng chung cho các màn hình học sinh
// ============================================================================

/** "8,5" — định dạng điểm 1 chữ số thập phân theo vi-VN (khớp CountUp). */
export function formatScore(score: number): string {
  return score.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Trung bình các môn đã có điểm, làm tròn 1 chữ số; null nếu chưa có môn nào. */
export function averageScore(subjects: SubjectScore[]): number | null {
  const scored = subjects.filter((s): s is SubjectScore & { score: number } => s.score !== null);
  if (scored.length === 0) return null;
  const sum = scored.reduce((acc, s) => acc + s.score, 0);
  return Math.round((sum / scored.length) * 10) / 10;
}

/** "27/09" từ ISO yyyy-mm-dd */
export function formatDayMonth(isoDate: string): string {
  const [, mm, dd] = isoDate.split("-");
  return `${dd}/${mm}`;
}

export const ATTENDANCE_META: Record<
  AttendanceStatus,
  { label: string; tone: Tone; icon: React.ReactNode; order: number }
> = {
  PRESENT: { label: "Có mặt", tone: "success", icon: <CheckCircle2 />, order: 0 },
  LATE: { label: "Đi muộn", tone: "warning", icon: <Clock />, order: 1 },
  EXCUSED: { label: "Có phép", tone: "info", icon: <FileCheck2 />, order: 2 },
  ABSENT: { label: "Vắng", tone: "danger", icon: <XCircle />, order: 3 },
};

export interface AttendanceSummary {
  total: number;
  attended: number;
  rate: number;
  streak: number;
  counts: Record<AttendanceStatus, number>;
}

/** Đi học = Có mặt hoặc Đi muộn. Chuỗi = số buổi đi học liên tiếp tính từ buổi gần nhất. */
export function summarizeAttendance(records: SundayAttendance[]): AttendanceSummary {
  const counts: Record<AttendanceStatus, number> = { PRESENT: 0, LATE: 0, EXCUSED: 0, ABSENT: 0 };
  records.forEach((r) => {
    counts[r.status] += 1;
  });
  const attended = counts.PRESENT + counts.LATE;
  const total = records.length;

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const r of sorted) {
    if (r.status === "PRESENT" || r.status === "LATE") streak += 1;
    else break;
  }

  return { total, attended, rate: total > 0 ? Math.round((attended / total) * 100) : 0, streak, counts };
}

const BADGE_ORDER: Record<StudentBadge["status"], number> = { NEW: 0, UNLOCKED: 1, AVAILABLE: 2, LOCKED: 3 };

/** Sắp xếp: Mới → Đã có → Sắp đạt → Khóa */
export function sortBadges<T extends { status: StudentBadge["status"] }>(badges: T[]): T[] {
  return [...badges].sort((a, b) => BADGE_ORDER[a.status] - BADGE_ORDER[b.status]);
}

/** Mock badge → props của AchievementBadge */
export function toBadgeProps(badge: StudentBadge): AchievementBadgeProps {
  return {
    id: badge.id,
    title: badge.title,
    description: badge.description,
    icon: renderKidIcon(badge.icon),
    status: badge.status,
    xpReward: badge.xpReward,
    unlockedAt: badge.unlockedAt,
    tone: badge.tone,
    progress: badge.progress,
    progressText: badge.progressHint,
  };
}
