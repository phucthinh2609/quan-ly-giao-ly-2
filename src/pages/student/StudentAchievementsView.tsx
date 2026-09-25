import React, { useMemo, useState } from "react";
import { Award, Hourglass, Trophy } from "lucide-react";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { EmptyState } from "../../components/ui/EmptyState";
import { AchievementBadge, AchievementBadgeProps, isBadgeEarned } from "../../components/gamification";
import { StudentViewHeader } from "./StudentViewHeader";
import { sortBadges } from "./studentUtils";

type BadgeFilter = "ALL" | "EARNED" | "ALMOST";

export interface StudentAchievementsViewProps {
  badges: AchievementBadgeProps[];
  onOpenBadge: (badgeId: string) => void;
  className?: string;
}

/** "Huy hiệu của em" (B-HS-03, B-HS-04): lưới huy hiệu, lọc, chạm mở sheet chi tiết. */
export const StudentAchievementsView: React.FC<StudentAchievementsViewProps> = ({
  badges,
  onOpenBadge,
  className,
}) => {
  const [filter, setFilter] = useState<BadgeFilter>("ALL");

  const earned = useMemo(() => badges.filter((b) => isBadgeEarned(b.status)), [badges]);
  const almost = useMemo(() => badges.filter((b) => b.status === "AVAILABLE"), [badges]);
  const earnedXP = earned.reduce((sum, b) => sum + (b.xpReward ?? 0), 0);

  const visible = useMemo(() => {
    if (filter === "EARNED") return sortBadges(earned);
    if (filter === "ALMOST") return almost;
    return sortBadges(badges);
  }, [filter, badges, earned, almost]);

  const pageRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLUListElement>({ selector: "[data-reveal-item]", deps: [filter] });

  return (
    <div ref={pageRef} className={cn("space-y-8", className)}>
      <StudentViewHeader
        title="Huy hiệu của em"
        subtitle="Chạm vào huy hiệu để xem cách nhận nhé."
        icon={<Award />}
        tone="gold"
        aside={
          <p className="inline-flex h-12 items-center gap-2 rounded-full bg-gold-soft px-4 text-ink">
            <Trophy className="size-5 text-gold-ink" aria-hidden="true" />
            <span className="font-mono text-xl font-bold">
              {earned.length}/{badges.length}
            </span>
            <span className="sr-only">huy hiệu em đã có</span>
          </p>
        }
      />

      <div data-reveal className="space-y-2">
        <ProgressBar
          value={earned.length}
          max={Math.max(1, badges.length)}
          tone="gold"
          size="lg"
          label={`Bộ sưu tập: ${earned.length} trên ${badges.length} huy hiệu`}
        />
        <p className="text-base text-ink-2">
          Em đã nhận <strong className="font-semibold text-ink">{earnedXP} XP</strong> từ huy hiệu.
        </p>
      </div>

      <div data-reveal>
        <SegmentedControl<BadgeFilter>
          ariaLabel="Lọc huy hiệu"
          value={filter}
          onChange={setFilter}
          size="lg"
          fullWidth
          className="max-w-xl [&_button]:px-2 sm:[&_button]:px-4"
          options={[
            { value: "ALL", label: "Tất cả" },
            { value: "EARNED", label: "Đã có" },
            { value: "ALMOST", label: "Sắp đạt" },
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={filter === "ALMOST" ? <Hourglass /> : <Award />}
          title={filter === "ALMOST" ? "Chưa có huy hiệu nào sắp đạt" : "Em chưa có huy hiệu nào"}
          description={
            filter === "ALMOST"
              ? "Em cứ đi học đều, huy hiệu mới sẽ tới nhanh thôi!"
              : "Đi học Chúa Nhật này để nhận huy hiệu đầu tiên nhé!"
          }
        />
      ) : (
        <ul
          ref={gridRef}
          aria-label="Danh sách huy hiệu"
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6"
        >
          {visible.map((badge) => (
            <li key={badge.id} data-reveal-item>
              <AchievementBadge {...badge} size="md" className="h-full" onClick={() => onOpenBadge(badge.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
