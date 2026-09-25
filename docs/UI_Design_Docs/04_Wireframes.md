# 04 — WIREFRAMES v2

Ký hiệu: `[Icon]` = icon Lucide, `( Nút )` = button pill, `[ Ô ]` = input, `▓` = khối night, `░` = skeleton.

## 1. Reference Viewport

```text
Mobile tham chiếu : 375 × 812, padding ngang 16px
Kiểm tra thêm     : 320 · 390 · 768 · 1024 · 1280 · 1440
Cỡ chữ            : kiểm tra cả Vừa (16) và Rất lớn (20)
Theme             : kiểm tra Light và Dark
```

## 2. Global Mobile Shell

```text
┌─────────────────────────────────────┐
│ [←] Tiêu đề trang      [Aa][Bell 2] │  Header glass sticky, 56–64px
├─────────────────────────────────────┤
│                                     │
│  Nội dung (px-4, reveal stagger)    │
│                                     │
│                                     │
│                                     │
│  ╭───────────────────────────────╮  │  Floating pill nav
│  │ [Home] [Lớp] (●) [Sheet][Bell] │  │  cách mép 12px + safe-area
│  │ Trang  Lớp  Điểm  Điểm Thông  │  │
│  ╰───────────────────────────────╯  │
└─────────────────────────────────────┘
```

Nội dung có `pb-32` để nav không che phần cuối. Nút giữa (●) chỉ có ở GLV.

## 3. Global Desktop Shell (≥ 1024px)

```text
┌──────────────────┬──────────────────────────────────────────────────────┐
│ ╭──────────────╮ │ Tổng quan › Lớp học                     [Aa][☼][Bell][Av]│
│ │ [Logo] Đoàn  │ │ Tiêu đề trang (text-3xl)                              │
│ │ Kitô Vua     │ │                                                      │
│ │              │ │  ┌──────────────── nội dung max-w-7xl ─────────────┐ │
│ │ Tổng quan    │ │  │                                                 │ │
│ │ ▓ Dashboard  │ │  │                                                 │ │
│ │ Quản lý      │ │  │                                                 │ │
│ │   Người dùng │ │  └─────────────────────────────────────────────────┘ │
│ │   Lớp học    │ │                                                      │
│ │ ...          │ │                                                      │
│ │ [Av] Tên     │ │                                                      │
│ ╰──────────────╯ │                                                      │
└──────────────────┴──────────────────────────────────────────────────────┘
  Sidebar nổi, bo 28px, mục active nền night
```

## 4. WIREFRAME W — WELCOME `/welcome` (desktop 1280)

```text
            ╭───────────────────────────────────────────────╮
            │ [Logo] Kitô Vua   Tính năng  Vai trò  Hành trình  ( Đăng nhập ) │   GlassNav pill
            ╰───────────────────────────────────────────────╯

  ┌─ col 1–7 ───────────────────────────────┐      ┌─ col 8–12 ──────────────┐
  │                                         │      │                         │
  │ Mỗi Chúa Nhật là một bước               │      │   ảnh (grayscale,       │
  │ [pill ảnh] lớn lên trong Đức Tin.       │      │   contrast-125, wash    │
  │   ← H1 text-display, max-w-4xl, ≤3 dòng │      │   ấm), rounded-card-lg  │
  │                                         │      │                         │
  │ Điểm danh một chạm, nhập điểm trong vài │      │                         │
  │ phút, phụ huynh và các em theo dõi hành │      │                         │
  │ trình Giáo lý mọi lúc.                  │      │                         │
  │                                         │      │                         │
  │ ( Vào ứng dụng → )  ( Xem cách hoạt động )│    │                         │
  └─────────────────────────────────────────┘      └─────────────────────────┘
                     khoảng trống âm rộng (py-32 md:py-48)

  ─── Khai Tâm · Rước Lễ · Thêm Sức · Bao Đồng · Vào Đời · Khai Tâm · ... ───►  Marquee

  Bento (grid-cols-4, grid-flow-dense, gap-4)
  ┌───────────────────────┬───────────────────────┐
  │ A  Điểm danh 1 chạm   │ B  Nhập điểm như bảng │
  │    (2×2, ảnh + mock   │    tính (2×1)         │
  │     danh sách chip)   ├───────────┬───────────┤
  │                       │ C Phụ     │ D Góc     │
  │                       │ huynh     │ thiếu nhi │
  └───────────────────────┴───────────┴───────────┘
  Kiểm tra: 4 + 2 + 1 + 1 = 8 ô = 4 cột × 2 hàng → không ô trống.

  Role stacking (pin, cuộn → thẻ sau trượt lên, thẻ trước scale 0.92 + mờ)
  ┌─────────────────────────────────────────────┐
  │ Học sinh — "Học vui, nhận huy hiệu"   [ảnh] │
  │  ┌──────────────────────────────────────────┴─┐
  │  │ Phụ huynh — "Biết con học thế nào"   [ảnh] │
  │  │  ┌─────────────────────────────────────────┴─┐
  │  │  │ Giáo lý viên — "Ít giấy tờ, nhiều thời    │
  │  │  │ gian cho các em"                    [ảnh] │
  └──┴──┴───────────────────────────────────────────┘

  Đoạn sứ mệnh (text-3xl/5xl, max-w-5xl) — từng từ sáng dần theo cuộn

  Bạn là ai?  (Horizontal accordion, cao 28rem)
  ┌────┬────┬──────────────────────────┬────┐
  │ H  │ P  │  Giáo lý viên (mở rộng)  │ Q  │   lát hẹp: tên dọc + icon
  │ S  │ H  │  mô tả + ảnh             │ T  │   lát mở: ảnh nền + mô tả + nút
  │    │    │  ( Vào với vai trò này ) │    │
  └────┴────┴──────────────────────────┴────┘

  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ▓ Sẵn sàng cho Chúa Nhật này?        (text-display) ▓
  ▓ ( Vào ứng dụng )   nền primary, chữ trắng          ▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  Footer: Logo · Giáo xứ · liên hệ · năm
```

