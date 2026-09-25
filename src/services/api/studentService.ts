import { Student, User } from "../../types";
import { dbStore, delay } from "./mockStorage";

export interface StudentFilterParams {
  classId?: string;
  search?: string;
  sort?: "order_asc" | "name_asc" | "name_desc" | "code_asc";
  gender?: "MALE" | "FEMALE";
  page?: number;
  limit?: number;
}

export const studentService = {
  /**
   * Get students with Data Ownership filtering (§14)
   */
  async getStudents(
    currentUser?: User | null,
    filters?: StudentFilterParams
  ): Promise<{ data: Student[]; total: number }> {
    await delay(150);

    let students = [...dbStore.students];

    // Data Ownership Enforcements (§14)
    if (currentUser) {
      if (currentUser.role === "GLV") {
        // GLV only gets students of assigned classes
        const assignedClassIds = ["cls-7a", "cls-8a", "class-rl1a"];
        students = students.filter(
          (s) => !s.classId || assignedClassIds.includes(s.classId)
        );
      } else if (currentUser.role === "PARENT") {
        // Parent only gets linked children
        const linkedIds = currentUser.childrenIds || ["stu-001", "stu-002", "s-01", "s-02"];
        students = students.filter((s) => linkedIds.includes(s.id) || linkedIds.includes(s.code));
      } else if (currentUser.role === "STUDENT") {
        // Student only gets self record
        const selfId = "stu-001";
        students = students.filter((s) => s.id === selfId);
      }
      // ADMIN gets all students
    }

    // Filter by classId
    if (filters?.classId && filters.classId !== "ALL") {
      students = students.filter((s) => s.classId === filters.classId || (!s.classId && filters.classId === "cls-7a"));
    }

    // Filter by search query
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          (s.christianName && s.christianName.toLowerCase().includes(q)) ||
          (s.parentName && s.parentName.toLowerCase().includes(q)) ||
          (s.parentPhone && s.parentPhone.includes(q))
      );
    }

    // Filter by gender
    if (filters?.gender) {
      students = students.filter((s) => s.gender === filters.gender);
    }

    // Sort
    if (filters?.sort === "name_asc") {
      students.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (filters?.sort === "name_desc") {
      students.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    } else if (filters?.sort === "code_asc") {
      students.sort((a, b) => a.code.localeCompare(b.code));
    } else {
      // Default: orderNumber
      students.sort((a, b) => a.orderNumber - b.orderNumber);
    }

    const total = students.length;

    // Pagination
    if (filters?.page && filters?.limit) {
      const start = (filters.page - 1) * filters.limit;
      students = students.slice(start, start + filters.limit);
    }

    return { data: students, total };
  },

  /**
   * Get student by ID
   */
  async getStudentById(studentId: string, currentUser?: User | null): Promise<Student> {
    await delay(120);

    const student = dbStore.students.find((s) => s.id === studentId || s.code === studentId);
    if (!student) {
      throw new Error(`Không tìm thấy hồ sơ học sinh với mã: ${studentId}`);
    }

    // Verify Data Ownership (§14)
    if (currentUser) {
      if (currentUser.role === "STUDENT" && student.id !== "stu-001" && student.id !== "s-01") {
        throw new Error("Học sinh chỉ được xem hồ sơ của chính mình (§14 Data Ownership).");
      }
      if (currentUser.role === "PARENT") {
        const allowedIds = currentUser.childrenIds || ["stu-001", "stu-002", "s-01", "s-02"];
        if (!allowedIds.includes(student.id) && !allowedIds.includes(student.code)) {
          throw new Error("Phụ huynh chỉ được xem hồ sơ của con mình (§14 Data Ownership).");
        }
      }
    }

    return student;
  },

  /**
   * Update student info
   */
  async updateStudent(studentId: string, updates: Partial<Student>): Promise<Student> {
    await delay(250);
    const index = dbStore.students.findIndex((s) => s.id === studentId || s.code === studentId);
    if (index === -1) {
      throw new Error("Học sinh không tồn tại.");
    }

    dbStore.students[index] = {
      ...dbStore.students[index],
      ...updates,
    };
    dbStore.persistStudents();
    return dbStore.students[index];
  },
};
