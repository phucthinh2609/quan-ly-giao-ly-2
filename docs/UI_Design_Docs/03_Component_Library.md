# 03 — COMPONENT LIBRARY

## 1. Architecture

```text
TIER 0 — DESIGN TOKENS
    ↓
TIER 1 — PRIMITIVES
    ↓
TIER 2 — COMPOSITE UI
    ↓
TIER 3 — APP SHELL
    ↓
TIER 4 — DOMAIN COMPONENTS
    ↓
TIER 5 — FEATURE COMPONENTS
```

### Tier 1
`Button`, `IconButton`, `Input`, `Select`, `Checkbox`, `Radio`, `Badge`, `Avatar`, `Divider`, `Spinner`

### Tier 2
`SearchBar`, `FilterBar`, `PageHeader`, `StatCard`, `EmptyState`, `ErrorState`, `DataTable`, `Pagination`, `Modal`, `BottomSheet`, `Toast`

### Tier 3
`Header`, `Sidebar`, `MobileBottomNav`, `Breadcrumb`, `AppShell`

### Tier 4
`StudentCard`, `StudentRow`, `AttendanceRow`, `AttendanceSummary`, `ScoreInput`, `ScoreRow`, `ScoreTable`, `ClassCard`, `NotificationCard`, `NotificationList`, `AchievementBadge`, `ParentChildSwitcher`

### Tier 5
`AttendancePage`, `BulkScoreEntry`, `ParentGradeOverview`, `AdminDashboard`, `TeacherDashboard`, `ParentDashboard`

## 2. Naming

Component: `PascalCase`

```tsx
<StudentCard />
<AttendanceRow />
<ScoreInput />
```

Props: `camelCase`

Events: `on + Verb`

```text
onClick
onChange
onSubmit
onSave
onDelete
onSelect
onRetry
onDismiss
```

## 3. State Model

```ts
type AsyncStatus = "idle" | "loading" | "success" | "error";

type ValidationState = "default" | "valid" | "invalid";

type InteractiveState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled";
```

## 4. Button

```tsx
<Button
  variant="primary"
  size="md"
  loading={false}
  disabled={false}
  fullWidth={false}
  leftIcon={<Plus />}
  rightIcon={<ArrowRight />}
  onClick={handleClick}
>
  Thêm học sinh
</Button>
```

Props:
- `variant`: primary | secondary | outline | ghost | danger
- `size`: sm | md | lg | parent
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `leftIcon`, `rightIcon`
- `type`
- `onClick`

States: Default, Hover, Focus, Active, Disabled, Loading.

Loading giữ nguyên kích thước button.

## 5. IconButton

Dùng cho Notification, More, Close, Back, Edit, Delete.

Bắt buộc:
```tsx
aria-label="Đóng"
```

States: Default, Hover, Focus, Active, Disabled.

## 6. Input

```tsx
<Input
  label="Họ và tên"
  placeholder="Nhập họ tên"
  value={name}
  error={error}
  helperText="Nhập đầy đủ họ tên"
  required
  onChange={handleChange}
/>
```

```ts
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  type?: "text" | "number" | "email" | "password" | "date";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onChange: (value: string) => void;
}
```

States: Default, Hover, Focus, Filled, Disabled, Readonly, Error.

## 7. NumericInput

```tsx
<NumericInput
  value={score}
  min={0}
  max={10}
  step={0.5}
  onChange={setScore}
/>
```

Mobile mở numeric keyboard; validate range; không tự làm tròn nếu chưa cấu hình.

States: Empty, Valid, Invalid, Focus, Disabled.

## 8. Select

```tsx
<Select
  label="Chọn lớp"
  value={classId}
  options={classes}
  placeholder="Chọn lớp"
  onChange={setClassId}
/>
```

States: Default, Open, Focus, Selected, Disabled, Error.

Mobile → BottomSheet. Desktop → Dropdown.

## 9. Checkbox / Badge / Avatar

Checkbox states:
`UNCHECKED`, `CHECKED`, `INDETERMINATE`, `DISABLED`, `FOCUS`.

Badge variants:
`neutral`, `primary`, `success`, `warning`, `error`, `info`, `gold`.

Avatar fallback dùng initials, không hiển thị broken image.

## 10. AppShell

