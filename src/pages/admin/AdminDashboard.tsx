import React, { useState } from "react";
import {
  Users,
  School,
  UserCheck,
  CalendarCheck,
  TrendingUp,
  Download,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { KPIGroup, ChartCard, ChartCardStatus, ActivityFeed } from "../../components/dashboard";
import { ClassCard } from "../../components/class/ClassCard";
import { NotificationPreview } from "../../components/notification/NotificationPreview";
import {
  MOCK_CLASSES,
  MOCK_ADMIN_ACTIVITIES,
  MOCK_ADMIN_NOTIFICATIONS,
} from "../../services/dashboardMockData";

export interface AdminDashboardProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

/**
 * AdminDashboard (§30 03_Component_Library & Wireframe A + Admin Responsive §4–5)
 *
 * CÂY THÀNH PHẦN BẮT BUỘC:
 * <AdminDashboard>
 * ├── <PageHeader />
 * ├── <KPIGroup />
 * ├── <AttendanceChartCard />
 * ├── <ScoreChartCard />
 * ├── <ClassOverview />
 * ├── <ActivityFeed />
 * └── <NotificationPreview />
 *
 * TUÂN THỦ RULE-015:
 * Tuyệt đối KHÔNG chứa thành phần Gamification (AchievementBadge, XPProgress, game-*).
 */
export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  className = "",
}) => {
  // ChartCard state controllers for interactive review & testing (Loading/Ready/Empty/Error)
  const [attendanceChartStatus, setAttendanceChartStatus] = useState<ChartCardStatus>("ready");
  const [scoreChartStatus, setScoreChartStatus] = useState<ChartCardStatus>("ready");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("ALL");

  // Filter classes by grade
  const filteredClasses = MOCK_CLASSES.filter((c) => {
    if (selectedGradeFilter === "ALL") return true;
    return c.grade.includes(selectedGradeFilter);
  });

  // Calculate high-level aggregates
  const totalStudents = MOCK_CLASSES.reduce((acc, c) => acc + c.studentCount, 0);
  const totalPresentToday = MOCK_CLASSES.reduce((acc, c) => acc + c.presentCount, 0);
  const averageAttendanceRate = Math.round((totalPresentToday / totalStudents) * 100);

  return (
    <div className={`space-y-6 sm:space-y-7 pb-10 ${className}`}>
      {/* =================================================================== */}
      {/* 1. PageHeader (§14, §30) */}
      {/* =================================================================== */}
      <PageHeader
        title="Bảng điều khiển Quản trị"
        description="Tổng quan tình hình sinh hoạt, học tập và chuyên cần toàn Xứ đoàn Kitô Vua"
        badge={<Badge variant="primary" dot>Niên khóa 2026 - 2027</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => alert("Xuất báo cáo tổng hợp toàn đoàn (Excel)")}
            >
              Xuất báo cáo
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => {
                setAttendanceChartStatus("ready");
                setScoreChartStatus("ready");
              }}
            >
              Làm mới
            </Button>
          </div>
        }
      />

      {/* =================================================================== */}
      {/* 2. KPIGroup (§25, Wireframe A §4–5) */}
      {/* Mobile 1 col → Tablet 2 cols → Desktop 4 cols */}
      {/* =================================================================== */}
      <section aria-label="Chỉ số chính toàn xứ đoàn">
        <KPIGroup
          title="Chỉ số hoạt động toàn xứ đoàn"
          items={[
            {
              title: "Tổng học sinh",
              value: "175",
              icon: <Users className="w-5 h-5 text-[#B4232C]" />,
              trend: "+8 học sinh so với HK trước",
              trendType: "positive",
              subtitle: "Đang sinh hoạt tại 6 phân đoàn",
              onClick: () => onNavigate && onNavigate("/admin/users"),
            },
            {
              title: "Lớp giáo lý",
              value: "6",
              icon: <School className="w-5 h-5 text-[#2563EB]" />,
              trend: "100% đã phân công GLV",
              trendType: "positive",
              subtitle: "Khai Tâm đến Bao Đồng",
              onClick: () => onNavigate && onNavigate("/admin/classes"),
            },
            {
              title: "Giáo lý viên",
              value: "18",
              icon: <UserCheck className="w-5 h-5 text-[#168154]" />,
              trend: "Đầy đủ huynh trưởng trực nhật",
              trendType: "neutral",
              subtitle: "Tỷ lệ 1 GLV / 10 học sinh",
              onClick: () => onNavigate && onNavigate("/admin/users"),
            },
            {
              title: "Chuyên cần hôm nay",
              value: `${averageAttendanceRate}%`,
              icon: <CalendarCheck className="w-5 h-5 text-[#B86F08]" />,
              trend: "+2% so với Chúa Nhật trước",
              trendType: "positive",
              subtitle: `${totalPresentToday}/${totalStudents} em có mặt hôm nay`,
              onClick: () => onNavigate && onNavigate("/teacher/attendance"),
            },
          ]}
        />
      </section>

      {/* State Switcher for ChartCard Verification (Testing states: Loading / Ready / Empty / Error) */}
      <div className="bg-[#FAFAF9] rounded-xl border border-[#E7E5E4] p-3 text-[12px] text-[#57534E] flex flex-wrap items-center justify-between gap-2.5">
        <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-[#78716C]" />
          Kiểm thử trạng thái ChartCard (§25 Loading / Ready / Empty / Error):
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#78716C]">Điểm danh:</span>
          {(["ready", "loading", "empty", "error"] as ChartCardStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setAttendanceChartStatus(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer capitalize ${
                attendanceChartStatus === s
                  ? "bg-[#B4232C] text-white border-[#B4232C]"
                  : "bg-white text-[#57534E] border-[#E7E5E4] hover:bg-[#F5F5F4]"
              }`}
            >
              {s}
            </button>
          ))}
          <span className="text-[#78716C] ml-2">Học tập:</span>
          {(["ready", "loading", "empty", "error"] as ChartCardStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScoreChartStatus(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer capitalize ${
                scoreChartStatus === s
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-white text-[#57534E] border-[#E7E5E4] hover:bg-[#F5F5F4]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3 & 4. CHARTS SECTION (Desktop: 2 columns, Mobile: 1 column) */}
      {/* ├── <AttendanceChartCard /> */}
      {/* └── <ScoreChartCard /> */}
      {/* =================================================================== */}
      <section aria-label="Biểu đồ chuyên cần và học tập" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* 3. AttendanceChartCard */}
        <ChartCard
          title="Điểm danh hôm nay"
          subtitle="Tỷ lệ hiện diện Chúa Nhật 24/09/2026"
          status={attendanceChartStatus}
          onRetry={() => setAttendanceChartStatus("ready")}
          badge={
            <Badge variant="success" size="sm">
              Có mặt: {averageAttendanceRate}%
            </Badge>
          }
          action={
            <span className="text-[12px] text-[#78716C] font-mono bg-[#FAFAF9] px-2 py-1 rounded border border-[#E7E5E4]">
              Chúa Nhật XXV TN
            </span>
          }
        >
          <div className="space-y-4 py-2">
            {/* Visual Attendance Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[#1C1917]">Tiến độ điểm danh toàn đoàn</span>
                <span className="font-bold text-[#168154]">{totalPresentToday} / {totalStudents} học sinh</span>
              </div>
              <div className="w-full h-4 bg-[#E7E5E4] rounded-full overflow-hidden flex">
                <div
                  className="bg-[#22A06B] h-full transition-all duration-700"
                  style={{ width: `${(totalPresentToday / totalStudents) * 100}%` }}
                  title="Có mặt"
                />
                <div
                  className="bg-[#FCD34D] h-full transition-all duration-700"
                  style={{ width: "6%" }}
                  title="Có phép"
                />
                <div
                  className="bg-[#DC4C4C] h-full transition-all duration-700"
                  style={{ width: "5%" }}
                  title="Vắng"
                />
              </div>
            </div>

            {/* Attendance breakdown pills (Wireframe A §4–5) */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F5F5F4] text-center">
              <div className="p-2.5 rounded-xl bg-[#ECFDF3] border border-[#D1FAE5]">
                <div className="text-[18px] font-bold text-[#168154] font-serif">{totalPresentToday}</div>
                <div className="text-[12px] text-[#146C47] font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Có mặt
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8E7] border border-[#FEF0C7]">
                <div className="text-[18px] font-bold text-[#B86F08] font-serif">6</div>
                <div className="text-[12px] text-[#925A0A] font-medium flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Có phép
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2]">
                <div className="text-[18px] font-bold text-[#DC4C4C] font-serif">9</div>
                <div className="text-[12px] text-[#A52D2D] font-medium flex items-center justify-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Vắng
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#78716C] italic pt-1">
              Ghi chú: Đã có 6/6 lớp hoàn tất điểm danh lúc 08:30 sáng Chúa Nhật.
            </p>
          </div>
        </ChartCard>

        {/* 4. ScoreChartCard */}
        <ChartCard
          title="Kết quả học tập toàn đoàn"
          subtitle="Điểm trung bình học kỳ I (Thang điểm 10)"
          status={scoreChartStatus}
          onRetry={() => setScoreChartStatus("ready")}
          badge={
            <Badge variant="gold" size="sm">
              Điểm TB: 8.2
            </Badge>
          }
          action={
            <span className="text-[12px] font-semibold text-[#168154] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +0.4đ
            </span>
          }
        >
          <div className="space-y-4 py-2">
            {/* Distribution bars */}
            <div className="space-y-2">
              {[
                { label: "Xuất sắc (9.0 - 10)", count: 48, percentage: 27, color: "bg-[#E3B341]" },
                { label: "Giỏi (8.0 - 8.9)", count: 76, percentage: 43, color: "bg-[#22A06B]" },
                { label: "Khá (6.5 - 7.9)", count: 38, percentage: 22, color: "bg-[#3B82F6]" },
                { label: "Đạt (5.0 - 6.4)", count: 13, percentage: 8, color: "bg-[#D9901A]" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-[#44403C] font-medium">{item.label}</span>
                    <span className="font-semibold text-[#1C1917]">
                      {item.count} em ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F5F5F4] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#F5F5F4] flex items-center justify-between text-[12px] text-[#78716C]">
              <span>Tỷ lệ hoàn thành môn Giáo lý & Kinh Thánh:</span>
              <span className="font-bold text-[#1C1917]">98.3%</span>
            </div>
          </div>
        </ChartCard>
      </section>

      {/* =================================================================== */}
      {/* 5. ClassOverview (§20, §30) */}
      {/* =================================================================== */}
      <section aria-labelledby="class-overview-heading" className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3
              id="class-overview-heading"
              className="text-[18px] sm:text-[19px] font-bold text-[#1C1917] font-serif"
            >
              Tổng quan các lớp giáo lý
            </h3>
            <p className="text-[13px] text-[#78716C]">
              Tình hình sĩ số, ban giáo lý phụ trách và chuyên cần từng lớp
            </p>
          </div>

          {/* Filter by Grade */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Filter className="w-3.5 h-3.5 text-[#78716C]" />
            <div className="flex items-center bg-[#FAFAF9] rounded-lg p-0.5 border border-[#E7E5E4] text-[12px]">
              {[
                { id: "ALL", label: "Tất cả" },
                { id: "Khai Tâm", label: "Khai Tâm" },
                { id: "Rước Lễ", label: "Rước Lễ" },
                { id: "Thêm Sức", label: "Thêm Sức" },
                { id: "Bao Đồng", label: "Bao Đồng" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedGradeFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    selectedGradeFilter === tab.id
                      ? "bg-white text-[#B4232C] shadow-xs font-semibold"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid of ClassCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              classInfo={cls}
              onViewDetails={() => alert(`Xem chi tiết hồ sơ lớp: ${cls.name}`)}
              onAttendanceClick={() => onNavigate && onNavigate("/teacher/attendance")}
              onScoreClick={() => onNavigate && onNavigate("/teacher/scores")}
            />
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6 & 7. ActivityFeed & NotificationPreview (§24, §25, §30, Wireframe A) */}
      {/* Desktop: 2 columns (ActivityFeed & NotificationPreview) */}
      {/* =================================================================== */}
      <section aria-label="Hoạt động và Thông báo điều hành" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* 6. ActivityFeed */}
        <ActivityFeed
          activities={MOCK_ADMIN_ACTIVITIES}
          title="Nhật ký hoạt động thời gian thực"
          onViewAll={() => alert("Xem toàn bộ nhật ký hệ thống")}
        />

        {/* 7. NotificationPreview / Cảnh báo */}
        <div className="bg-white rounded-[14px] border border-[#E7E5E4] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <NotificationPreview
            notifications={MOCK_ADMIN_NOTIFICATIONS}
            onViewAll={() => onNavigate && onNavigate("/parent/notifications")}
          />
        </div>
      </section>
    </div>
  );
};
