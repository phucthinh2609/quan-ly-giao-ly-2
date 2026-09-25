# 02 — SITEMAP & USER FLOWS v2

## 1. Architecture Overview

### User Roles

```text
SYSTEM
│
├── PUBLIC (chưa đăng nhập)
│   └── /welcome · /login
├── ADMIN
│   └── Quản trị toàn hệ thống
├── GLV — GIÁO LÝ VIÊN
│   └── Quản lý lớp / học sinh / điểm danh / điểm số
├── PARENT — PHỤ HUYNH
│   └── Theo dõi con: điểm, chuyên cần, thông báo, thành tích
└── STUDENT — HỌC SINH
    └── Góc của em: điểm, chuyên cần, huy hiệu, thông báo
```

### Permission Matrix

| Module | Admin | GLV | Phụ huynh / Học sinh |
|---|:---:|:---:|:---:|
| Dashboard | Có | Có | Có |
| Account / Profile | Có | Xem | Xem |
| Quản lý người dùng | Có | Không | Không |
| Quản lý lớp | Có | Lớp phân công | Không |
| Quản lý học sinh | Có | Lớp phân công | Chỉ con / bản thân |
| Điểm danh | Có | Có | Xem |
| Nhập điểm | Có | Có | Không |
| Xem bảng điểm | Có | Có | Có |
| Export Excel | Có | Có | Không |
| Thông báo | Có | Có | Có |
| Cài đặt hệ thống | Có | Không | Không |
| Audit / Activity Log | Có | Không | Không |
| Cài đặt cá nhân (Giao diện, Cỡ chữ) | Có | Có | Có |

## 2. Application Shell v2

```text
<PreferencesProvider>          theme + textSize + demoMode (localStorage)
└── <AuthProvider>
    └── <RouterProvider>
        ├── PUBLIC  (!isAuthenticated)
        │   ├── /welcome  → <WelcomePage />   (Marketing surface, AIDA)
        │   └── /login    → <LoginPage />     (chọn vai trò)
        └── APP     (isAuthenticated)
            └── <AppShell data-role={role}>
                ├── <Sidebar />           lg+  (floating, thu gọn được)
                ├── <Header />            sticky glass
                ├── <main>  page enter motion
                └── <MobileBottomNav />   < lg (floating pill)
        <DemoPanel />                     nút nổi, mọi màn hình
```

- Mobile bottom nav tối đa 5 mục, luôn có nhãn chữ.
- Sidebar hiện từ `lg` (1024px); tablet dọc dùng bottom nav.

## 3. Public surface

```text
/welcome
├── Nav (glass pill): Logo · Tính năng · Vai trò · Hành trình · [Đăng nhập]
├── Hero (Editorial Split)
├── Marquee khối lớp
├── Bento tính năng
├── Card stacking theo vai trò (Học sinh · Phụ huynh · GLV)
├── Đoạn văn sứ mệnh (scrub reveal)
├── Role accordion "Bạn là ai?" → đăng nhập nhanh
└── CTA lớn + Footer

/login
├── Panel thương hiệu (ảnh + trích dẫn)
└── 4 ô vai trò lớn: Học sinh · Phụ huynh · Giáo lý viên · Quản trị
    → login(role) → điều hướng về trang chủ của vai trò
```

Ghi chú: xác thực hiện tại là **demo** (chọn vai trò). Khi có backend, `/login` thêm form tài khoản; luồng chọn vai trò giữ cho tài khoản nhiều vai trò.

## 4. Sitemap — ADMIN

```text
/admin
├── /dashboard           Bento: KPI · Điểm danh hôm nay · Học tập · Cảnh báo · Hoạt động
├── /users               Người dùng (GLV, Phụ huynh, Học sinh) — tạo / xóa
├── /classes             → /classes/:classId (Tổng quan · Học sinh · Điểm danh · Bảng điểm)
├── /students            → /students/:studentId (Hồ sơ · Kết quả · Điểm danh)
├── /attendance          Điểm danh toàn đoàn
├── /scores              Bảng điểm / nhập điểm
├── /reports             Báo cáo + Export Excel
├── /notifications       Danh sách + tạo thông báo
├── /settings            Giáo xứ · Năm học · Quy tắc điểm
└── /activity-log        Nhật ký hoạt động
```

