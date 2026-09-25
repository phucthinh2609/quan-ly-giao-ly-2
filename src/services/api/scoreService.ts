import {
  ExamType,
  ScoreEntry,
  SubjectOption,
  ExamTypeOption,
  StudentAcademicReport,
  AcademicPeriod,
  User,
} from "../../types";
import { dbStore, delay } from "./mockStorage";

export const SUBJECT_OPTIONS: SubjectOption[] = [
  { id: "sub-gl", name: "Giáo lý (Học thuyết đức tin)", code: "GL" },
  { id: "sub-kt", name: "Kinh Thánh & Lời Chúa", code: "KT" },
  { id: "sub-nv", name: "Nhân bản & Phụng vụ", code: "NV" },
];

export const EXAM_TYPE_OPTIONS: ExamTypeOption[] = [
  { id: "MIENG", label: "Kiểm tra Miệng (Hệ số 1)", weight: 1 },
  { id: "PHUT_15", label: "Kiểm tra 15 Phút (Hệ số 1)", weight: 1 },
  { id: "GIUA_KY", label: "Kiểm tra Giữa kỳ (Hệ số 2)", weight: 2 },
  { id: "CUOI_KY", label: "Kiểm tra Cuối kỳ (Hệ số 3)", weight: 3 },
];

export const scoreService = {
  /**
   * Get scores for a class, subject, and exam type
   */
  async getScores(
    classId: string,
    subjectId: string,
    examType: ExamType,
    currentUser?: User | null
  ): Promise<ScoreEntry[]> {
    await delay(180);

    // Verify Data Ownership (§14)
    if (currentUser && currentUser.role === "GLV") {
      const allowed = ["cls-7a", "cls-8a", "class-rl1a"];
      if (!allowed.includes(classId)) {
        throw new Error("Giáo lý viên chỉ nhập và xem được điểm của lớp mình phụ trách.");
      }
    }

    const key = `${classId}_${subjectId}_${examType}`;
    const stored = dbStore.scores[key];

    if (stored && stored.length > 0) {
      return stored;
    }

    // Default: generate entries from students in class
    const students = dbStore.students.filter(
      (s) => s.classId === classId || (!s.classId && classId === "cls-7a")
    );

    const initialEntries: ScoreEntry[] = students.map((s, idx) => ({
      studentId: s.id,
      score: idx % 2 === 0 ? 8.5 : 9.0,
      previousScore: idx % 2 === 0 ? 8.5 : 9.0,
      error: null,
      isDirty: false,
    }));

    dbStore.scores[key] = initialEntries;
    dbStore.persistScores();
    return initialEntries;
  },

  /**
   * Save bulk scores mutation
   */
  async saveScores(
    classId: string,
    subjectId: string,
    examType: ExamType,
    entries: ScoreEntry[]
  ): Promise<{ success: boolean; count: number; savedAt: string }> {
    await delay(350);

    // Validate entries
    const validated = entries.map((e) => {
      if (e.score !== null && (e.score < 0 || e.score > 10 || isNaN(e.score))) {
        throw new Error(`Điểm ${e.score} không hợp lệ (Phải từ 0 đến 10).`);
      }
      return {
        ...e,
        previousScore: e.score,
        isDirty: false,
        error: null,
      };
    });

    const key = `${classId}_${subjectId}_${examType}`;
    dbStore.scores[key] = validated;
    dbStore.persistScores();

    // Add activity log
    const subName = SUBJECT_OPTIONS.find((s) => s.id === subjectId)?.name || subjectId;
    dbStore.activities.unshift({
      id: `act-${Date.now()}`,
      userName: "Giáo lý viên",
      christianName: "Giuse",
      userAvatar: "",
      actionText: `đã nhập điểm môn ${subName} (${examType}) cho ${entries.length} học sinh`,
      timestamp: "Vừa xong",
      status: "SAVED",
      type: "SCORE",
    });
    dbStore.persistActivities();

    return {
      success: true,
      count: validated.length,
      savedAt: new Date().toLocaleTimeString("vi-VN"),
    };
  },

  /**
   * Get academic report for a linked student
   */
  async getStudentReport(
    studentId: string,
    period: AcademicPeriod,
    currentUser?: User | null
  ): Promise<StudentAcademicReport> {
    await delay(150);

    // Verify Data Ownership (§14)
    if (currentUser) {
      if (currentUser.role === "STUDENT" && studentId !== "stu-001" && studentId !== "s-01") {
        throw new Error("Em chỉ xem được bảng điểm của chính mình.");
      }
      if (currentUser.role === "PARENT") {
        const allowedIds = currentUser.childrenIds || ["stu-001", "stu-002", "s-01", "s-02"];
        if (!allowedIds.includes(studentId)) {
          // Fallback to primary
          studentId = "s-01";
        }
      }
    }

    const studentReports = dbStore.reports[studentId] || dbStore.reports["s-01"];
    const report = studentReports?.[period] || studentReports?.["HK1"];

    if (!report) {
      throw new Error(`Không tìm thấy kết quả học tập cho kỳ ${period}`);
    }

    return report;
  },

  getSubjectOptions() {
    return SUBJECT_OPTIONS;
  },

  getExamTypeOptions() {
    return EXAM_TYPE_OPTIONS;
  },
};
