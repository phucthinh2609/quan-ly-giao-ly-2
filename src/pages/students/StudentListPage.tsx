import React, { useState, useEffect } from "react";
import {
  Users,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";
import { Select } from "../../components/ui/Select";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Pagination } from "../../components/ui/Pagination";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "../../context/RouterContext";
import { studentService, classService } from "../../services/api";
import { Student, ClassInfo } from "../../types";

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
  const sortParam = (query.sort as any) || "order_asc";
  const pageParam = parseInt(query.page || "1", 10);
  const pageSize = 12;

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
          limit: pageSize,
        }),
      ]);
      setClasses(classRes.data);
      setStudents(studentRes.data);
      setTotalCount(studentRes.total);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách học sinh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, searchParam, classParam, sortParam, pageParam]);

  const handleSearchChange = (val: string) => {
    setQueryParams({ search: val || undefined, page: 1 });
  };

  const handleClassChange = (val: string) => {
    setQueryParams({ classId: val === "ALL" ? undefined : val, page: 1 });
  };

  const handleSortChange = (val: string) => {
    setQueryParams({ sort: val });
  };

  const handlePageChange = (page: number) => {
    setQueryParams({ page });
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Danh sách Học sinh"
        description={
          user?.role === "GLV"
            ? "Danh sách thiếu nhi thuộc các lớp Giáo lý bạn phụ trách"
            : user?.role === "PARENT"
            ? "Hồ sơ học tập của con em trong gia đình"
            : "Toàn bộ danh sách thiếu nhi trong Đoàn Kitô Vua"
        }
        badge={
          <Badge variant="primary" dot>
            Tổng: {totalCount} em
          </Badge>
        }
      />

      {/* Filter & Search Toolbar (§15) */}
      <div className="bg-white p-4 rounded-[14px] border border-[#E7E5E4] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <SearchBar
            value={searchParam}
            onChange={handleSearchChange}
            placeholder="Tìm theo tên, Tên Thánh, mã HS, phụ huynh..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="w-48">
            <Select
              value={classParam}
              onChange={handleClassChange}
              options={[
                { value: "ALL", label: "Tất cả các lớp" },
                ...classes.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>

          <div className="w-40">
            <Select
              value={sortParam}
              onChange={handleSortChange}
              options={[
                { value: "order_asc", label: "Theo STT sổ điểm" },
                { value: "name_asc", label: "Tên A → Z" },
                { value: "name_desc", label: "Tên Z → A" },
                { value: "code_asc", label: "Mã học sinh" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Students List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-4 rounded-[16px] border border-[#E7E5E4] space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Không thể tải danh sách học sinh"
          message={error}
          onRetry={fetchData}
        />
      ) : students.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12 text-[#A8A29E]" />}
          title="Không tìm thấy học sinh"
          description={
            searchParam || classParam !== "ALL"
              ? "Không có học sinh nào phù hợp với bộ lọc tìm kiếm."
              : "Chưa có dữ liệu học sinh."
          }
          action={
            searchParam || classParam !== "ALL" ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((st) => (
              <div
                key={st.id}
                onClick={() => navigate(`/students/${st.id}`)}
                className="bg-white rounded-[16px] border border-[#E7E5E4] p-4 shadow-xs hover:border-[#B4232C]/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#FFF1F2] text-[#B4232C] font-bold text-[14px] flex items-center justify-center border border-[#FECDD3] flex-shrink-0">
                    {st.orderNumber || st.code.slice(-2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold text-[#1C1917] group-hover:text-[#B4232C] transition-colors leading-snug truncate">
                      {st.christianName && (
                        <span className="text-[#B4232C] mr-1">{st.christianName}</span>
                      )}
                      {st.name}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] font-mono text-[#78716C] bg-[#FAFAF9] px-1.5 py-0.5 rounded border border-[#E7E5E4]">
                        {st.code}
                      </span>
                      <span className="text-[12px] text-[#57534E]">
                        {st.className || "Lớp 7A"}
                      </span>
                    </div>

                    <div className="text-[12px] text-[#78716C] mt-2 pt-2 border-t border-[#F5F5F4] space-y-0.5">
                      <div>Phụ huynh: <span className="text-[#1C1917] font-medium">{st.parentName || "—"}</span></div>
                      <div>SĐT: <span className="text-[#1C1917] font-mono">{st.parentPhone || "—"}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-[12px] text-[#B4232C] font-semibold">
                  <span>Xem chi tiết hồ sơ & điểm</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="pt-4 flex justify-center">
              <Pagination
                currentPage={pageParam}
                totalPages={Math.ceil(totalCount / pageSize)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
