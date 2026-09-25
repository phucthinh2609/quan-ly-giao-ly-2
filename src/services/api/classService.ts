import { ClassInfo, User } from "../../types";
import { dbStore, delay } from "./mockStorage";

export interface ClassFilterParams {
  grade?: string;
  search?: string;
  sort?: "name_asc" | "name_desc" | "students_desc" | "rate_asc";
  page?: number;
  limit?: number;
}

export const classService = {
  /**
   * Get list of classes respecting Data Ownership (§14)
   */
  async getClasses(
    currentUser?: User | null,
    filters?: ClassFilterParams
  ): Promise<{ data: (ClassInfo & { presentCount: number; attendanceRate: number; lastUpdated: string })[]; total: number }> {
    await delay(180);

    let classes = [...dbStore.classes];

    // Data Ownership Enforcements (§14)
    if (currentUser) {
      if (currentUser.role === "GLV") {
        // GLV only sees assigned classes (e.g. cls-7a, cls-8a)
        classes = classes.filter((c) =>
          c.id === "cls-7a" ||
          c.id === "cls-8a" ||
          c.teachers?.some((t) => t.includes(currentUser.name) || t.includes(currentUser.christianName || ""))
        );
      } else if (currentUser.role === "PARENT") {
        // Parent only sees classes of linked students (e.g. cls-7a, cls-3b)
        const parentStudentClassIds = ["cls-7a", "cls-3b", "cls-cc1"];
        classes = classes.filter((c) => parentStudentClassIds.includes(c.id));
      } else if (currentUser.role === "STUDENT") {
        // Student only sees self class
        classes = classes.filter((c) => c.id === "cls-7a" || c.id === "cls-bb1");
      }
      // ADMIN sees all organization classes
    }

    // Apply filters
    if (filters?.grade && filters.grade !== "ALL") {
      classes = classes.filter((c) => c.grade.toLowerCase().includes(filters.grade!.toLowerCase()));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      classes = classes.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.grade.toLowerCase().includes(q) ||
          c.room?.toLowerCase().includes(q) ||
          c.teachers?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Apply sort
    if (filters?.sort === "name_asc") {
      classes.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (filters?.sort === "name_desc") {
      classes.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    } else if (filters?.sort === "students_desc") {
      classes.sort((a, b) => b.studentCount - a.studentCount);
    } else if (filters?.sort === "rate_asc") {
      classes.sort((a, b) => a.attendanceRate - b.attendanceRate);
    }

    const total = classes.length;

    // Apply pagination if specified
    if (filters?.page && filters?.limit) {
      const start = (filters.page - 1) * filters.limit;
      classes = classes.slice(start, start + filters.limit);
    }

    return { data: classes, total };
  },

  /**
   * Get single class details by ID
   */
  async getClassById(classId: string, currentUser?: User | null) {
    await delay(120);

    const cls = dbStore.classes.find((c) => c.id === classId);
    if (!cls) {
      throw new Error(`Không tìm thấy lớp học với mã: ${classId}`);
    }

    // Verify Data Ownership (§14)
    if (currentUser && currentUser.role === "GLV") {
      const isAssigned =
        cls.id === "cls-7a" ||
        cls.id === "cls-8a" ||
        cls.teachers?.some((t) => t.includes(currentUser.name));
      if (!isAssigned) {
        throw new Error("Bạn không có quyền xem thông tin lớp này (Data Ownership §14).");
      }
    }

    return cls;
  },

  /**
   * Create class (Admin only)
   */
  async createClass(data: Partial<ClassInfo>) {
    await delay(300);
    const newClass: ClassInfo & { presentCount: number; attendanceRate: number; lastUpdated: string } = {
      id: `cls-${Date.now().toString(36)}`,
      name: data.name || "Lớp mới",
      grade: data.grade || "Khối Rước Lễ",
      academicYear: data.academicYear || "2026 - 2027",
      studentCount: data.studentCount || 0,
      room: data.room || "Phòng học",
      teachers: data.teachers || ["GLV phân công"],
      presentCount: 0,
      attendanceRate: 100,
      lastUpdated: "Vừa tạo",
    };

    dbStore.classes.unshift(newClass);
    dbStore.persistClasses();
    return newClass;
  },

  /**
   * Update class
   */
  async updateClass(classId: string, updates: Partial<ClassInfo>) {
    await delay(250);
    const index = dbStore.classes.findIndex((c) => c.id === classId);
    if (index === -1) {
      throw new Error("Lớp học không tồn tại.");
    }

    dbStore.classes[index] = {
      ...dbStore.classes[index],
      ...updates,
      lastUpdated: "Vừa cập nhật",
    };
    dbStore.persistClasses();
    return dbStore.classes[index];
  },
};
