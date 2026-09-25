import React, { useState, useEffect } from "react";
import { Plus, School } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { FilterBar } from "../../components/ui/FilterBar";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../components/ui/Toast";
import { ClassCard } from "../../components/class/ClassCard";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { useReveal } from "../../lib/motion";
import { classService, ClassFilterParams } from "../../services/api";
import { ClassInfo } from "../../types";

type ClassWithStats = ClassInfo & { presentCount: number; attendanceRate: number; lastUpdated: string };
type ClassSort = NonNullable<ClassFilterParams["sort"]>;

const PAGE_SIZE = 9;
const ALL = "all";

const GRADE_OPTIONS = [
  { value: ALL, label: "Tất cả khối" },
  { value: "Khai Tâm", label: "Khối Khai Tâm" },
  { value: "Rước Lễ", label: "Khối Rước Lễ" },
  { value: "Thêm Sức", label: "Khối Thêm Sức" },
  { value: "Bao Đồng", label: "Khối Bao Đồng" },
];

const SORT_OPTIONS: { value: ClassSort; label: string }[] = [
  { value: "name_asc", label: "Tên lớp A → Z" },
  { value: "name_desc", label: "Tên lớp Z → A" },
  { value: "students_desc", label: "Sĩ số nhiều nhất" },
  { value: "rate_asc", label: "Chuyên cần thấp trước" },
];

const isClassSort = (value: string | undefined): value is ClassSort =>
  SORT_OPTIONS.some((o) => o.value === value);

/** Bỏ các chú thích tham chiếu tài liệu (VD "(§14)") khỏi thông điệp lỗi hiển thị cho người dùng. */
const cleanMessage = (message: string) => message.replace(/\s*\([^)]*§[^)]*\)/g, "").trim();

const todayIso = () => new Date().toISOString().split("T")[0];

export const ClassListPage: React.FC = () => {
  const { user } = useAuth();
  const { navigate, query, setQueryParams } = useRouter();
  const toast = useToast();

  const [classes, setClasses] = useState<ClassWithStats[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParam = query.search || "";
  const gradeParam = query.grade || "ALL";
  const sortParam: ClassSort = isClassSort(query.sort) ? query.sort : "name_asc";
  const pageParam = Math.max(1, parseInt(query.page || "1", 10) || 1);

  const revealRef = useReveal<HTMLDivElement>({ deps: [loading] });

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await classService.getClasses(user, {
        search: searchParam,
        grade: gradeParam,
        sort: sortParam,
        page: pageParam,
        limit: PAGE_SIZE,
      });
      setClasses(res.data);
      setTotal(res.total);
    } catch (err: unknown) {
      setError(cleanMessage(err instanceof Error && err.message ? err.message : "Không thể tải danh sách lớp học."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, searchParam, gradeParam, sortParam, pageParam]);

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val || undefined, page: 1 });
  };

  const handleGradeChange = (val: string) => {
    setQueryParams({ grade: val === ALL || val === "ALL" ? undefined : val, page: 1 });
  };

  const handleSortChange = (val: string) => {
    setQueryParams({ sort: val === "name_asc" ? undefined : val, page: 1 });
  };

  const hasFilters = Boolean(searchParam) || gradeParam !== "ALL";
  const isAdmin = user?.role === "ADMIN";
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lớp học"
        description={
          user?.role === "GLV"
            ? "Các lớp giáo lý bạn được phân công trong năm học 2026–2027"
            : "Toàn bộ các lớp thuộc các khối Khai Tâm, Rước Lễ, Thêm Sức, Bao Đồng"
        }
        badge={
          <Badge variant={user?.role === "GLV" ? "primary" : "neutral"}>
            {user?.role === "GLV" ? "Lớp của tôi" : "Toàn đoàn"}
          </Badge>
        }
        actions={
          isAdmin ? (
            <Button leftIcon={<Plus />} onClick={() => toast.info("Tính năng tạo lớp mới đang được chuẩn bị.")}>
              Tạo lớp mới
            </Button>
          ) : undefined
        }
      />

      <FilterBar
        searchQuery={searchParam}
        searchPlaceholder="Tìm theo tên lớp, phòng, GLV"
        onSearchChange={handleSearchChange}
        onSearchClear={() => handleSearchChange("")}
        filters={[
          {
            id: "grade",
            label: "Khối",
            value: gradeParam === "ALL" ? ALL : gradeParam,
            options: GRADE_OPTIONS,
            onChange: handleGradeChange,
          },
          {
            id: "sort",
            label: "Sắp xếp",
            value: sortParam,
            options: SORT_OPTIONS,
            onChange: handleSortChange,
          },
        ]}
        activeFiltersCount={gradeParam !== "ALL" ? 1 : 0}
        onClearAll={() => setQueryParams({ grade: undefined, sort: undefined, page: 1 })}
        mobileFilterTitle="Lọc lớp học"
      />

      <div ref={revealRef}>
        {loading ? (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Đang tải danh sách lớp">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} padding="md" className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2.5">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-6 w-3/4 rounded-full" />
                    <Skeleton className="h-4 w-1/2 rounded-full" />
                  </div>
                  <Skeleton variant="circular" className="size-12" />
                </div>
                <div className="flex items-center justify-between border-t border-line pt-3">
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Không thể tải danh sách lớp" message={error} onRetry={fetchClasses} />
        ) : classes.length === 0 ? (
          <EmptyState
            icon={<School />}
            title={hasFilters ? "Không tìm thấy lớp phù hợp" : "Chưa có lớp học"}
            description={
              hasFilters
                ? "Thử từ khóa khác hoặc bỏ bớt bộ lọc."
                : isAdmin
                ? "Tạo lớp đầu tiên để bắt đầu."
                : "Bạn chưa được phân công lớp nào. Liên hệ Ban Giáo lý để được hỗ trợ."
            }
            action={
              hasFilters ? (
                <Button variant="outline" onClick={() => setQueryParams({ search: undefined, grade: undefined, page: 1 })}>
                  Xóa bộ lọc
                </Button>
              ) : isAdmin ? (
                <Button leftIcon={<Plus />} onClick={() => toast.info("Tính năng tạo lớp mới đang được chuẩn bị.")}>
                  Tạo lớp
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-ink-3" aria-live="polite">
              <span className="font-mono font-semibold text-ink">{total}</span> lớp
              {hasFilters ? " phù hợp" : ""}
            </p>
            <ul className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
              {classes.map((cls) => (
                <li key={cls.id} data-reveal className="min-w-0">
                  <ClassCard
                    classInfo={cls}
                    onClick={(id) => navigate(`/classes/${id}`)}
                    onAttendanceClick={(id) => navigate(`/classes/${id}/attendance?date=${todayIso()}`)}
                    onScoreClick={(id) => navigate(`/classes/${id}/scores`)}
                  />
                </li>
              ))}
            </ul>

            {total > PAGE_SIZE && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={Math.min(pageParam, totalPages)}
                  totalPages={totalPages}
                  totalItems={total}
                  pageSize={PAGE_SIZE}
                  onPageChange={(page) => setQueryParams({ page })}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
