import React from "react";
import {
  CalendarCheck,
  FileEdit,
  CheckCircle2,
  ArrowRight,
  Bell,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ClassCard } from "../../components/class/ClassCard";
import { AttendanceSummary } from "../../components/attendance/AttendanceSummary";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { NotificationCard } from "../../components/notification/NotificationCard";
import { NotificationData, AttendanceSummaryData } from "../../types";
import {
  MOCK_CLASSES,
  MOCK_TEACHER_ACTIVITIES,
} from "../../services/dashboardMockData";

export interface TeacherDashboardProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

/**
 * TeacherDashboard Component (§30 03_Component_Library & Wireframe B §6)
 *
 * CÂY THÀNH PHẦN BẮT BUỘC:
 * <TeacherDashboard>
 * ├── <PageHeader />
 * ├── <QuickActionGrid /> (2 nút Điểm danh/Nhập điểm, đạt chuẩn ≤1 tap)
 * ├── <MyClassList />
 * ├── <AttendanceSummary />
 * ├── <UpcomingNotification />
 * └── <ActivityFeed />
 *
 * TUÂN THỦ RULE-015:
 * Tuyệt đối KHÔNG chứa thành phần Gamification (AchievementBadge, XPProgress, game-*).
 */
export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigate,
  className = "",
}) => {
  // GLV phụ trách lớp 7A (Khối Thêm Sức 1)
  const myClasses = MOCK_CLASSES.filter((c) => c.id === "cls-7a" || c.id === "cls-8a");
  const primaryClass = myClasses[0] || MOCK_CLASSES[0];

  // Today's attendance summary data for primary class
  const classSummary: AttendanceSummaryData = {
    total: primaryClass.studentCount,
    present: primaryClass.presentCount,
    absent: 1,
    excused: 1,
    late: 0,
    presentRate: (primaryClass.presentCount / primaryClass.studentCount) * 100,
  };

  // GLV Urgent/Upcoming reminder notice
  const upcomingNotice: NotificationData = {
    id: "glv-notice-01",
    type: "URGENT",
    title: "Nhắc nhở: Hạn chót hoàn thành nhập điểm Giữa kỳ I",
    preview: "Còn 2 ngày để hoàn tất điểm 15 phút và Giữa kỳ cho học sinh Lớp 7A.",
    content: "Kính gửi quý Giáo lý viên lớp 7A, theo lịch học vụ chung của Đoàn Kitô Vua, bảng điểm giữa kỳ cần được chốt trước 23:59 ngày 26/09 để Ban Phụ Huynh có thể theo dõi kết quả của các em.",
    timestamp: "1 giờ trước",
    formattedDate: "24/09/2026 · 09:00",
    isRead: false,
    className: "Lớp 7A",
    actionLabel: "Nhập điểm ngay",
    actionPath: "/teacher/scores",
  };

  const handleQuickAction = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`space-y-6 sm:space-y-7 pb-10 ${className}`}>
      {/* =================================================================== */}
      {/* 1. PageHeader (§14, §30) */}
      {/* =================================================================== */}
      <PageHeader
        title="Không gian Giáo lý viên"
        description="Chào mừng GLV. Maria Nguyễn Thị Hoa · Phụ trách Lớp 7A (Khối Thêm Sức 1)"
        badge={<Badge variant="primary">Lớp 7A · 32 học sinh</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#78716C] font-mono bg-[#FAFAF9] px-2.5 py-1 rounded-lg border border-[#E7E5E4] hidden sm:inline">
              Chúa Nhật XXV TN · 24/09/2026
            </span>
          </div>
        }
      />

      {/* =================================================================== */}
      {/* 2. QuickActionGrid (§30, Ràng buộc: ≤1 tap tới đúng trang) */}
      {/* Hai nút hành động tối ưu tốc độ tác vụ: Điểm danh & Nhập điểm */}
      {/* =================================================================== */}
      <section aria-labelledby="quick-action-heading" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3
            id="quick-action-heading"
            className="text-[13px] font-semibold tracking-wider uppercase text-[#78716C]"
          >
            Tác vụ thao tác nhanh (1 Chạm)
          </h3>
          <span className="text-[12px] text-[#168154] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sẵn sàng ghi nhận
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Nút 1: Điểm danh hôm nay (≤1 tap tới /teacher/attendance) */}
          <button
            type="button"
            onClick={() => handleQuickAction("/teacher/attendance")}
            className="group relative overflow-hidden bg-gradient-to-br from-[#FFF1F2] to-white rounded-2xl border-2 border-[#FECDD3] hover:border-[#B4232C] p-5 sm:p-6 text-left shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-[#B4232C] text-white flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[17px] sm:text-[18px] font-bold text-[#1C1917] group-hover:text-[#B4232C] transition-colors font-serif">
                    Điểm danh hôm nay
                  </h4>
                  <Badge variant="primary" size="sm">Cần ghi</Badge>
                </div>
                <p className="text-[13px] text-[#57534E] mt-0.5 line-clamp-1">
                  Ghi nhận chuyên cần Chúa Nhật 24/09 (32 học sinh)
                </p>
                <div className="mt-2 flex items-center gap-2 text-[12px] text-[#B4232C] font-semibold">
                  <span>Vào điểm danh ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            <div className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#FECDD3] items-center justify-center text-[#B4232C] shadow-2xs group-hover:bg-[#B4232C] group-hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {/* Nút 2: Nhập điểm số (≤1 tap tới /teacher/scores) */}
          <button
            type="button"
            onClick={() => handleQuickAction("/teacher/scores")}
            className="group relative overflow-hidden bg-gradient-to-br from-[#EFF6FF] to-white rounded-2xl border-2 border-[#BFDBFE] hover:border-[#2563EB] p-5 sm:p-6 text-left shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileEdit className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[17px] sm:text-[18px] font-bold text-[#1C1917] group-hover:text-[#2563EB] transition-colors font-serif">
                    Nhập điểm số
                  </h4>
                  <Badge variant="neutral" size="sm">Giữa kỳ I</Badge>
                </div>
                <p className="text-[13px] text-[#57534E] mt-0.5 line-clamp-1">
                  Nhập điểm miệng, 15 phút hoặc tải file Excel lên
                </p>
                <div className="mt-2 flex items-center gap-2 text-[12px] text-[#2563EB] font-semibold">
                  <span>Mở bảng điểm nhập liệu</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            <div className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#BFDBFE] items-center justify-center text-[#2563EB] shadow-2xs group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. MyClassList (§20, §30) */}
      {/* Danh sách lớp phụ trách */}
      {/* =================================================================== */}
      <section aria-labelledby="my-classes-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3
              id="my-classes-heading"
              className="text-[18px] sm:text-[19px] font-bold text-[#1C1917] font-serif"
            >
              Lớp giáo lý phụ trách
            </h3>
            <p className="text-[13px] text-[#78716C]">
              Danh sách các phân đoàn bạn được chỉ định làm Giáo lý viên
            </p>
          </div>
          <span className="text-[12px] text-[#78716C] bg-[#FAFAF9] px-2.5 py-1 rounded-lg border border-[#E7E5E4]">
            {myClasses.length} lớp học
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {myClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              classInfo={cls}
              onAttendanceClick={() => handleQuickAction("/teacher/attendance")}
              onScoreClick={() => handleQuickAction("/teacher/scores")}
              onViewDetails={() => alert(`Xem chi tiết lớp ${cls.name}`)}
            />
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. AttendanceSummary (§21, §30) */}
      {/* Thống kê chuyên cần của lớp hôm nay */}
      {/* =================================================================== */}
      <section aria-labelledby="attendance-summary-heading" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3
            id="attendance-summary-heading"
            className="text-[18px] sm:text-[19px] font-bold text-[#1C1917] font-serif"
          >
            Chuyên cần Lớp 7A hôm nay
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("/teacher/attendance")}
          >
            Cập nhật chi tiết
          </Button>
        </div>

        <AttendanceSummary summary={classSummary} />
      </section>

      {/* =================================================================== */}
      {/* 5 & 6. UpcomingNotification & ActivityFeed (§24, §25, §30) */}
      {/* =================================================================== */}
      <section aria-label="Thông báo và Hoạt động của lớp" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* 5. UpcomingNotification */}
        <div className="bg-white rounded-[14px] border border-[#E7E5E4] p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#B4232C]">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1C1917] font-serif">
                Thông báo & Nhắc việc
              </h3>
            </div>
            <Badge variant="error" size="sm" dot>Khẩn cấp</Badge>
          </div>

          <div className="space-y-3">
            <NotificationCard
              notification={upcomingNotice}
              onClick={() => handleQuickAction("/teacher/scores")}
            />

            {/* Notice from Admin */}
            <div className="p-3 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] text-[12.5px] text-[#57534E] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#78716C]" />
                <span>Họp Huynh trưởng tháng 10: 19:30 Thứ Sáu 02/10</span>
              </span>
              <span className="text-[#A8A29E] font-mono text-[11px]">Văn phòng Xứ</span>
            </div>
          </div>
        </div>

        {/* 6. ActivityFeed */}
        <ActivityFeed
          activities={MOCK_TEACHER_ACTIVITIES}
          title="Nhật ký thao tác của lớp 7A"
          onViewAll={() => alert("Xem toàn bộ lịch sử thao tác lớp")}
        />
      </section>
    </div>
  );
};
