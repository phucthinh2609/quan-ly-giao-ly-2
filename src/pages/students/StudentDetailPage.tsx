import React, { useState, useEffect } from "react";
import { BookOpen, CalendarCheck, FileSpreadsheet, PenLine, Phone } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Avatar } from "../../components/ui/Avatar";
import { Badge, BadgeVariant } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CountUp } from "../../components/ui/CountUp";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { IconTile } from "../../components/ui/IconTile";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { SegmentedControl, SegmentedOption } from "../../components/ui/SegmentedControl";
import { Skeleton } from "../../components/ui/Skeleton";
import { Tone, toneFromString } from "../../components/ui/tone";
import { SectionHeader } from "../../components/dashboard";
import { attendanceTone } from "../../components/class/ClassCard";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { scoreGrade } from "../../lib/format";
import { useReveal } from "../../lib/motion";
import { studentService, scoreService } from "../../services/api";
import { Student, StudentAcademicReport, AcademicPeriod } from "../../types";

const PERIOD_OPTIONS: SegmentedOption<AcademicPeriod>[] = [
  { value: "HK1", label: "Học kỳ I" },
  { value: "HK2", label: "Học kỳ II" },
  { value: "FULL_YEAR", label: "Cả năm" },
];

/** Màu biểu đồ cho môn học (01 §15) */
const SUBJECT_TONES: Tone[] = ["primary", "info", "success", "warning", "grape"];

const GRADE_BADGE: Record<ReturnType<typeof scoreGrade>["tone"], BadgeVariant> = {
  success: "success",
  info: "info",
  warning: "warning",
  danger: "error",
};

const formatScore = (value: number | null | undefined) =>
  value === null || value === undefined || Number.isNaN(value)
    ? "—"
    : value.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Bỏ các chú thích tham chiếu tài liệu (VD "(§14)") khỏi thông điệp lỗi hiển thị cho người dùng. */
const cleanMessage = (message: string) => message.replace(/\s*\([^)]*§[^)]*\)/g, "").trim();

