# 04 — WIREFRAMES

## 1. Reference Viewport

```text
Width: 375px
Height: 812px
Page horizontal padding: 16px
Bottom navigation: fixed
```

Other targets:
`320px`, `375px` primary, `390px`, `768px`, `1024px`, `1280px`.

## 2. Global Mobile Shell

```text
┌─────────────────────────────────────┐
│ Header                              │ 56–64px
├─────────────────────────────────────┤
│                                     │
│ Main Content                        │
│ Padding: 16px                       │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ MobileBottomNav                     │ 64–72px
└─────────────────────────────────────┘
```

Component:
```text
<AppShell>
├── <Header />
├── <MainContent>
└── <MobileBottomNav />
```

## 3. Global Page Header

Root:
```text
┌─────────────────────────────────────┐
│ Dashboard                       🔔  │
└─────────────────────────────────────┘
```

Detail:
```text
┌─────────────────────────────────────┐
│ ←  Page Title                   🔔  │
└─────────────────────────────────────┘
```

## 4. WIREFRAME A — ADMIN DASHBOARD MOBILE

```text
┌─────────────────────────────────────┐
│ Dashboard                       🔔  │
├─────────────────────────────────────┤
│ Chào buổi sáng, Admin 👋            │
│ Theo dõi tình hình giáo lý          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Tổng học sinh                   │ │
│ │ 128                             │ │
│ │ ↑ +5 so với tháng trước         │ │
│ │                           👥    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────┬───────────────┐ │
│ │ Lớp học         │ GLV           │ │
│ │ 12              │ 18            │ │
│ └─────────────────┴───────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ĐIỂM DANH HÔM NAY               │ │
│ │ Có mặt          94%             │ │
│ │ █████████████████░░              │ │
│ │ 120 Có mặt   5 Vắng   3 Phép    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ KẾT QUẢ HỌC TẬP                 │ │
│ │ Điểm TB toàn đoàn        8.2    │ │
│ │      ╭──────────────╮           │ │
│ │  10 ─┤      ╭───╮   │           │ │
│ │   8 ─┤ ╭──╮ │   ╰╮  │           │ │
│ │   6 ─┤╯  ╰─╯     ╰──│           │ │
│ │      └──────────────┘           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ CẢNH BÁO                            │
│ ┌─────────────────────────────────┐ │
│ │ ⚠ 3 lớp có tỷ lệ vắng > 10%   › │ │
│ └─────────────────────────────────┘ │
│                                     │
│ HOẠT ĐỘNG GẦN ĐÂY                  │
│ ┌─────────────────────────────────┐ │
│ │ Nguyễn Văn A                    │ │
│ │ Cập nhật điểm lớp 7A            │ │
│ │ 10 phút trước                   │ │
│ ├─────────────────────────────────┤ │
│ │ Trần Văn B                      │ │
│ │ Đã điểm danh lớp 8A             │ │
│ │ 25 phút trước                   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🏠      👥       🏫       ⋯         │
│ Home    Users    Lớp     Thêm      │
└─────────────────────────────────────┘
```

### Component Mapping

| Vị trí | Component |
|---|---|
| Header | `<Header />` |
| Tổng học sinh | `<StatCard />` |
| Lớp / GLV | `<KPIGroup />` + `<StatCard />` |
| Điểm danh | `<ChartCard />` + `<AttendanceSummary />` |
| Học tập | `<ChartCard />` |
| Cảnh báo | `<NotificationCard />` / `<AlertCard />` |
| Activity | `<ActivityFeed />` |
| Bottom | `<MobileBottomNav />` |

## 5. Admin Responsive

### 768px

