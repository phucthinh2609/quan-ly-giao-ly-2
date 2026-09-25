import React, { useState } from "react";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { useToast } from "../../components/ui/Toast";

export const ReportsPage: React.FC = () => {
  const toast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<"HK1" | "HK2" | "FULL_YEAR">("HK1");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = (reportType: string) => {
    setIsExporting(true);
    toast.info(`Đang kết xuất ${reportType} ra file Excel...`);
    setTimeout(() => {
      setIsExporting(false);
      toast.success(`Đã xuất báo cáo ${reportType} thành công! File kito_vua_${selectedPeriod}.xlsx đã sẵn sàng.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Báo Cáo & Thống Kê Tổng Hợp"
        description="Tổng hợp tình hình chuyên cần, phổ điểm học tập và kết xuất báo cáo Excel cho Ban Điều Hành"
        badge={<Badge variant="primary">Niên khóa 2026 - 2027</Badge>}
        actions={
          <Button
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
            loading={isExporting}
            onClick={() => handleExport("Tổng hợp toàn đoàn")}
          >
            Xuất Excel Tổng Hợp
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng sĩ số toàn đoàn"
          value={165}
          subtitle="4 khối / 6 lớp giáo lý"
          icon={<BarChart3 className="w-5 h-5" />}
          trend="+5 em (3.2%)"
          trendType="positive"
        />
        <StatCard
          title="Tỷ lệ chuyên cần chung"
          value="93.8%"
          subtitle="Mục tiêu ≥ 90%"
          icon={<CalendarCheck className="w-5 h-5" />}
          trend="+1.4%"
          trendType="positive"
        />
        <StatCard
          title="Điểm TB toàn đoàn"
          value="8.4"
          subtitle="Thang điểm 10"
          icon={<FileSpreadsheet className="w-5 h-5" />}
          trend="Học kỳ I"
          trendType="neutral"
        />
        <StatCard
          title="Học sinh Xuất sắc / Giỏi"
          value="118 em"
          subtitle="Chiếm 71.5% tổng số"
          icon={<TrendingUp className="w-5 h-5" />}
          trendType="positive"
        />
      </div>

      {/* Grade Level Summary Table */}
      <div className="bg-white rounded-[16px] border border-[#E7E5E4] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F5F4]">
          <div>
            <h3 className="text-[17px] font-bold text-[#1C1917] font-serif">
              Thống Kê Chi Tiết Theo Khối Lớp
            </h3>
            <p className="text-[12px] text-[#78716C]">
              Phân tích tỷ lệ chuyên cần, điểm trung bình và số lượng học sinh cần hỗ trợ
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAFAF9] p-1 rounded-lg border border-[#E7E5E4]">
            {(["HK1", "HK2", "FULL_YEAR"] as const).map((p) => (
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

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-[#57534E]">
                <th className="py-3 px-4 font-semibold">Khối Lớp</th>
                <th className="py-3 px-4 font-semibold">Sĩ Số</th>
                <th className="py-3 px-4 font-semibold">Chuyên Cần</th>
                <th className="py-3 px-4 font-semibold">Điểm TB</th>
                <th className="py-3 px-4 font-semibold">Đạt Chuẩn (≥5.0)</th>
                <th className="py-3 px-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4]">
              {[
                { grade: "Khối Khai Tâm", count: 24, rate: 88, gpa: 8.2, passRate: "100%" },
                { grade: "Khối Rước Lễ (Lớp 3B, 4A)", count: 65, rate: 96, gpa: 8.6, passRate: "98.5%" },
                { grade: "Khối Thêm Sức (Lớp 7A, 8A)", count: 60, rate: 94, gpa: 8.4, passRate: "96.7%" },
                { grade: "Khối Bao Đồng", count: 16, rate: 92, gpa: 8.1, passRate: "93.8%" },
              ].map((row) => (
                <tr key={row.grade} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1C1917]">{row.grade}</td>
                  <td className="py-3 px-4 font-mono">{row.count} em</td>
                  <td className="py-3 px-4">
                    <Badge variant={row.rate >= 90 ? "success" : "warning"} size="sm">
                      {row.rate}%
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#B4232C] font-mono">{row.gpa}</td>
                  <td className="py-3 px-4 text-[#168154] font-semibold">{row.passRate}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => handleExport(row.grade)}
                    >
                      Xuất Excel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
