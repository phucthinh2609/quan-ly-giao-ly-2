# 00 — REDESIGN BRIEF v2 ("Lumen")

**Nền tảng:** Quản lý Học tập Giáo lý – Đoàn Kitô Vua
**Phiên bản tài liệu:** 2.0 (2026-09-25) — thay thế định hướng v1 (Noto Serif + Inter, màu hard-code).
**Phạm vi:** Toàn bộ UI/UX và hành vi (behavior) của ứng dụng + bề mặt giới thiệu/đăng nhập mới.

Thứ tự đọc: `00_Redesign_Brief` → `01_DesignSystem_Tokens` → `02_Sitemap_Flows` → `03_Component_Library` → `04_Wireframes`.

---

## 1. Mục tiêu

| # | Mục tiêu | Đo lường |
|---|---|---|
| G1 | Giao diện **thời thượng**, ấm áp, mang tinh thần cộng đoàn Công giáo nhưng không cổ điển | Không còn màu hard-code; 100% component dùng token v2; có Light/Dark |
| G2 | **Học sinh (8–15 tuổi)** tự dùng được không cần hướng dẫn | Mọi thao tác chính ≤ 2 chạm; nút ≥ 56px; icon + chữ; phản hồi vui (motion, huy hiệu) |
| G3 | **Giáo lý viên (18–45 tuổi)** điểm danh 1 lớp 30 em trong < 60 giây | Điểm danh 1 chạm, "Có mặt tất cả", Hoàn tác, lưu nháp tự động |
| G4 | **Phụ huynh (30–55 tuổi)** hiểu tình hình con trong 5 giây | Câu tóm tắt ngôn ngữ đời thường, cỡ chữ lớn mặc định, đổi con 1 chạm |
| G5 | Tách công cụ dev/test khỏi UI sản phẩm | Role switcher, bảng route, giả lập lỗi mạng chuyển vào **Demo Panel** |

## 2. Personas

| Persona | Bối cảnh | Nhu cầu chính | Nỗi đau v1 | Giải pháp v2 |
|---|---|---|---|---|
| **Em Maria (11 tuổi, Rước Lễ)** | Điện thoại của bố mẹ, sau Thánh lễ Chúa Nhật | Xem điểm, huy hiệu, chuỗi đi học | Trang Học sinh chỉ là trang demo component, chữ nhỏ, bảng biểu người lớn | "Góc của em": Level/XP, nhiệm vụ tuần, kệ huy hiệu, điểm hiển thị bằng sao + từ ngữ dễ hiểu |
| **Anh Giuse (24 tuổi, GLV)** | Điện thoại 1 tay, đứng trước lớp 30 em | Điểm danh nhanh, nhập điểm sau buổi học | Phải chạm nhiều lần, dễ mất dữ liệu khi lỗi mạng, UI lẫn nút test | Tile trạng thái 1 chạm, phân đoạn 4 trạng thái trên tablet, Hoàn tác, nháp tự động |
| **Chị Têrêsa (42 tuổi, phụ huynh 2 con)** | Đọc thông báo vào buổi tối | Con có đi học đều không, điểm thế nào, có thông báo gì | Dropdown chọn con khó thấy, số liệu khô, chữ 13–14px | Chip chọn con có ảnh, câu tóm tắt "Con đi học 18/20 buổi", cỡ chữ "Lớn" mặc định |
| **Ông Phêrô (58 tuổi, Trưởng ban Giáo lý / Admin)** | Laptop tại văn phòng giáo xứ | Nhìn toàn đoàn, xuất báo cáo | Dashboard dài, nhiều màu rời rạc | Bento dashboard mật độ cao, bảng dữ liệu sticky header |

## 3. Nguyên tắc thiết kế v2