```text
<AppShell>
├── <Header />
├── <DesktopSidebar />
├── <MainContent />
└── <MobileBottomNav />
```

Props:
```ts
interface AppShellProps {
  role: UserRole;
  children: ReactNode;
}
```

Mobile = Header + Content + BottomNav; Desktop = Header + Sidebar + Content.

## 11. Header

```text
<Header>
├── MobileMenuButton
├── PageTitle
├── NotificationButton
└── UserMenu
```

Props:
```ts
interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  notificationCount?: number;
  user?: User;
  onBack?: () => void;
  onNotificationClick?: () => void;
}
```

States: Default, Scrolled, Loading.

## 12. Sidebar

```tsx
<Sidebar role="ADMIN" items={navigation} />
```

Item states: Default, Hover, Active, Disabled.

Active item phải có background + icon/text emphasis, không chỉ dựa vào màu.

## 13. MobileBottomNav

Admin:
```text
Dashboard | Users | Classes | More
```

GLV:
```text
Home | Lớp | Điểm danh | Điểm
```

Parent/Student:
```text
Home | Bảng điểm | Điểm danh | Thông báo
```

Tối đa 5 items; active state rõ; icon + label; touch target ≥44px; support iPhone safe-area.

## 14. PageHeader

```tsx
<PageHeader
  title="Danh sách học sinh"
  description="Quản lý học sinh trong lớp"
  actions={<Button>Thêm học sinh</Button>}
/>
```

Structure:
`Back → Breadcrumb → Title → Description → Actions`

## 15. SearchBar / FilterBar

SearchBar props:
```ts
value: string;
placeholder?: string;
onChange: (value: string) => void;
onClear?: () => void;
```

Default debounce = 300ms.

FilterBar:
- Desktop = inline filters
- Mobile = Search + `[Bộ lọc]`, mở BottomSheet

## 16. StatCard

```tsx
<StatCard
  title="Tổng học sinh"
  value={128}
  icon={<Users />}
  trend="+5%"
  trendType="positive"
/>
```

Props:
`title`, `value`, `icon`, `trend`, `trendType`, `loading`

States: Default, Loading, Error.

## 17. DataTable / Pagination

DataTable:
```text
Desktop → Table
Mobile → Card/horizontal scroll
```

Pagination mobile:
```text
[←] 1 / 10 [→]
```

Desktop:
```text
[←] [1] [2] [3] ... [10] [→]
```

## 18. Modal / BottomSheet / Toast / States

Modal dành cho Confirmation và CRUD nhỏ; không dùng cho nhập điểm từng học sinh.

BottomSheet dành cho Mobile Filter/Select/Action/short detail.

Toast variants:
`SUCCESS`, `ERROR`, `WARNING`, `INFO`

EmptyState có icon + title + description + action khi phù hợp.

Loading ưu tiên Skeleton; Spinner dành cho button/local async.

ErrorState có Retry.

## 19. Student Components

### StudentCard

```text
<StudentCard>
├── Avatar
├── StudentInfo
├── ClassBadge
├── AttendanceStatus
├── ScoreSummary
└── Action
```

Props:
```ts
interface StudentCardProps {
  student: Student;
  showScore?: boolean;
  showAttendance?: boolean;
  showAction?: boolean;
  onClick?: () => void;
}
```

States: Default, Hover, Active, Selected, Disabled.

### StudentRow

```ts
interface StudentRowProps {
  student: Student;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
}
```

### StudentSelector

Features:
`Search`, `Select All`, `Individual Select`, `Selected Count`, `Clear`

## 20. ClassCard

```text
<ClassCard>
├── ClassName
├── Grade
├── StudentCount
├── Teacher
├── AttendanceSummary
└── ViewAction
```

States: Default, Hover, Active, Disabled.

## 21. Attendance Components

Canonical state:
```ts
type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "EXCUSED"
  | "LATE";
```

| State | Label |
|---|---|
| PRESENT | Có mặt |
| ABSENT | Vắng |
| EXCUSED | Có phép |
| LATE | Đi muộn |

### AttendanceRow

```text
<AttendanceRow>
├── StudentAvatar
├── StudentName
├── StudentCode
├── AttendanceStatus
└── QuickAction
```

Props:
```ts
interface AttendanceRowProps {
  student: Student;
  status: AttendanceStatus;
  disabled?: boolean;
  onStatusChange: (
    studentId: string,
    status: AttendanceStatus
  ) => void;
}
```

