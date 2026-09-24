# 02 — SITEMAP & USER FLOWS

## 1. Architecture Overview

### User Roles

```text
SYSTEM
│
├── ADMIN
│   └── Quản trị toàn hệ thống
├── GLV — GIÁO LÝ VIÊN
│   └── Quản lý lớp / học sinh / điểm danh / điểm số
└── HS/PH — HỌC SINH / PHỤ HUYNH
    └── Xem kết quả học tập / điểm danh / thông báo
```

### Permission Matrix

| Module               | Admin |        GLV         |        HS/PH         |
| -------------------- | :---: | :----------------: | :------------------: |
| Dashboard            |   ✅   |         ✅          |          ✅           |
| Account              |   ✅   |    Xem profile     |     Xem profile      |
| Quản lý người dùng   |   ✅   |         ❌          |          ❌           |
| Quản lý lớp          |   ✅   | Theo lớp phân công |          ❌           |
| Quản lý học sinh     |   ✅   | Theo lớp phân công | Chỉ xem con/bản thân |
| Điểm danh            |   ✅   |         ✅          |         Xem          |
| Nhập điểm            |   ✅   |         ✅          |          ❌           |
| Xem bảng điểm        |   ✅   |         ✅          |          ✅           |
| Export Excel         |   ✅   |         ✅          |          ❌           |
| Thông báo            |   ✅   |         ✅          |          ✅           |
| Cài đặt hệ thống     |   ✅   |         ❌          |          ❌           |
| Audit / Activity Log |   ✅   |         ❌          |          ❌           |

## 2. Application Shell

```text
<AppShell>
├── <Header>
│   ├── Logo
│   ├── Page Title
│   ├── Notification
│   └── User Menu
├── <Navigation>
│   ├── Desktop Sidebar
│   └── Mobile Bottom Navigation
└── <MainContent>
```

Mobile bottom nav tối đa 5 mục; desktop dùng Sidebar.

## 3. Sitemap — ADMIN

```text
/admin
│
├── /dashboard
│
├── /users
│   ├── /students
│   │   ├── Danh sách
│   │   ├── /create
│   │   └── /:studentId
│   │       ├── Hồ sơ
│   │       ├── Kết quả học tập
│   │       ├── Điểm danh
│   │       └── Lịch sử
│   ├── /teachers
│   │   ├── Danh sách
│   │   ├── /create
│   │   └── /:teacherId
│   └── /parents
│       ├── Danh sách
│       ├── /create
│       └── /:parentId
│
├── /classes
│   ├── Danh sách
│   ├── /create
│   └── /:classId
│       ├── Tổng quan
│       ├── Học sinh
│       ├── Giáo lý viên
│       ├── Điểm danh
│       ├── Bảng điểm
│       └── Cấu hình lớp
│
├── /scores
│   ├── Tổng quan
│   ├── Theo lớp
│   ├── Theo môn / khối
│   ├── /entry
│   └── /export
│
├── /attendance
│   ├── Tổng quan
│   ├── Theo lớp
│   ├── Theo ngày
│   └── Báo cáo
│
├── /notifications
│   ├── Danh sách
│   ├── /create
│   └── /:notificationId
│
├── /reports
│   ├── Báo cáo học tập
│   ├── Báo cáo điểm danh
│   └── Export Excel
│
├── /settings
│   ├── Thông tin giáo xứ / đoàn
│   ├── Năm học
│   ├── Khối / lớp
│   ├── Môn / chương trình học
│   ├── Quy tắc điểm
│   ├── Quyền & vai trò
│   └── Cấu hình thông báo
│
├── /activity-log
└── /profile
```

### Admin Sidebar

```text
┌──────────────────────────┐
│ ✝  ĐOÀN KITÔ VUA         │
│    Quản lý Giáo lý       │
├──────────────────────────┤
│ 🏠 Dashboard              │
│                          │
│ QUẢN LÝ                  │
│ 👥 Người dùng             │
│ 🏫 Lớp học                │
│ 📋 Học sinh               │
│                          │
│ HỌC TẬP                  │
│ ✅ Điểm danh              │
│ 📝 Bảng điểm              │
│ 📊 Báo cáo                │
│                          │
│ TRUYỀN THÔNG             │
│ 🔔 Thông báo              │
│                          │
│ HỆ THỐNG                 │
│ ⚙ Cài đặt                 │
│ 🕘 Activity Log            │
└──────────────────────────┘
```

## 4. Sitemap — GLV