| Nguyên tắc | Quy tắc triển khai |
|---|---|
| **Warm Modern** | Nền ngà ấm (`canvas`), chữ mực nâu than (`ink`), đỏ Kitô Vua làm hành động chính, vàng làm thành tích. Không nền đỏ toàn màn hình |
| **Role-adaptive** | Mỗi vai trò có "mật độ" và "giọng điệu" riêng qua `data-role` trên AppShell (xem 01 §12) |
| **Scalable type** | Mọi cỡ chữ và khoảng cách dùng `rem`; người dùng chọn cỡ chữ Vừa / Lớn / Rất lớn → toàn bộ UI co giãn |
| **Label-first** | Thao tác quan trọng luôn có icon + chữ. Không icon-only cho Phụ huynh và Học sinh |
| **Forgiving** | Ưu tiên **Hoàn tác** thay vì hộp thoại xác nhận cho thao tác đảo ngược được; lưu nháp tự động; lỗi mạng không làm mất dữ liệu |
| **Motion có mục đích** | GSAP cho: xuất hiện theo nhịp (stagger), đếm số, lấp đầy thanh tiến độ, ăn mừng thành tích. Tôn trọng `prefers-reduced-motion` |
| **Accessible** | Không dùng màu làm tín hiệu duy nhất; focus ring luôn thấy; tương phản chữ ≥ 4.5:1 ở cả Light/Dark |
| **No emoji, no meta-label** | Không emoji trong UI/code/tài liệu. Không nhãn kiểu "SECTION 01", "Phase 8 Complete". Tiêu đề nhóm viết sentence case |

## 4. Chiến lược hai bề mặt (Two-surface strategy)

Skill thẩm mỹ `gpt-tasteskill` được áp dụng có điều chỉnh:

| Bề mặt | Route | Áp dụng skill |
|---|---|---|
| **Marketing surface** | `/welcome`, `/login` | Áp dụng **đầy đủ**: AIDA, Hero Editorial Split, Bento gapless, GSAP ScrollTrigger (Card Stacking + Scrubbing Text Reveal), Horizontal Accordion, Infinite Marquee, Inline Typography Image, khoảng cách section `py-32 md:py-48`, ảnh picsum + filter |
| **Product surface** | Toàn bộ app sau đăng nhập | Áp dụng **nguyên tắc**: font Geist, không Inter, bento gapless cho dashboard, hover physics, motion GSAP nhẹ, không meta-label, không emoji. **Không** dùng khoảng cách kiểu landing — app giữ mật độ theo vai trò để thao tác nhanh |

### 4.1 Design plan (kết quả RNG xác định)

```text
seed = len(prompt) = 247  (LCG)
hero        = "Editorial Split"
font        = "Satoshi"  -> OVERRIDE "Geist"
components  = ["Horizontal Accordions", "Inline Typography Images", "Infinite Marquee"]
gsap        = ["Card Stacking", "Scrubbing Text Reveal"]
```

**Lý do override font:** đã kiểm tra bảng cmap của Satoshi (Fontshare): thiếu hầu hết glyph tiếng Việt (`ệ ở ữ ặ ẫ ỹ ự ơ ư ...`). Cabinet Grotesk và Outfit cũng không có subset `vietnamese`. **Geist** là font duy nhất trong danh sách của skill có subset `vietnamese` đầy đủ trên Google Fonts.

### 4.2 Kiểm tra bắt buộc cho `/welcome`

| Kiểm tra | Cam kết |
|---|---|
| AIDA | Nav (glass pill) → Attention (Hero) → Interest (Bento) → Desire (Card Stacking + Text Reveal) → Action (Role Accordion + CTA + Footer) |
| Hero 2–3 dòng | Cột chữ `lg:col-span-7`, H1 `max-w-4xl`, `font-size: clamp(2.75rem, 5vw, 5rem)`, ~45 ký tự. Không stamp icon, không pill-tag, không số liệu trong hero |
| Bento gapless | `grid-cols-4 grid-flow-dense`: A `col-span-2 row-span-2` + B `col-span-2` + C + D = 8 ô = 4×2. Mobile 1 cột |
| Nút | Nền tối → chữ trắng; nền sáng → chữ `ink`. Không nút chữ chìm |
| Overflow | Bọc trang trong `<main class="overflow-x-hidden w-full max-w-full">` |

