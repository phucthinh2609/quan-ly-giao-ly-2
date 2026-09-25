import React, { useState, useEffect, useMemo } from "react";
import { CalendarCheck, ChevronRight, FileSpreadsheet, MapPin, Phone, Users, UserX } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CountUp } from "../../components/ui/CountUp";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { IconTile } from "../../components/ui/IconTile";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { SearchBar } from "../../components/ui/SearchBar";
import { Skeleton } from "../../components/ui/Skeleton";
import { SectionHeader, TableShell, TABLE_CLASSES } from "../../components/dashboard";
import { attendanceTone } from "../../components/class/ClassCard";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { cn } from "../../lib/cn";
import { useReveal } from "../../lib/motion";
import { classService, studentService } from "../../services/api";
import { ClassInfo, Student } from "../../types";

type ClassWithStats = ClassInfo & { presentCount?: number; attendanceRate?: number; lastUpdated?: string };

/** Bỏ các chú thích tham chiếu tài liệu (VD "(§14)") khỏi thông điệp lỗi hiển thị cho người dùng. */
const cleanMessage = (message: string) => message.replace(/\s*\([^)]*§[^)]*\)/g, "").trim();

const cleanTeacherName = (name: string) => name.replace(/^GLV\.?\s*/i, "").trim();

const todayIso = () => new Date().toISOString().split("T")[0];

const studentLabel = (st: Student) => (st.christianName ? `${st.christianName} ${st.name}` : st.name);