### Mobile (375)

```text
╭─────────────────────────────╮
│ [Logo]           ( Đăng nhập ) │
╰─────────────────────────────╯
Mỗi Chúa Nhật là một
bước [pill] lớn lên
trong Đức Tin.            ← clamp → 44px, 3–4 dòng ở 375 là chấp nhận
mô tả
( Vào ứng dụng → )  full-width
( Xem cách hoạt động )
[ảnh full-width rounded]
Marquee
Bento 1 cột (A, B, C, D)
Role cards xếp dọc (không pin)
Accordion → danh sách thẻ dọc, chạm để mở
CTA + footer
```

## 5. WIREFRAME L — LOGIN `/login`

```text
┌──────────────────────────────┬───────────────────────────────┐
│ ảnh ấm (ẩn trên mobile)      │  [Logo]                       │
│                              │  Chào mừng bạn                │
│ "Hãy để trẻ nhỏ đến với      │  Chọn vai trò để tiếp tục     │
│  Thầy" — Mc 10,14            │                               │
│  (font-accent italic)        │  ┌────────────┐┌────────────┐ │
│                              │  │[Grad] sky  ││[Heart] rose│ │
│                              │  │ Học sinh   ││ Phụ huynh  │ │
│                              │  │ Xem điểm,  ││ Theo dõi   │ │
│                              │  │ huy hiệu   ││ con        │ │
│                              │  └────────────┘└────────────┘ │
│                              │  ┌────────────┐┌────────────┐ │
│                              │  │[Book] mint ││[Shield]    │ │
│                              │  │ Giáo lý viên││ Quản trị   │ │
│                              │  └────────────┘└────────────┘ │
│                              │  ← Về trang giới thiệu        │
└──────────────────────────────┴───────────────────────────────┘
Ô vai trò: min-h 8rem, rounded-card, IconTile lg, hover lift, focus ring.
```

## 6. WIREFRAME A — ADMIN DASHBOARD

### Desktop (bento, grid-cols-4, grid-flow-dense)

```text
Chào buổi sáng, Phêrô                                   ( Xuất báo cáo )
Tổng quan Đoàn Kitô Vua · Năm học 2026–2027

┌──────────┬──────────┬──────────┬──────────┐
│ Học sinh │ Lớp học  │ GLV      │ Chuyên   │   KPI: CountUp, trend pill
│ 128 ↑5   │ 12       │ 18       │ cần 94%  │
├──────────┴──────────┼──────────┴──────────┤
│ Điểm danh hôm nay   │ Kết quả học tập     │   2×2 mỗi khối
│ Ring 94% + 4 ô số   │ Phân bố điểm (bar)  │
│                     │                     │
├─────────────────────┼──────────┬──────────┤
│ Lớp học (lưới card) │ Cảnh báo │ Hoạt động│
└─────────────────────┴──────────┴──────────┘
```

### Mobile

