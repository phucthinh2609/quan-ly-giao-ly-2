import React, { useState } from "react";
import {
  Save,
  Church,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [parishName, setParishName] = useState("Giáo xứ Đức Mẹ Hằng Cứu Giúp");
  const [unitName, setUnitName] = useState("Đoàn Thiếu Nhi Thánh Thể Kitô Vua");
  const [academicYear, setAcademicYear] = useState("2026 - 2027");
  const [headTeacher, setHeadTeacher] = useState("Tôma Nguyễn Quản Trị");
  const [passThreshold, setPassThreshold] = useState("5.0");
  const [excellentThreshold, setExcellentThreshold] = useState("8.5");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Đã lưu các cài đặt hệ thống thành công!");
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Cài Đặt Hệ Thống"
        description="Quản trị thông tin Xứ đoàn, cấu hình niên khóa, thang điểm chuẩn và quy tắc đánh giá"
        badge={<Badge variant="primary">Hệ thống</Badge>}
        actions={
          <Button
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            loading={isSaving}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Thông tin Giáo xứ & Xứ đoàn */}
        <div className="bg-white rounded-[16px] border border-[#E7E5E4] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F5F5F4]">
            <Church className="w-5 h-5 text-[#B4232C]" />
            <h3 className="text-[17px] font-bold text-[#1C1917] font-serif">
              Thông Tin Giáo Xứ & Đoàn
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
                Tên Giáo xứ
              </label>
              <Input
                value={parishName}
                onChange={(val) => setParishName(val)}
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
                Tên Phân đoàn / Đoàn Giáo lý
              </label>
              <Input
                value={unitName}
                onChange={(val) => setUnitName(val)}
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
                Trưởng Ban Giáo Lý / Đoàn Trưởng
              </label>
              <Input
                value={headTeacher}
                onChange={(val) => setHeadTeacher(val)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Niên khóa & Quy tắc tính điểm */}
        <div className="bg-white rounded-[16px] border border-[#E7E5E4] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F5F5F4]">
            <BookOpen className="w-5 h-5 text-[#168154]" />
            <h3 className="text-[17px] font-bold text-[#1C1917] font-serif">
              Niên Khóa & Thang Điểm
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
                Niên khóa hiện tại
              </label>
              <Input
                value={academicYear}
                onChange={(val) => setAcademicYear(val)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
                  Điểm đạt chuẩn (≥)
                </label>
                <Input
                  value={passThreshold}
                  onChange={(val) => setPassThreshold(val)}
                  type="number"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
                  Điểm Xuất sắc (≥)
                </label>
                <Input
                  value={excellentThreshold}
                  onChange={(val) => setExcellentThreshold(val)}
                  type="number"
                />
              </div>
            </div>

            <div className="p-3 bg-[#ECFDF3] border border-[#A7F3D0] rounded-[10px] text-[12px] text-[#146C47]">
              ✓ Công thức tính: Điểm TB = (Miệng + 15' + GK×2 + CK×3) / 7
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
