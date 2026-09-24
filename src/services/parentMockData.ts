import {
  LinkedStudent,
  AcademicPeriod,
  AcademicPeriodOption,
  StudentAcademicReport,
  NotificationData,
  NOTIFICATION_TYPE_PRIORITY,
} from "../types";

// ============================================================================
// LINKED CHILDREN FOR PARENT
// ============================================================================
export const MOCK_LINKED_STUDENTS: LinkedStudent[] = [
  {
    id: "s-01",
    name: "Nguyễn Văn An",
    christianName: "Giuse",
    className: "Lớp 7A",
    grade: "Khối Thêm Sức 1",
    code: "HS001",
    avatarUrl: null,
  },
  {
    id: "s-02",
    name: "Nguyễn Thị Mai Anh",
    christianName: "Maria",
    className: "Lớp 3B",
    grade: "Khối Rước Lễ 1",
    code: "HS042",
    avatarUrl: null,
  },
  {
    id: "s-03",
    name: "Nguyễn Minh Khôi",
    christianName: "Gioan Baotixita",
    className: "Lớp Chiên Con 2",
    grade: "Khối Khai Tâm",
    code: "HS089",
    avatarUrl: null,
  },
];

// ============================================================================
// ACADEMIC PERIODS
// ============================================================================
export const MOCK_ACADEMIC_PERIODS: AcademicPeriodOption[] = [
  {
    id: "HK1",
    label: "Học kỳ I",
    academicYear: "2026 - 2027",
  },
  {
    id: "HK2",
    label: "Học kỳ II",
    academicYear: "2026 - 2027",
  },
  {
    id: "FULL_YEAR",
    label: "Cả năm học",
    academicYear: "2026 - 2027",
  },
];