```text
Chào buổi sáng, Phêrô
┌───────────┬───────────┐
│ HS 128    │ Lớp 12    │   KPI 2 cột
├───────────┼───────────┤
│ GLV 18    │ CC 94%    │
└───────────┴───────────┘
[Card] Điểm danh hôm nay (ring + số)
[Card] Kết quả học tập
[Card soft warning] 3 lớp vắng > 10%  ›
[Card] Hoạt động gần đây (timeline)
```

## 7. WIREFRAME G1 — GLV DASHBOARD (mobile)

```text
Chào anh Giuse
Chúa Nhật, 27/09
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓ Buổi học tới                       ▓
▓ Rước Lễ 1A · 08:00 · Phòng 3       ▓
▓ 32 em · đã điểm danh 0/32          ▓
▓ ( Bắt đầu điểm danh → )  primary   ▓
▓ ( Nhập điểm )            outline   ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Lớp của tôi                    Xem tất cả
┌──────────────┐┌──────────────┐  cuộn ngang
│ Rước Lễ 1A   ││ Thêm Sức 2B  │
│ Ring 94%     ││ Ring 88%     │
└──────────────┘└──────────────┘
Chuyên cần tuần trước  (4 ô số)
Thông báo từ Ban Giáo lý
Hoạt động gần đây
```

## 8. WIREFRAME G2 — GLV ĐIỂM DANH

### Mobile

```text
┌─────────────────────────────────────┐
│ [←] Điểm danh                 [Aa]  │
├─────────────────────────────────────┤
│ (CN 13/9)(CN 20/9)(●CN 27/9)[Lịch]  │  dải chip ngày
│ [ Rước Lễ 1A                    ▾ ] │
│ ┌─────────────────────────────────┐ │
│ │ Có bản nháp lúc 08:12            │ │  DraftBanner (nếu có)
│ │ ( Khôi phục )  ( Bỏ qua )        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Ring 84%  27 Có · 3 Vắng ·      │ │  Summary
│ │           1 Phép · 1 Muộn       │ │
│ └─────────────────────────────────┘ │
│ ( Có mặt tất cả ) ( Vắng tất cả ) ( Đặt lại ) │
│ [ Tìm tên...                      ] │
│ (Tất cả)(Chưa có mặt)(Vắng)(Phép)   │
│ ┌─────────────────────────────────┐ │
│ │ [Av] Maria Nguyễn An             │ │
│ │      HS001      ( ✓ Có mặt ) [⋯]│ │  chip xoay vòng
│ ├─────────────────────────────────┤ │
│ │ [Av] Giuse Trần Bình             │ │
│ │      HS002      ( ✕ Vắng   ) [⋯]│ │
│ └─────────────────────────────────┘ │
│ ╭─────────────────────────────────╮ │
│ │ (84%) 3 vắng · 1 muộn  ( Lưu )  │ │  SaveBar nổi trên nav
│ ╰─────────────────────────────────╯ │
└─────────────────────────────────────┘
```

### Tablet / Desktop (≥ 768)

```text
│ [Av] Maria Nguyễn An  HS001  [ Có mặt | Vắng | Có phép | Đi muộn ] │
│ [Av] Giuse Trần Bình  HS002  [ Có mặt | Vắng | Có phép | Đi muộn ] │
    SegmentedControl: mục chọn nền đặc theo tone, chọn trực tiếp 1 chạm
```

Toast sau hành động hàng loạt:

```text
╭──────────────────────────────────────────────╮
│ [✓] Đã đánh dấu 32 em có mặt     ( Hoàn tác ) │   bg-night, 6 giây
╰──────────────────────────────────────────────╯
```

## 9. WIREFRAME G3 — GLV NHẬP ĐIỂM

### Mobile

```text
┌─────────────────────────────────────┐
│ [←] Nhập điểm                       │
├─────────────────────────────────────┤
│ [ Rước Lễ 1A ▾ ]  [ Giáo lý ▾ ]     │
│ [ Miệng | 15 phút | Giữa kỳ | Cuối kỳ ] │
│ ( Nhập từ Excel )                    │
│ ┌─────────────────────────────────┐ │
│ │ 2 lỗi: (Lê Minh C) (Phạm D)      │ │  chip lỗi → cuộn + focus
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 01 Maria Nguyễn An               │ │
│ │    Điểm cũ 8.0        [  8.5  ]  │ │  NumericInput mono lớn
│ ├─────────────────────────────────┤ │
│ │ 03 Lê Minh C                     │ │
│ │    Điểm cũ 9.0        [  11   ]  │ │
│ │    [!] Điểm phải từ 0 đến 10     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ (10) (9) (8) (7) (6) (5)         │ │  QuickFillBar khi đang focus
│ └─────────────────────────────────┘ │
│ ╭─────────────────────────────────╮ │
│ │ 25/28 đã nhập · 2 lỗi  ( Lưu )  │ │
│ ╰─────────────────────────────────╯ │
└─────────────────────────────────────┘
```