```text
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────────────────────────────┤
│ Welcome                                 │
│ ┌──────────────┐ ┌──────────────┐      │
│ │ HS 128       │ │ Lớp 12       │      │
│ └──────────────┘ └──────────────┘      │
│ ┌──────────────┐ ┌──────────────┐      │
│ │ GLV 18       │ │ Chuyên cần 94%│      │
│ └──────────────┘ └──────────────┘      │
│ ┌─────────────────────────────────────┐ │
│ │ Học tập / Chart                     │ │
│ └─────────────────────────────────────┘ │
│ ┌──────────────────┐ ┌───────────────┐ │
│ │ Cảnh báo         │ │ Hoạt động     │ │
│ └──────────────────┘ └───────────────┘ │
└─────────────────────────────────────────┘
```

### 1280px

```text
┌──────────────┬─────────────────────────────────────────┐
│ SIDEBAR      │ Header                                  │
│              ├─────────────────────────────────────────┤
│ Dashboard    │ Welcome                                 │
│ Người dùng   │                                         │
│ Lớp          │ ┌───────┐ ┌───────┐ ┌───────┐ ┌─────┐│
│ Điểm danh    │ │ HS    │ │ Lớp   │ │ GLV   │ │ %   ││
│ Bảng điểm    │ └───────┘ └───────┘ └───────┘ └─────┘│
│ Báo cáo      │                                         │
│ Thông báo    │ ┌──────────────────┐ ┌──────────────┐ │
│ Cài đặt      │ │ Điểm danh        │ │ Học tập      │ │
│              │ │ Chart            │ │ Chart        │ │
│              │ └──────────────────┘ └──────────────┘ │
│              │ ┌──────────────────┐ ┌──────────────┐ │
│              │ │ Cảnh báo         │ │ Activity     │ │
│              │ └──────────────────┘ └──────────────┘ │
└──────────────┴─────────────────────────────────────────┘
```

Desktop: persistent sidebar, no bottom nav, KPI 4 columns, charts 2 columns.

## 6. WIREFRAME B — GLV NHẬP ĐIỂM MOBILE

```text
┌─────────────────────────────────────┐
│ ←  Nhập điểm                        │
├─────────────────────────────────────┤
│ Lớp                                 │
│ ┌─────────────────────────────────┐ │
│ │ 7A                          ▼   │ │
│ └─────────────────────────────────┘ │
│ Môn                                 │
│ ┌─────────────────────────────────┐ │
│ │ Giáo lý                     ▼   │ │
│ └─────────────────────────────────┘ │
│ Loại điểm                            │
│ ┌─────────────────────────────────┐ │
│ │ Giữa kỳ                     ▼   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 28 học sinh                     │ │
│ │ 3 điểm chưa hợp lệ              │ │
│ └─────────────────────────────────┘ │
│ [ Import Excel ]                    │
│ DANH SÁCH HỌC SINH                 │
│ ┌─────────────────────────────────┐ │
│ │ 01  Nguyễn Văn An               │ │
│ │     Điểm cũ: 8.0                │ │
│ │                  Điểm: [ 8.5 ] │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 02  Trần Văn Bình               │ │
│ │     Điểm cũ: 7.5                │ │
│ │                  Điểm: [  ]    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 03  Lê Minh C                  │ │
│ │     Điểm cũ: 9.0                │ │
│ │                  Điểm: [ 11 ]  │ │
│ │                  ⚠ Tối đa 10   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 25/28 đã nhập         [ LƯU ĐIỂM ] │
└─────────────────────────────────────┘
```

Component mapping:
```text
<BulkScoreEntry>
├── <Header />
├── <ClassSelector />
├── <SubjectSelector />
├── <ExamTypeSelector />
├── <ScoreValidationSummary />
├── <ExcelUploader />
├── <ScoreTable>
│   ├── <ScoreRow />
│   │   └── <ScoreInput />
│   └── ...
└── <SaveBar />
```

### Score Input interaction

```text
Tap ScoreInput
↓
Numeric Keyboard
↓
Next
↓
Next Student
```

### Error

```text
┌─────────────────────────────────────┐
│ 03  Lê Minh C                       │
│ Điểm: [ 11 ]                        │
│ ⚠ Điểm phải từ 0–10                │
└─────────────────────────────────────┘
```

Tap error item:
`scrollIntoView() → focus ScoreInput`

### Dirty state

