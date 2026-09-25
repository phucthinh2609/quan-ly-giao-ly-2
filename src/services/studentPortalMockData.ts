import type { AttendanceStatus } from "../types";
import type { Tone } from "../components/ui/tone";
import type { AchievementState } from "../components/gamification/AchievementBadge";

// ============================================================================
// STUDENT PORTAL MOCK DATA — "Góc của em" (B-HS-01 … B-HS-06)
// Dữ liệu giả lập cho học sinh Phanxicô Hoàng Gia Bảo (Bao Đồng 1).
// Kiểu dữ liệu định nghĩa cục bộ, chỉ dùng trong khu Học sinh.
// ============================================================================

/** Khóa icon Lucide dùng trong khu Học sinh (ánh xạ sang component ở pages/student/kidIcons). */
export type KidIconKey =
  | "book-open"
  | "book-marked"
  | "book-heart"
  | "church"
  | "cross"
  | "heart"
  | "hand-heart"
  | "music"
  | "sparkles"
  | "star"
  | "flame"
  | "trophy"
  | "medal"
  | "crown"
  | "calendar-check"
  | "clock"
  | "footprints"
  | "pencil"
  | "bell"
  | "megaphone"
  | "party";

export interface StudentGameProfile {
  level: number;
  rankTitle: string;
  currentXP: number;
  nextLevelXP: number;
  /** Số Chúa Nhật đi học liên tiếp */
  streak: number;
}

export interface WeeklyQuest {
  id: string;
  title: string;
  /** Câu hướng dẫn ngắn khi chưa xong */
  hint: string;
  icon: KidIconKey;
  tone: Tone;
  current: number;
  target: number;
  xpReward: number;
  /** Nhãn nút để em tự đánh dấu tiến độ. Không có → hệ thống tự ghi nhận (VD điểm danh). */
  actionLabel?: string;
}

export interface StudentBadge {
  id: string;
  title: string;
  /** Cách đạt huy hiệu */
  description: string;
  icon: KidIconKey;
  tone: Tone;
  status: AchievementState;
  xpReward: number;
  /** Ngày đạt (dd/mm/yyyy) cho UNLOCKED / NEW */
  unlockedAt?: string;
  progress?: { current: number; total: number };
  /** Gợi ý mở khóa, VD "Còn 2 buổi nữa" */
  progressHint?: string;
}

export type SemesterId = "HK1" | "HK2";

export interface SubjectScore {
  id: string;
  name: string;
  icon: KidIconKey;
  tone: Tone;
  /** Thang 10; null = chưa có điểm */
  score: number | null;
}

export interface SemesterScores {
  id: SemesterId;
  label: string;
  fullLabel: string;
  subjects: SubjectScore[];
}

export interface SundayAttendance {
  /** ISO yyyy-mm-dd */
  date: string;
  status: AttendanceStatus;
  lesson?: string;
}

export interface NextSessionInfo {
  /** ISO datetime */
  startsAt: string;
  dateLabel: string;
  time: string;
  room: string;
  teacher: string;
  lesson: string;
}

export interface StudentNotification {
  id: string;
  title: string;
  body: string;
  /** ISO datetime */
  createdAt: string;
  icon: KidIconKey;
  tone: Tone;
  read: boolean;
  /** Route liên quan (VD /student/scores) */
  link?: string;
  linkLabel?: string;
}

// ----------------------------------------------------------------------------
// Hồ sơ trò chơi
// ----------------------------------------------------------------------------
export const STUDENT_GAME_PROFILE: StudentGameProfile = {
  level: 5,
  rankTitle: "Hiệp sĩ nhỏ",
  currentXP: 860,
  nextLevelXP: 1000,
  streak: 5,
};

// ----------------------------------------------------------------------------
// Nhiệm vụ tuần này
// ----------------------------------------------------------------------------
export const STUDENT_WEEKLY_QUESTS: WeeklyQuest[] = [
  {
    id: "quest-on-time",
    title: "Đi học đúng giờ",
    hint: "GLV sẽ ghi nhận khi điểm danh.",
    icon: "clock",
    tone: "sky",
    current: 1,
    target: 1,
    xpReward: 20,
  },
  {
    id: "quest-hail-mary",
    title: "Thuộc kinh Kính Mừng",
    hint: "Đọc thuộc cho bố mẹ nghe nhé.",
    icon: "sparkles",
    tone: "mint",
    current: 0,
    target: 1,
    xpReward: 30,
    actionLabel: "Em đã thuộc",
  },
  {
    id: "quest-homework",
    title: "Làm bài tập Giáo lý",
    hint: "Còn 1 bài nữa thôi!",
    icon: "pencil",
    tone: "sun",
    current: 2,
    target: 3,
    xpReward: 25,
    actionLabel: "Xong thêm 1 bài",
  },
];