```text
/teacher
│
├── /dashboard
├── /classes
│   ├── Lớp của tôi
│   └── /:classId
│       ├── Tổng quan
│       ├── Học sinh
│       ├── Điểm danh
│       ├── Nhập điểm
│       ├── Bảng điểm
│       └── Thống kê lớp
├── /attendance
│   ├── Điểm danh hôm nay
│   ├── Lịch sử điểm danh
│   └── Báo cáo
├── /scores
│   ├── Nhập điểm
│   ├── Bảng điểm
│   ├── Lịch sử chỉnh sửa
│   └── Export Excel
├── /students
│   ├── Danh sách
│   └── /:studentId
│       ├── Hồ sơ
│       ├── Điểm
│       └── Điểm danh
├── /notifications
└── /profile
```

GLV chỉ nhìn thấy dữ liệu thuộc lớp/khối được phân công.

### GLV Mobile Bottom Navigation

```text
┌─────────────────────────────────┐
│ 🏠       👥       ✅       📝    │
│ Home     Lớp    Điểm danh   Điểm│
└─────────────────────────────────┘
```

`Điểm danh` và `Nhập điểm` phải truy cập được trong tối đa 1 thao tác từ Dashboard.

## 5. Sitemap — Học sinh / Phụ huynh

```text
/home
│
├── /dashboard
├── /learning
│   ├── Bảng điểm
│   ├── Điểm từng môn
│   ├── Kết quả theo kỳ
│   └── Thành tích
├── /attendance
│   ├── Lịch sử đi học
│   └── Thống kê chuyên cần
├── /notifications
│   ├── Thông báo chung
│   └── Thông báo cá nhân
├── /achievements
│   ├── Huy hiệu
│   ├── XP
│   ├── Level
│   └── Streak
└── /profile
```

Parent không nhìn thấy các module quản trị như Users, Export, Settings.

### Parent Navigation

```text
🏠 Trang chủ
📊 Bảng điểm
✅ Điểm danh
🔔 Thông báo
☰ Thêm
```

## 6. Parent Child Switcher

Nếu một phụ huynh có nhiều con:

```text
┌─────────────────────────────┐
│ Con đang xem                │
│ 👦 Nguyễn Văn A         ▼   │
└─────────────────────────────┘
```

Switch child phải refresh dashboard/score/attendance/notification context.

## 7. Route Guard

```text
AUTHENTICATED USER
       │
       ▼
  GET USER ROLE
       │
 ┌─────┼─────────┐
 ▼     ▼         ▼
ADMIN  GLV     HS/PH
 │      │         │
 ▼      ▼         ▼
/admin /teacher  /home
```

Pseudo logic:

```text
if !authenticated
    → /login

else if role == ADMIN
    → /admin/dashboard

else if role == GLV
    → /teacher/dashboard

else if role == STUDENT
    → /dashboard

else if role == PARENT
    → /dashboard
```

Unauthorized:

```text
/403
→ "Bạn không có quyền truy cập trang này."
→ [Quay về trang chủ]
```

## 8. Core User Flow #1 — GLV Điểm Danh Nhanh

### Entry

```text
Dashboard
  ↓
[Điểm danh hôm nay]

HOẶC

Lớp của tôi
  ↓
Chọn lớp
  ↓
[Điểm danh]
```

### Main flow

```text
Dashboard GLV
      ↓
Điểm danh hôm nay
      ↓
Chọn lớp
      ↓
Danh sách học sinh
      ↓
Gán status
      ↓
[Lưu điểm danh]
      ↓
Confirmation
      ↓
Đã lưu thành công
```

Attendance status:

```ts
PRESENT
ABSENT
EXCUSED
LATE
```

### One-touch operation

```text
Có mặt
  ↓ tap
Vắng
  ↓ tap
Có phép
  ↓ tap
Đi muộn
```

Bulk actions:

```text
Đánh dấu tất cả Có mặt
Đánh dấu tất cả Vắng
Reset
```

Save summary:

```text
Tổng: 32
🟢 Có mặt 27
🔴 Vắng 3
🟡 Có phép 1
🟠 Đi muộn 1
```

Network error không được reset toàn bộ dữ liệu local.

## 9. Core User Flow #2 — Nhập Điểm Hàng Loạt

```text
Dashboard
 ↓
Lớp của tôi
 ↓
Chọn lớp
 ↓
Chọn môn
 ↓
Chọn loại điểm
 ↓
Bảng nhập điểm
 ↓
Validation
 ↓
[Lưu tất cả]
 ↓
Success / Error
```

### Keyboard flow

Desktop/tablet:
```text
Input → Enter/Tab → Next Student
```