```text
⚠ Có thay đổi chưa lưu
5 thay đổi chưa lưu     [LƯU]
```

Save states:
`NO_CHANGES`, `DIRTY`, `SAVING`, `SAVED`, `ERROR`

## 7. GLV Score Desktop

```text
┌──────────────┬────────────────────────────────────────────┐
│ SIDEBAR      │ ← Nhập điểm                               │
│              ├────────────────────────────────────────────┤
│              │ Lớp [7A ▼]  Môn [Giáo lý ▼]              │
│              │ Loại điểm [Giữa kỳ ▼]                     │
│              │ [Import Excel]              [LƯU ĐIỂM]    │
│              │                                            │
│              │ ┌────────────────────────────────────────┐ │
│              │ │ STT │ HỌC SINH │ ĐIỂM CŨ │ ĐIỂM MỚI   │ │
│              │ ├────────────────────────────────────────┤ │
│              │ │ 01  │ Nguyễn A │ 8.0     │ [ 8.5 ]    │ │
│              │ │ 02  │ Trần B   │ 7.5     │ [ 8.0 ]    │ │
│              │ │ 03  │ Lê C     │ 9.0     │ [ 11 ] ⚠  │ │
│              │ └────────────────────────────────────────┘ │
│              │ 25/28 đã nhập                              │
└──────────────┴────────────────────────────────────────────┘
```

Table header sticky khi scroll.

## 8. WIREFRAME C — PARENT BẢNG ĐIỂM MOBILE

```text
┌─────────────────────────────────────┐
│ Bảng điểm                       🔔  │
├─────────────────────────────────────┤
│ Con đang xem                        │
│ ┌─────────────────────────────────┐ │
│ │ 👦 Nguyễn Văn An            ▼  │ │
│ │    Lớp 7A                      │ │
│ └─────────────────────────────────┘ │
│ Kỳ học                              │
│ ┌─────────────────────────────────┐ │
│ │ Học kỳ I                    ▼  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ĐIỂM TRUNG BÌNH                │ │
│ │             8.5                 │ │
│ │        Kết quả: Tốt             │ │
│ └─────────────────────────────────┘ │
│ KẾT QUẢ THEO MÔN                    │
│ ┌─────────────────────────────────┐ │
│ │ 📖 Giáo lý                      │ │
│ │ Điểm TB                  8.5   │ │
│ │ Giữa kỳ 8.0   Cuối kỳ 9.0     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📖 Kinh Thánh                   │ │
│ │ Điểm TB                  9.0   │ │
│ │ Giữa kỳ 9.0   Cuối kỳ 9.0     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 💬 Nhận xét của GLV             │ │
│ │ "Con chăm chỉ và tích cực       │ │
│ │  tham gia học tập."             │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🏠       📊       ✅       🔔       │
│ Home     Điểm    Điểm danh  TB      │
└─────────────────────────────────────┘
```

### Component mapping

```text
<ParentGradeOverview>
├── <Header />
├── <ParentChildSwitcher />
├── <AcademicPeriodSelector />
├── <GPAHighlight />
├── <SubjectScoreCard /> × N
└── <TeacherComment />
```

## 9. Parent Subject Detail

```text
┌─────────────────────────────────────┐
│ ←  Chi tiết môn Giáo lý             │
├─────────────────────────────────────┤
│ 📖 Giáo lý                          │
│ Điểm trung bình                     │
│              8.5                    │
│ ┌─────────────────────────────────┐ │
│ │ Thành phần điểm                 │ │
│ │ Miệng                 9.0       │ │
│ │ 15 phút              8.5        │ │
│ │ Giữa kỳ              8.0        │ │
│ │ Cuối kỳ              9.0        │ │
│ └─────────────────────────────────┘ │
│ Nhận xét                            │
│ "Con có tinh thần học tập tốt."     │
└─────────────────────────────────────┘
```

## 10. Parent Attendance