// ----------------------------------------------------------------------------
// Huy hiệu (12 huy hiệu)
// ----------------------------------------------------------------------------
export const STUDENT_BADGES: StudentBadge[] = [
  {
    id: "badge-streak-5",
    title: "Chuỗi 5 Chúa Nhật",
    description: "Đi học 5 Chúa Nhật liên tiếp, không vắng buổi nào.",
    icon: "flame",
    tone: "sun",
    status: "NEW",
    xpReward: 100,
    unlockedAt: "27/09/2026",
  },
  {
    id: "badge-bible-knight",
    title: "Hiệp sĩ Lời Chúa",
    description: "Được từ 9 điểm trở lên ở bài kiểm tra Kinh Thánh.",
    icon: "book-marked",
    tone: "sky",
    status: "NEW",
    xpReward: 150,
    unlockedAt: "21/09/2026",
  },
  {
    id: "badge-streak-7",
    title: "Chuỗi 7 Chúa Nhật",
    description: "Đi học 7 Chúa Nhật liên tiếp, không vắng buổi nào.",
    icon: "calendar-check",
    tone: "coral",
    status: "AVAILABLE",
    xpReward: 150,
    progress: { current: 5, total: 7 },
    progressHint: "Còn 2 buổi nữa",
  },
  {
    id: "badge-homework",
    title: "Chăm làm bài",
    description: "Làm đủ 10 bài tập Giáo lý ở nhà.",
    icon: "pencil",
    tone: "mint",
    status: "AVAILABLE",
    xpReward: 120,
    progress: { current: 8, total: 10 },
    progressHint: "Còn 2 bài nữa",
  },
  {
    id: "badge-top-student",
    title: "Học giỏi",
    description: "Điểm trung bình học kỳ từ 8 điểm trở lên.",
    icon: "trophy",
    tone: "gold",
    status: "AVAILABLE",
    xpReward: 200,
    progress: { current: 8, total: 10 },
    progressHint: "Chờ tổng kết HK I",
  },
  {
    id: "badge-first-step",
    title: "Bước chân đầu tiên",
    description: "Đi học buổi Giáo lý đầu tiên của năm học.",
    icon: "footprints",
    tone: "mint",
    status: "UNLOCKED",
    xpReward: 50,
    unlockedAt: "12/07/2026",
  },
  {
    id: "badge-prayers",
    title: "Thuộc kinh giỏi",
    description: "Thuộc 3 kinh: Lạy Cha, Kính Mừng và Sáng Danh.",
    icon: "book-heart",
    tone: "grape",
    status: "UNLOCKED",
    xpReward: 100,
    unlockedAt: "16/08/2026",
  },
  {
    id: "badge-kind-friend",
    title: "Người bạn tốt",
    description: "Giúp đỡ bạn trong lớp và được GLV khen.",
    icon: "hand-heart",
    tone: "rose",
    status: "UNLOCKED",
    xpReward: 80,
    unlockedAt: "30/08/2026",
  },
  {
    id: "badge-on-time",
    title: "Luôn đúng giờ",
    description: "Đến lớp đúng giờ 4 buổi liền.",
    icon: "clock",
    tone: "sky",
    status: "UNLOCKED",
    xpReward: 60,
    unlockedAt: "20/09/2026",
  },
  {
    id: "badge-choir",
    title: "Ca đoàn nhí",
    description: "Hát ca đoàn thiếu nhi trong 4 Thánh lễ.",
    icon: "music",
    tone: "rose",
    status: "LOCKED",
    xpReward: 120,
    progress: { current: 1, total: 4 },
    progressHint: "Còn 3 lễ nữa",
  },
  {
    id: "badge-altar",
    title: "Giúp lễ",
    description: "Tham gia giúp lễ 3 lần cùng các anh chị.",
    icon: "church",
    tone: "grape",
    status: "LOCKED",
    xpReward: 150,
    progress: { current: 0, total: 3 },
    progressHint: "Còn 3 lần nữa",
  },
  {
    id: "badge-christ-king",
    title: "Hiệp sĩ Kitô Vua",
    description: "Lên tới Level 10.",
    icon: "crown",
    tone: "gold",
    status: "LOCKED",
    xpReward: 500,
    progress: { current: 5, total: 10 },
    progressHint: "Còn 5 Level nữa",
  },
];