Mobile:
```text
Tap ScoreInput → Numeric Keyboard → Next → Next Student
```

Không mở modal cho từng học sinh.

### Validation

Thang điểm 10:

```text
0 <= Score <= 10
```

Không hợp lệ:

```text
-1
11
abc
empty nếu bắt buộc
```

Error inline, không dùng modal.

### Unsaved draft

```text
⚠ Có thay đổi chưa lưu
[Tiếp tục chỉnh sửa]
[Lưu]
```

Rời trang phải cảnh báo unsaved changes.

## 10. Excel Import

```text
Nhập điểm
   ↓
[Import Excel]
   ↓
Upload
   ↓
Validate columns
   ↓
Preview
   ↓
Highlight errors
   ↓
[Import]
   ↓
Success
```

Preview:

```text
✓ 28 dòng hợp lệ
⚠ 2 dòng lỗi

Dòng 12 — Điểm > 10
Dòng 19 — Không tìm thấy HS

[Hủy] [Import hợp lệ]
```

## 11. Core User Flow #3 — Parent Xem Điểm & Thông Báo

```text
Login
  ↓
Authentication
  ↓
Role = PARENT
  ↓
Dashboard
```

### Score flow

```text
Trang chủ
 ↓
Kết quả học tập
 ↓
Bảng điểm
```

Information priority:

```text
1. Học sinh
2. Kỳ / năm học
3. Điểm trung bình
4. Danh sách môn
5. Chi tiết điểm
6. Nhận xét
```

### Notification flow

```text
Dashboard
 ↓
🔔 Thông báo
 ↓
Notification List
 ↓
Notification Detail
```

Types:

```text
GENERAL
CLASS
STUDENT
SYSTEM
URGENT
```

Priority ordering for display:
`URGENT → STUDENT → CLASS → GENERAL`

## 12. Global Navigation

### Desktop

```text
Sidebar → Module → Page → Detail
```

### Mobile

```text
Bottom Navigation → Primary Page → Inline/Drawer/Sheet → Detail
```

Mục tiêu:
- Primary feature ≤ 2 taps
- Secondary feature ≤ 3 taps
- Admin setting ≤ 4 taps

## 13. Page Hierarchy

```text
<AppShell>
├── Header
├── Breadcrumb (Desktop/Admin)
├── PageHeader
├── PrimaryAction
├── Filters
├── MainContent
└── Feedback / Pagination
```

## 14. Data Ownership

```text
ADMIN
└── ALL ORGANIZATION DATA

GLV
└── ASSIGNED CLASSES
    ├── Students
    ├── Attendance
    └── Scores

PARENT
└── LINKED STUDENTS ONLY

STUDENT
└── SELF DATA ONLY
```

## 15. Search & Filters

Danh sách lớn:
```text
Search + Filter + Sort + Pagination
```

Mobile:
```text
Search
[ Bộ lọc ]
```

Filter mở BottomSheet.

## 16. URL Convention

lowercase + kebab/resource hierarchy:

```text
/dashboard
/classes
/classes/:classId
/classes/:classId/students
/classes/:classId/attendance
/classes/:classId/scores
/students
/students/:studentId
/attendance
/scores
/notifications
/reports
/settings
```

Query params dành cho:
`filter`, `search`, `sort`, `page`, `date`

Ví dụ:
```text
/classes/7a/attendance?date=2026-09-24
```

## 17. Loading / Empty / Error

Mỗi module có:
```text
LOADING
SUCCESS
ERROR
EMPTY
```

Loading dùng Skeleton. Error có Retry. Empty có message/action phù hợp.

## 18. Dashboard Priority

| Priority | Admin | GLV | Parent | Student |
|---|---|---|---|---|
| Hệ thống | ★★★ | ★ | — | — |
| Lớp | ★★ | ★★★ | ★ | ★ |
| Điểm danh | ★★ | ★★★ | ★★ | ★★ |
| Điểm số | ★★ | ★★★ | ★★★ | ★★★ |
| Thông báo | ★★ | ★★ | ★★★ | ★★ |
| Gamification | — | ★ | ★ | ★★★ |

## 19. Navigation Contract

Frontend phải theo:

```text
AUTH
  ↓
ROLE RESOLUTION
  ↓
APP SHELL
  ↓
ROLE NAVIGATION
  ↓
MODULE
  ↓
RESOURCE
  ↓
DETAIL / ACTION
```

UI component không tự quyết định quyền; quyền nằm ở Auth/Permission Layer + Route Guard + Navigation Resolver.
