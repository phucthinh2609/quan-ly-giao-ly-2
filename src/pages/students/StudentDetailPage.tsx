import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  FileSpreadsheet,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { studentService, scoreService } from "../../services/api";
import { Student, StudentAcademicReport, AcademicPeriod } from "../../types";

export const StudentDetailPage: React.FC = () => {
  const { user } = useAuth();
  const { params, navigate, goBack } = useRouter();
  const studentId = params.studentId || "stu-001";

  const [student, setStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<StudentAcademicReport | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<AcademicPeriod>("HK1");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        // Fallback report
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải hồ sơ học sinh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId, selectedPeriod, user]);

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-20 w-full rounded-[14px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-44 rounded-[14px]" />
          <Skeleton className="h-44 rounded-[14px]" />
          <Skeleton className="h-44 rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-6 pb-12">
        <ErrorState
          title="Không thể xem hồ sơ học sinh"
          message={error || "Học sinh không tồn tại hoặc bạn không có quyền xem thông tin (§14 Data Ownership)."}
          onRetry={fetchStudentData}
          retryLabel="Thử lại"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={`${student.christianName ? `${student.christianName} ` : ""}${student.name}`}
        description={`Mã học sinh: ${student.code} · ${student.className || "Lớp 7A"}`}
        showBackButton
        onBack={goBack}
        badge={
          <Badge variant="primary" dot>
            STT {student.orderNumber || 1}
          </Badge>
        }
      />

      {/* Student Profile Card */}
      <div className="bg-white rounded-[16px] border border-[#E7E5E4] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF1F2] text-[#B4232C] font-bold text-[22px] flex items-center justify-center border-2 border-[#FECDD3]">
            {student.christianName ? student.christianName.slice(0, 2).toUpperCase() : student.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#1C1917] font-serif">
              {student.christianName && (
                <span className="text-[#B4232C] mr-1.5">{student.christianName}</span>
              )}
              {student.name}
            </h2>
            <div className="text-[13px] text-[#78716C] mt-1 flex flex-wrap gap-3">
              <span>Lớp: <strong>{student.className || "Lớp 7A"}</strong></span>
              <span>Giới tính: <strong>{student.gender === "MALE" ? "Nam" : "Nữ"}</strong></span>
              <span>Phụ huynh: <strong>{student.parentName || "—"}</strong></span>
              <span>SĐT: <strong className="font-mono">{student.parentPhone || "—"}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CalendarCheck className="w-4 h-4 text-[#168154]" />}
            onClick={() => navigate(`/teacher/attendance`)}
          >
            Điểm danh
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={() => navigate(`/teacher/scores`)}
          >
            Nhập điểm
          </Button>
        </div>
      </div>

      {/* Academic Scores Section */}
      {report && (
        <div className="bg-white rounded-[16px] border border-[#E7E5E4] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F5F4]">
            <div>
              <h3 className="text-[17px] font-bold text-[#1C1917] font-serif">
                Bảng Điểm & Kết Quả Học Tập ({report.periodLabel})
              </h3>
              <p className="text-[12px] text-[#78716C]">
                Điểm TB: <strong className="text-[#B4232C] text-[15px]">{report.gpa}</strong> · Xếp loại: <strong>{report.rankLabel}</strong>
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAFAF9] p-1 rounded-lg border border-[#E7E5E4]">
              {(["HK1", "HK2", "FULL_YEAR"] as AcademicPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1 text-[12px] font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedPeriod === p
                      ? "bg-[#B4232C] text-white shadow-xs"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  {p === "HK1" ? "Học kỳ I" : p === "HK2" ? "Học kỳ II" : "Cả năm"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.subjects.map((sub) => (
              <div
                key={sub.subjectId}
                className="p-4 rounded-[12px] bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[22px]">{sub.icon}</span>
                  <div>
                    <div className="font-bold text-[14px] text-[#1C1917]">{sub.subjectName}</div>
                    <div className="text-[12px] text-[#78716C]">
                      Miệng: {sub.oralScore ?? "—"} · GK: {sub.midtermScore ?? "—"} · CK: {sub.finalScore ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[18px] font-bold text-[#B4232C] font-serif">
                    {sub.averageScore.toFixed(1)}
                  </div>
                  <div className="text-[11px] text-[#78716C]">Điểm TB</div>
                </div>
              </div>
            ))}
          </div>

          {report.teacherComment && (
            <div className="p-3.5 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] text-[13px] text-[#8B6419]">
              <strong>Nhận xét của GLV:</strong> "{report.teacherComment}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
