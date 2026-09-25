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
import { classService, studentService } from "../../services/api";
import { ClassInfo, Student } from "../../types";

export const ClassDetailPage: React.FC = () => {
  const { user } = useAuth();
  const { params, navigate, goBack } = useRouter();
  const classId = params.classId || "cls-7a";

  const [cls, setCls] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin lớp học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetail();
  }, [classId, user]);

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-16 w-full rounded-[14px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-[14px]" />
          <Skeleton className="h-32 rounded-[14px]" />
          <Skeleton className="h-32 rounded-[14px]" />
        </div>
        <Skeleton className="h-64 rounded-[14px]" />
      </div>
    );
  }

  if (error || !cls) {
    return (
      <div className="space-y-6 pb-12">
        <ErrorState
          title="Không thể truy cập lớp học"
          message={error || "Lớp học không tồn tại hoặc bạn không có quyền truy cập (§14)."}
          onRetry={fetchClassDetail}
          retryLabel="Thử lại"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={cls.name}
        description={`${cls.grade} · Niên khóa ${cls.academicYear} · ${cls.room || "Nhà Mục Vụ"}`}
        showBackButton
        onBack={goBack}
        badge={<Badge variant="primary">{cls.grade}</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<CalendarCheck className="w-4 h-4 text-[#168154]" />}
              onClick={() =>
                navigate(`/classes/${cls.id}/attendance?date=${new Date().toISOString().split("T")[0]}`)
              }
            >
              Điểm danh hôm nay
            </Button>
            <Button
              variant="primary"
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
              onClick={() => navigate(`/classes/${cls.id}/scores`)}
            >
              Bảng điểm lớp
            </Button>
          </div>
        }
      />

      {/* Class KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[16px] border border-[#E7E5E4] shadow-xs">
          <div className="text-[12px] font-bold text-[#78716C] uppercase">Sĩ số lớp</div>
          <div className="text-[28px] font-bold text-[#1C1917] font-serif mt-1">
            {students.length} <span className="text-[14px] font-normal text-[#78716C]">học sinh</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[16px] border border-[#E7E5E4] shadow-xs">
          <div className="text-[12px] font-bold text-[#78716C] uppercase">Giáo lý viên phụ trách</div>
          <div className="text-[15px] font-bold text-[#1C1917] mt-1 line-clamp-2">
            {cls.teachers?.join(", ") || "Chưa phân công"}
          </div>
        </div>
        <div className="bg-white p-5 rounded-[16px] border border-[#E7E5E4] shadow-xs">
          <div className="text-[12px] font-bold text-[#78716C] uppercase">Phòng học</div>
          <div className="text-[16px] font-bold text-[#1C1917] font-serif mt-1">
            {cls.room || "Phòng 102"}
          </div>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-[16px] border border-[#E7E5E4] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F5F5F4] flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1C1917] font-serif">
              Danh sách Học sinh ({students.length} em)
            </h3>
            <p className="text-[12px] text-[#78716C]">
              Bấm vào tên học sinh để xem chi tiết kết quả học tập & chuyên cần
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F5F5F4]">
          {students.map((st) => (
            <div
              key={st.id}
              onClick={() => navigate(`/students/${st.id}`)}
              className="p-4 hover:bg-[#FAFAF9] transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFF1F2] text-[#B4232C] font-bold text-[12px] flex items-center justify-center">
                  {st.orderNumber || st.code}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#1C1917]">
                    {st.christianName && (
                      <span className="text-[#B4232C] mr-1">{st.christianName}</span>
                    )}
                    {st.name}
                  </div>
                  <div className="text-[12px] text-[#78716C]">
                    Mã: {st.code} · PH: {st.parentName || "—"} ({st.parentPhone || "—"})
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                Xem hồ sơ →
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
