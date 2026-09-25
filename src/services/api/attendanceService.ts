import {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummaryData,
  User,
} from "../../types";
import { dbStore, delay } from "./mockStorage";

export const attendanceService = {
  /**
   * Get attendance records for a class on a specific date (YYYY-MM-DD)
   */
  async getAttendance(
    classId: string,
    date: string,
    currentUser?: User | null
  ): Promise<{
    records: Record<string, AttendanceStatus>;
    notes: Record<string, string>;
    lastSaved: string | null;
  }> {
    await delay(180);

    // Verify Data Ownership (§14)
    if (currentUser && currentUser.role === "GLV") {
      const allowed = ["cls-7a", "cls-8a", "class-rl1a"];
      if (!allowed.includes(classId)) {
        throw new Error("GLV chỉ được truy cập điểm danh theo lớp được phân công (§14).");
      }
    }

    const key = `${classId}_${date}`;
    const stored = (dbStore.attendance as any)[key]?.[date] || (dbStore.attendance as any)[key];

    const records: Record<string, AttendanceStatus> = {};
    const notes: Record<string, string> = {};
    let lastSaved: string | null = null;

    if (Array.isArray(stored) && stored.length > 0) {
      stored.forEach((item: AttendanceRecord) => {
        records[item.studentId] = item.status;
        if (item.note) notes[item.studentId] = item.note;
      });
      lastSaved = stored[0].updatedAt || null;
    } else {
      // Default: all present
      const classStudents = dbStore.students.filter(
        (s) => s.classId === classId || (!s.classId && classId === "cls-7a")
      );
      classStudents.forEach((s) => {
        records[s.id] = "PRESENT";
      });
    }

    return { records, notes, lastSaved };
  },

  /**
   * Save attendance records mutation
   */
  async saveAttendance(
    classId: string,
    date: string,
    records: Record<string, AttendanceStatus>,
    notes: Record<string, string> = {}
  ): Promise<{ success: boolean; updatedAt: string; summary: AttendanceSummaryData }> {
    await delay(350);

    const now = new Date().toISOString();
    const recordsList: AttendanceRecord[] = Object.entries(records).map(([studentId, status]) => ({
      studentId,
      status,
      note: notes[studentId],
      updatedAt: now,
    }));

    const key = `${classId}_${date}`;
    (dbStore.attendance as any)[key] = recordsList;
    dbStore.persistAttendance();

    // Compute summary
    const total = recordsList.length;
    let present = 0;
    let absent = 0;
    let excused = 0;
    let late = 0;

    recordsList.forEach((r) => {
      if (r.status === "PRESENT") present++;
      else if (r.status === "ABSENT") absent++;
      else if (r.status === "EXCUSED") excused++;
      else if (r.status === "LATE") late++;
    });

    const presentRate = total > 0 ? (present / total) * 100 : 100;

    // Update class cache rate
    const clsIndex = dbStore.classes.findIndex((c) => c.id === classId);
    if (clsIndex !== -1) {
      dbStore.classes[clsIndex].attendanceRate = Math.round(presentRate);
      dbStore.classes[clsIndex].presentCount = present;
      dbStore.classes[clsIndex].lastUpdated = "Vừa cập nhật";
      dbStore.persistClasses();
    }

    // Add activity log
    dbStore.activities.unshift({
      id: `act-${Date.now()}`,
      userName: "Giáo lý viên",
      christianName: "Giuse",
      userAvatar: "",
      actionText: `đã lưu điểm danh cho ${dbStore.classes[clsIndex]?.name || classId} (${date})`,
      timestamp: "Vừa xong",
      status: "SAVED",
      type: "ATTENDANCE",
    });
    dbStore.persistActivities();

    return {
      success: true,
      updatedAt: now,
      summary: {
        total,
        present,
        absent,
        excused,
        late,
        presentRate,
      },
    };
  },

  /**
   * Get attendance summary for class
   */
  async getAttendanceSummary(classId: string, date: string): Promise<AttendanceSummaryData> {
    await delay(100);
    const { records } = await this.getAttendance(classId, date);
    const total = Object.keys(records).length;
    let present = 0;
    let absent = 0;
    let excused = 0;
    let late = 0;

    Object.values(records).forEach((st) => {
      if (st === "PRESENT") present++;
      else if (st === "ABSENT") absent++;
      else if (st === "EXCUSED") excused++;
      else if (st === "LATE") late++;
    });

    return {
      total,
      present,
      absent,
      excused,
      late,
      presentRate: total > 0 ? Math.round((present / total) * 100) : 100,
    };
  },
};