### Desktop

```text
│ Lớp [Rước Lễ 1A ▾]  Môn [Giáo lý ▾]  [Miệng|15p|GK|CK]   ( Excel ) ( Lưu tất cả ) │
│ ┌────┬──────────────────────┬─────────┬──────────────┐                       │
│ │ STT│ Học sinh             │ Điểm cũ │ Điểm mới     │  header sticky         │
│ ├────┼──────────────────────┼─────────┼──────────────┤                       │
│ │ 01 │ Maria Nguyễn An      │ 8.0     │ [ 8.5 ]      │                       │
│ │ 03 │ Lê Minh C            │ 9.0     │ [ 11 ] [!]   │                       │
│ └────┴──────────────────────┴─────────┴──────────────┘                       │
  Gợi ý phím: Enter / ↓ em kế tiếp · ↑ em trước
```

## 10. WIREFRAME P1 — PHỤ HUYNH TRANG CHỦ (mobile, cỡ chữ Lớn)

```text
┌─────────────────────────────────────┐
│ Trang chủ              [Aa][Bell 3] │
├─────────────────────────────────────┤
│ Chào chị Têrêsa                     │
│ ( ▓[Av] An▓ ) ( [Av] Bình )         │  chip chọn con
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓ Tuần này của An                 ▓ │
│ ▓ An đi học đều 18/20 buổi và     ▓ │  câu đời thường
│ ▓ đang học rất tốt.               ▓ │
│ ▓ ┌──────────┐ ┌──────────┐       ▓ │
│ ▓ │ 90%      │ │ 8.5      │       ▓ │
│ ▓ │chuyên cần│ │ điểm TB  │       ▓ │
│ ▓ └──────────┘ └──────────┘       ▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ┌───────────────┐┌───────────────┐  │
│ │ [Sheet]       ││ [Check]       │  │  ShortcutGrid 2×2
│ │ Bảng điểm     ││ Điểm danh     │  │  tile ≥ 7rem, có nhãn
│ ├───────────────┤├───────────────┤  │
│ │ [Bell] 3 mới  ││ [Phone]       │  │
│ │ Thông báo     ││ Gọi GLV       │  │
│ └───────────────┘└───────────────┘  │
│ Thông báo mới                        │
│ [Card danger] Khẩn · Nghỉ học CN 4/10│
│ [Card] Kết quả học tập tháng 9       │
│ ╭─────────────────────────────────╮ │
│ │ Trang chủ  Bảng điểm  Điểm danh  Thông báo │
│ ╰─────────────────────────────────╯ │
└─────────────────────────────────────┘
```

## 11. WIREFRAME P2 — PHỤ HUYNH BẢNG ĐIỂM

```text
Bảng điểm
( ▓An▓ ) ( Bình )
[ HK I | HK II | Cả năm ]
┌─────────────────────────────────────┐
│ Ring   Điểm trung bình               │
│  8.5   Giỏi  [badge success]         │
│        Xếp thứ 5/32 trong lớp        │
└─────────────────────────────────────┘
Kết quả theo môn
┌─────────────────────────────────────┐
│ [Book] Giáo lý                  8.5 │
│ GK 8.0 · CK 9.0   ▬▬▬▬▬▬▬▬▬░░       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [Quote] Nhận xét của GLV             │
│ "Con chăm chỉ và tích cực tham gia   │  font-accent italic
│  học tập."        — Anh Giuse        │
└─────────────────────────────────────┘
```

## 12. WIREFRAME P3 — PHỤ HUYNH ĐIỂM DANH

```text
Điểm danh
( ▓An▓ ) ( Bình )
┌─────────────────────────────────────┐
│ Chuyên cần 90%                       │
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░                  │
│ 18 Có mặt · 1 Vắng · 1 Có phép       │
│ ● ● ● ○ ● ● ● ● ◐ ● (10 buổi gần nhất)│  chấm có icon trong tooltip/label
└─────────────────────────────────────┘
Lịch sử
│ CN 27/09   [✓ Có mặt]                │
│ CN 20/09   [✓ Có mặt]                │
│ CN 13/09   [Có phép]                 │
│ CN 06/09   [✕ Vắng]                  │
```

