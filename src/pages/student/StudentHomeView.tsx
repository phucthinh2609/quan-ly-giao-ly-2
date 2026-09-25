import React from "react";
import { ChevronRight, CircleCheckBig, House, Star } from "lucide-react";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { formatWeekdayDate, scoreGrade } from "../../lib/format";
import { Card } from "../../components/ui/Card";
import { IconTile } from "../../components/ui/IconTile";
import {
  AchievementBadgeProps,
  BadgeShelf,
  NextSessionCard,
  QuestCard,
  StarRating,
  StudentHero,
} from "../../components/gamification";
import type {
  NextSessionInfo,
  SemesterScores,
  StudentGameProfile,
  WeeklyQuest,
} from "../../services/studentPortalMockData";
import { StudentViewHeader } from "./StudentViewHeader";
import { renderKidIcon } from "./kidIcons";
import { averageScore, formatScore } from "./studentUtils";

export interface StudentHomeViewProps {
  firstName: string;
  fullName?: string;
  avatarUrl?: string | null;
  className?: string;
  profile: StudentGameProfile;
  quests: WeeklyQuest[];
  onQuestAction: (questId: string) => void;
  badges: AchievementBadgeProps[];
  earnedBadges: number;
  onOpenBadge: (badgeId: string) => void;
  nextSession: NextSessionInfo;
  recentScores: SemesterScores;
  onNavigate: (path: string) => void;
}

function daysUntil(iso: string): number | null {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const day = new Date(target);
  day.setHours(0, 0, 0, 0);
  return Math.round((day.getTime() - start.getTime()) / 86400000);
}

function countdownLabel(iso: string): string | undefined {
  const days = daysUntil(iso);
  if (days === null || days < 0) return undefined;
  if (days === 0) return "Hôm nay";
  if (days === 1) return "Ngày mai";
  return `Còn ${days} ngày nữa`;
}

/** Trang chủ "Góc của em" (B-HS-01, B-HS-03). */
export const StudentHomeView: React.FC<StudentHomeViewProps> = ({
  firstName,
  fullName,
  avatarUrl,
  className,
  profile,
  quests,
  onQuestAction,
  badges,
  earnedBadges,
  onOpenBadge,
  nextSession,
  recentScores,
  onNavigate,
}) => {
  const ref = useReveal<HTMLDivElement>();
  const questsDone = quests.filter((q) => q.current >= q.target).length;
  const avg = averageScore(recentScores.subjects);
  const grade = scoreGrade(avg);
  const topSubjects = recentScores.subjects.filter((s) => s.score !== null).slice(0, 3);

  return (
    <div ref={ref} className={cn("space-y-8", className)}>
      <StudentViewHeader
        title="Góc của em"
        subtitle={formatWeekdayDate()}
        icon={<House />}
        tone="grape"
      />

      <StudentHero
        data-reveal
        name={firstName}
        fullName={fullName}
        avatarUrl={avatarUrl}
        level={profile.level}
        rankTitle={profile.rankTitle}
        currentXP={profile.currentXP}
        nextLevelXP={profile.nextLevelXP}
        streak={profile.streak}
      />

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="min-w-0 space-y-8 lg:col-span-2">
          {/* Nhiệm vụ tuần này */}
          <section aria-labelledby="student-quests-heading" data-reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 id="student-quests-heading" className="text-xl font-bold tracking-tight text-ink">
                  Nhiệm vụ tuần này
                </h2>
                <p className="mt-0.5 text-base text-ink-2">Làm xong để nhận thêm XP nhé!</p>
              </div>
              <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-mint-soft px-3.5 text-sm font-semibold text-ink">
                <CircleCheckBig className="size-4 text-mint" aria-hidden="true" />
                Xong {questsDone}/{quests.length}
              </span>
            </div>

            <ul className="mt-4 grid gap-4 sm:gap-5">
              {quests.map((quest) => (
                <li key={quest.id}>
                  <QuestCard
                    title={quest.title}
                    icon={renderKidIcon(quest.icon)}
                    tone={quest.tone}
                    current={quest.current}
                    target={quest.target}
                    hint={quest.hint}
                    xpReward={quest.xpReward}
                    actionLabel={quest.actionLabel}
                    onAction={quest.actionLabel ? () => onQuestAction(quest.id) : undefined}
                  />
                </li>
              ))}
            </ul>
          </section>

          {/* Kệ huy hiệu */}
          <div data-reveal className="min-w-0">
            <BadgeShelf
              badges={badges}
              onSelect={onOpenBadge}
              subtitle={`Em có ${earnedBadges}/${badges.length} huy hiệu`}
              onSeeAll={() => onNavigate("/student/achievements")}
            />
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <NextSessionCard
            data-reveal
            dateLabel={nextSession.dateLabel}
            time={nextSession.time}
            room={nextSession.room}
            teacher={nextSession.teacher}
            lesson={nextSession.lesson}
            countdownLabel={countdownLabel(nextSession.startsAt)}
          />

          {/* Điểm gần đây */}
          <Card
            data-reveal
            interactive
            padding="lg"
            onClick={() => onNavigate("/student/scores")}
            className="min-h-13"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <IconTile icon={<Star />} tone="gold" size="lg" />
                <p className="text-lg font-bold text-ink">Điểm gần đây</p>
              </div>
              <ChevronRight className="size-6 shrink-0 text-ink-3" aria-hidden="true" />
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-ink-2">Trung bình {recentScores.label}</p>
                <p className="font-mono text-4xl font-bold text-ink">{avg !== null ? formatScore(avg) : "—"}</p>
              </div>
              <div className="text-right">
                <StarRating value={grade.stars} size="md" />
                <p className="mt-1 text-base font-semibold text-ink">{grade.kidLabel}</p>
              </div>
            </div>

            {topSubjects.length > 0 && (
              <ul className="mt-4 space-y-2">
                {topSubjects.map((subject) => (
                  <li
                    key={subject.id}
                    className="flex items-center justify-between gap-3 rounded-control bg-surface-2 px-3.5 py-2.5"
                  >
                    <span className="text-base font-medium text-ink">{subject.name}</span>
                    <span className="font-mono text-base font-bold text-ink">
                      {subject.score !== null ? formatScore(subject.score) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 text-base font-semibold text-primary-ink">Xem điểm của em</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