## 5. Thay đổi hành vi (Behavior change log)

### 5.1 Toàn cục

| ID | v1 | v2 |
|---|---|---|
| B-01 | Mở app vào thẳng Admin, thanh dev tối màu phía trên | Chưa đăng nhập → `/welcome`; đăng nhập = chọn vai trò (demo auth). Thanh dev chuyển thành **Demo Panel** (nút nổi) |
| B-02 | Màu sáng duy nhất | **Giao diện Sáng / Tối**, lưu `localStorage` (`qlgl.theme`) |
| B-03 | Cỡ chữ cố định px | **Cỡ chữ Vừa / Lớn / Rất lớn** (16/18/20px root), lưu `localStorage` (`qlgl.textSize`). Phụ huynh mặc định **Lớn** |
| B-04 | Toast không có hành động | Toast hỗ trợ `action` (VD **Hoàn tác**) |
| B-05 | Chuyển trang tức thì | Nội dung trang vào bằng fade + trượt nhẹ (GSAP, 280ms); card xuất hiện stagger 40ms |
| B-06 | Chuông thông báo nhảy sang trang khác theo role cứng | Chuông điều hướng đúng route thông báo của từng vai trò |
| B-07 | Bottom nav dính đáy, full-width | **Floating pill nav** (kính mờ, bo tròn, cách mép 12px, safe-area). GLV có nút trung tâm nổi **Điểm danh** |

### 5.2 Giáo lý viên

| ID | Hành vi mới |
|---|---|
| B-GLV-01 | Dashboard có thẻ hero "Buổi học tới" với CTA lớn **Bắt đầu điểm danh** (1 chạm) và **Nhập điểm** |
| B-GLV-02 | Điểm danh: mobile chạm chip trạng thái để xoay vòng; tablet/desktop có **phân đoạn 4 trạng thái** chọn trực tiếp 1 chạm |
| B-GLV-03 | **Có mặt tất cả / Vắng tất cả / Đặt lại** → toast có **Hoàn tác** thay vì hộp thoại |
| B-GLV-04 | **Lưu nháp tự động** theo lớp + ngày (`localStorage`); mở lại thấy banner "Khôi phục bản nháp" |
| B-GLV-05 | Tìm nhanh theo tên + lọc "Chưa có mặt" trong danh sách điểm danh |
| B-GLV-06 | Rung nhẹ (`navigator.vibrate(8)`) khi chạm đổi trạng thái trên thiết bị hỗ trợ |
| B-GLV-07 | Nhập điểm: Enter/Tab/↓ sang em kế tiếp, ↑ về em trước; chip điền nhanh (10, 9, 8, 7, 6, 5) trên mobile; nháp tự động; cảnh báo rời trang |
| B-GLV-08 | Công cụ test (giả lập lỗi mạng, checklist) chỉ hiện khi bật **Chế độ demo** trong Demo Panel |

### 5.3 Phụ huynh

| ID | Hành vi mới |
|---|---|
| B-PH-01 | Chọn con bằng **chip ảnh đại diện** ngang (1 chạm). > 4 con mới dùng sheet chọn |
| B-PH-02 | Thẻ **"Tuần này của con"** viết bằng câu đời thường + màu + icon trạng thái |
| B-PH-03 | Lối tắt lớn có nhãn: Bảng điểm · Điểm danh · Thông báo · Liên hệ GLV (`tel:`) |
| B-PH-04 | Thông báo khẩn luôn ghim trên cùng, có nhãn "Khẩn" + icon, không chỉ màu đỏ |

### 5.4 Học sinh