// ============================================================================
// ACADEMIC REPORTS BY STUDENT & PERIOD
// ============================================================================
export const MOCK_STUDENT_REPORTS: Record<string, Record<AcademicPeriod, StudentAcademicReport>> = {
  // 👦 Child 1: Nguyễn Văn An (Lớp 7A)
  "s-01": {
    HK1: {
      studentId: "s-01",
      period: "HK1",
      periodLabel: "Học kỳ I",
      academicYear: "2026 - 2027",
      gpa: 8.5,
      rankLabel: "Tốt",
      rankColor: "gold",
      subjects: [
        {
          subjectId: "sub-gl",
          subjectName: "Giáo lý",
          icon: "📖",
          averageScore: 8.5,
          midtermScore: 8.0,
          finalScore: 9.0,
          oralScore: 9.0,
          quizScore: 8.5,
          comment: "Nắm vững các mầu nhiệm căn bản và giáo lý Hội thánh.",
        },
        {
          subjectId: "sub-kt",
          subjectName: "Kinh Thánh",
          icon: "✝️",
          averageScore: 9.0,
          midtermScore: 9.0,
          finalScore: 9.0,
          oralScore: 9.0,
          quizScore: 9.0,
          comment: "Thuộc lòng các câu Tin Mừng và tích cực chia sẻ Lời Chúa.",
        },
        {
          subjectId: "sub-pv",
          subjectName: "Phụng vụ",
          icon: "🕊️",
          averageScore: 8.0,
          midtermScore: 7.5,
          finalScore: 8.5,
          oralScore: 8.0,
          quizScore: 8.0,
          comment: "Tham dự Thánh lễ nghiêm trang, biết cách phụ tá bàn thờ.",
        },
        {
          subjectId: "sub-nb",
          subjectName: "Nhân bản & Hoạt động",
          icon: "🤝",
          averageScore: 8.8,
          midtermScore: 8.5,
          finalScore: 9.0,
          oralScore: 9.0,
          quizScore: 8.5,
          comment: "Hòa nhã với bạn bè, tích cực trong các phong trào thi đua.",
        },
      ],
      teacherComment: "Con chăm chỉ và tích cực tham gia học tập, thảo luận sôi nổi và hăng say học hỏi giáo lý.",
      teacherName: "GLV. Giuse Trần Văn Minh",
      attendance: {
        totalSessions: 20,
        attendedSessions: 18,
        absentSessions: 2,
        excusedSessions: 1,
        attendanceRate: 90,
      },
    },
    HK2: {
      studentId: "s-01",
      period: "HK2",
      periodLabel: "Học kỳ II",
      academicYear: "2026 - 2027",
      gpa: 8.8,
      rankLabel: "Giỏi",
      rankColor: "gold",
      subjects: [
        {
          subjectId: "sub-gl",
          subjectName: "Giáo lý",
          icon: "📖",
          averageScore: 8.9,
          midtermScore: 8.5,
          finalScore: 9.2,
          oralScore: 9.0,
          quizScore: 9.0,
        },
        {
          subjectId: "sub-kt",
          subjectName: "Kinh Thánh",
          icon: "✝️",
          averageScore: 9.2,
          midtermScore: 9.0,
          finalScore: 9.5,
          oralScore: 9.0,
          quizScore: 9.5,
        },
        {
          subjectId: "sub-pv",
          subjectName: "Phụng vụ",
          icon: "🕊️",
          averageScore: 8.3,
          midtermScore: 8.0,
          finalScore: 8.6,
          oralScore: 8.5,
          quizScore: 8.0,
        },
        {
          subjectId: "sub-nb",
          subjectName: "Nhân bản & Hoạt động",
          icon: "🤝",
          averageScore: 9.0,
          midtermScore: 9.0,
          finalScore: 9.0,
          oralScore: 9.0,
          quizScore: 9.0,
        },
      ],
      teacherComment: "Kỳ II con tiến bộ vượt bậc, thể hiện sự trưởng thành đức tin rõ rệt.",
      teacherName: "GLV. Giuse Trần Văn Minh",
      attendance: {
        totalSessions: 20,
        attendedSessions: 19,
        absentSessions: 1,
        excusedSessions: 1,
        attendanceRate: 95,
      },
    },
    FULL_YEAR: {
      studentId: "s-01",
      period: "FULL_YEAR",
      periodLabel: "Cả năm học",
      academicYear: "2026 - 2027",
      gpa: 8.7,
      rankLabel: "Giỏi",
      rankColor: "gold",
      subjects: [
        {
          subjectId: "sub-gl",
          subjectName: "Giáo lý",
          icon: "📖",
          averageScore: 8.7,
          midtermScore: 8.3,
          finalScore: 9.1,
        },
        {
          subjectId: "sub-kt",
          subjectName: "Kinh Thánh",
          icon: "✝️",
          averageScore: 9.1,
          midtermScore: 9.0,
          finalScore: 9.2,
        },
        {
          subjectId: "sub-pv",
          subjectName: "Phụng vụ",
          icon: "🕊️",
          averageScore: 8.2,
          midtermScore: 7.8,
          finalScore: 8.6,
        },
        {
          subjectId: "sub-nb",
          subjectName: "Nhân bản & Hoạt động",
          icon: "🤝",
          averageScore: 8.9,
          midtermScore: 8.8,
          finalScore: 9.0,
        },
      ],
      teacherComment: "Đạt danh hiệu Học sinh Giáo lý Giỏi cả năm học. Đủ điều kiện lãnh nhận Bí tích Thêm Sức.",
      teacherName: "GLV. Giuse Trần Văn Minh",
      attendance: {
        totalSessions: 40,
        attendedSessions: 37,
        absentSessions: 3,
        excusedSessions: 2,
        attendanceRate: 92.5,
      },
    },
  },

  // 👧 Child 2: Nguyễn Thị Mai Anh (Lớp 3B)
  "s-02": {
    HK1: {
      studentId: "s-02",
      period: "HK1",
      periodLabel: "Học kỳ I",
      academicYear: "2026 - 2027",
      gpa: 9.3,
      rankLabel: "Xuất sắc",
      rankColor: "gold",
      subjects: [
        {
          subjectId: "sub-gl",
          subjectName: "Giáo lý",
          icon: "📖",
          averageScore: 9.5,
          midtermScore: 9.5,
          finalScore: 9.5,
          oralScore: 10.0,
          quizScore: 9.0,
          comment: "Rất chăm chỉ, thuộc hết các kinh bổn và trả lời lưu loát.",
        },
        {
          subjectId: "sub-kt",
          subjectName: "Kinh Thánh",
          icon: "✝️",
          averageScore: 9.2,
          midtermScore: 9.0,
          finalScore: 9.5,
          oralScore: 9.0,
          quizScore: 9.0,
          comment: "Thích nghe kể chuyện Chúa Giêsu, nhớ chi tiết rất nhanh.",
        },
        {
          subjectId: "sub-cn",
          subjectName: "Cầu nguyện & Kinh hạt",
          icon: "📿",
          averageScore: 9.4,
          midtermScore: 9.0,
          finalScore: 9.8,
          oralScore: 9.5,
          quizScore: 9.5,
          comment: "Đọc kinh sốt sắng, giữ trật tự tốt trong nhà thờ.",
        },
        {
          subjectId: "sub-kl",
          subjectName: "Kỷ luật & Tác phong",
          icon: "⭐",
          averageScore: 9.0,
          midtermScore: 9.0,
          finalScore: 9.0,
          oralScore: 9.0,
          quizScore: 9.0,
          comment: "Lễ phép với các anh chị GLV và cha xứ.",
        },
      ],
      teacherComment: "Maria Mai Anh rất ngoan ngoãn, thuộc kinh tốt, luôn chăm chỉ đi lễ và tham gia phát biểu tích cực.",
      teacherName: "GLV. Maria Nguyễn Thị Lan",
      attendance: {
        totalSessions: 20,
        attendedSessions: 20,
        absentSessions: 0,
        excusedSessions: 0,
        attendanceRate: 100,
      },
    },
    HK2: {
      studentId: "s-02",
      period: "HK2",
      periodLabel: "Học kỳ II",
      academicYear: "2026 - 2027",
      gpa: 9.5,
      rankLabel: "Xuất sắc",
      rankColor: "gold",
      subjects: [
        {
          subjectId: "sub-gl",
          subjectName: "Giáo lý",
          icon: "📖",
          averageScore: 9.6,
          midtermScore: 9.5,
          finalScore: 9.7,
        },
        {
          subjectId: "sub-kt",
          subjectName: "Kinh Thánh",
          icon: "✝️",
          averageScore: 9.4,
          midtermScore: 9.2,
          finalScore: 9.6,
        },
        {
          subjectId: "sub-cn",
          subjectName: "Cầu nguyện & Kinh hạt",
          icon: "📿",
          averageScore: 9.6,
          midtermScore: 9.5,
          finalScore: 9.8,
        },
        {
          subjectId: "sub-kl",
          subjectName: "Kỷ luật & Tác phong",
          icon: "⭐",
          averageScore: 9.3,
          midtermScore: 9.0,
          finalScore: 9.5,
        },
      ],
      teacherComment: "Mai Anh hoàn thành xuất sắc chương trình chuẩn bị Rước Lễ Lần Đầu.",
      teacherName: "GLV. Maria Nguyễn Thị Lan",
      attendance: {
        totalSessions: 20,
        attendedSessions: 20,
        absentSessions: 0,
        excusedSessions: 0,
        attendanceRate: 100,
      },
    },
    FULL_YEAR: {
      studentId: "s-02",
      period: "FULL_YEAR",
      periodLabel: "Cả năm học",
      academicYear: "2026 - 2027",
      gpa: 9.4,
      rankLabel: "Xuất sắc",
      rankColor: "gold",
      subjects: [
        {
          subjectId: "sub-gl",
          subjectName: "Giáo lý",
          icon: "📖",
          averageScore: 9.5,
          midtermScore: 9.5,
          finalScore: 9.6,
        },
        {
          subjectId: "sub-kt",
          subjectName: "Kinh Thánh",
          icon: "✝️",
          averageScore: 9.3,
          midtermScore: 9.1,
          finalScore: 9.5,
        },
        {
          subjectId: "sub-cn",
          subjectName: "Cầu nguyện & Kinh hạt",
          icon: "📿",
          averageScore: 9.5,
          midtermScore: 9.2,
          finalScore: 9.8,
        },
        {
          subjectId: "sub-kl",
          subjectName: "Kỷ luật & Tác phong",
          icon: "⭐",
          averageScore: 9.2,
          midtermScore: 9.0,
          finalScore: 9.3,
        },
      ],
      teacherComment: "Đạt giải Nhất thi Giáo lý cấp Giáo xứ và chuyên cần 100%.",
      teacherName: "GLV. Maria Nguyễn Thị Lan",
      attendance: {
        totalSessions: 40,
        attendedSessions: 40,
        absentSessions: 0,
        excusedSessions: 0,
        attendanceRate: 100,
      },
    },
  },

  // 👦 Child 3: Nguyễn Minh Khôi (Lớp Chiên Con 2)
  "s-03": {
    HK1: {
      studentId: "s-03",
      period: "HK1",
      periodLabel: "Học kỳ I",
      academicYear: "2026 - 2027",
      gpa: 8.0,
      rankLabel: "Khá",
      rankColor: "neutral",
      subjects: [
        {
          subjectId: "sub-kc",
          subjectName: "Kể chuyện Thánh Kinh",
          icon: "📖",
          averageScore: 8.0,
          midtermScore: 8.0,
          finalScore: 8.0,
          comment: "Thích nghe kể chuyện Chúa Giêsu yêu trẻ nhỏ.",
        },
        {
          subjectId: "sub-ld",
          subjectName: "Làm dấu & Kinh vắn",
          icon: "✝️",
          averageScore: 8.0,
          midtermScore: 8.0,
          finalScore: 8.0,
          comment: "Đã thuộc Kinh Lạy Cha và Kinh Kính Mừng.",
        },
        {
          subjectId: "sub-cm",
          subjectName: "Ca múa cử điệu",
          icon: "🎶",
          averageScore: 8.5,
          midtermScore: 8.0,
          finalScore: 9.0,
          comment: "Rất vui vẻ và nhiệt tình múa cử điệu cùng các bạn.",
        },
      ],
      teacherComment: "Minh Khôi rất hiếu động, múa cử điệu rất hào hứng. Gia đình nhắc con tập trung hơn khi làm dấu Thánh Giá.",
      teacherName: "GLV. Têrêsa Phạm Thị Kim",
      attendance: {
        totalSessions: 20,
        attendedSessions: 17,
        absentSessions: 3,
        excusedSessions: 2,
        attendanceRate: 85,
      },
    },
    HK2: {
      studentId: "s-03",
      period: "HK2",
      periodLabel: "Học kỳ II",
      academicYear: "2026 - 2027",
      gpa: 8.3,
      rankLabel: "Khá",
      rankColor: "neutral",
      subjects: [
        {
          subjectId: "sub-kc",
          subjectName: "Kể chuyện Thánh Kinh",
          icon: "📖",
          averageScore: 8.2,
          midtermScore: 8.0,
          finalScore: 8.4,
        },
        {
          subjectId: "sub-ld",
          subjectName: "Làm dấu & Kinh vắn",
          icon: "✝️",
          averageScore: 8.3,
          midtermScore: 8.0,
          finalScore: 8.5,
        },
        {
          subjectId: "sub-cm",
          subjectName: "Ca múa cử điệu",
          icon: "🎶",
          averageScore: 8.6,
          midtermScore: 8.5,
          finalScore: 9.0,
        },
      ],
      teacherComment: "Con đã trật tự hơn rất nhiều trong giờ sinh hoạt.",
      teacherName: "GLV. Têrêsa Phạm Thị Kim",
      attendance: {
        totalSessions: 20,
        attendedSessions: 18,
        absentSessions: 2,
        excusedSessions: 2,
        attendanceRate: 90,
      },
    },
    FULL_YEAR: {
      studentId: "s-03",
      period: "FULL_YEAR",
      periodLabel: "Cả năm học",
      academicYear: "2026 - 2027",
      gpa: 8.2,
      rankLabel: "Khá",
      rankColor: "neutral",
      subjects: [
        {
          subjectId: "sub-kc",
          subjectName: "Kể chuyện Thánh Kinh",
          icon: "📖",
          averageScore: 8.1,
          midtermScore: 8.0,
          finalScore: 8.2,
        },
        {
          subjectId: "sub-ld",
          subjectName: "Làm dấu & Kinh vắn",
          icon: "✝️",
          averageScore: 8.2,
          midtermScore: 8.0,
          finalScore: 8.3,
        },
        {
          subjectId: "sub-cm",
          subjectName: "Ca múa cử điệu",
          icon: "🎶",
          averageScore: 8.5,
          midtermScore: 8.2,
          finalScore: 9.0,
        },
      ],
      teacherComment: "Hoàn thành chương trình lớp Chiên Con 2.",
      teacherName: "GLV. Têrêsa Phạm Thị Kim",
      attendance: {
        totalSessions: 40,
        attendedSessions: 35,
        absentSessions: 5,
        excusedSessions: 4,
        attendanceRate: 87.5,
      },
    },
  },
};