### Admin Sidebar (sentence case, không emoji)

```text
┌──────────────────────────────┐
│ [Logo] Đoàn Kitô Vua         │
│        Gx. Đức Mẹ HCG        │
├──────────────────────────────┤
│ Tổng quan                    │
│   [Home]      Dashboard      │
│ Quản lý                      │
│   [Users]     Người dùng     │
│   [School]    Lớp học        │
│   [Grad]      Học sinh       │
│ Học tập                      │
│   [Check]     Điểm danh      │
│   [Sheet]     Bảng điểm      │
│   [Chart]     Báo cáo        │
│ Truyền thông                 │
│   [Bell]      Thông báo   3  │
│ Hệ thống                     │
│   [Gear]      Cài đặt        │
│   [History]   Nhật ký        │
├──────────────────────────────┤
│ [Avatar] Phêrô Trần  Admin   │
└──────────────────────────────┘
```

### Admin Mobile Bottom Nav

`Tổng quan | Người dùng | Lớp học | Thông báo | Thêm` — "Thêm" mở sheet: Học sinh · Điểm danh · Bảng điểm · Báo cáo · Cài đặt · Nhật ký.

## 5. Sitemap — GLV

```text
/teacher
├── /dashboard      Hero "Buổi học tới" + CTA Điểm danh / Nhập điểm
├── /classes        Lớp của tôi → /classes/:classId
├── /attendance     Điểm danh hôm nay
├── /scores         Nhập điểm
├── /students       Học sinh lớp phụ trách → /students/:studentId
└── /notifications  Thông báo
```

GLV chỉ thấy dữ liệu lớp/khối được phân công.

### GLV Mobile Bottom Nav (nút trung tâm nổi)

```text
╭──────────────────────────────────────────────╮
│  Trang chủ   Lớp    ( ĐIỂM DANH )  Điểm  Thông báo │
╰──────────────────────────────────────────────╯
                       ↑ nút tròn đỏ nổi, shadow-glow
```

`Điểm danh` luôn 1 chạm từ mọi màn hình GLV; `Nhập điểm` 1 chạm từ Dashboard.

## 6. Sitemap — Phụ huynh

```text
/dashboard                Trang chủ: chip chọn con · "Tuần này của con" · lối tắt · thông báo mới
/parent/scores            Bảng điểm con (kỳ học, điểm TB, môn, nhận xét)
/parent/attendance        Lịch sử điểm danh (tỷ lệ, timeline)
/parent/notifications     Thông báo (khẩn ghim trên cùng)
/parent/achievements      Thành tích của con
```

Parent Bottom Nav: `Trang chủ | Bảng điểm | Điểm danh | Thông báo`

## 7. Sitemap — Học sinh

```text
/dashboard | /student/portal   Góc của em: Level · XP · chuỗi · nhiệm vụ · huy hiệu mới
/student/scores                Điểm của em (sao + từ ngữ dễ hiểu)
/student/attendance            Chuyên cần (lịch Chúa Nhật dạng chấm)
/student/achievements          Kệ huy hiệu + XP
/student/notifications         Thông báo
```

Student Bottom Nav: `Nhà của em | Điểm | Huy hiệu | Thông báo`

## 8. Child Switcher (Phụ huynh)

```text
┌─────────────────────────────────────┐
│ ( [ảnh] An  ) ( [ảnh] Bình )        │  chip ngang, 1 chạm, chip đang chọn nền night
└─────────────────────────────────────┘
```

- ≤ 4 con: chip ngang cuộn được.
- > 4 con: nút "Chọn con" mở BottomSheet.
- Đổi con → làm mới dashboard / điểm / điểm danh / thông báo; hiển thị skeleton, không chớp trắng.

## 9. Route Guard v2

```text
Mở app
  │
  ▼
isAuthenticated?
  ├── Không → /welcome  (các route app → chuyển về /welcome)
  └── Có    → ROLE RESOLUTION
               ├── ADMIN   → /admin/dashboard
               ├── GLV     → /teacher/dashboard
               ├── PARENT  → /dashboard
               └── STUDENT → /dashboard (Góc của em)
```