| ID | Hành vi mới |
|---|---|
| B-HS-01 | Trang chủ "Góc của em": Level + XP (thanh lấp đầy động), chuỗi Chúa Nhật liên tiếp, nhiệm vụ tuần |
| B-HS-02 | Điểm hiển thị bằng số lớn + **sao** + từ "Giỏi / Khá / Cố gắng thêm" (không chỉ con số) |
| B-HS-03 | Kệ huy hiệu cuộn ngang; huy hiệu khóa hiển thị "Còn N buổi nữa" |
| B-HS-04 | Mở huy hiệu mới → hiệu ứng ăn mừng (GSAP burst, tắt khi reduced-motion) |
| B-HS-05 | Mỗi route học sinh (`/student/scores`, `/attendance`, `/achievements`, `/notifications`) có màn hình riêng thay vì cùng một trang demo |
| B-HS-06 | Giọng văn xưng "em", câu ngắn, tích cực |

### 5.5 Admin

| ID | Hành vi mới |
|---|---|
| B-AD-01 | Dashboard dạng **bento** gapless, KPI đếm số động |
| B-AD-02 | Bảng dữ liệu sticky header, hàng hover rõ, mobile chuyển thành card |

## 6. Quy tắc migrate code (bắt buộc)

```text
MIG-01 Không dùng mã hex trong className (VD bg-[#B4232C]). Dùng utility token: bg-primary, text-ink, border-line...
MIG-02 Không dùng cỡ chữ px (text-[13px]). Dùng thang rem: text-xs/sm/base/lg/xl/2xl... hoặc text-display.
MIG-03 Không dùng font-serif (Noto Serif đã bỏ). Heading dùng font-sans (Geist) + tracking-tight.
        Trích dẫn (Lời Chúa, nhận xét GLV) dùng font-accent (Fraunces italic).
MIG-04 Số liệu (điểm, mã, thống kê) dùng font-mono hoặc class "tabular-nums".
MIG-05 Không emoji trong UI, code, comment.
MIG-06 Giữ nguyên API props của component hiện có; chỉ được THÊM prop tùy chọn.
MIG-07 Không thay đổi business logic/service trừ khi mục Behavior change log yêu cầu.
MIG-08 Mọi animation đi qua lib/motion (tôn trọng reduced-motion).
MIG-09 Không dùng tên màu mặc định của Tailwind (stone-*, red-*, ...) — chỉ dùng token.
MIG-10 Công cụ dev/test chỉ hiển thị khi demoMode = true.
```

## 7. Definition of Done v2

- [ ] `npm run lint` (tsc) và `npm run build` pass.
- [ ] Không còn `#xxxxxx` trong `src/**/*.tsx` (trừ SVG logo và dữ liệu biểu đồ có chú thích).
- [ ] Không còn emoji trong `src/`.
- [ ] 375px: không cuộn ngang; bottom nav không che nội dung; nút chính ≥ 44px (Học sinh/Phụ huynh ≥ 52px).
- [ ] Light + Dark đều đọc được; cỡ chữ "Rất lớn" không vỡ layout chính.
- [ ] `/welcome` đạt toàn bộ kiểm tra §4.2.
- [ ] Mọi mục trong Behavior change log §5 có trong UI.

## 8. Ghi chú triển khai v2 (đồng bộ tài liệu ↔ code, 2026-09-25)

Các điểm dưới đây là quyết định phát sinh khi hiện thực và **có hiệu lực thay cho** mô tả tương ứng ở 01–04.

### 8.1 Nền tảng

| Hạng mục | Quyết định |
|---|---|
| Font hero | `text-display` = `clamp(2.25rem, 5vw, 5rem)` để H1 landing giữ 2–3 dòng cả ở 375px (đã đo 375 → 1600px) |
| Grid an toàn | `:where(.grid) > * { min-width: 0 }` trong `index.css` — ngăn dải chip cuộn ngang kéo giãn cả trang trên mobile |
| Phiên demo | `AuthContext` lưu vai trò ở `qlgl.session`; tải lại trang không bị đăng xuất |
| Theme mặc định | Theo hệ điều hành (`prefers-color-scheme`) nếu người dùng chưa chọn; script trong `index.html` áp dụng trước lần vẽ đầu (không nháy) |
| Code splitting | `/welcome` và `/login` (GSAP ScrollTrigger) là chunk riêng, tải lười |
| Khung mobile demo | Dùng `iframe ?embed=1` (viewport thật) thay vì co khung CSS |

