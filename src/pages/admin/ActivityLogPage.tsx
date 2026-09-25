import React, { useState, useEffect, useMemo } from "react";
import { Bell, CheckCircle2, History, PenLine, UserPlus } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CountUp } from "../../components/ui/CountUp";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { FilterBar } from "../../components/ui/FilterBar";
import { IconTile } from "../../components/ui/IconTile";
import { Pagination } from "../../components/ui/Pagination";
import { Skeleton } from "../../components/ui/Skeleton";
import { Tone } from "../../components/ui/tone";
import { ActivityFeed, ActivityItem, ActivityType } from "../../components/dashboard/ActivityFeed";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { activityService } from "../../services/api";

const PAGE_SIZE = 10;
const ALL = "all";

const TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: "attendance", label: "Điểm danh" },
  { value: "score", label: "Điểm số" },
  { value: "notification", label: "Thông báo" },
  { value: "user", label: "Tài khoản" },
  { value: "system", label: "Hệ thống" },
];

const SUMMARY_TILES: { type: ActivityType; label: string; tone: Tone; icon: React.ReactNode }[] = [
  { type: "attendance", label: "Điểm danh", tone: "success", icon: <CheckCircle2 /> },
  { type: "score", label: "Điểm số", tone: "info", icon: <PenLine /> },
  { type: "notification", label: "Thông báo", tone: "primary", icon: <Bell /> },
  { type: "user", label: "Tài khoản", tone: "gold", icon: <UserPlus /> },
];

const isActivityType = (value: string): value is ActivityType => TYPE_OPTIONS.some((o) => o.value === value);

export const ActivityLogPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ActivityType | typeof ALL>(ALL);
  const [page, setPage] = useState(1);

  const revealRef = useReveal<HTMLDivElement>({ deps: [loading] });

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await activityService.getActivities();
      setActivities(Array.isArray(data) ? (data as ActivityItem[]) : []);
    } catch {
      setError("Kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  const counts = useMemo(() => {
    const map: Partial<Record<ActivityType, number>> = {};
    activities.forEach((a) => {
      const t = a.type ?? "system";
      map[t] = (map[t] ?? 0) + 1;
    });
    return map;
  }, [activities]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activities.filter((a) => {
      if (typeFilter !== ALL && (a.type ?? "system") !== typeFilter) return false;
      if (!q) return true;
      return [a.userName, a.christianName, a.action, a.target, a.userRole]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [activities, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = Boolean(search) || typeFilter !== ALL;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhật ký hoạt động"
        description="Mọi thao tác điểm danh, cập nhật điểm số và thay đổi hồ sơ trong hệ thống"
      />

      <div ref={revealRef} className="space-y-6">
        {/* Tóm tắt theo loại — chạm để lọc nhanh */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {SUMMARY_TILES.map((tile) => {
            const active = typeFilter === tile.type;
            return (
              <Card
                key={tile.type}
                data-reveal
                interactive
                padding="sm"
                aria-pressed={active}
                aria-label={`Lọc theo ${tile.label}: ${counts[tile.type] ?? 0} hoạt động`}
                onClick={() => setTypeFilter(active ? ALL : tile.type)}
                className={cn("flex items-center gap-3", active && "border-ink-3 bg-surface-2")}
              >
                <IconTile icon={tile.icon} tone={tile.tone} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-2">{tile.label}</p>
                  <div className="text-xl font-bold tracking-tight text-ink">
                    {loading ? <Skeleton className="h-6 w-8 rounded-full" /> : <CountUp value={counts[tile.type] ?? 0} />}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <FilterBar
          searchQuery={search}
          searchPlaceholder="Tìm theo người thực hiện, hành động, lớp"
          onSearchChange={setSearch}
          onSearchClear={() => setSearch("")}
          filters={[
            {
              id: "type",
              label: "Loại",
              value: typeFilter,
              options: [{ value: ALL, label: "Tất cả loại" }, ...TYPE_OPTIONS],
              onChange: (v) => setTypeFilter(isActivityType(v) ? v : ALL),
            },
          ]}
          activeFiltersCount={typeFilter !== ALL ? 1 : 0}
          onClearAll={() => setTypeFilter(ALL)}
          mobileFilterTitle="Lọc nhật ký"
        />

        {loading ? (
          <Card padding="md" className="space-y-5" role="status" aria-label="Đang tải nhật ký">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton variant="circular" className="mt-3 size-2.5" />
                <Skeleton variant="circular" className="size-8" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/3 rounded-full" />
                </div>
              </div>
            ))}
          </Card>
        ) : error ? (
          <ErrorState title="Không thể tải nhật ký" message={error} onRetry={loadActivities} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<History />}
            title={hasFilters ? "Không có hoạt động phù hợp" : "Chưa có hoạt động"}
            description={
              hasFilters ? "Thử từ khóa khác hoặc chọn loại khác." : "Các thao tác trong hệ thống sẽ được ghi lại tại đây."
            }
            action={
              hasFilters ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter(ALL);
                  }}
                >
                  Xóa bộ lọc
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            <Card data-reveal padding="md">
              <p className="mb-4 text-sm text-ink-3" aria-live="polite">
                <span className="font-mono font-semibold text-ink">{filtered.length}</span> hoạt động
                {hasFilters ? " phù hợp" : ""}
              </p>
              <ActivityFeed variant="plain" activities={paged} maxItems={PAGE_SIZE} />
            </Card>

            {filtered.length > PAGE_SIZE && (
              <div className="flex justify-center pt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