Đã đăng nhập mà vào `/welcome` hoặc `/login` → chuyển về trang chủ vai trò.
Không đủ quyền → `<Forbidden403>`: "Trang này dành cho vai trò khác." + [Về trang chủ].

## 10. Core Flow #1 — GLV Điểm danh nhanh v2

```text
Bất kỳ màn hình GLV
      ↓  chạm nút trung tâm "Điểm danh"
Màn Điểm danh (lớp mặc định = lớp phụ trách, ngày = hôm nay)
      ↓
[Nếu có nháp] Banner: "Có bản nháp lúc 08:12 — Khôi phục | Bỏ qua"
      ↓
Chạm "Có mặt tất cả"  →  Toast "Đã đánh dấu 32 em có mặt · Hoàn tác"
      ↓
Chạm từng em vắng/muộn:
   mobile   : chạm chip trạng thái → xoay vòng Có mặt → Vắng → Có phép → Đi muộn
              chạm "..." → menu chọn trực tiếp
   tablet+  : phân đoạn 4 nút, chọn trực tiếp 1 chạm
      ↓   (mỗi thay đổi: rung nhẹ + lưu nháp tự động)
SaveBar: vòng tiến độ + "3 vắng · 1 muộn" + [Lưu điểm danh]
      ↓
Đang lưu (nút loading, giữ kích thước)
      ↓
Thành công → toast + xóa nháp     |   Lỗi mạng → giữ dữ liệu, SaveBar "Thử lại"
```

Tìm & lọc trong danh sách: ô tìm tên; chip lọc `Tất cả · Chưa có mặt · Vắng · Có phép · Đi muộn`.

## 11. Core Flow #2 — Nhập điểm hàng loạt v2

```text
Dashboard → [Nhập điểm]  (hoặc Lớp → Nhập điểm)
      ↓
Thanh chọn: Lớp · Môn · Loại điểm  (segmented cho Loại điểm)
      ↓
Bảng nhập (desktop: bảng sticky header; mobile: thẻ)
      ↓
Nhập điểm:
   Enter / Tab / ↓ → em kế tiếp     ↑ → em trước     Esc → bỏ focus
   Mobile: bàn phím số + dải chip điền nhanh 10 · 9 · 8 · 7 · 6 · 5
      ↓   (validate inline 0–10, bước 0.25; nháp tự động)
Tóm tắt lỗi (chạm → cuộn + focus ô lỗi)
      ↓
SaveBar: "25/28 đã nhập · 2 lỗi" + [Lưu tất cả]
```

Rời trang khi còn thay đổi → hộp thoại "Còn N thay đổi chưa lưu" [Ở lại] [Lưu rồi rời] [Bỏ thay đổi].

## 12. Excel Import

```text
[Nhập từ Excel] → Sheet 3 bước:
  1. Chọn file (.xlsx, .xls)   kéo-thả trên desktop, nút lớn trên mobile
  2. Kiểm tra: "28 dòng hợp lệ · 2 dòng lỗi" + danh sách lỗi theo dòng
  3. [Hủy]  [Nhập 28 dòng hợp lệ]
```

## 13. Core Flow #3 — Phụ huynh

```text
Đăng nhập → Trang chủ
  ├── Chip chọn con (1 chạm)
  ├── "Tuần này của con":  "An đi học 18/20 buổi. Điểm trung bình 8.5 — Giỏi."
  ├── Lối tắt: Bảng điểm · Điểm danh · Thông báo (3 mới) · Gọi GLV
  └── Thông báo mới nhất (khẩn ghim đầu)

Bảng điểm: Con → Kỳ học → Điểm TB (số lớn + xếp loại) → Môn → Thành phần → Nhận xét GLV
Thông báo: Danh sách (Khẩn → Học sinh → Lớp → Chung) → Chi tiết → Hành động liên quan
```

## 14. Core Flow #4 — Học sinh