// ============================================================================
// NOTIFICATIONS BY STUDENT
// Priority ordering: URGENT -> STUDENT -> CLASS -> GENERAL -> SYSTEM
// ============================================================================
export const MOCK_NOTIFICATIONS: Record<string, NotificationData[]> = {
  "s-01": [
    {
      id: "notif-01-urg",
      type: "URGENT",
      title: "Thông báo chuẩn bị Tĩnh tâm & Xưng tội",
      preview: "Chúa Nhật ngày 28/09 sẽ tổ chức buổi tĩnh tâm bắt buộc cho toàn khối Thêm Sức.",
      content: "Kính gửi quý phụ huynh, để chuẩn bị tâm hồn sốt sắng cho ngày lễ Bổn mạng Xứ đoàn, Ban Giáo lý tổ chức buổi Tĩnh tâm và Xưng tội cho các em Lớp 7A vào lúc 14h30 Chúa Nhật ngày 28/09/2026 tại Nhà thờ Giáo xứ. Kính mong phụ huynh nhắc nhở các em tham dự đầy đủ đúng giờ.",
      timestamp: "2 giờ trước",
      formattedDate: "24/09/2026 · 08:30",
      isRead: false,
      studentId: "s-01",
      studentName: "Nguyễn Văn An",
      className: "Lớp 7A",
      actionLabel: "Xem chi tiết lịch học",
      actionPath: "/parent/attendance",
    },
    {
      id: "notif-01-stu-1",
      type: "STUDENT",
      title: "Cập nhật điểm Giữa kỳ I của con",
      preview: "Bảng điểm môn Giáo lý và Kinh Thánh của Nguyễn Văn An đã được cập nhật.",
      content: "Kính gửi quý phụ huynh, Giáo lý viên phụ trách đã hoàn tất việc nhập điểm kiểm tra Giữa kỳ I cho em Nguyễn Văn An. Điểm Giáo lý: 8.0, Điểm Kinh Thánh: 9.0. Quý phụ huynh vui lòng vào Bảng điểm để xem chi tiết kết quả.",
      timestamp: "Hôm qua · 18:30",
      formattedDate: "23/09/2026 · 18:30",
      isRead: false,
      studentId: "s-01",
      studentName: "Nguyễn Văn An",
      className: "Lớp 7A",
      actionLabel: "Xem Bảng điểm",
      actionPath: "/parent/scores",
    },
    {
      id: "notif-01-stu-2",
      type: "STUDENT",
      title: "Ghi nhận chuyên cần ngày 03/09",
      preview: "Giáo lý viên đã xác nhận phép nghỉ học ngày 03/09 của em An.",
      content: "Đơn xin phép nghỉ học Chúa Nhật ngày 03/09 của phụ huynh em Nguyễn Văn An vì lý do việc gia đình đã được phê duyệt hợp lệ thành 'Có phép'.",
      timestamp: "3 ngày trước",
      formattedDate: "21/09/2026 · 09:15",
      isRead: true,
      studentId: "s-01",
      studentName: "Nguyễn Văn An",
      className: "Lớp 7A",
      actionLabel: "Xem lịch sử điểm danh",
      actionPath: "/parent/attendance",
    },
    {
      id: "notif-01-cls",
      type: "CLASS",
      title: "Kế hoạch sinh hoạt chuyên đề Lớp 7A",
      preview: "Sinh hoạt chủ đề 'Tình bạn Kitô giáo' trong tiết học Chúa Nhật tới.",
      content: "Các em học sinh mang theo tập bút và trang phục Thiếu Nhi Thánh Thể chỉnh tề để tham gia tiết sinh hoạt chuyên đề ngoài trời cùng các bạn trong lớp.",
      timestamp: "5 ngày trước",
      formattedDate: "19/09/2026 · 16:00",
      isRead: true,
      className: "Lớp 7A",
      actionLabel: "Xem thông tin lớp",
    },
    {
      id: "notif-01-gen",
      type: "GENERAL",
      title: "Lễ Khai giảng Năm học Giáo lý 2026 - 2027",
      preview: "Chào mừng hơn 500 em thiếu nhi và các anh chị Huynh trưởng bước vào niên khóa mới.",
      content: "Ban Giáo lý Xứ đoàn Kính chúc quý Phụ huynh cùng toàn thể các em một năm học tràn đầy ân sủng Chúa Thánh Thần và đạt nhiều thành tích thi đua tốt.",
      timestamp: "1 tuần trước",
      formattedDate: "15/09/2026 · 08:00",
      isRead: true,
    },
  ],

  "s-02": [
    {
      id: "notif-02-urg",
      type: "URGENT",
      title: "Lịch tập dâng hoa Tháng Mân Côi - Khối Rước Lễ",
      preview: "Các em trong đội hoa Khối Rước Lễ 1 tập dâng hoa vào chiều thứ Bảy 15h30.",
      content: "Kính gửi quý phụ huynh em Maria Nguyễn Thị Mai Anh, vì em được chọn vào đội hoa dâng kính Đức Mẹ tháng 10, kính mời phụ huynh đưa em đến hội trường giáo xứ lúc 15h30 thứ Bảy để thử trang phục và tập cử điệu.",
      timestamp: "1 giờ trước",
      formattedDate: "24/09/2026 · 09:00",
      isRead: false,
      studentId: "s-02",
      studentName: "Nguyễn Thị Mai Anh",
      className: "Lớp 3B",
      actionLabel: "Xem lịch tập",
    },
    {
      id: "notif-02-stu-1",
      type: "STUDENT",
      title: "Khen thưởng Chuyên cần 100% Tháng 9",
      preview: "Maria Nguyễn Thị Mai Anh đạt chuyên cần tuyệt đối 20/20 buổi học.",
      content: "Chúc mừng em Maria Mai Anh đã tham gia đầy đủ tất cả các buổi học Giáo lý và Thánh lễ thiếu nhi, nhận huy hiệu 'Siêu Chuyên Cần' và phần quà khích lệ từ Cha Tuyên úy.",
      timestamp: "Hôm qua · 10:00",
      formattedDate: "23/09/2026 · 10:00",
      isRead: false,
      studentId: "s-02",
      studentName: "Nguyễn Thị Mai Anh",
      className: "Lớp 3B",
      actionLabel: "Xem chuyên cần",
      actionPath: "/parent/attendance",
    },
    {
      id: "notif-02-cls",
      type: "CLASS",
      title: "Họp phụ huynh chuẩn bị Xưng Tội Lần Đầu",
      preview: "Cuộc họp ngắn 30 phút sau Thánh lễ thiếu nhi Chúa Nhật 05/10.",
      content: "Kính mời quý phụ huynh Lớp 3B nán lại tại Nhà xứ sau lễ để GLV phổ biến chương trình chuẩn bị tâm hồn cho các em lãnh nhận Bí tích Giao hòa lần đầu.",
      timestamp: "4 ngày trước",
      formattedDate: "20/09/2026 · 11:30",
      isRead: true,
      className: "Lớp 3B",
    },
    {
      id: "notif-02-gen",
      type: "GENERAL",
      title: "Đăng ký tham gia Hội chợ Ẩm thực Thiếu Nhi",
      preview: "Hội chợ diễn ra vào Chúa Nhật Khánh nhật Truyền giáo 19/10.",
      content: "Ban Trợ tá phụ huynh hỗ trợ các gian hàng ẩm thực vui chơi có thưởng cho các em thiếu nhi trong giáo xứ.",
      timestamp: "1 tuần trước",
      formattedDate: "16/09/2026 · 14:00",
      isRead: true,
    },
  ],

  "s-03": [
    {
      id: "notif-03-urg",
      type: "URGENT",
      title: "Nhắc nhở phụ huynh đón bé đúng giờ",
      preview: "Lớp Chiên Con 2 tan học lúc 09h00 sau giờ sinh hoạt nhà xứ.",
      content: "Kính mong phụ huynh đón các bé đúng giờ tại sảnh hội trường để các anh chị Huynh trưởng kiểm soát an toàn cho các bé nhỏ tuổi.",
      timestamp: "3 giờ trước",
      formattedDate: "24/09/2026 · 07:15",
      isRead: false,
      studentId: "s-03",
      studentName: "Nguyễn Minh Khôi",
      className: "Lớp Chiên Con 2",
    },
    {
      id: "notif-03-stu",
      type: "STUDENT",
      title: "Nhận xét học tập Tháng 9 của Minh Khôi",
      preview: "GLV đã cập nhật nhận xét nề nếp và tham gia cử điệu của bé.",
      content: "Minh Khôi rất hào hứng tham gia các trò chơi và múa cử điệu. Bé đã thuộc trọn vẹn Kinh Lạy Cha và biết làm dấu ngay ngắn trước khi vào lớp.",
      timestamp: "2 ngày trước",
      formattedDate: "22/09/2026 · 17:00",
      isRead: true,
      studentId: "s-03",
      studentName: "Nguyễn Minh Khôi",
      className: "Lớp Chiên Con 2",
      actionLabel: "Xem nhận xét GLV",
      actionPath: "/parent/scores",
    },
    {
      id: "notif-03-gen",
      type: "GENERAL",
      title: "Lễ Khai giảng Năm học Giáo lý 2026 - 2027",
      preview: "Chào đón các em lớp Chiên Con lần đầu đến trường Giáo lý.",
      content: "Kính chúc các bé luôn chăm ngoan, khỏe mạnh và yêu mến Chúa Giêsu Bạn Mình.",
      timestamp: "1 tuần trước",
      formattedDate: "15/09/2026 · 08:00",
      isRead: true,
    },
  ],
};