States: Default, Selected, Pending, Saved, Error, Disabled.

### AttendanceQuickToggle

Cho phép one-touch cycle, nhưng menu đầy đủ vẫn phải cho phép chọn trực tiếp.

### AttendanceSummary

```text
Tổng 32
Có mặt 27
Vắng 3
Có phép 1
Đi muộn 1
```

### AttendanceBulkAction

```text
MarkAllPresent
MarkAllAbsent
Reset
Save
```

Nếu chưa có thay đổi → Save disabled. Có thay đổi → active. Saving → loading. Saved → success. Error → retry.

## 22. Score Components

### ScoreInput

```tsx
<ScoreInput
  value={8.5}
  min={0}
  max={10}
  step={0.5}
  onChange={setValue}
  error={error}
/>
```

States:
`EMPTY`, `FOCUS`, `VALID`, `INVALID`, `DISABLED`, `SAVED`, `DIRTY`

### ScoreRow

```text
<ScoreRow>
├── StudentPosition
├── StudentIdentity
├── ScoreInput
├── PreviousScore
└── ValidationMessage
```

### ScoreTable

```ts
interface ScoreTableProps {
  students: Student[];
  scores: ScoreEntry[];
  onScoreChange: (
    studentId: string,
    score: number | null
  ) => void;
  readOnly?: boolean;
}
```

States: Loading, Ready, Dirty, Validating, Error, Saving, Saved.

### ScoreHeader

`ClassSelector + SubjectSelector + ExamTypeSelector + ImportExcelButton + SaveButton`

### ScoreValidationSummary

Lỗi click được → scrollIntoView → focus ScoreInput.

## 23. Excel Components

### ExcelUploader

Accept `.xlsx,.xls`

States:
`IDLE`, `DRAGGING`, `UPLOADING`, `PARSING`, `SUCCESS`, `ERROR`

Mobile chỉ cần `[Chọn file Excel]`.

### ExcelPreview

`FileInfo + ValidCount + ErrorCount + PreviewTable + ActionBar`

## 24. Notification Components

### NotificationCard

```text
<NotificationCard>
├── TypeIcon
├── Title
├── Preview
├── Timestamp
├── UnreadIndicator
└── Chevron
```

States: Unread, Read, Hover, Active, Disabled.

### NotificationList

Features:
`Unread filter`, `Category filter`, `Pagination`, `Mark all as read`

### NotificationDetail

`Title + Category + PublishedAt + Content + Attachment + RelatedAction`

## 25. Dashboard Components

### KPIGroup

Mobile 1 column → Tablet 2 columns → Desktop 4 columns.

### ChartCard

States: Loading, Ready, Empty, Error.

### ActivityFeed

Hiển thị User + Action + Target + Time.

## 26. Gamification

### AchievementBadge

States:
`LOCKED`, `AVAILABLE`, `UNLOCKED`, `NEW`

Locked = muted/grayscale; Unlocked = full color; New = subtle notification.

### XPProgress

```text
Level 5
████████████░░░ 860/1000
140 XP để lên Level 6
```

Props:
```ts
level: number;
currentXP: number;
nextLevelXP: number;
```

## 27. Parent Components

### ParentChildSwitcher

```tsx
<ParentChildSwitcher
  children={linkedStudents}
  selectedChildId={selectedChildId}
  onChange={setSelectedChildId}
/>
```

States: Default, Open, Selected, Loading, Error.

Đổi child phải refresh dashboard/score/attendance/notification context.

### ParentGradeOverview

```text
<ParentGradeOverview>
├── ParentChildSwitcher
├── AcademicPeriodSelector
├── GPAHighlight
├── SubjectSummaryList
└── TeacherComment
```

### SubjectScoreCard

```text
┌──────────────────────────────┐
│ 📖 Giáo lý                   │
│ Điểm TB                8.5   │
│ GK 8.0   CK 9.0              │
└──────────────────────────────┘
```

### AttendanceSummaryCard

```text
Chuyên cần
18 / 20 buổi
████████████████░░ 90%
Vắng: 2
```

## 28. Form / Confirmation

`FormSection`, `FormActions`, `ConfirmDialog`

Validation:
```ts
interface FieldState<T> {
  value: T;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  error?: string;
}
```