// ----------------------------------------------------------------------------
// Điểm theo học kỳ
// ----------------------------------------------------------------------------
export const STUDENT_SEMESTER_SCORES: SemesterScores[] = [
  {
    id: "HK1",
    label: "HK I",
    fullLabel: "Học kỳ I",
    subjects: [
      { id: "sub-catechism", name: "Giáo lý", icon: "book-open", tone: "grape", score: 8.5 },
      { id: "sub-bible", name: "Kinh Thánh", icon: "book-marked", tone: "sky", score: 9.0 },
      { id: "sub-liturgy", name: "Phụng vụ", icon: "church", tone: "sun", score: 7.8 },
      { id: "sub-christian-life", name: "Đời sống Kitô hữu", icon: "hand-heart", tone: "rose", score: 8.8 },
      { id: "sub-prayer", name: "Kinh nguyện", icon: "sparkles", tone: "mint", score: 9.5 },
      { id: "sub-hymns", name: "Thánh ca", icon: "music", tone: "coral", score: 6.5 },
    ],
  },
  {
    id: "HK2",
    label: "HK II",
    fullLabel: "Học kỳ II",
    subjects: [
      { id: "sub-catechism", name: "Giáo lý", icon: "book-open", tone: "grape", score: 8.8 },
      { id: "sub-bible", name: "Kinh Thánh", icon: "book-marked", tone: "sky", score: 9.3 },
      { id: "sub-liturgy", name: "Phụng vụ", icon: "church", tone: "sun", score: 8.0 },
      { id: "sub-christian-life", name: "Đời sống Kitô hữu", icon: "hand-heart", tone: "rose", score: 9.0 },
      { id: "sub-prayer", name: "Kinh nguyện", icon: "sparkles", tone: "mint", score: 4.8 },
      { id: "sub-hymns", name: "Thánh ca", icon: "music", tone: "coral", score: null },
    ],
  },
];

// ----------------------------------------------------------------------------
// Chuyên cần — 12 Chúa Nhật gần nhất (kết thúc 27/09/2026)
// ----------------------------------------------------------------------------
export const STUDENT_SUNDAY_ATTENDANCE: SundayAttendance[] = [
  { date: "2026-07-12", status: "PRESENT", lesson: "Khai giảng năm học" },
  { date: "2026-07-19", status: "PRESENT", lesson: "Thiên Chúa là Cha" },
  { date: "2026-07-26", status: "EXCUSED", lesson: "Thiên Chúa sáng tạo" },
  { date: "2026-08-02", status: "PRESENT", lesson: "Tổ tông loài người" },
  { date: "2026-08-09", status: "LATE", lesson: "Lời hứa cứu độ" },
  { date: "2026-08-16", status: "PRESENT", lesson: "Đức Maria" },
  { date: "2026-08-23", status: "ABSENT", lesson: "Chúa Giêsu giáng sinh" },
  { date: "2026-08-30", status: "PRESENT", lesson: "Thời thơ ấu của Chúa Giêsu" },
  { date: "2026-09-06", status: "PRESENT", lesson: "Gioan Tẩy Giả" },
  { date: "2026-09-13", status: "PRESENT", lesson: "Chúa Giêsu chịu cám dỗ" },
  { date: "2026-09-20", status: "PRESENT", lesson: "Chúa Giêsu gọi môn đệ" },
  { date: "2026-09-27", status: "PRESENT", lesson: "Tiệc cưới Cana" },
];

// ----------------------------------------------------------------------------
// Buổi học tới
// ----------------------------------------------------------------------------
export const STUDENT_NEXT_SESSION: NextSessionInfo = {
  startsAt: "2026-10-04T08:00:00+07:00",
  dateLabel: "Chúa Nhật 04/10",
  time: "08:00",
  room: "Phòng 3",
  teacher: "GLV Giuse Minh",
  lesson: "Bài 13: Chúa Giêsu dạy cầu nguyện",
};

// ----------------------------------------------------------------------------
// Thông báo cho học sinh
// ----------------------------------------------------------------------------
export const STUDENT_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "stu-noti-1",
    title: "Em vừa nhận huy hiệu mới!",
    body: "Chúc mừng em đạt huy hiệu Chuỗi 5 Chúa Nhật. Vào Huy hiệu để xem nhé.",
    createdAt: "2026-09-27T11:30:00+07:00",
    icon: "trophy",
    tone: "gold",
    read: false,
    link: "/student/achievements",
    linkLabel: "Xem huy hiệu",
  },
  {
    id: "stu-noti-2",
    title: "Chúa Nhật này học bài 13",
    body: "Bài 13: Chúa Giêsu dạy cầu nguyện. Em nhớ mang sách Giáo lý và bút màu nhé.",
    createdAt: "2026-09-25T19:00:00+07:00",
    icon: "book-open",
    tone: "sky",
    read: false,
  },
  {
    id: "stu-noti-3",
    title: "Điểm Kinh Thánh đã có",
    body: "GLV đã cập nhật điểm kiểm tra Kinh Thánh. Em được 9 điểm, giỏi lắm!",
    createdAt: "2026-09-21T10:00:00+07:00",
    icon: "star",
    tone: "mint",
    read: true,
    link: "/student/scores",
    linkLabel: "Xem điểm",
  },
  {
    id: "stu-noti-4",
    title: "Mừng lễ Thiên Thần Hộ Thủ",
    body: "Thứ Sáu 02/10 có Thánh lễ lúc 18:00. Em cùng gia đình đến dự nhé.",
    createdAt: "2026-09-20T08:00:00+07:00",
    icon: "church",
    tone: "rose",
    read: true,
  },
];