## 13. WIREFRAME S1 — HỌC SINH "GÓC CỦA EM" (mobile)

```text
┌─────────────────────────────────────┐
│ Góc của em                 [Bell 1] │
├─────────────────────────────────────┤
│ ╭─────────────────────────────────╮ │
│ │ gradient grape → sky            │ │  StudentHero rounded-card-lg
│ │ (Av+ring)  Chào Maria!          │ │
│ │            Level 5 · Hiệp sĩ nhỏ│ │
│ │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░░  860/1000 XP  │ │
│ │ Còn 140 XP nữa lên Level 6      │ │
│ │ [Flame] 5 Chúa Nhật liên tiếp   │ │
│ ╰─────────────────────────────────╯ │
│ Nhiệm vụ tuần này                    │
│ ┌─────────────────────────────────┐ │
│ │ [sky] Đi học đúng giờ      1/1 ✓│ │
│ │ [mint] Thuộc kinh Kính Mừng 0/1 │ │
│ │ [sun] Làm bài tập          2/3  │ │
│ └─────────────────────────────────┘ │
│ Huy hiệu của em             Xem hết │
│ (●)(●)(●)(○ còn 2 buổi)(○)  →       │  kệ cuộn ngang
│ ┌─────────────────────────────────┐ │
│ │ Buổi học tới                    │ │
│ │ CN 04/10 · 08:00 · Phòng 3      │ │
│ └─────────────────────────────────┘ │
│ ╭─────────────────────────────────╮ │
│ │ Nhà của em  Điểm  Huy hiệu  Thông báo │
│ ╰─────────────────────────────────╯ │
└─────────────────────────────────────┘
```

## 14. WIREFRAME S2 — ĐIỂM CỦA EM

```text
Điểm của em
[ HK I | HK II ]
┌─────────────────────────────────────┐
│ Điểm trung bình                      │
│   8.5     ★★★★☆   Giỏi lắm!          │
└─────────────────────────────────────┘
┌──────────────────┐┌──────────────────┐
│ [Book] Giáo lý   ││ [Cross] Kinh     │
│ 8.5  ★★★★☆       ││ Thánh 9.0 ★★★★★  │
│ Giỏi             ││ Xuất sắc         │
└──────────────────┘└──────────────────┘
Thang: ≥ 9 Xuất sắc (5 sao) · ≥ 8 Giỏi (4) · ≥ 6.5 Khá (3) · ≥ 5 Đạt (2) · < 5 Cố gắng thêm (1)
```

## 15. WIREFRAME S3 — HUY HIỆU

```text
Huy hiệu của em        12/20
[ Tất cả | Đã có | Sắp đạt ]
┌──────┐┌──────┐┌──────┐
│ (●)  ││ (●)  ││ (○)  │   lưới 3 cột, huy hiệu tròn lớn
│Chuyên││Thuộc ││Còn 2 │   LOCKED: grayscale + tiến độ
│ cần  ││ kinh ││ buổi │
└──────┘└──────┘└──────┘
Chạm → BottomSheet: tên · cách đạt · XP thưởng · ngày đạt
```

## 16. WIREFRAME N — THÔNG BÁO

```text
Thông báo                 ( Đã đọc tất cả )
[ Tất cả | Chưa đọc 3 ]
(Khẩn)(Học sinh)(Lớp)(Chung)
┌─────────────────────────────────────┐
│ [Alert danger] Khẩn · Hôm nay     ● │
│ Nghỉ học Chúa Nhật 04/10             │  chưa đọc: đậm + chấm
│ Do giáo xứ tổ chức lễ...             │
├─────────────────────────────────────┤
│ [Book info] Học sinh · Hôm qua       │
│ Kết quả học tập tháng 9              │
└─────────────────────────────────────┘
Chi tiết: sheet (mobile) / modal (desktop), [ Xem bảng điểm ]
```

## 17. States

### Empty

```text
        [IconTile xl]
     Chưa có lớp học
 Tạo lớp đầu tiên để bắt đầu.
      ( + Tạo lớp )
```

GLV: "Lớp chưa có học sinh — Liên hệ Ban Giáo lý để cập nhật danh sách."
Phụ huynh: "Chưa có bảng điểm — Điểm sẽ hiện khi GLV cập nhật."
Học sinh: "Em chưa có huy hiệu nào — Đi học Chúa Nhật này để nhận huy hiệu đầu tiên nhé!"