export const ClassDetailPage: React.FC = () => {
  const { user } = useAuth();
  const { params, navigate, goBack } = useRouter();
  const classId = params.classId || "cls-7a";

  const [cls, setCls] = useState<ClassWithStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const revealRef = useReveal<HTMLDivElement>({ deps: [loading] });

  const fetchClassDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classRes, studentsRes] = await Promise.all([
        classService.getClassById(classId, user),
        studentService.getStudents(user, { classId }),
      ]);
      setCls(classRes);
      setStudents(studentsRes.data);
    } catch (err: unknown) {
      setError(cleanMessage(err instanceof Error && err.message ? err.message : "Không thể tải thông tin lớp học."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, user]);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (st) =>
        st.name.toLowerCase().includes(q) ||
        st.christianName?.toLowerCase().includes(q) ||
        st.code.toLowerCase().includes(q) ||
        st.parentName?.toLowerCase().includes(q)
    );
  }, [students, search]);

  if (loading) {
    return (
      <div className="space-y-6" role="status" aria-label="Đang tải thông tin lớp">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-4 w-72 max-w-full rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="md" className={cn("space-y-3", i >= 2 && "col-span-2 lg:col-span-1")}>
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </Card>
          ))}
        </div>
        <Card padding="md" className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="circular" className="size-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2 rounded-full" />
                <Skeleton className="h-3 w-1/3 rounded-full" />
              </div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (error || !cls) {
    return (
      <div className="space-y-6">
        <PageHeader title="Lớp học" showBackButton onBack={goBack} />
        <ErrorState
          title="Không thể mở lớp học"
          message={error || "Lớp học không tồn tại hoặc bạn không có quyền truy cập."}
          onRetry={fetchClassDetail}
          retryLabel="Thử lại"
        />
      </div>
    );
  }

  const rate = cls.attendanceRate !== undefined ? Math.round(cls.attendanceRate) : null;
  const teacherNames = (cls.teachers || []).map(cleanTeacherName).filter(Boolean);

  const openStudent = (st: Student) => navigate(`/students/${st.id}`);
  const handleRowKey = (event: React.KeyboardEvent, st: Student) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStudent(st);
    }
  };

  return (
    <div ref={revealRef} className="space-y-6">
      <PageHeader
        title={cls.name}
        description={`${cls.grade} · Năm học ${cls.academicYear}`}
        showBackButton
        onBack={goBack}
        backAriaLabel="Quay lại danh sách lớp"
        badge={<Badge variant="neutral">{cls.grade}</Badge>}
        actions={
          <>
            <Button
              variant="outline"
              leftIcon={<CalendarCheck />}
              onClick={() => navigate(`/classes/${cls.id}/attendance?date=${todayIso()}`)}
            >
              Điểm danh hôm nay
            </Button>
            <Button leftIcon={<FileSpreadsheet />} onClick={() => navigate(`/classes/${cls.id}/scores`)}>
              Bảng điểm lớp
            </Button>
          </>
        }
      />

      {/*
        Tổng quan lớp — mobile 2 cột: [Sĩ số][Chuyên cần] / [GLV (2)] / [Phòng (2)] = 2 + 2 + 2 ô;
        desktop 4 cột: 4 ô trên 1 hàng.
      */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card data-reveal padding="md" className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm font-medium text-ink-2">
            <Users className="size-4 text-ink-3" aria-hidden="true" />
            Sĩ số
          </p>
          <p className="text-3xl font-bold tracking-tight text-ink">
            <CountUp value={students.length} />
          </p>
          <p className="text-sm text-ink-3">học sinh trong danh sách</p>
        </Card>

        <Card data-reveal padding="md" className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-2">Chuyên cần</p>
            <p className="mt-1 text-sm text-ink-3">
              {cls.presentCount !== undefined ? (
                <>
                  Có mặt{" "}
                  <span className="font-mono font-semibold text-ink">
                    {cls.presentCount}/{cls.studentCount}
                  </span>
                </>
              ) : (
                "Buổi gần nhất"
              )}
            </p>
            {cls.lastUpdated && <p className="text-xs text-ink-3">{cls.lastUpdated}</p>}
          </div>
          {rate !== null ? (
            <ProgressRing value={rate} size="md" tone={attendanceTone(rate)} label={`Chuyên cần ${rate}%`}>
              <span className="text-sm font-bold tabular-nums text-ink">{rate}%</span>
            </ProgressRing>
          ) : (
            <span className="text-sm text-ink-3">Chưa có</span>
          )}
        </Card>

        <Card data-reveal padding="md" className="col-span-2 flex flex-col gap-3 lg:col-span-1">
          <p className="text-sm font-medium text-ink-2">Giáo lý viên phụ trách</p>
          {teacherNames.length > 0 ? (
            <ul className="space-y-2">
              {teacherNames.map((name) => (
                <li key={name} className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={name} size="sm" />
                  <span className="truncate text-sm font-medium text-ink">{name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">Chưa phân công</p>
          )}
        </Card>

        <Card data-reveal padding="md" className="col-span-2 flex items-center gap-3 lg:col-span-1">
          <IconTile icon={<MapPin />} tone="info" size="md" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-2">Phòng học</p>
            <p className="text-base font-semibold text-ink">{cls.room || "Chưa xếp phòng"}</p>
          </div>
        </Card>
      </div>

      {/* Danh sách học sinh */}
      <section data-reveal aria-labelledby="roster-heading" className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            id="roster-heading"
            title="Danh sách học sinh"
            description={`${students.length} em · chọn một em để xem hồ sơ`}
          />
          {students.length > 0 && (
            <div className="w-full sm:w-72">
              <SearchBar
                value={search}
                onChange={setSearch}
                onClear={() => setSearch("")}
                placeholder="Tìm theo tên, mã, phụ huynh"
                ariaLabel="Tìm học sinh trong lớp"
              />
            </div>
          )}
        </div>

        {students.length === 0 ? (
          <EmptyState
            icon={<UserX />}
            title="Lớp chưa có học sinh"
            description="Liên hệ Ban Giáo lý để cập nhật danh sách."
          />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            icon={<Users />}
            title="Không tìm thấy học sinh"
            description="Không có em nào khớp với từ khóa tìm kiếm."
            action={
              <Button variant="outline" onClick={() => setSearch("")}>
                Xóa tìm kiếm
              </Button>
            }
          />
        ) : (
          <>
            {/* Desktop / tablet: bảng có header dính */}
            <TableShell className="hidden md:block" minWidthClassName="min-w-[44rem]" label={`Danh sách học sinh ${cls.name}`}>
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
                {filteredStudents.map((st) => (
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
                          {st.christianName && <p className="truncate text-xs text-primary-ink">{st.christianName}</p>}
                        </div>
                      </div>
                    </td>
                    <td className={cn(TABLE_CLASSES.td, "font-mono text-ink-2")}>{st.code}</td>
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

            {/* Mobile: danh sách thẻ */}
            <ul className="space-y-3 md:hidden">
              {filteredStudents.map((st) => (
                <Card
                  key={st.id}
                  as="li"
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
                      {st.parentName && <> · PH {st.parentName}</>}
                    </p>
                  </div>
                  {st.parentPhone && (
                    <a
                      href={`tel:${st.parentPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      aria-label={`Gọi phụ huynh của ${st.name}`}
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <Phone className="size-5" aria-hidden="true" />
                    </a>
                  )}
                  <ChevronRight className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
                </Card>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
};
