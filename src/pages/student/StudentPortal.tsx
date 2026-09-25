import React, { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/cn";
import { givenName } from "../../lib/format";
import { haptic } from "../../lib/motion";
import { useToast } from "../../components/ui/Toast";
import { BadgeDetailSheet, isBadgeEarned } from "../../components/gamification";
import {
  STUDENT_BADGES,
  STUDENT_GAME_PROFILE,
  STUDENT_NEXT_SESSION,
  STUDENT_NOTIFICATIONS,
  STUDENT_SEMESTER_SCORES,
  STUDENT_SUNDAY_ATTENDANCE,
  STUDENT_WEEKLY_QUESTS,
  StudentBadge,
  StudentGameProfile,
  StudentNotification,
  WeeklyQuest,
} from "../../services/studentPortalMockData";
import { StudentHomeView } from "./StudentHomeView";
import { StudentScoresView } from "./StudentScoresView";
import { StudentAttendanceView } from "./StudentAttendanceView";
import { StudentAchievementsView } from "./StudentAchievementsView";
import { StudentNotificationsView } from "./StudentNotificationsView";
import { sortBadges, toBadgeProps } from "./studentUtils";

export interface StudentPortalProps {
  onNavigate?: (path: string) => void;
  /** Đường dẫn hiện tại (App truyền pathname). Mặc định "/dashboard". */
  currentPath?: string;
  className?: string;
}

export type StudentPortalView = "home" | "scores" | "attendance" | "achievements" | "notifications";

/** Route học sinh → màn hình (B-HS-05). "/dashboard" và "/student/portal" là trang chủ. */
export function resolveStudentView(path: string): StudentPortalView {
  const clean = (path.split(/[?#]/)[0] || "/").replace(/\/+$/, "");
  if (clean.startsWith("/student/scores")) return "scores";
  if (clean.startsWith("/student/attendance")) return "attendance";
  if (clean.startsWith("/student/achievements")) return "achievements";
  if (clean.startsWith("/student/notifications")) return "notifications";
  return "home";
}

/** Mốc chuỗi của huy hiệu chuỗi kế tiếp (lấy từ huy hiệu "Chuỗi N Chúa Nhật" chưa đạt). */
const NEXT_STREAK_GOAL =
  STUDENT_BADGES.find((b) => b.id === "badge-streak-7" && !isBadgeEarned(b.status))?.progress?.total ?? 7;

/**
 * StudentPortal — "Góc của em" (B-HS-01 … B-HS-06).
 * Một component cho mọi route học sinh; trạng thái (XP, nhiệm vụ, huy hiệu đã xem, thông báo đã đọc)
 * được giữ khi em chuyển qua lại giữa các màn hình.
 */
export const StudentPortal: React.FC<StudentPortalProps> = ({
  onNavigate,
  currentPath = "/dashboard",
  className,
}) => {
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState<StudentGameProfile>(STUDENT_GAME_PROFILE);
  const [quests, setQuests] = useState<WeeklyQuest[]>(STUDENT_WEEKLY_QUESTS);
  const [badges, setBadges] = useState<StudentBadge[]>(STUDENT_BADGES);
  const [notifications, setNotifications] = useState<StudentNotification[]>(STUDENT_NOTIFICATIONS);
  const [openBadgeId, setOpenBadgeId] = useState<string | null>(null);

  const view = resolveStudentView(currentPath);
  const firstName = givenName(user?.name) || "em";

  const navigate = useCallback((path: string) => onNavigate?.(path), [onNavigate]);

  const badgeProps = useMemo(() => badges.map(toBadgeProps), [badges]);
  const shelfBadges = useMemo(() => sortBadges(badgeProps), [badgeProps]);
  const earnedCount = badgeProps.filter((b) => isBadgeEarned(b.status)).length;
  const openBadge = badgeProps.find((b) => b.id === openBadgeId) ?? null;

  // --------------------------------------------------------------------------
  // Nhiệm vụ: em tự đánh dấu tiến độ → XP tăng khi hoàn thành, có Hoàn tác
  // --------------------------------------------------------------------------
  const handleQuestAction = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.current >= quest.target) return;

    const previous = quest.current;
    const next = previous + 1;
    const completes = next >= quest.target;
    const previousXP = profile.currentXP;

    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, current: next } : q)));
    haptic(8);

    const undo = () => {
      setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, current: previous } : q)));
      if (completes) setProfile((p) => ({ ...p, currentXP: previousXP }));
    };

    if (completes) {
      setProfile((p) => ({ ...p, currentXP: Math.min(p.nextLevelXP, p.currentXP + quest.xpReward) }));
      toast.success(`Giỏi lắm! Em nhận thêm ${quest.xpReward} XP.`, {
        title: `Xong nhiệm vụ: ${quest.title}`,
        action: { label: "Hoàn tác", onClick: undo },
      });
    } else {
      const left = quest.target - next;
      toast.info(`Tuyệt! Còn ${left} lần nữa là xong nhiệm vụ.`, {
        action: { label: "Hoàn tác", onClick: undo },
      });
    }
  };

  // --------------------------------------------------------------------------
  // Huy hiệu: mở sheet; huy hiệu NEW được đánh dấu đã xem khi đóng sheet
  // --------------------------------------------------------------------------
  const handleOpenBadge = useCallback((badgeId: string) => {
    haptic(8);
    setOpenBadgeId(badgeId);
  }, []);

  const handleCloseBadge = useCallback(() => {
    const id = openBadgeId;
    setOpenBadgeId(null);
    if (id) {
      setBadges((prev) => prev.map((b) => (b.id === id && b.status === "NEW" ? { ...b, status: "UNLOCKED" } : b)));
    }
  }, [openBadgeId]);

  // --------------------------------------------------------------------------
  // Thông báo
  // --------------------------------------------------------------------------
  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("Em đã đọc hết thông báo rồi!");
  }, [toast]);

  let content: React.ReactNode;
  switch (view) {
    case "scores":
      content = <StudentScoresView semesters={STUDENT_SEMESTER_SCORES} />;
      break;
    case "attendance":
      content = <StudentAttendanceView records={STUDENT_SUNDAY_ATTENDANCE} nextStreakGoal={NEXT_STREAK_GOAL} />;
      break;
    case "achievements":
      content = <StudentAchievementsView badges={badgeProps} onOpenBadge={handleOpenBadge} />;
      break;
    case "notifications":
      content = (
        <StudentNotificationsView
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onNavigate={navigate}
        />
      );
      break;
    default:
      content = (
        <StudentHomeView
          firstName={firstName}
          fullName={user?.name}
          avatarUrl={user?.avatarUrl}
          profile={profile}
          quests={quests}
          onQuestAction={handleQuestAction}
          badges={shelfBadges}
          earnedBadges={earnedCount}
          onOpenBadge={handleOpenBadge}
          nextSession={STUDENT_NEXT_SESSION}
          recentScores={STUDENT_SEMESTER_SCORES[0]}
          onNavigate={navigate}
        />
      );
  }

  return (
    <div className={cn("w-full min-w-0 pb-4", className)} data-student-view={view}>
      {/* key theo màn hình để hiệu ứng xuất hiện chạy lại khi đổi route */}
      <React.Fragment key={view}>{content}</React.Fragment>

      <BadgeDetailSheet badge={openBadge} isOpen={openBadge !== null} onClose={handleCloseBadge} />
    </div>
  );
};