### 8.2 App shell

| Hạng mục | Quyết định |
|---|---|
| Header | Tiêu đề chỉ hiện khi cuộn (large-title); desktop hiện breadcrumb; nút Aa (cỡ chữ) cho mọi vai trò, Phụ huynh có thêm chữ "Cỡ chữ" từ `sm` |
| Nút Quay lại | Chỉ Header hiển thị. `PageHeader` tự ẩn nút Back khi nằm trong AppShell (`[data-role]`) để không lặp |
| Bottom nav | Khối bo `rounded-card-lg` (thay `rounded-full`), nhãn `text-xs` được xuống tối đa 2 dòng ở cỡ chữ Rất lớn thay vì bị cắt. Admin: "Người dùng" hiển thị ngắn là "Tài khoản" |
| Toast | Vùng toast dịch lên khi trang có SaveBar (`useToastOffset`) để nút Hoàn tác không che nút Lưu |
| Demo Panel | Tab dọc ở mép phải màn hình; gồm đổi vai trò, lối tắt, theme, cỡ chữ, chế độ demo, khung mobile, bảng route, phân quyền |

### 8.3 Component

| Component | Quyết định |
|---|---|
| StatCard | Trend hiển thị **dưới** giá trị, được xuống dòng (không còn pill cạnh icon) — tránh tràn ở cột KPI hẹp |
| Modal / BottomSheet / Select | Render qua portal vào `document.body`, dùng `z-(--z-modal)`; `useOverlayBehavior` lo khóa cuộn, focus trap, Esc, trả focus |
| DataTable | Header chỉ dính khi trang truyền `maxHeight` (bảng cuộn trong khung riêng) |
| Avatar | `xl` = 64px, `2xl` = 88px, prop `ring?: Tone` |

### 8.4 Màn hình

| Màn | Quyết định |
|---|---|
| Admin dashboard | Bento `gap-3`; bố cục 2 + 1 + 1 (lớp · cảnh báo · hoạt động) bắt đầu từ `xl`; ở `lg` lớp học chiếm full hàng, cảnh báo/hoạt động mỗi khối 2 cột (vẫn gapless) |
| Landing bento | 4×2 từ `lg`; 2×3 ở tablet (768–1023); 1 cột mobile |
| Điểm danh / Nhập điểm | ID lớp/môn không tồn tại → tự chọn lớp/môn đầu tiên. Đổi lớp/môn/loại điểm khi còn thay đổi chưa lưu → hỏi trước. Bước điểm 0.25 |
| Học sinh | Em tự đánh dấu nhiệm vụ "Thuộc kinh", "Làm bài tập" (có Hoàn tác); "Đi học đúng giờ" do GLV ghi nhận khi điểm danh |
| Phụ huynh | Trang Thành tích hiển thị mục tiêu suy ra từ điểm và chuyên cần của con (dữ liệu huy hiệu là dữ liệu riêng của học sinh) |
| Chuỗi lỗi service | Viết lại bằng ngôn ngữ đời thường, không còn ký hiệu mục tài liệu |

### 8.5 Còn lại (ngoài phạm vi redesign)

- "Sửa tài khoản" và "Tạo lớp mới" vẫn chỉ hiện toast như bản v1 (chưa có form nghiệp vụ).
- Modal chưa hỗ trợ kéo để đóng (BottomSheet đã có).
- Bundle chính ~198 KB gzip — có thể tách tiếp theo vai trò nếu cần.
