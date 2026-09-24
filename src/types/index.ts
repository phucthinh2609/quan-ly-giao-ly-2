/**
 * Domain & Design System Types
 * Quản lý Học tập Giáo lý – Đoàn Kitô Vua
 */

export type UserRole = 'ADMIN' | 'GLV' | 'PARENT' | 'STUDENT';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
export type UIState = 'loading' | 'empty' | 'error' | 'success';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE';

export interface User {
  id: string;
  name: string;
  saintName?: string; // Tên Thánh (Maria, Giuse, Phaolô, v.v.)
  email?: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  code: string;
  saintName: string;
  fullName: string;
  dob: string;
  classId: string;
  className: string;
  avatarUrl?: string;
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  division: string; // Phân đoàn: Khai Tâm, Rước Lễ, Thêm Sức, Bao Đồng
  room: string;
  teacherId: string;
  teacherName: string;
  totalStudents: number;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface ScoreItem {
  id: string;
  studentId: string;
  subject: string; // 'Giáo lý' | 'Kinh Thánh' | 'Kinh nguyện'
  semester: string; // 'Học kỳ I' | 'Học kỳ II'
  examType: 'oral' | 'quiz_15m' | 'midterm' | 'final'; // Miệng, 15p, Giữa kỳ, Cuối kỳ
  score: number | null;
  previousScore?: number;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  preview: string;
  content: string;
  category: 'GENERAL' | 'CLASS' | 'STUDENT' | 'URGENT';
  publishedAt: string;
  isRead: boolean;
  important?: boolean;
}