```text
Đăng nhập → Góc của em
  ├── Lời chào "Chào Maria!" + avatar có vòng Level
  ├── Thanh XP (lấp đầy động)  "Còn 140 XP nữa lên Level 6"
  ├── Chuỗi: "5 Chúa Nhật liên tiếp"
  ├── Nhiệm vụ tuần này (3 thẻ có tiến độ)
  ├── Huy hiệu mới / sắp đạt ("Còn 2 buổi nữa")
  └── Buổi học tới (Chúa Nhật 08:00 · Phòng 3)

Điểm của em: thẻ môn — số lớn + 1–5 sao + "Giỏi / Khá / Cố gắng thêm"
Huy hiệu: kệ lưới; chạm huy hiệu → sheet chi tiết (cách đạt, XP)
```

## 15. Demo Panel (thay thanh dev v1)

```text
Nút nổi "Demo" (góc dưới trái desktop; trên bottom nav ở mobile)
  └── Sheet:
      ├── Đổi vai trò: Admin · GLV · Phụ huynh · Học sinh
      ├── Đăng xuất / về /welcome
      ├── Giao diện: Sáng / Tối     Cỡ chữ: Vừa / Lớn / Rất lớn
      ├── Chế độ demo (bật công cụ test: giả lập lỗi mạng, checklist)
      ├── Khung mobile 375px (desktop)
      └── Tab: Bảng route (URL convention) · Phân quyền dữ liệu
```

## 16. Global Navigation

| Nền tảng | Mô hình |
|---|---|
| Desktop (lg+) | Sidebar → Module → Page → Detail |
| Mobile/Tablet | Bottom nav → Page → Sheet/Inline → Detail |

Mục tiêu: tính năng chính ≤ 2 chạm; phụ ≤ 3 chạm; cài đặt admin ≤ 4 chạm.

## 17. Page Hierarchy

```text
<AppShell>
├── Header (glass): Back | Tiêu đề + breadcrumb (desktop) | Cỡ chữ · Theme · Chuông · Avatar
├── PageHeader (trong nội dung): Title · mô tả · actions
├── Filters (inline desktop / BottomSheet mobile)
├── MainContent (reveal stagger)
└── Sticky action / Pagination
```

## 18. Data Ownership

```text
ADMIN    → ALL ORGANIZATION DATA
GLV      → ASSIGNED CLASSES (Students · Attendance · Scores)
PARENT   → LINKED STUDENTS ONLY
STUDENT  → SELF DATA ONLY
```

## 19. Search & Filters

Danh sách lớn: `Search + Filter + Sort + Pagination`. Mobile: ô tìm + nút `Bộ lọc (n)` mở BottomSheet.

## 20. URL Convention

lowercase + resource hierarchy:

```text
/welcome  /login
/dashboard
/classes  /classes/:classId  /classes/:classId/students
/classes/:classId/attendance?date=2026-09-27
/classes/:classId/scores?subject=sub-gl&type=MIENG
/students  /students/:studentId
/attendance  /scores  /notifications  /reports  /settings
/admin/*  /teacher/*  /parent/*  /student/*
```

Query params: `filter`, `search`, `sort`, `page`, `date`, `subject`, `type`.

## 21. Loading / Empty / Error

Mỗi module có `LOADING · SUCCESS · ERROR · EMPTY`.
Loading = Skeleton shimmer đúng hình dạng nội dung. Error có [Thử lại]. Empty có minh họa icon + câu hướng dẫn + hành động.

## 22. Dashboard Priority

| Priority | Admin | GLV | Phụ huynh | Học sinh |
|---|---|---|---|---|
| Hệ thống | Cao | Thấp | — | — |
| Lớp | Trung bình | Cao | Thấp | Thấp |
| Điểm danh | Trung bình | Cao | Trung bình | Trung bình |
| Điểm số | Trung bình | Cao | Cao | Cao |
| Thông báo | Trung bình | Trung bình | Cao | Trung bình |
| Gamification | — | Thấp | Thấp | Cao |

## 23. Navigation Contract

```text
PREFERENCES → AUTH → ROLE RESOLUTION → APP SHELL (data-role) → ROLE NAVIGATION → MODULE → RESOURCE → DETAIL / ACTION
```

UI component không tự quyết định quyền; quyền nằm ở Auth/Permission Layer + RouteGuard + Navigation config.
