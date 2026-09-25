import {
  AlertTriangle,
  Award,
  BookHeart,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Church,
  Clock,
  Cross,
  Crown,
  FileCheck2,
  HandHeart,
  Info,
  Music,
  Sparkles,
  Star,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { AttendanceStatus, ParentAttendanceSummary, StudentAcademicReport } from "../../types";
import type { Tone } from "../ui/tone";
import { scoreGrade } from "../../lib/format";

// ============================================================================
// PARENT INSIGHTS — diễn giải số liệu thành ngôn ngữ đời thường (G4, B-PH-02)
// ============================================================================

export interface StatusMeta {
  label: string;
  tone: Tone;
  icon: LucideIcon;
}

/** Trạng thái điểm danh (01 §3.5): luôn icon + nhãn, không chỉ màu. */
export const PARENT_ATTENDANCE_STATUS: Record<AttendanceStatus, StatusMeta> = {
  PRESENT: { label: "Có mặt", tone: "success", icon: CheckCircle2 },
  ABSENT: { label: "Vắng", tone: "danger", icon: XCircle },
  EXCUSED: { label: "Có phép", tone: "info", icon: FileCheck2 },
  LATE: { label: "Đi muộn", tone: "warning", icon: Clock },
};

/** Tỷ lệ chuyên cần 0–100 tính từ số buổi (ưu tiên số buổi thật hơn số làm tròn). */
export function attendancePercent(attendance: ParentAttendanceSummary): number {
  if (attendance.totalSessions > 0) {
    return (attendance.attendedSessions / attendance.totalSessions) * 100;
  }
  return attendance.attendanceRate ?? 0;
}

export function attendanceTone(percent: number): Tone {
  if (percent >= 90) return "success";
  if (percent >= 80) return "warning";
  return "danger";
}

/** Nhãn đời thường cho tỷ lệ chuyên cần. */
export function attendanceLabel(percent: number): string {
  if (percent >= 99.5) return "Đầy đủ";
  if (percent >= 90) return "Rất đều";
  if (percent >= 80) return "Khá đều";
  return "Cần đi đều hơn";
}

function attendancePhrase(attendance: ParentAttendanceSummary): string {
  const { attendedSessions: attended, totalSessions: total } = attendance;
  if (total <= 0) return "chưa có buổi học nào được điểm danh";
  const percent = attendancePercent(attendance);
  if (attended >= total) return `đi học đầy đủ cả ${total} buổi`;
  if (percent >= 85) return `đi học đều ${attended}/${total} buổi`;
  if (percent >= 70) return `đi học ${attended}/${total} buổi, vắng ${total - attended} buổi`;
  return `mới đi học ${attended}/${total} buổi`;
}

function gpaPhrase(gpa: number | null | undefined): string {
  const { label } = scoreGrade(gpa);
  switch (label) {
    case "Xuất sắc":
      return "đang học rất xuất sắc";
    case "Giỏi":
      return "đang học rất tốt";
    case "Khá":
      return "đang học khá tốt";
    case "Đạt":
      return "học ở mức đạt, cần cố gắng thêm";
    case "Cần cố gắng":
      return "cần gia đình nhắc con ôn bài thêm";
    default:
      return "chưa có điểm trong kỳ này";
  }
}

/** "An đi học đều 18/20 buổi và đang học rất tốt." */
export function describeChildProgress(
  callName: string,
  attendance: ParentAttendanceSummary,
  gpa: number | null | undefined
): string {
  return `${callName} ${attendancePhrase(attendance)} và ${gpaPhrase(gpa)}.`;
}

/** Trạng thái tổng quát (màu + icon + chữ) cho thẻ "Tuần này của con". */
export function childOverallStatus(attendance: ParentAttendanceSummary, gpa: number | null | undefined): StatusMeta {
  const percent = attendancePercent(attendance);
  const score = gpa ?? 0;
  if (percent >= 85 && score >= 6.5) return { label: "Mọi việc đều tốt", tone: "success", icon: CheckCircle2 };
  if (percent >= 70 && score >= 5) return { label: "Cần để ý thêm", tone: "warning", icon: Info };
  return { label: "Cần gia đình quan tâm", tone: "danger", icon: AlertTriangle };
}

/** Icon Lucide theo tên môn (thay cho emoji cũ trong dữ liệu). */
export function subjectIcon(subjectName: string): LucideIcon {
  const name = subjectName.toLowerCase();
  if (name.includes("kinh thánh") || name.includes("thánh kinh")) return BookHeart;
  if (name.includes("làm dấu")) return Cross;
  if (name.includes("phụng vụ")) return Church;
  if (name.includes("nhân bản")) return HandHeart;
  if (name.includes("cầu nguyện") || name.includes("kinh hạt")) return Sparkles;
  if (name.includes("kỷ luật") || name.includes("tác phong")) return Star;
  if (name.includes("ca múa") || name.includes("hát")) return Music;
  return BookOpen;
}

/** Định dạng điểm theo kiểu Việt Nam: 8.5 → "8,5". */
export function formatScore(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "Chưa có";
  return value.toLocaleString("vi-VN", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

// ============================================================================
// THÀNH TÍCH CỦA CON — suy ra từ điểm số và chuyên cần của kỳ đang chọn
// ============================================================================

export interface ChildMilestone {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  achieved: boolean;
  /** Tiến độ khi chưa đạt */
  progress?: { value: number; max: number; hint: string };
}

export function deriveChildMilestones(report: StudentAcademicReport): ChildMilestone[] {
  const { attendance, gpa, subjects } = report;
  const percent = attendancePercent(attendance);
  const neededFor90 = Math.ceil(attendance.totalSessions * 0.9);
  const best = [...subjects].sort((a, b) => b.averageScore - a.averageScore)[0];

  const milestones: ChildMilestone[] = [
    {
      id: "attendance-90",
      title: "Chuyên cần",
      description: "Đi học từ 90% số buổi trở lên",
      icon: CalendarCheck,
      achieved: percent >= 90,
      progress: {
        value: attendance.attendedSessions,
        max: Math.max(neededFor90, 1),
        hint: `Đã đi ${attendance.attendedSessions}/${neededFor90} buổi cần có`,
      },
    },
    {
      id: "attendance-full",
      title: "Không vắng buổi nào",
      description: "Có mặt ở tất cả các buổi học trong kỳ",
      icon: CheckCircle2,
      achieved: attendance.totalSessions > 0 && attendance.attendedSessions >= attendance.totalSessions,
      progress: {
        value: attendance.attendedSessions,
        max: Math.max(attendance.totalSessions, 1),
        hint: `Đã vắng ${attendance.totalSessions - attendance.attendedSessions} buổi`,
      },
    },
    {
      id: "gpa-8",
      title: "Học lực Giỏi",
      description: "Điểm trung bình từ 8,0 trở lên",
      icon: Award,
      achieved: gpa >= 8,
      progress: { value: gpa, max: 8, hint: `Điểm hiện tại ${formatScore(gpa)}` },
    },
    {
      id: "gpa-9",
      title: "Học lực Xuất sắc",
      description: "Điểm trung bình từ 9,0 trở lên",
      icon: Crown,
      achieved: gpa >= 9,
      progress: { value: gpa, max: 9, hint: `Điểm hiện tại ${formatScore(gpa)}` },
    },
  ];

  if (best) {
    milestones.push({
      id: "best-subject",
      title: "Môn học nổi bật",
      description: `${best.subjectName}: ${formatScore(best.averageScore)} điểm`,
      icon: subjectIcon(best.subjectName),
      achieved: best.averageScore >= 9,
      progress: { value: best.averageScore, max: 9, hint: "Cần đạt 9,0 ở một môn" },
    });
  }

  return milestones;
}