```text
┌─────────────────────────────────────┐
│ Điểm danh                           │
├─────────────────────────────────────┤
│ 👦 Nguyễn Văn An             ▼      │
│ Chuyên cần                          │
│          90%                        │
│ █████████████████░░                 │
│ Tổng buổi: 20                       │
│ Có mặt: 18                          │
│ Vắng: 1                             │
│ Có phép: 1                          │
│ Lịch sử                             │
│ 24/09   🟢 Có mặt                   │
│ 17/09   🟢 Có mặt                   │
│ 10/09   🟡 Có phép                  │
│ 03/09   🔴 Vắng                     │
└─────────────────────────────────────┘
```

## 11. Parent Notification

```text
┌─────────────────────────────────────┐
│ Thông báo                       🔔  │
├─────────────────────────────────────┤
│ [Tất cả] [Chưa đọc]                │
│ ┌─────────────────────────────────┐ │
│ │ ● Kết quả học tập tháng 9       │ │
│ │   Bảng điểm đã được cập nhật.   │ │
│ │   Hôm qua                   ›   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ● Lịch học tuần này             │ │
│ │   Thông tin lịch học...         │ │
│ │   Hôm nay                   ›   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ○ Sinh hoạt Trung Thu           │ │
│ │   20/09                      ›  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🏠       📊       ✅       🔔       │
└─────────────────────────────────────┘
```

Notification detail:
```text
← Thông báo
Kết quả học tập tháng 9
23/09/2026 · 18:30

Kính gửi quý phụ huynh,
Bảng điểm tháng 9 của học sinh đã được cập nhật.

[ Xem bảng điểm ]
```

## 12. GLV Attendance Supporting Screen

```text
┌─────────────────────────────────────┐
│ ←  Điểm danh                        │
├─────────────────────────────────────┤
│ Hôm nay · 24/09/2026                │
│ Lớp                                 │
│ ┌─────────────────────────────────┐ │
│ │ 7A                          ▼   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 32 HS  27 Có  3 Vắng  1 Phép  │ │
│ │                      1 Muộn    │ │
│ └─────────────────────────────────┘ │
│ [✓ Có mặt tất cả]                  │
│ DANH SÁCH                           │
│ ┌─────────────────────────────────┐ │
│ │ 👦 Nguyễn Văn An        🟢 Có  │ │
│ ├─────────────────────────────────┤ │
│ │ 👦 Trần Văn Bình        🔴 Vắng│ │
│ ├─────────────────────────────────┤ │
│ │ 👧 Lê Minh C            🟡 Phép│ │
│ ├─────────────────────────────────┤ │
│ │ 👦 Phạm D               🟠 Muộn│ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 32 học sinh             [ LƯU ]    │
└─────────────────────────────────────┘
```

Status picker:
```text
🟢 Có mặt
🔴 Vắng
🟡 Có phép
🟠 Đi muộn
```

Mobile có thể dùng BottomSheet.

## 13. Empty States

### Admin
```text
┌─────────────────────────────────────┐
│               🏫                    │
│       Chưa có lớp học               │
│ Tạo lớp đầu tiên để bắt đầu        │
│ [ + Tạo lớp ]                      │
└─────────────────────────────────────┘
```

### GLV
```text
┌─────────────────────────────────────┐
│               👥                    │
│    Lớp chưa có học sinh             │
│ Liên hệ Admin để cập nhật danh sách.│
└─────────────────────────────────────┘
```

### Parent
```text
┌─────────────────────────────────────┐
│               📊                    │
│       Chưa có bảng điểm             │
│ Điểm sẽ xuất hiện khi GLV cập nhật.│
└─────────────────────────────────────┘
```

## 14. Loading

Page dùng Skeleton; không dùng spinner toàn trang nếu chỉ một card loading.

```text
┌─────────────────────────────────────┐
│ Dashboard                       ◌   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ░░░░░░░░░░░░                    │ │
│ │ ░░░░░░░░                        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────┐ ┌─────────────┐    │
│ │ ░░░░░░      │ │ ░░░░░░      │    │
│ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────┘
```

## 15. Error

