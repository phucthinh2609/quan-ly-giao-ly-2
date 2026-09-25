import React, { useEffect, useRef, useState } from "react";
import { BookOpen, Calculator, Church, Moon, Save, Sun, UserCog } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { SegmentedControl, SegmentedOption } from "../../components/ui/SegmentedControl";
import { useToast } from "../../components/ui/Toast";
import { SectionHeader } from "../../components/dashboard";
import { TEXT_SIZE_OPTIONS, TextSize, ThemeMode, usePreferences } from "../../context/PreferencesContext";
import { useReveal } from "../../lib/motion";

const THEME_OPTIONS: SegmentedOption<ThemeMode>[] = [
  { value: "light", label: "Sáng", icon: <Sun /> },
  { value: "dark", label: "Tối", icon: <Moon /> },
];

const TEXT_OPTIONS: SegmentedOption<TextSize>[] = TEXT_SIZE_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const { theme, setTheme, textSize, setTextSize } = usePreferences();
  const revealRef = useReveal<HTMLDivElement>();
  const [isSaving, setIsSaving] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  // Form state
  const [parishName, setParishName] = useState("Giáo xứ Đức Mẹ Hằng Cứu Giúp");
  const [unitName, setUnitName] = useState("Đoàn Thiếu Nhi Thánh Thể Kitô Vua");
  const [academicYear, setAcademicYear] = useState("2026 - 2027");
  const [headTeacher, setHeadTeacher] = useState("Tôma Nguyễn Quản Trị");
  const [passThreshold, setPassThreshold] = useState("5.0");
  const [excellentThreshold, setExcellentThreshold] = useState("8.5");

  const handleSave = () => {
    setIsSaving(true);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      setIsSaving(false);
      toast.success("Đã lưu cài đặt hệ thống.");
    }, 400);
  };

  const currentSize = TEXT_SIZE_OPTIONS.find((o) => o.value === textSize);

  return (
    <div ref={revealRef} className="space-y-6">
      <PageHeader
        title="Cài đặt"
        description="Tùy chỉnh cá nhân, thông tin giáo xứ, năm học và quy tắc tính điểm"
        actions={
          <Button leftIcon={<Save />} loading={isSaving} onClick={handleSave}>
            Lưu thay đổi
          </Button>
        }
      />

      {/* Cá nhân — áp dụng ngay, lưu trên thiết bị (B-02, B-03) */}
      <Card data-reveal as="section" aria-labelledby="settings-personal" padding="lg" className="space-y-5">
        <SectionHeader
          id="settings-personal"
          title="Cá nhân"
          description="Áp dụng ngay và được ghi nhớ trên thiết bị này"
          icon={<UserCog />}
          iconTone="primary"
        />

        <div className="divide-y divide-line">
          <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-ink">Giao diện</p>
              <p className="text-sm text-ink-3">Chọn nền sáng hoặc tối cho dễ nhìn</p>
            </div>
            <SegmentedControl
              ariaLabel="Giao diện"
              value={theme}
              onChange={setTheme}
              options={THEME_OPTIONS}
              fullWidth
              className="sm:inline-flex sm:w-auto"
            />
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-ink">Cỡ chữ</p>
              <p className="text-sm text-ink-3">Phóng to chữ, khoảng cách và nút bấm trên toàn ứng dụng</p>
            </div>
            <SegmentedControl
              ariaLabel="Cỡ chữ"
              value={textSize}
              onChange={setTextSize}
              options={TEXT_OPTIONS}
              fullWidth
              className="sm:inline-flex sm:w-auto"
            />
          </div>

          <div className="pt-4">
            <div className="rounded-control bg-surface-2 p-4" aria-live="polite">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-ink">
                <span className="text-3xl font-bold tracking-tight" aria-hidden="true">
                  Aa
                </span>
                <span className="text-base">— Cỡ chữ hiện tại</span>
              </p>
              {currentSize && (
                <p className="mt-1 text-sm text-ink-3">
                  {currentSize.label} · <span className="font-mono">{currentSize.hint}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Thông tin Giáo xứ & Đoàn */}
        <Card data-reveal as="section" aria-labelledby="settings-parish" padding="lg" className="space-y-5">
          <SectionHeader
            id="settings-parish"
            title="Giáo xứ và Đoàn"
            description="Hiển thị trên báo cáo và thông báo"
            icon={<Church />}
            iconTone="primary"
          />
          <div className="space-y-4">
            <Input id="settings-parish-name" label="Tên giáo xứ" value={parishName} onChange={setParishName} />
            <Input id="settings-unit-name" label="Tên đoàn giáo lý" value={unitName} onChange={setUnitName} />
            <Input
              id="settings-head-teacher"
              label="Trưởng Ban Giáo lý"
              value={headTeacher}
              onChange={setHeadTeacher}
            />
          </div>
        </Card>

        {/* Năm học & Thang điểm */}
        <Card data-reveal as="section" aria-labelledby="settings-year" padding="lg" className="space-y-5">
          <SectionHeader
            id="settings-year"
            title="Năm học và thang điểm"
            description="Quy tắc xếp loại áp dụng cho toàn đoàn"
            icon={<BookOpen />}
            iconTone="success"
          />
          <div className="space-y-4">
            <Input id="settings-academic-year" label="Năm học hiện tại" value={academicYear} onChange={setAcademicYear} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="settings-pass-threshold"
                label="Điểm đạt chuẩn (từ)"
                type="number"
                value={passThreshold}
                onChange={setPassThreshold}
              />
              <Input
                id="settings-excellent-threshold"
                label="Điểm xuất sắc (từ)"
                type="number"
                value={excellentThreshold}
                onChange={setExcellentThreshold}
              />
            </div>
            <div className="flex items-start gap-3 rounded-control bg-success-soft p-3">
              <Calculator className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-ink">Công thức tính điểm trung bình</p>
                <p className="mt-0.5 font-mono text-ink-2">(Miệng + 15 phút + GK × 2 + CK × 3) / 7</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