export const StudentDetailPage: React.FC = () => {
  const { user } = useAuth();
  const { params, navigate, goBack } = useRouter();
  const studentId = params.studentId || "stu-001";

  const [student, setStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<StudentAcademicReport | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<AcademicPeriod>("HK1");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const revealRef = useReveal<HTMLDivElement>({ deps: [student?.id] });

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentData = await studentService.getStudentById(studentId, user);
      setStudent(studentData);

      try {
        const reportData = await scoreService.getStudentReport(studentData.id, selectedPeriod, user);
        setReport(reportData);
      } catch {
        // Không có bảng điểm cho kỳ này — giữ trạng thái hiện tại
      }
    } catch (err: unknown) {
      setError(cleanMessage(err instanceof Error && err.message ? err.message : "Không thể tải hồ sơ học sinh."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, selectedPeriod, user]);

  // Skeleton toàn trang chỉ khi chưa có hồ sơ (đổi kỳ học chỉ tải lại khối kết quả)
  const showPageSkeleton = loading && (!student || student.id !== studentId);

  if (showPageSkeleton) {
    return (
      <div className="space-y-6" role="status" aria-label="Đang tải hồ sơ học sinh">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 max-w-full rounded-full" />
          <Skeleton className="h-4 w-48 rounded-full" />
        </div>
        <Card padding="lg" className="flex items-center gap-5">
          <Skeleton variant="circular" className="size-16" />
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="md" className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <PageHeader title="Hồ sơ học sinh" showBackButton onBack={goBack} />
        <ErrorState
          title="Không thể xem hồ sơ học sinh"
          message={error || "Học sinh không tồn tại hoặc bạn không có quyền xem thông tin."}
          onRetry={fetchStudentData}
          retryLabel="Thử lại"
        />
      </div>
    );
  }

  const fullName = `${student.christianName ? `${student.christianName} ` : ""}${student.name}`;
  const canTeach = user?.role === "ADMIN" || user?.role === "GLV";
  const grade = report ? scoreGrade(report.gpa) : null;
  const attendance = report?.attendance;
  const attendanceRate = attendance ? Math.round(attendance.attendanceRate) : null;

  const profileFields: { label: string; value: React.ReactNode }[] = [
    { label: "Lớp", value: student.className || "Chưa xếp lớp" },
    { label: "Giới tính", value: student.gender === "MALE" ? "Nam" : student.gender === "FEMALE" ? "Nữ" : "—" },
    { label: "Phụ huynh", value: student.parentName || "—" },
    {
      label: "Điện thoại",
      value: student.parentPhone ? (
        <a
          href={`tel:${student.parentPhone}`}
          className="inline-flex min-h-11 items-center gap-1.5 font-mono text-primary-ink underline-offset-4 hover:underline"
        >
          <Phone className="size-4" aria-hidden="true" />
          {student.parentPhone}
        </a>
      ) : (
        "—"
      ),
    },
  ];

  return (
    <div ref={revealRef} className="space-y-6">
      <PageHeader
        title={fullName}
        description={`Mã học sinh ${student.code} · ${student.className || "Chưa xếp lớp"}`}
        showBackButton
        onBack={goBack}
        backAriaLabel="Quay lại danh sách học sinh"
        badge={
          <Badge variant="neutral">
            STT <span className="font-mono">{student.orderNumber || 1}</span>
          </Badge>
        }
        actions={
          canTeach ? (
            <>
              <Button variant="outline" leftIcon={<CalendarCheck />} onClick={() => navigate(`/teacher/attendance`)}>
                Điểm danh
              </Button>
              <Button leftIcon={<PenLine />} onClick={() => navigate(`/teacher/scores`)}>
                Nhập điểm
              </Button>
            </>
          ) : undefined
        }
      />

      {/* Hồ sơ */}
      <Card data-reveal padding="lg" className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar name={student.name} src={student.avatarUrl || undefined} size="xl" className="shrink-0" />
        <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          {profileFields.map((field) => (
            <div key={field.label} className="min-w-0">
              <dt className="text-sm text-ink-3">{field.label}</dt>
              <dd className="truncate text-base font-medium text-ink">{field.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* Kết quả học tập */}
      <section data-reveal aria-labelledby="report-heading" className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            id="report-heading"
            title="Kết quả học tập"
            description={report ? `${report.periodLabel} · Năm học ${report.academicYear}` : "Theo kỳ học"}
          />
          <SegmentedControl
            ariaLabel="Chọn kỳ học"
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            options={PERIOD_OPTIONS}
            disabled={loading}
          />
        </div>

        {loading ? (
          <div className="grid gap-3 md:grid-cols-3" role="status" aria-label="Đang tải kết quả học tập">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} padding="md" className="space-y-3">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-full" />
              </Card>
            ))}
          </div>
        ) : !report ? (
          <EmptyState
            icon={<FileSpreadsheet />}
            title="Chưa có bảng điểm"
            description="Điểm sẽ hiện khi GLV cập nhật."
          />
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <Card padding="md" className="flex flex-col gap-2">
                <p className="text-sm font-medium text-ink-2">Điểm trung bình</p>
                <p className="text-4xl font-bold tracking-tight text-ink">
                  <CountUp value={report.gpa} decimals={1} />
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {grade && (
                    <Badge variant={GRADE_BADGE[grade.tone]} dot>
                      {report.rankLabel || grade.label}
                    </Badge>
                  )}
                </div>
              </Card>

              <Card padding="md" className="flex items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-ink-2">Chuyên cần</p>
                  {attendance ? (
                    <>
                      <p className="text-sm text-ink-3">
                        Đi học{" "}
                        <span className="font-mono font-semibold text-ink">
                          {attendance.attendedSessions}/{attendance.totalSessions}
                        </span>{" "}
                        buổi
                      </p>
                      <p className="text-sm text-ink-3">
                        Vắng <span className="font-mono text-ink-2">{attendance.absentSessions}</span> · Có phép{" "}
                        <span className="font-mono text-ink-2">{attendance.excusedSessions}</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-ink-3">Chưa có dữ liệu</p>
                  )}
                </div>
                {attendanceRate !== null && (
                  <ProgressRing value={attendanceRate} size="md" tone={attendanceTone(attendanceRate)} label={`Chuyên cần ${attendanceRate}%`}>
                    <span className="text-sm font-bold tabular-nums text-ink">{attendanceRate}%</span>
                  </ProgressRing>
                )}
              </Card>

              <Card padding="md" as="article" className="flex flex-col gap-2">
                <p className="text-sm font-medium text-ink-2">Nhận xét của GLV</p>
                {report.teacherComment ? (
                  <figure className="space-y-2">
                    <blockquote className="font-accent text-lg leading-snug text-ink italic">
                      “{report.teacherComment}”
                    </blockquote>
                    {report.teacherName && <figcaption className="text-sm text-ink-3">{report.teacherName}</figcaption>}
                  </figure>
                ) : (
                  <p className="text-sm text-ink-3">Chưa có nhận xét.</p>
                )}
              </Card>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Điểm theo môn">
              {report.subjects.map((sub) => {
                const subGrade = scoreGrade(sub.averageScore);
                return (
                  <Card key={sub.subjectId} as="li" padding="md" className="flex items-center gap-3">
                    <IconTile icon={<BookOpen />} tone={toneFromString(sub.subjectId, SUBJECT_TONES)} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{sub.subjectName}</p>
                      <p className="text-xs text-ink-3">
                        {sub.oralScore !== undefined && (
                          <>
                            Miệng <span className="font-mono text-ink-2">{formatScore(sub.oralScore)}</span> ·{" "}
                          </>
                        )}
                        GK <span className="font-mono text-ink-2">{formatScore(sub.midtermScore)}</span> · CK{" "}
                        <span className="font-mono text-ink-2">{formatScore(sub.finalScore)}</span>
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-2xl font-semibold text-ink">{formatScore(sub.averageScore)}</p>
                      <Badge variant={GRADE_BADGE[subGrade.tone]} size="sm">
                        {subGrade.label}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};
