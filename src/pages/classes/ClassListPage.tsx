import React, { useState, useEffect } from "react";
import {
  School,
  Plus,
  CalendarCheck,
  FileSpreadsheet,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";
import { Select } from "../../components/ui/Select";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { classService } from "../../services/api";
import { ClassInfo } from "../../types";

export const ClassListPage: React.FC = () => {
  const { user } = useAuth();
  const { navigate, query, setQueryParams } = useRouter();
  const toast = useToast();

  const [classes, setClasses] = useState<(ClassInfo & { presentCount: number; attendanceRate: number; lastUpdated: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParam = query.search || "";
  const gradeParam = query.grade || "ALL";
  const sortParam = (query.sort as any) || "name_asc";

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await classService.getClasses(user, {
        search: searchParam,
        grade: gradeParam,
        sort: sortParam,
      });
      setClasses(res.data);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách lớp học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user, searchParam, gradeParam, sortParam]);

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val || undefined, page: 1 });
  };

  const handleGradeChange = (val: string) => {
    setQueryParams({ grade: val === "ALL" ? undefined : val, page: 1 });
  };

  const handleSortChange = (val: string) => {
    setQueryParams({ sort: val });
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Danh sách Lớp học"
        description={
          user?.role === "GLV"
            ? "Các lớp Giáo lý được phân công phụ trách trong niên khóa 2026 - 2027"
            : "Toàn bộ các lớp thuộc các khối Khai Tâm, Rước Lễ, Thêm Sức, Bao Đồng"
        }
        badge={
          <Badge variant="primary" dot>
            {user?.role === "GLV" ? "Lớp của tôi" : "Toàn đoàn"}
          </Badge>
        }
        actions={
          user?.role === "ADMIN" ? (
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => toast.info("Tính năng tạo lớp mới dành cho Quản trị viên")}
            >
              Tạo lớp mới
            </Button>
          ) : undefined
        }
      />

      {/* Filter & Search Bar (§15) */}
      <div className="bg-white p-4 rounded-[14px] border border-[#E7E5E4] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <SearchBar
            value={searchParam}
            onChange={handleSearchChange}
            placeholder="Tìm theo tên lớp, phòng, GLV..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="w-44">
            <Select
              value={gradeParam}
              onChange={handleGradeChange}
              options={[
                { value: "ALL", label: "Tất cả các Khối" },
                { value: "Khai Tâm", label: "Khối Khai Tâm" },
                { value: "Rước Lễ", label: "Khối Rước Lễ" },
                { value: "Thêm Sức", label: "Khối Thêm Sức" },
                { value: "Bao Đồng", label: "Khối Bao Đồng" },
              ]}
            />
          </div>

          <div className="w-40">
            <Select
              value={sortParam}
              onChange={handleSortChange}
              options={[
                { value: "name_asc", label: "Tên lớp A → Z" },
                { value: "name_desc", label: "Tên lớp Z → A" },
                { value: "students_desc", label: "Sĩ số nhiều nhất" },
                { value: "rate_asc", label: "Cần chú ý vắng" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-5 rounded-[16px] border border-[#E7E5E4] space-y-3">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="pt-4 flex justify-between">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Không thể tải danh sách lớp"
          message={error}
          onRetry={fetchClasses}
        />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={<School className="w-12 h-12 text-[#A8A29E]" />}
          title="Không tìm thấy lớp học nào"
          description={
            searchParam || gradeParam !== "ALL"
              ? "Không có lớp nào phù hợp với bộ lọc hiện tại. Vui lòng thử từ khóa khác."
              : "Hiện chưa có lớp học nào được phân công."
          }
          action={
            searchParam || gradeParam !== "ALL" ? (
              <Button
                variant="outline"
                onClick={() => setQueryParams({ search: undefined, grade: undefined })}
              >
                Xóa bộ lọc
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const isWarning = cls.attendanceRate < 90;
            return (
              <div
                key={cls.id}
                className="bg-white rounded-[16px] border border-[#E7E5E4] p-5 shadow-xs hover:border-[#B4232C]/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F5F5F4] text-[#57534E]">
                      {cls.grade}
                    </span>
                    <Badge
                      variant={isWarning ? "warning" : "success"}
                      size="sm"
                      dot
                    >
                      {cls.attendanceRate}% chuyên cần
                    </Badge>
                  </div>

                  <h3
                    onClick={() => navigate(`/classes/${cls.id}`)}
                    className="text-[18px] font-bold text-[#1C1917] font-serif group-hover:text-[#B4232C] cursor-pointer transition-colors"
                  >
                    {cls.name}
                  </h3>

                  <p className="text-[12px] text-[#78716C] mt-1">
                    {cls.room || "Phòng học Nhà Mục Vụ"} · {cls.academicYear}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#F5F5F4] text-[13px] text-[#57534E] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#78716C]">Sĩ số học sinh:</span>
                      <span className="font-bold text-[#1C1917]">{cls.studentCount} em</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#78716C]">Giáo lý viên:</span>
                      <span className="font-medium text-[#1C1917] truncate max-w-[170px] text-right">
                        {cls.teachers?.join(", ") || "Chưa phân công"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons (§16 URL convention) */}
                <div className="mt-4 pt-3 border-t border-[#F5F5F4] grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<CalendarCheck className="w-3.5 h-3.5 text-[#168154]" />}
                    onClick={() => navigate(`/classes/${cls.id}/attendance?date=${new Date().toISOString().split("T")[0]}`)}
                    className="justify-center text-[12px]"
                  >
                    Điểm danh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#B4232C]" />}
                    onClick={() => navigate(`/classes/${cls.id}/scores`)}
                    className="justify-center text-[12px]"
                  >
                    Nhập điểm
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
