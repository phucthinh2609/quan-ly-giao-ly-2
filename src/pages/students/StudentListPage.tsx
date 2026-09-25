import React, { useState, useEffect } from "react";
import { ChevronRight, Users } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { FilterBar } from "../../components/ui/FilterBar";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Pagination } from "../../components/ui/Pagination";
import { TableShell, TABLE_CLASSES } from "../../components/dashboard";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { studentService, classService, StudentFilterParams } from "../../services/api";
import { Student, ClassInfo } from "../../types";

type StudentSort = NonNullable<StudentFilterParams["sort"]>;

const PAGE_SIZE = 12;
const ALL = "all";

const SORT_OPTIONS: { value: StudentSort; label: string }[] = [
  { value: "order_asc", label: "Theo số thứ tự" },
  { value: "name_asc", label: "Tên A → Z" },
  { value: "name_desc", label: "Tên Z → A" },
  { value: "code_asc", label: "Mã học sinh" },
];

const isStudentSort = (value: string | undefined): value is StudentSort =>
  SORT_OPTIONS.some((o) => o.value === value);

/** Bỏ các chú thích tham chiếu tài liệu (VD "(§14)") khỏi thông điệp lỗi hiển thị cho người dùng. */
const cleanMessage = (message: string) => message.replace(/\s*\([^)]*§[^)]*\)/g, "").trim();

const studentLabel = (st: Student) => (st.christianName ? `${st.christianName} ${st.name}` : st.name);