// ============================================================================
// HELPER SERVICE FUNCTIONS
// ============================================================================

/**
 * Sort notifications according to strict specification:
 * Priority: URGENT -> STUDENT -> CLASS -> GENERAL -> SYSTEM
 */
export function sortNotificationsByPriority(list: NotificationData[]): NotificationData[] {
  return [...list].sort((a, b) => {
    const rankA = NOTIFICATION_TYPE_PRIORITY[a.type] || 99;
    const rankB = NOTIFICATION_TYPE_PRIORITY[b.type] || 99;
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    // Then unread first
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Simulates fetching full academic report for a student and period.
 * Returns a promise with simulated network delay (200-350ms) to ensure
 * child switcher genuinely triggers real data fetching lifecycle.
 */
export async function fetchStudentAcademicReport(
  studentId: string,
  period: AcademicPeriod = "HK1",
  delayMs: number = 280
): Promise<StudentAcademicReport> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const studentReports = MOCK_STUDENT_REPORTS[studentId] || MOCK_STUDENT_REPORTS["s-01"];
  const report = studentReports[period] || studentReports["HK1"];
  return JSON.parse(JSON.stringify(report)); // return fresh copy
}

/**
 * Simulates fetching notifications for a student.
 */
export async function fetchStudentNotifications(
  studentId: string,
  delayMs: number = 240
): Promise<NotificationData[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const rawList = MOCK_NOTIFICATIONS[studentId] || MOCK_NOTIFICATIONS["s-01"];
  return sortNotificationsByPriority(JSON.parse(JSON.stringify(rawList)));
}