### Loading

Skeleton đúng hình dạng (card, dòng, vòng), shimmer; không spinner toàn trang.

### Error

```text
      [IconTile danger]
   Không thể tải dữ liệu
 Kiểm tra kết nối và thử lại.
      ( Thử lại )
```

### Confirmation (chỉ cho thao tác không đảo ngược: xóa)

```text
Xóa học sinh?
Hành động này không thể hoàn tác.
( Hủy )            ( Xóa )  danger
```

Mobile: hiển thị dạng bottom sheet, nút full-width xếp dọc (nút nguy hiểm ở dưới cùng).

## 18. Sticky Action Pattern

```text
Nội dung cuộn
╭─────────────────────────────────────╮
│ Ngữ cảnh (ring/số)     ( HÀNH ĐỘNG ) │   nổi, bo pill, trên bottom nav
╰─────────────────────────────────────╯
```

Áp dụng: Điểm danh, Nhập điểm, form dài.

## 19. Grid Rules

| Ngữ cảnh | Mobile | Tablet | Desktop |
|---|---|---|---|
| KPI | 2 cột | 2 cột | 4 cột |
| Dashboard bento | 1 cột | 2 cột | 4 cột `grid-flow-dense` |
| Card list (lớp, môn) | 1 cột | 2 cột | 3 cột |
| Huy hiệu | 3 cột | 4 cột | 6 cột |
| Gap | `gap-3` | `gap-4` | `gap-4`/`gap-5` |

Mọi bento dùng `grid-flow-dense` và phải kiểm tra tổng ô = cột × hàng.

## 20. Responsive Transformation Matrix

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Sidebar | Ẩn | Ẩn | Nổi, thu gọn được |
| Bottom nav | Floating pill | Floating pill | Ẩn |
| DataTable | Card | Table | Table |
| FilterBar | BottomSheet | Inline | Inline |
| Modal | Bottom sheet | Modal | Modal |
| Điểm danh | Chip xoay vòng + menu | Segmented | Segmented |
| Nhập điểm | Thẻ + QuickFill | Bảng | Bảng |
| Phụ huynh điểm | Thẻ | Thẻ 2 cột | Thẻ 2–3 cột |

## 21. Traceability

```text
WelcomePage     → GlassNav · EditorialHero · KhoiMarquee · FeatureBento · RoleStack · ScrubText · RoleAccordion · BigCTA · SiteFooter
LoginPage       → role tiles → AuthContext.login(role)
AdminDashboard  → PageHeader · KPIGroup(StatCard×4) · ChartCard×2 · ClassCard grid · Alert · ActivityFeed
TeacherDashboard→ NextSession hero · ClassCard rail · AttendanceSummary · NotificationPreview · ActivityFeed
AttendancePage  → DateChips · ClassSelector · DraftBanner · AttendanceSummary · BulkAction · AttendanceList(Row) · SaveBar
BulkScoreEntry  → ScoreHeader · ValidationSummary · ScoreTable(ScoreRow/ScoreInput) · QuickFillBar · SaveBar · Excel sheet
ParentDashboard → ChildSwitcher · WeeklySummary · ShortcutGrid · NotificationPreview | Scores view | Attendance view
StudentPortal   → StudentHero · QuestCard×3 · BadgeShelf · NextSessionCard | Scores view | Attendance view | Badges view
```

## 22. Page-Level Contract v2

```text
PAGE-001 Mobile-first.
PAGE-002 375px không cuộn ngang toàn trang (kể cả cỡ chữ Rất lớn ở các màn chính).
PAGE-003 Page padding px-4 mobile.
PAGE-004 Primary action trong vùng ngón cái (dưới màn hình) trên mobile.
PAGE-005 Sticky action và bottom nav không che nội dung (pb-32).
PAGE-006 Desktop/tablet mở rộng từ mobile layout.
PAGE-007 Business logic không phụ thuộc viewport.
PAGE-008 Tên component khớp Component Library.
PAGE-009 Token lấy từ 01_DesignSystem_Tokens v2.
PAGE-010 Light + Dark đều đạt tương phản.
```

## 23. Definition of Done

Wireframe v2 cho phép xác định: layout hierarchy · viewport mobile · vị trí header/nav · vị trí component · primary/sticky action · empty/loading/error/validation · layout riêng từng vai trò · responsive · traceability · hành vi mới (Hoàn tác, nháp, cỡ chữ, theme).
