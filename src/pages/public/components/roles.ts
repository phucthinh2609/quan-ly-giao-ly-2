import { BookOpen, GraduationCap, Heart, ShieldCheck, type LucideIcon } from "lucide-react";
import type { UserRole } from "../../../types";

// ============================================================================
// Dữ liệu vai trò dùng chung cho bề mặt giới thiệu (/welcome) và đăng nhập (/login)
// ============================================================================

export type LoginHandler = (role: UserRole) => void;
export type NavigateHandler = (path: string) => void;

/** Tone kid palette dùng cho 4 vai trò (01 §3.4). */
export type RoleTone = "sky" | "rose" | "mint" | "grape";

export interface PublicRole {
  role: UserRole;
  label: string;
  /** Mô tả 1 dòng trên ô đăng nhập */
  short: string;
  /** Mô tả trong accordion "Bạn là ai?" */
  pitch: string;
  icon: LucideIcon;
  tone: RoleTone;
  image: string;
  imageAlt: string;
}

export const PUBLIC_ROLES: PublicRole[] = [
  {
    role: "STUDENT",
    label: "Học sinh",
    short: "Xem điểm, huy hiệu và chuỗi đi học",
    pitch: "Xem điểm bằng sao và lời khen, giữ chuỗi Chúa Nhật đi học và mở khoá huy hiệu mới mỗi tuần.",
    icon: GraduationCap,
    tone: "sky",
    image: "https://picsum.photos/seed/role-student/1200/1400",
    imageAlt: "Các em thiếu nhi cùng nhau học bài",
  },
  {
    role: "PARENT",
    label: "Phụ huynh",
    short: "Theo dõi việc học của con",
    pitch: "Biết con đi học đều không, điểm thế nào và lớp có thông báo gì, bằng những câu dễ hiểu.",
    icon: Heart,
    tone: "rose",
    image: "https://picsum.photos/seed/role-parent/1200/1400",
    imageAlt: "Cha mẹ đồng hành cùng con trên đường đến nhà thờ",
  },
  {
    role: "GLV",
    label: "Giáo lý viên",
    short: "Điểm danh, nhập điểm cho lớp",
    pitch: "Điểm danh một chạm, nhập điểm liên tục bằng bàn phím và gửi thông báo cho phụ huynh trong lớp.",
    icon: BookOpen,
    tone: "mint",
    image: "https://picsum.photos/seed/role-catechist/1200/1400",
    imageAlt: "Giáo lý viên đứng lớp cùng các em",
  },
  {
    role: "ADMIN",
    label: "Quản trị",
    short: "Quản lý toàn đoàn và báo cáo",
    pitch: "Nhìn toàn đoàn trong một màn hình, quản lý lớp, Giáo lý viên và xuất báo cáo cuối kỳ.",
    icon: ShieldCheck,
    tone: "grape",
    image: "https://picsum.photos/seed/role-admin/1200/1400",
    imageAlt: "Văn phòng Ban Giáo lý giáo xứ",
  },
];

/** Nền nhạt cho lát/ô vai trò (chữ giữ màu ink để đủ tương phản). */
export const ROLE_SOFT_BG: Record<RoleTone, string> = {
  sky: "bg-sky-soft",
  rose: "bg-rose-soft",
  mint: "bg-mint-soft",
  grape: "bg-grape-soft",
};

/** Lớp phủ màu trên ảnh grayscale (mix-blend-multiply). */
export const ROLE_WASH: Record<RoleTone, string> = {
  sky: "bg-sky/35",
  rose: "bg-rose/35",
  mint: "bg-mint/35",
  grape: "bg-grape/35",
};