export const StudentListPage: React.FC = () => {
  const { user } = useAuth();
  const { navigate, query, setQueryParams } = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParam = query.search || "";
  const classParam = query.classId || "ALL";
  const sortParam: StudentSort = isStudentSort(query.sort) ? query.sort : "order_asc";
  const pageParam = Math.max(1, parseInt(query.page || "1", 10) || 1);

  const revealRef = useReveal<HTMLDivElement>({ deps: [loading] });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classRes, studentRes] = await Promise.all([
        classService.getClasses(user),
        studentService.getStudents(user, {
          search: searchParam,
          classId: classParam,
          sort: sortParam,
          page: pageParam,
          limit: PAGE_SIZE,
        }),
      ]);
      setClasses(classRes.data);
      setStudents(studentRes.data);
      setTotalCount(studentRes.total);
    } catch (err: unknown) {
      setError(cleanMessage(err instanceof Error && err.message ? err.message : "Không thể tải danh sách học sinh."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, searchParam, classParam, sortParam, pageParam]);

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val || undefined, page: 1 });
  };

  const handleClassChange = (val: string) => {
    setQueryParams({ classId: val === ALL || val === "ALL" ? undefined : val, page: 1 });
  };

  const handleSortChange = (val: string) => {
    setQueryParams({ sort: val === "order_asc" ? undefined : val, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setQueryParams({ page });
  };

  const hasFilters = Boolean(searchParam) || classParam !== "ALL";
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const openStudent = (st: Student) => navigate(`/students/${st.id}`);
  const handleRowKey = (event: React.KeyboardEvent, st: Student) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStudent(st);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Học sinh"
        description={
          user?.role === "GLV"
            ? "Thiếu nhi thuộc các lớp giáo lý bạn phụ trách"
            : user?.role === "PARENT"
            ? "Hồ sơ học tập của con em trong gia đình"
            : "Toàn bộ thiếu nhi trong Đoàn Kitô Vua"
        }
        badge={
          !loading && !error ? (
            <Badge variant="neutral">
              <span className="font-mono">{totalCount}</span>&nbsp;em
            </Badge>
          ) : undefined
        }
      />

      <FilterBar
        searchQuery={searchParam}
        searchPlaceholder="Tìm theo tên, Tên Thánh, mã HS, phụ huynh"
        onSearchChange={handleSearchChange}
        onSearchClear={() => handleSearchChange("")}
        filters={[
          {
            id: "class",
            label: "Lớp",
            value: classParam === "ALL" ? ALL : classParam,
            options: [{ value: ALL, label: "Tất cả lớp" }, ...classes.map((c) => ({ value: c.id, label: c.name }))],
            onChange: handleClassChange,
          },
          {
            id: "sort",
            label: "Sắp xếp",
            value: sortParam,
            options: SORT_OPTIONS,
            onChange: handleSortChange,
          },
        ]}
        activeFiltersCount={classParam !== "ALL" ? 1 : 0}
        onClearAll={() => setQueryParams({ classId: undefined, sort: undefined, page: 1 })}
        mobileFilterTitle="Lọc học sinh"
      />

      <div ref={revealRef}>
        {loading ? (
          <Card padding="md" className="space-y-4" role="status" aria-label="Đang tải danh sách học sinh">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton variant="circular" className="size-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2 rounded-full" />
                  <Skeleton className="h-3 w-1/3 rounded-full" />
                </div>
                <Skeleton className="hidden h-4 w-24 rounded-full sm:block" />
              </div>
            ))}
          </Card>
        ) : error ? (
          <ErrorState title="Không thể tải danh sách học sinh" message={error} onRetry={fetchData} />
        ) : students.length === 0 ? (
          <EmptyState
            icon={<Users />}
            title={hasFilters ? "Không tìm thấy học sinh" : "Chưa có học sinh"}
            description={
              hasFilters
                ? "Không có em nào phù hợp với bộ lọc hiện tại."
                : "Danh sách sẽ hiện khi Ban Giáo lý cập nhật hồ sơ học sinh."
            }
            action={
              hasFilters ? (
                <Button
                  variant="outline"
                  onClick={() => setQueryParams({ search: undefined, classId: undefined, page: 1 })}
                >
                  Xóa bộ lọc
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {/* Desktop / tablet: bảng có header dính */}
            <div data-reveal className="hidden md:block">
              <TableShell minWidthClassName="min-w-[48rem]" label="Danh sách học sinh">
                <thead>
                  <tr>
                    <th scope="col" className={cn(TABLE_CLASSES.th, "w-16")}>
                      STT
                    </th>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Học sinh
                    </th>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Mã HS
                    </th>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Lớp
                    </th>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Phụ huynh
                    </th>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Điện thoại
                    </th>
                    <th scope="col" className={cn(TABLE_CLASSES.th, "w-12")}>
                      <span className="sr-only">Mở hồ sơ</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => (
                    <tr
                      key={st.id}
                      tabIndex={0}
                      onClick={() => openStudent(st)}
                      onKeyDown={(e) => handleRowKey(e, st)}
                      aria-label={`Xem hồ sơ ${studentLabel(st)}`}
                      className={cn(TABLE_CLASSES.tr, TABLE_CLASSES.trClickable)}
                    >
                      <td className={cn(TABLE_CLASSES.td, "font-mono text-ink-2")}>{st.orderNumber || "—"}</td>
                      <td className={TABLE_CLASSES.td}>
                        <div className="flex items-center gap-3">
                          <Avatar name={st.name} src={st.avatarUrl || undefined} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink">{st.name}</p>
                            {st.christianName && (
                              <p className="truncate text-xs text-primary-ink">{st.christianName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={cn(TABLE_CLASSES.td, "font-mono text-ink-2")}>{st.code}</td>
                      <td className={TABLE_CLASSES.td}>
                        {st.className ? (
                          <Badge variant="neutral" size="sm">
                            {st.className}
                          </Badge>
                        ) : (
                          <span className="text-ink-3">—</span>
                        )}
                      </td>
                      <td className={cn(TABLE_CLASSES.td, "text-ink-2")}>{st.parentName || "—"}</td>
                      <td className={cn(TABLE_CLASSES.td, "font-mono text-ink-2")}>
                        {st.parentPhone ? (
                          <a
                            href={`tel:${st.parentPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="rounded-sm underline-offset-4 hover:text-primary-ink hover:underline"
                          >
                            {st.parentPhone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className={cn(TABLE_CLASSES.td, "text-right")}>
                        <ChevronRight
                          className="ml-auto size-4 text-ink-3 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            </div>

            {/* Mobile: danh sách thẻ */}
            <ul className="space-y-3 md:hidden">
              {students.map((st) => (
                <Card
                  key={st.id}
                  as="li"
                  data-reveal
                  interactive
                  padding="sm"
                  onClick={() => openStudent(st)}
                  aria-label={`Xem hồ sơ ${studentLabel(st)}`}
                  className="flex items-center gap-3"
                >
                  <Avatar name={st.name} src={st.avatarUrl || undefined} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">
                      {st.christianName && <span className="text-primary-ink">{st.christianName} </span>}
                      {st.name}
                    </p>
                    <p className="truncate text-sm text-ink-3">
                      <span className="font-mono">{st.code}</span>
                      {st.className && <> · {st.className}</>}
                    </p>
                    {st.parentName && <p className="truncate text-sm text-ink-3">Phụ huynh: {st.parentName}</p>}
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
                </Card>
              ))}
            </ul>

            {totalCount > PAGE_SIZE && (
              <div className="flex justify-center pt-2">
                <Pagination
                  currentPage={Math.min(pageParam, totalPages)}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