Error hiển thị sau blur hoặc submit.

Delete flow:
```text
Delete → ConfirmDialog → Confirm → Loading → Success/Error
```

## 29. Permission Components

```tsx
<PermissionGate permission="score:update">
  <ScoreInput />
</PermissionGate>
```

Permission keys dạng:
```text
resource:action

student:view
student:create
student:update
student:delete
attendance:view
attendance:create
attendance:update
score:view
score:create
score:update
score:export
notification:view
notification:create
user:view
user:create
user:update
user:delete
settings:view
settings:update
```

## 30. Feature Component Trees

### AttendancePage

```text
<AttendancePage>
├── <PageHeader />
├── <AttendanceDateSelector />
├── <ClassSelector />
├── <AttendanceSummary />
├── <AttendanceBulkAction />
├── <AttendanceList>
│   └── <AttendanceRow />
├── <SaveBar />
└── <Toast />
```

### BulkScoreEntry

```text
<BulkScoreEntry>
├── <PageHeader />
├── <ScoreHeader />
├── <ScoreValidationSummary />
├── <ScoreTable />
│   └── <ScoreRow />
│       └── <ScoreInput />
├── <SaveBar />
├── <ExcelUploader />
└── <Toast />
```

### ParentDashboard

```text
<ParentDashboard>
├── <Header />
├── <ParentChildSwitcher />
├── <WelcomeSummary />
├── <ParentGradeOverview />
├── <AttendanceSummaryCard />
├── <NotificationPreview />
└── <ParentBottomNav />
```

### AdminDashboard

```text
<AdminDashboard>
├── <PageHeader />
├── <KPIGroup />
├── <AttendanceChartCard />
├── <ScoreChartCard />
├── <ClassOverview />
├── <ActivityFeed />
└── <NotificationPreview />
```

### TeacherDashboard

```text
<TeacherDashboard>
├── <PageHeader />
├── <QuickActionGrid />
│   ├── Điểm danh
│   └── Nhập điểm
├── <MyClassList />
├── <AttendanceSummary />
├── <UpcomingNotification />
└── <ActivityFeed />
```

## 31. Critical GLV Components

### Attendance SaveBar

```text
┌────────────────────────────────┐
│ 31/32 đã cập nhật     [LƯU]   │
└────────────────────────────────┘
```

States:
`NO_CHANGES`, `DIRTY`, `SAVING`, `SAVED`, `ERROR`

### Score SaveBar
Tương tự, hiển thị số thay đổi chưa lưu.

## 32. State Matrix

| Component | Default | Hover | Focus | Active | Disabled | Loading | Error |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| IconButton | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Input | ✅ | ✅ | ✅ | — | ✅ | — | ✅ |
| Select | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Checkbox | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| AttendanceRow | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ScoreInput | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| StudentCard | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| NotificationCard | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Modal | — | — | ✅ | — | — | ✅ | ✅ |

## 33. Smart vs Dumb

Presentational:
`Button`, `Badge`, `Avatar`, `StudentCard`, `AttendanceRow`, `ScoreInput`

Smart:
`AttendancePage`, `BulkScoreEntry`, `AdminDashboard`, `ParentDashboard`

Page/Smart chịu trách nhiệm fetch/state/mutation/permission/navigation.

## 34. Folder Convention

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── student/
│   ├── attendance/
│   ├── score/
│   ├── class/
│   ├── notification/
│   ├── dashboard/
│   └── gamification/
├── pages/
│   ├── admin/
│   ├── teacher/
│   └── parent/
├── hooks/
├── services/
├── stores/
├── types/
├── utils/
└── routes/
```

Dependency direction:

```text
Tokens
 ↓
UI Primitives
 ↓
Composite UI
 ↓
Domain Components
 ↓
Feature Components
 ↓
Pages
```

## 35. Component Generation Contract

```text
1. Không hard-code design token.
2. Không hard-code quyền trong UI component.
3. Business component nhận data qua props.
4. Page component quản lý API/state/navigation.
5. Mọi mutation có loading/success/error.
6. Mọi form có validation.
7. Mobile layout là default.
8. Parent UI sử dụng density riêng.
9. GLV UI tối ưu tốc độ nhập liệu.
10. Student UI có gamification nhưng không ảnh hưởng academic data.
```
