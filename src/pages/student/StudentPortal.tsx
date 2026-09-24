import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { XPProgress } from "../../components/gamification/XPProgress";
import { AchievementBadge, AchievementBadgeProps } from "../../components/gamification/AchievementBadge";
import { StudentCard } from "../../components/student/StudentCard";
import { StudentSelector } from "../../components/student/StudentSelector";
import {
  MOCK_ACHIEVEMENTS,
  MOCK_STUDENTS,
} from "../../services/dashboardMockData";

export interface StudentPortalProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

/**
 * StudentPortal Component (§26 03_Component_Library & RULE-015)
 *
 * KHU VỰC DÀNH RIÊNG CHO HỌC SINH (STUDENT AREA):
 * Nơi quy tụ các thành phần Gamification (AchievementBadge, XPProgress, màu game-*).
 * Tuân thủ tuyệt đối RULE-015: Không làm lẫn lộn dữ liệu học vụ với huy hiệu game.
 */
export const StudentPortal: React.FC<StudentPortalProps> = ({
  className = "",
}) => {
  // Gamification state for current student
  const [level, setLevel] = useState<number>(5);
  const [currentXP, setCurrentXP] = useState<number>(860);
  const [nextLevelXP] = useState<number>(1000);
  const [streakDays, setStreakDays] = useState<number>(12);
  const [achievements, setAchievements] = useState<AchievementBadgeProps[]>(MOCK_ACHIEVEMENTS);

  // StudentSelector demo state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([
    "stu-001",
    "stu-002",
  ]);

  const activeStudent = MOCK_STUDENTS[0];

  const handleClaimReward = (id: string, xpReward: number = 100) => {
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.id === id ? { ...ach, status: "UNLOCKED", unlockedAt: "Vừa xong" } : ach
      )
    );
    setCurrentXP((prev) => Math.min(nextLevelXP, prev + xpReward));
  };

  return (
    <div className={`space-y-6 sm:space-y-7 pb-10 ${className}`}>
      {/* 1. Page Header */}
      <PageHeader
        title="Góc Thiếu Nhi Kitô Vua"
        description="Không gian học tập vui tươi, thu thập hoa thiêng và thăng tiến cấp độ đạo đức"
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Khu vực Gamification Học sinh</span>
          </span>
        }
      />

      {/* 2. XPProgress Component (§26) */}
      <section aria-labelledby="xp-progress-heading" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3
            id="xp-progress-heading"
            className="text-[13px] font-semibold tracking-wider uppercase text-[#78716C]"
          >
            Tiến độ Cấp độ & Hoa thiêng (XPProgress)
          </h3>
          <button
            type="button"
            onClick={() => {
              setCurrentXP((prev) => {
                if (prev + 50 >= nextLevelXP) {
                  setLevel((lvl) => lvl + 1);
                  return 0;
                }
                return prev + 50;
              });
              setStreakDays((d) => d + 1);
            }}
            className="text-[12px] font-bold text-[#7C5CFC] hover:underline cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+50 XP thử nghiệm</span>
          </button>
        </div>

        <XPProgress
          level={level}
          currentXP={currentXP}
          nextLevelXP={nextLevelXP}
          streakDays={streakDays}
          rankTitle="Chiến sĩ Lời Chúa Tích cực"
        />
      </section>

      {/* 3. Achievement Badges Grid (§26) */}
      <section aria-labelledby="achievements-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3
              id="achievements-heading"
              className="text-[18px] sm:text-[19px] font-bold text-[#1C1917] font-serif"
            >
              Huy hiệu Thánh thiện & Thành tích (AchievementBadge)
            </h3>
            <p className="text-[13px] text-[#78716C]">
              Bao gồm đầy đủ 4 trạng thái: LOCKED (khóa), AVAILABLE (sẵn sàng), UNLOCKED (đã đạt), NEW (mới)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {achievements.map((ach) => (
            <AchievementBadge
              key={ach.id}
              {...ach}
              onClick={() => {
                if (ach.status === "AVAILABLE") {
                  handleClaimReward(ach.id, ach.xpReward);
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* 4. StudentCard & StudentSelector (§19) */}
      <section aria-labelledby="student-components-heading" className="space-y-4 pt-4 border-t border-[#E7E5E4]">
        <div>
          <h3
            id="student-components-heading"
            className="text-[18px] sm:text-[19px] font-bold text-[#1C1917] font-serif"
          >
            Thành phần Học sinh (StudentCard, StudentRow, StudentSelector)
          </h3>
          <p className="text-[13px] text-[#78716C]">
            Kiểm thử thẻ cá nhân và bộ chọn học sinh đa năng theo đúng chuẩn §19
          </p>
        </div>

        {/* StudentCard Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <StudentCard
            student={activeStudent}
            showScore={true}
            score={8.8}
            showAttendance={true}
            attendanceStatus="PRESENT"
            actionLabel="Xem hồ sơ"
            onAction={() => alert(`Xem hồ sơ học sinh: ${activeStudent.name}`)}
          />
          <StudentCard
            student={MOCK_STUDENTS[1]}
            showScore={true}
            score={9.2}
            showAttendance={true}
            attendanceStatus="EXCUSED"
            selected={true}
            actionLabel="Sửa thông tin"
          />
          <StudentCard
            student={MOCK_STUDENTS[2]}
            showScore={true}
            score={7.5}
            showAttendance={true}
            attendanceStatus="ABSENT"
            actionLabel="Liên hệ PH"
          />
        </div>

        {/* StudentSelector with Search, Select All, Individual Select, Selected Count, Clear */}
        <div className="pt-2">
          <StudentSelector
            students={MOCK_STUDENTS}
            selectedIds={selectedStudentIds}
            onChange={setSelectedStudentIds}
            title="Bộ chọn học sinh toàn năng (StudentSelector §19)"
            placeholder="Tìm theo tên học sinh, tên Thánh, hoặc mã số..."
          />
        </div>
      </section>
    </div>
  );
};