```text
┌─────────────────────────────────────┐
│                ⚠                    │
│     Không thể tải dữ liệu            │
│ Vui lòng kiểm tra kết nối và thử lại│
│             [ Thử lại ]             │
└─────────────────────────────────────┘
```

## 16. Confirmation

```text
┌─────────────────────────────────────┐
│ Xóa học sinh?                       │
│ Hành động này không thể hoàn tác.   │
│ [ Hủy ]          [ Xóa ]            │
└─────────────────────────────────────┘
```

Mobile dùng Dialog/BottomSheet full-width khi phù hợp.

## 17. Navigation Behavior

### Admin Mobile
```text
Dashboard
Users
Classes
More
```

More:
```text
Điểm danh
Bảng điểm
Báo cáo
Thông báo
Cài đặt
Activity Log
```

### GLV
`Home | Lớp | Điểm danh | Điểm`

### Parent
`Home | Bảng điểm | Điểm danh | Thông báo`

## 18. Sticky Action Pattern

```text
┌─────────────────────────────────────┐
│ Scrollable content                  │
│                                     │
├─────────────────────────────────────┤
│ Context        PRIMARY ACTION       │
└─────────────────────────────────────┘
```

Áp dụng cho Score Entry, Attendance, Long Forms.

## 19. Grid Rules

Mobile:
```css
grid-template-columns: 1fr;
gap: 16px;
```

Tablet:
```css
grid-template-columns: repeat(2, 1fr);
gap: 16px–24px;
```

Desktop:
```css
grid-template-columns: repeat(4, 1fr);
```

Charts: mobile 1 column; desktop 2 columns.

## 20. Responsive Transformation Matrix

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Sidebar | Hidden | Drawer/compact | Persistent |
| BottomNav | Visible | Optional | Hidden |
| DataTable | Card/scroll | Table | Table |
| FilterBar | BottomSheet | Inline/Sheet | Inline |
| Modal | BottomSheet khi dài | Modal | Modal |
| KPI | 1 col | 2 col | 4 col |
| Chart | 1 col | 2 col | 2 col |
| Score rows | Card | Hybrid | Table |
| Parent score | Cards | Cards | Cards/2 col |
| GLV score | Cards | Table | Table |

## 21. Traceability

### Admin Dashboard
```text
AdminDashboard
├── Header
├── KPIGroup
│   └── StatCard × 4
├── ChartCard
│   └── AttendanceSummary
├── ChartCard
├── AlertCard
├── ActivityFeed
└── MobileBottomNav
```

### GLV Score Entry
```text
BulkScoreEntry
├── Header
├── ClassSelector
├── SubjectSelector
├── ExamTypeSelector
├── ScoreValidationSummary
├── ExcelUploader
├── ScoreTable
│   └── ScoreRow
│       └── ScoreInput
└── SaveBar
```

### Parent Score
```text
ParentGradeOverview
├── Header
├── ParentChildSwitcher
├── AcademicPeriodSelector
├── GPAHighlight
├── SubjectScoreCard × N
└── TeacherComment
```

## 22. Page-Level Contract

```text
PAGE-001 Mobile-first.
PAGE-002 375px không horizontal-scroll toàn trang.
PAGE-003 Page padding = 16px mobile.
PAGE-004 Primary action trong vùng dễ thao tác.
PAGE-005 Sticky action không che nội dung.
PAGE-006 Desktop/tablet mở rộng từ mobile layout.
PAGE-007 Business logic không phụ thuộc viewport.
PAGE-008 Chỉ presentation/layout thay đổi theo breakpoint.
PAGE-009 Component names phải khớp Component Library.
PAGE-010 Design tokens lấy từ 01_DesignSystem_Tokens.
```

## 23. Definition of Done

Wireframe phải cho Gemini xác định được:
- Layout hierarchy
- Mobile viewport
- Header/navigation placement
- Component placement
- Primary/sticky action
- Empty/loading/error/validation
- Parent-specific layout
- GLV-specific fast-input layout
- Responsive transformation
- Component traceability
