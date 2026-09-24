import { useState } from "react";
import {
  Button,
  IconButton,
  Input,
  NumericInput,
  Select,
  Checkbox,
  RadioGroup,
  Badge,
  Avatar,
  Divider,
  Spinner,
} from "./components/ui";
import {
  Bell,
  MoreVertical,
  X,
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  ArrowRight,
  Mail,
  ShieldCheck,
  CheckCircle,
  GraduationCap,
  Calendar,
  Layers,
} from "lucide-react";

export default function App() {
  // State variables for interactive testing
  const [activeTab, setActiveTab] = useState<"all" | "matrix" | "form">("matrix");

  // Input states
  const [textValue, setTextValue] = useState("");
  const [errorInputVal, setErrorInputVal] = useState("admin@");
  const [numericScore, setNumericScore] = useState<number | null>(8.5);
  const [outOfRangeScore, setOutOfRangeScore] = useState<number | null>(11);

  // Select state
  const [selectedClass, setSelectedClass] = useState("7a");
  const classOptions = [
    { value: "6a", label: "Lớp Khai Tâm 1 (6A)", description: "GLV phụ trách: Thầy Minh" },
    { value: "7a", label: "Lớp Rước Lễ 1 (7A)", description: "GLV phụ trách: Cô Mai" },
    { value: "8a", label: "Lớp Thêm Sức 1 (8A)", description: "GLV phụ trách: Thầy Dũng" },
    { value: "9a", label: "Lớp Bao Đồng 1 (9A)", description: "GLV phụ trách: Cô Hương", disabled: true },
  ];

  // Checkbox states
  const [chkUnchecked, setChkUnchecked] = useState(false);
  const [chkChecked, setChkChecked] = useState(true);
  const [chkIndeterminate, setChkIndeterminate] = useState(true);

  // Radio state
  const [radioRole, setRadioRole] = useState("glv");

  // Button loading toggle
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#292524] pb-20 font-sans">
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E7E5E4] px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#B4232C] text-white flex items-center justify-center font-serif font-bold text-xl shadow-xs">
              ✝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] sm:text-[19px] font-bold text-[#1C1917] tracking-tight">
                  Đoàn Kitô Vua
                </h1>
                <Badge variant="primary" size="sm">Tier 1 Primitives</Badge>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[#78716C]">
                03_Component_Library (§4–9) & State Matrix (§32)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton
              aria-label="Thông báo hệ thống"
              variant="outline"
              size="sm"
              icon={<Bell className="w-4 h-4 text-[#B4232C]" />}
            />
            <Avatar name="Trần Văn B" roleBadge="GLV" size="sm" status="online" />
          </div>
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-[#F5F5F4] rounded-[10px] w-fit mb-6 border border-[#E7E5E4]">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 text-[14px] font-semibold rounded-[8px] transition-all cursor-pointer ${
              activeTab === "matrix"
                ? "bg-white text-[#B4232C] shadow-xs"
                : "text-[#57534E] hover:text-[#1C1917]"
            }`}
          >
            📋 Bảng State Matrix (§32)
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-[14px] font-semibold rounded-[8px] transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-[#B4232C] shadow-xs"
                : "text-[#57534E] hover:text-[#1C1917]"
            }`}
          >
            🧩 Toàn bộ Component Tier 1
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`px-4 py-2 text-[14px] font-semibold rounded-[8px] transition-all cursor-pointer ${
              activeTab === "form"
                ? "bg-white text-[#B4232C] shadow-xs"
                : "text-[#57534E] hover:text-[#1C1917]"
            }`}
          >
            📝 Fast-Input / Điểm Danh Demo
          </button>
        </div>

        {/* SECTION 1: STATE MATRIX §32 FULL VERIFICATION */}
        {activeTab === "matrix" && (
          <section className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-[#E7E5E4] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E5E4] gap-2">
                <div>
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1C1917] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#B4232C]" />
                    State Matrix Verification (§32)
                  </h2>
                  <p className="text-[14px] text-[#78716C]">
                    Kiểm chứng trực quan mọi trạng thái: Default, Hover, Focus, Active, Disabled, Loading, Error.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBtnLoading(!btnLoading)}
                >
                  {btnLoading ? "Tắt Loading Test" : "Bật Loading Test"}
                </Button>
              </div>

              {/* 1. BUTTON STATES */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary">1. Button (§4)</Badge>
                  <span className="text-[13px] text-[#78716C]">
                    5 variants · 4 sizes (sm, md, lg, parent) · loading giữ nguyên kích thước
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#FAFAF9] p-4 rounded-[12px] border border-[#E7E5E4]">
                  {/* Default & Hover/Active */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-semibold text-[#78716C] uppercase">Default / Hover / Active</span>
                    <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                      Lưu điểm danh (Primary)
                    </Button>
                    <Button variant="secondary" size="md">
                      Hủy bỏ (Secondary)
                    </Button>
                    <Button variant="outline" size="md">
                      Nhập từ Excel (Outline)
                    </Button>
                    <Button variant="ghost" size="md">
                      Xem chi tiết (Ghost)
                    </Button>
                    <Button variant="danger" size="md" leftIcon={<Trash2 className="w-4 h-4" />}>
                      Xóa học sinh (Danger)
                    </Button>
                  </div>

                  {/* Loading State: Giữ nguyên kích thước */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-semibold text-[#78716C] uppercase">Loading (Giữ nguyên kích thước)</span>
                    <Button variant="primary" size="md" loading={true}>
                      Lưu điểm danh (Primary)
                    </Button>
                    <Button variant="secondary" size="md" loading={true}>
                      Hủy bỏ (Secondary)
                    </Button>
                    <Button variant="outline" size="md" loading={true}>
                      Nhập từ Excel (Outline)
                    </Button>
                    <Button variant="danger" size="md" loading={true}>
                      Xóa học sinh (Danger)
                    </Button>
                  </div>

                  {/* Disabled State & Sizes */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-semibold text-[#78716C] uppercase">Disabled & Role Sizes</span>
                    <Button variant="primary" size="md" disabled>
                      Đã vô hiệu hóa (Disabled)
                    </Button>
                    <Button variant="outline" size="sm">
                      Size SM (36px compact)
                    </Button>
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Size LG (52px GLV fast)
                    </Button>
                    <Button variant="primary" size="parent" fullWidth>
                      Size PARENT (56px Phụ huynh)
                    </Button>
                  </div>
                </div>
              </div>

              <Divider className="my-6" />

              {/* 2. ICONBUTTON STATES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary">2. IconButton (§5)</Badge>
                  <span className="text-[13px] text-[#78716C]">
                    Bắt buộc có aria-label · Touch target ≥ 44×44px · Notification/More/Close/Back/Edit/Delete
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-[#FAFAF9] p-4 rounded-[12px] border border-[#E7E5E4]">
                  <div className="flex items-center gap-2">
                    <IconButton aria-label="Thông báo mới" variant="outline">
                      <Bell className="w-5 h-5 text-[#B4232C]" />
                    </IconButton>
                    <IconButton aria-label="Tùy chọn khác" variant="ghost">
                      <MoreVertical className="w-5 h-5" />
                    </IconButton>
                    <IconButton aria-label="Đóng bảng" variant="ghost">
                      <X className="w-5 h-5" />
                    </IconButton>
                    <IconButton aria-label="Quay lại trang trước" variant="secondary">
                      <ArrowLeft className="w-5 h-5" />
                    </IconButton>
                    <IconButton aria-label="Chỉnh sửa thông tin" variant="outline">
                      <Pencil className="w-5 h-5" />
                    </IconButton>
                    <IconButton aria-label="Xóa bản ghi" variant="danger">
                      <Trash2 className="w-5 h-5" />
                    </IconButton>
                  </div>

                  <div className="h-8 w-[1px] bg-[#E7E5E4] hidden sm:block" />

                  {/* Loading & Disabled */}
                  <div className="flex items-center gap-2">
                    <IconButton aria-label="Đang tải" loading variant="primary" />
                    <IconButton aria-label="Nút bị khóa" disabled variant="outline">
                      <Pencil className="w-5 h-5" />
                    </IconButton>
                    <IconButton aria-label="Nút cho phụ huynh" size="parent" variant="primary">
                      <Bell className="w-6 h-6" />
                    </IconButton>
                  </div>
                </div>
              </div>

              <Divider className="my-6" />

              {/* 3. INPUT & NUMERIC INPUT STATES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary">3. Input & NumericInput (§6, §7)</Badge>
                  <span className="text-[13px] text-[#78716C]">
                    Interface §6 · Mobile keyboard · Validate range · Không tự làm tròn
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#FAFAF9] p-4 rounded-[12px] border border-[#E7E5E4]">
                  {/* Default Input */}
                  <Input
                    label="Họ và tên học sinh"
                    placeholder="Ví dụ: Maria Nguyễn Thị Mai"
                    value={textValue}
                    required
                    helperText="Nhập đầy đủ tên thánh, họ và tên đệm"
                    leftIcon={<GraduationCap className="w-5 h-5" />}
                    onChange={setTextValue}
                  />

                  {/* Input with Error State */}
                  <Input
                    label="Email phụ huynh"
                    placeholder="parent@example.com"
                    value={errorInputVal}
                    error="Địa chỉ email chưa đúng định dạng"
                    leftIcon={<Mail className="w-5 h-5" />}
                    onChange={setErrorInputVal}
                  />

                  {/* Disabled & ReadOnly */}
                  <Input
                    label="Mã định danh GLV (Read-only)"
                    value="GLV-KT-2026-08"
                    readOnly
                    helperText="Mã tự sinh bởi hệ thống"
                    onChange={() => {}}
                  />

                  {/* NumericInput - Valid score */}
                  <NumericInput
                    label="Điểm Giáo Lý (Thang 0–10)"
                    value={numericScore}
                    min={0}
                    max={10}
                    step={0.5}
                    helperText="Hỗ trợ số lẻ (VD: 8.5, 7.25), không tự làm tròn"
                    onChange={setNumericScore}
                  />

                  {/* NumericInput - Out of range error */}
                  <NumericInput
                    label="Điểm chuyên cần (Thử nhập > 10)"
                    value={outOfRangeScore}
                    min={0}
                    max={10}
                    step={0.5}
                    onChange={setOutOfRangeScore}
                  />

                  {/* NumericInput - Disabled */}
                  <NumericInput
                    label="Điểm đã khóa kỳ trước"
                    value={9.0}
                    disabled
                    helperText="Đã nộp lên Ban Giáo Lý"
                    onChange={() => {}}
                  />
                </div>
              </div>

              <Divider className="my-6" />

              {/* 4. SELECT RESPONSIVE STATES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary">4. Select (§8)</Badge>
                  <span className="text-[13px] text-[#78716C]">
                    Desktop dùng Dropdown · Mobile mở BottomSheet với touch-target ≥ 48px
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAFAF9] p-4 rounded-[12px] border border-[#E7E5E4]">
                  <Select
                    label="Chọn lớp học (Thử mở trên desktop hoặc mobile)"
                    value={selectedClass}
                    options={classOptions}
                    helperText="Chuyển đổi viewport < 768px để thấy BottomSheet trượt lên"
                    onChange={setSelectedClass}
                  />

                  <Select
                    label="Lớp học bị lỗi hoặc khóa"
                    value=""
                    options={classOptions}
                    placeholder="Chưa chọn lớp"
                    error="Vui lòng chọn một lớp học để tiếp tục"
                    onChange={() => {}}
                  />
                </div>
              </div>

              <Divider className="my-6" />

              {/* 5. CHECKBOX & RADIO STATES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary">5. Checkbox & Radio (§9)</Badge>
                  <span className="text-[13px] text-[#78716C]">
                    Đủ 5 state: UNCHECKED / CHECKED / INDETERMINATE / DISABLED / FOCUS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAFAF9] p-4 rounded-[12px] border border-[#E7E5E4]">
                  {/* Checkbox States */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[13px] font-semibold text-[#1C1917] mb-1">Checkbox States</span>
                    <Checkbox
                      checked={chkUnchecked}
                      label="Unchecked State"
                      description="Học sinh chưa hoàn thành bài tập"
                      onChange={setChkUnchecked}
                    />
                    <Checkbox
                      checked={chkChecked}
                      label="Checked State"
                      description="Đã tham dự Thánh Lễ Chúa Nhật"
                      onChange={setChkChecked}
                    />
                    <Checkbox
                      indeterminate={chkIndeterminate}
                      label="Indeterminate State"
                      description="Chọn một phần học sinh trong lớp"
                      onChange={() => setChkIndeterminate(!chkIndeterminate)}
                    />
                    <Checkbox
                      disabled
                      checked={true}
                      label="Disabled Checked State"
                      description="Điểm danh đã được chốt bởi Admin"
                      onChange={() => {}}
                    />
                  </div>

                  {/* Radio Group States */}
                  <div>
                    <RadioGroup
                      name="role-test"
                      label="Phân quyền người dùng (Radio States)"
                      value={radioRole}
                      options={[
                        { value: "admin", label: "Quản trị viên (Admin)", description: "Toàn quyền quản lý giáo phận / xứ" },
                        { value: "glv", label: "Giáo lý viên (GLV)", description: "Quản lý điểm danh và nhập điểm lớp" },
                        { value: "parent", label: "Phụ huynh / Học sinh", description: "Xem bảng điểm, thông báo và lịch học" },
                        { value: "guest", label: "Tài khoản khách (Disabled)", disabled: true },
                      ]}
                      onChange={setRadioRole}
                    />
                  </div>
                </div>
              </div>

              <Divider className="my-6" />

              {/* 6. BADGE, AVATAR, SPINNER */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary">6. Badge, Avatar, Divider, Spinner (§9)</Badge>
                </div>

                <div className="space-y-4 bg-[#FAFAF9] p-4 rounded-[12px] border border-[#E7E5E4]">
                  {/* Badges */}
                  <div>
                    <span className="text-[12px] font-semibold text-[#78716C] uppercase block mb-2">
                      Badge Variants: neutral | primary | success | warning | error | info | gold
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="neutral">Neutral</Badge>
                      <Badge variant="primary" dot>Primary Red</Badge>
                      <Badge variant="success" dot>Có mặt (Success)</Badge>
                      <Badge variant="warning" dot>Có phép (Warning)</Badge>
                      <Badge variant="error" dot>Vắng mặt (Error)</Badge>
                      <Badge variant="info">Thông tin (Info)</Badge>
                      <Badge variant="gold" icon="★">Huy hiệu Vàng (Gold)</Badge>
                    </div>
                  </div>

                  {/* Avatars */}
                  <div>
                    <span className="text-[12px] font-semibold text-[#78716C] uppercase block mb-2">
                      Avatar: Initials Fallback (Không hiển thị ảnh vỡ) · Status · Role Badges
                    </span>
                    <div className="flex flex-wrap items-center gap-4">
                      <Avatar name="Nguyễn Văn An" roleBadge="ADMIN" status="online" size="xl" />
                      <Avatar name="Trần Thị Bình" roleBadge="GLV" status="busy" size="lg" />
                      <Avatar name="Lê Minh Cúc" roleBadge="HS" status="away" size="md" />
                      <Avatar name="Phạm Đức Dũng" roleBadge="PH" status="offline" size="sm" />
                      {/* Simulating broken image */}
                      <Avatar
                        src="https://invalid-broken-url.example/test.jpg"
                        name="Hoàng Gia Bảo"
                        size="lg"
                        status="online"
                      />
                      <Avatar size="md" />
                    </div>
                  </div>

                  {/* Spinners */}
                  <div>
                    <span className="text-[12px] font-semibold text-[#78716C] uppercase block mb-2">
                      Spinner Sizes & Colors
                    </span>
                    <div className="flex items-center gap-4">
                      <Spinner size="xs" color="primary" />
                      <Spinner size="sm" color="primary" />
                      <Spinner size="md" color="primary" />
                      <Spinner size="lg" color="gold" />
                      <Spinner size="xl" color="neutral" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: FAST INPUT REAL-WORLD SIMULATION */}
        {activeTab === "form" && (
          <section className="bg-white p-5 sm:p-6 rounded-[14px] border border-[#E7E5E4] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <div>
                <h2 className="text-[18px] font-bold text-[#1C1917] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#B4232C]" />
                  Mô phỏng Thao tác GLV: Điểm danh & Nhập điểm nhanh
                </h2>
                <p className="text-[13px] text-[#78716C]">
                  Được thiết kế theo nguyên tắc Fast-Input và Touch-first (touch-target ≥ 48px).
                </p>
              </div>
              <Badge variant="success" dot>25/28 Đã nhập</Badge>
            </div>

            {/* Quick Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Lớp học"
                value={selectedClass}
                options={classOptions}
                onChange={setSelectedClass}
              />
              <Select
                label="Môn học"
                value="gl"
                options={[
                  { value: "gl", label: "Giáo lý Hồng Ân" },
                  { value: "kt", label: "Kinh Thánh Tân Ước" },
                ]}
                onChange={() => {}}
              />
              <Select
                label="Loại điểm"
                value="gk"
                options={[
                  { value: "15p", label: "Kiểm tra 15 phút" },
                  { value: "gk", label: "Điểm thi Giữa kỳ" },
                  { value: "ck", label: "Điểm thi Cuối kỳ" },
                ]}
                onChange={() => {}}
              />
            </div>

            <Divider label="Danh sách học sinh & Nhập điểm" />

            {/* Student Score Row Simulation */}
            <div className="space-y-3">
              {[
                { id: "1", code: "01", name: "Maria Nguyễn Văn An", oldScore: 8.0, current: 8.5 },
                { id: "2", code: "02", name: "Giuse Trần Văn Bình", oldScore: 7.5, current: null },
                { id: "3", code: "03", name: "Têrêsa Lê Minh Cúc", oldScore: 9.0, current: 9.5 },
              ].map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-[12px] bg-[#FAFAF9] border border-[#E7E5E4] gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[#78716C] w-6 text-center">
                      {student.code}
                    </span>
                    <Avatar name={student.name} size="md" status="online" />
                    <div>
                      <div className="text-[15px] font-semibold text-[#1C1917]">
                        {student.name}
                      </div>
                      <div className="text-[12px] text-[#78716C]">
                        Điểm cũ: {student.oldScore}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="w-28">
                      <NumericInput
                        placeholder="0.0"
                        size="md"
                        min={0}
                        max={10}
                        value={student.current}
                        onChange={() => {}}
                      />
                    </div>
                    <Badge variant={student.current ? "success" : "neutral"} size="sm">
                      {student.current ? "Đã nhập" : "Chưa có"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Save Bar Simulation (§31) */}
            <div className="sticky bottom-4 z-30 flex items-center justify-between p-4 bg-white rounded-[12px] border border-[#E7E5E4] shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3B341]" />
                <span className="text-[14px] font-semibold text-[#292524]">
                  Có thay đổi chưa lưu
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="md">
                  Đặt lại
                </Button>
                <Button variant="primary" size="md" leftIcon={<CheckCircle className="w-4 h-4" />}>
                  Lưu điểm số
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: COMPONENT CATALOG */}
        {activeTab === "all" && (
          <section className="space-y-6">
            <div className="bg-white p-5 rounded-[14px] border border-[#E7E5E4]">
              <h2 className="text-[18px] font-bold text-[#1C1917] mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#B4232C]" />
                Danh mục Primitive Tier 1
              </h2>
              <p className="text-[14px] text-[#78716C] mb-4">
                Toàn bộ 11 primitives đã được sinh hoàn chỉnh theo tiêu chuẩn presentational thuần túy: props-in, event-out qua on+Verb, không side-effect.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Button",
                  "IconButton",
                  "Input",
                  "NumericInput",
                  "Select",
                  "Checkbox",
                  "Radio",
                  "Badge",
                  "Avatar",
                  "Divider",
                  "Spinner",
                ].map((name) => (
                  <div
                    key={name}
                    className="p-3 rounded-[10px] bg-[#FAFAF9] border border-[#E7E5E4] text-center"
                  >
                    <div className="text-[15px] font-bold text-[#B4232C]">{name}</div>
                    <div className="text-[12px] text-[#78716C]">Tier 1 Primitive</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
