import {
  Student,
  ClassInfo,
  NotificationData,
  AttendanceRecord,
  ExamType,
  ScoreEntry,
  User,
  AcademicPeriod,
  StudentAcademicReport,
} from "../../types";
import {
  MOCK_CLASSES,
  MOCK_STUDENTS,
  MOCK_ADMIN_NOTIFICATIONS,
  MOCK_ADMIN_ACTIVITIES,
} from "../dashboardMockData";
import {
  MOCK_STUDENT_REPORTS,
  MOCK_NOTIFICATIONS,
} from "../parentMockData";
import { MOCK_USERS } from "../../context/AuthContext";

// Storage keys
const STORAGE_KEYS = {
  CLASSES: "kito_vua_classes_v1",
  STUDENTS: "kito_vua_students_v1",
  ATTENDANCE: "kito_vua_attendance_v1",
  SCORES: "kito_vua_scores_v1",
  NOTIFICATIONS: "kito_vua_notifications_v1",
  USERS: "kito_vua_users_v1",
  SETTINGS: "kito_vua_settings_v1",
  ACTIVITIES: "kito_vua_activities_v1",
};

// Initial state builder
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined" || !window.localStorage) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed writing ${key} to storage:`, err);
  }
}

// Initial attendance records for all classes & dates
function buildInitialAttendance(): Record<string, Record<string, AttendanceRecord[]>> {
  const map: Record<string, Record<string, AttendanceRecord[]>> = {};
  const today = new Date().toISOString().split("T")[0];
  const lastSunday = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  MOCK_CLASSES.forEach((cls) => {
    const studentsInClass = MOCK_STUDENTS.filter((s) => s.classId === cls.id || (!s.classId && cls.id === "cls-7a"));
    
    // Seed today
    const recordsToday: AttendanceRecord[] = studentsInClass.map((s, idx) => ({
      studentId: s.id,
      status: idx === 3 ? "ABSENT" : idx === 5 ? "EXCUSED" : idx === 7 ? "LATE" : "PRESENT",
      updatedAt: new Date().toISOString(),
    }));

    // Seed last Sunday
    const recordsLastSunday: AttendanceRecord[] = studentsInClass.map((s, idx) => ({
      studentId: s.id,
      status: idx === 2 ? "ABSENT" : idx === 4 ? "EXCUSED" : "PRESENT",
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    map[`${cls.id}_${today}`] = { [today]: recordsToday };
    map[`${cls.id}_${lastSunday}`] = { [lastSunday]: recordsLastSunday };
  });

  return map;
}

// Initial scores store
function buildInitialScores(): Record<string, ScoreEntry[]> {
  const map: Record<string, ScoreEntry[]> = {};
  const defaultScores = [9.0, 8.5, 7.0, 9.5, 8.0, 6.5, 10.0, 8.5, 7.5, 9.0, 8.0, 8.5, 9.0, 7.0, 8.5, 9.5];

  MOCK_CLASSES.forEach((cls) => {
    const studentsInClass = MOCK_STUDENTS.filter((s) => s.classId === cls.id || (!s.classId && cls.id === "cls-7a"));
    
    ["sub-gl", "sub-kt", "sub-nv"].forEach((subId) => {
      (["MIENG", "PHUT_15", "GIUA_KY", "CUOI_KY"] as ExamType[]).forEach((examType) => {
        const key = `${cls.id}_${subId}_${examType}`;
        map[key] = studentsInClass.map((s, idx) => ({
          studentId: s.id,
          score: defaultScores[idx % defaultScores.length],
          previousScore: defaultScores[idx % defaultScores.length],
          error: null,
          isDirty: false,
        }));
      });
    });
  });

  return map;
}

const allParentNotifs: NotificationData[] = Object.values(MOCK_NOTIFICATIONS).flat();

// Global Memory State with LocalStorage backing
class MockStore {
  classes: (ClassInfo & { presentCount: number; attendanceRate: number; lastUpdated: string })[];
  students: Student[];
  attendance: Record<string, AttendanceRecord[]>;
  scores: Record<string, ScoreEntry[]>;
  notifications: NotificationData[];
  users: User[];
  activities: any[];
  reports: Record<string, Record<AcademicPeriod, StudentAcademicReport>>;

  constructor() {
    this.classes = loadFromStorage(STORAGE_KEYS.CLASSES, MOCK_CLASSES);
    this.students = loadFromStorage(STORAGE_KEYS.STUDENTS, MOCK_STUDENTS);
    this.attendance = loadFromStorage(STORAGE_KEYS.ATTENDANCE, buildInitialAttendance() as any);
    this.scores = loadFromStorage(STORAGE_KEYS.SCORES, buildInitialScores());
    this.notifications = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, [
      ...MOCK_ADMIN_NOTIFICATIONS,
      ...allParentNotifs,
    ]);
    this.users = loadFromStorage(STORAGE_KEYS.USERS, Object.values(MOCK_USERS));
    this.activities = loadFromStorage(STORAGE_KEYS.ACTIVITIES, MOCK_ADMIN_ACTIVITIES);
    this.reports = MOCK_STUDENT_REPORTS;
  }

  persistClasses() {
    saveToStorage(STORAGE_KEYS.CLASSES, this.classes);
  }

  persistStudents() {
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
  }

  persistAttendance() {
    saveToStorage(STORAGE_KEYS.ATTENDANCE, this.attendance);
  }

  persistScores() {
    saveToStorage(STORAGE_KEYS.SCORES, this.scores);
  }

  persistNotifications() {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  persistUsers() {
    saveToStorage(STORAGE_KEYS.USERS, this.users);
  }

  persistActivities() {
    saveToStorage(STORAGE_KEYS.ACTIVITIES, this.activities);
  }

  resetAll() {
    this.classes = MOCK_CLASSES;
    this.students = MOCK_STUDENTS;
    this.attendance = buildInitialAttendance() as any;
    this.scores = buildInitialScores();
    this.notifications = [...MOCK_ADMIN_NOTIFICATIONS, ...allParentNotifs];
    this.users = Object.values(MOCK_USERS);
    this.activities = MOCK_ADMIN_ACTIVITIES;
    
    this.persistClasses();
    this.persistStudents();
    this.persistAttendance();
    this.persistScores();
    this.persistNotifications();
    this.persistUsers();
    this.persistActivities();
  }
}

export const dbStore = new MockStore();

// Utility for realistic simulated API latency
export const delay = (ms: number = 250) => new Promise((resolve) => setTimeout(resolve, ms));
