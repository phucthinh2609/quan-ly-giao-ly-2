# 01 — DESIGN SYSTEM & DESIGN TOKENS v2 ("Lumen")

## Nền tảng
**Quản lý Học tập Giáo lý – Đoàn Kitô Vua**

> v2 thay thế toàn bộ v1. Nguồn token duy nhất: `src/tokens.css` (được import bởi `src/index.css`).
> Tailwind CSS v4 đọc token qua `@theme inline` → mọi utility (`bg-surface`, `text-ink`...) tự đổi theo Light/Dark và vai trò.

## 1. Design Principles

| Principle | Quy tắc triển khai |
|---|---|
| Warm Modern | Nền ngà ấm, chữ mực nâu than, đỏ Kitô Vua cho hành động, vàng cho thành tích |
| Mobile-first | Thiết kế từ 320px; tham chiếu 375px; mở rộng tablet/desktop |
| Touch-first | Vùng chạm ≥ 44px; Phụ huynh/Học sinh ≥ 52–56px |
| Scalable | Mọi kích thước bằng `rem` → cỡ chữ người dùng chọn co giãn toàn UI |
| Role-adaptive | `data-role` trên AppShell đổi mật độ, bo góc, chiều cao control |
| Themeable | `data-theme="light" | "dark"` trên `<html>` |
| Accessible | Tương phản chữ ≥ 4.5:1; không chỉ dùng màu; focus ring luôn thấy |
| Faith & Community | Chất liệu ấm, ánh sáng, trích dẫn bằng serif nghiêng; không trang trí rườm rà |

## 2. Brand Direction

**Keyword:** `Ấm áp` · `Hiện đại` · `Tin cậy` · `Vui tươi (khu Học sinh)` · `Rõ ràng (khu Phụ huynh)` · `Nhanh (khu GLV)`

- Đỏ Kitô Vua `#B4232C` giữ nguyên làm nhận diện, dùng cho **Primary action** và điểm nhấn thương hiệu.
- Vàng `#E3B341` cho huy hiệu, level, thành tích, highlight.
- Nền không dùng xám lạnh: chuyển sang **ngà ấm** `#F7F3ED`.
- Khối "night" (nâu than `#1C1714`) dùng cho hero card, CTA lớn — tạo nhịp tương phản cao cấp.

## 3. Color — Semantic tokens

Component **chỉ** dùng semantic token. Không dùng hex, không dùng palette mặc định của Tailwind.

### 3.1 Surface & Text

| Token (utility) | Light | Dark | Usage |
|---|---|---|---|
| `canvas` | `#F7F3ED` | `#110F0D` | Nền trang |
| `surface` | `#FFFFFF` | `#1A1714` | Card, sheet, input |
| `surface-2` | `#F2ECE3` | `#231F1B` | Nền phụ, hàng xen kẽ, track |
| `surface-3` | `#E9E1D5` | `#2E2924` | Pressed, skeleton, divider đậm |
| `ink` | `#1C1714` | `#F5EFE7` | Chữ chính, heading |
| `ink-2` | `#574D45` | `#C2B7AB` | Chữ phụ, body secondary |
| `ink-3` | `#7A6F66` | `#948A7F` | Metadata, placeholder (≥ 4.5:1 trên surface) |
| `line` | `#E7DFD4` | `#2F2A25` | Border mặc định |
| `line-strong` | `#D4C8B9` | `#433C35` | Border input, divider rõ |
| `night` | `#1C1714` | `#2A221D` | Khối tối nổi bật (hero, CTA) ở cả 2 theme |
| `on-night` | `#F7F3ED` | `#F7F3ED` | Chữ trên `night` |

### 3.2 Brand

| Token | Light | Dark | Usage |
|---|---|---|---|
| `primary` | `#B4232C` | `#D93B44` | Nền nút chính, fill thương hiệu |
| `primary-hover` | `#971C24` | `#C5323B` | Hover/pressed |
| `primary-soft` | `#FBE9EA` | `#3A2020` | Nền chọn, badge nhẹ |
| `primary-ink` | `#9E1F27` | `#FF9A9F` | **Chữ** màu thương hiệu trên surface/soft |
| `on-primary` | `#FFFFFF` | `#FFFFFF` | Chữ trên `primary` |
| `gold` | `#E3B341` | `#EDBE52` | Huy hiệu, level, sao |
| `gold-soft` | `#FBF1D6` | `#3A2F16` | Nền thành tích |
| `gold-ink` | `#7A5610` | `#F3CF7A` | Chữ trên `gold-soft` |

Quy tắc: chữ nhỏ màu thương hiệu dùng `text-primary-ink`; `text-primary` chỉ cho icon/chữ lớn đậm.

### 3.3 Status

| Token | Light | Dark | Soft (Light / Dark) |
|---|---|---|---|
| `success` | `#157A4F` | `#3CC48A` | `#E4F3EA` / `#15291F` |
| `warning` | `#A15F05` | `#F0A93A` | `#FCEFD9` / `#33260F` |
| `danger` | `#C23636` | `#F06A6A` | `#FBE8E7` / `#361A1A` |
| `info` | `#2358D8` | `#6D9BFF` | `#E6EEFD` / `#172440` |
| `on-solid` | `#FFFFFF` | `#12100E` | Chữ trên nền status **đặc** |

Pattern chuẩn: nền `*-soft` + chữ/icon `text-*`. Nền đặc `bg-success` phải đi với `text-on-solid`.

### 3.4 Kid palette (khu Học sinh, gamification, minh họa)

| Token | Light | Dark | Soft Light / Dark | Ý nghĩa |
|---|---|---|---|---|
| `sky` | `#3E86F5` | `#6AA3FF` | `#E3EEFE` / `#16233B` | Nhiệm vụ |
| `mint` | `#16A57A` | `#3CD3A2` | `#DDF4EC` / `#12291F` | Tiến bộ |
| `sun` | `#F5A30B` | `#FFBD3D` | `#FEF1D3` / `#35280C` | Chuỗi (streak) |
| `grape` | `#7C5CF6` | `#A08BFF` | `#EEE9FE` / `#231D3D` | XP / Level |
| `coral` | `#F2624F` | `#FF8A7A` | `#FDE6E2` / `#3A1E1A` | Năng lượng |
| `rose` | `#E0578F` | `#FF86B5` | `#FCE6EF` / `#3A1A28` | Thân thiện |

Kid palette chỉ tăng độ phong phú ở khu Học sinh, landing và minh họa. Không dùng làm màu trạng thái nghiệp vụ.

### 3.5 Trạng thái điểm danh (thay đổi so với v1)

| Status | Nhãn | Màu | Icon (Lucide) | Lý do |
|---|---|---|---|---|
| PRESENT | Có mặt | `success` | `CheckCircle2` | |
| ABSENT | Vắng | `danger` | `XCircle` | |
| EXCUSED | Có phép | `info` | `FileCheck2` | v1 dùng vàng — dễ nhầm với cam "Đi muộn" |
| LATE | Đi muộn | `warning` | `Clock` | |

Luôn hiển thị icon + nhãn; không chỉ chấm màu.

## 4. Typography

### 4.1 Font stack

| Vai trò | Font | Utility | Ghi chú |
|---|---|---|---|
| UI + Heading | **Geist** 400/500/600/700/800 | `font-sans` (mặc định) | Có subset `vietnamese` đầy đủ |
| Số liệu, mã | **Geist Mono** 500/600 | `font-mono` | Điểm số, mã HS, thống kê. Có thể dùng `tabular-nums` với Geist |
| Trích dẫn | **Fraunces** italic 400/600 | `font-accent` | Chỉ cho Lời Chúa, nhận xét GLV, 1 từ nhấn trong hero landing |

**Cấm:** Inter, Noto Serif (v1), `font-serif`.

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400..800&family=Geist+Mono:wght@500;600&family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,600&display=swap" rel="stylesheet">
```

### 4.2 Type scale (rem — co giãn theo cỡ chữ người dùng)

| Utility | rem | px @16 | Weight | Tracking | Usage |
|---|---:|---:|---:|---|---|
| `text-display` | clamp(2.25rem, 5vw, 5rem) | 36–80 | 700 | -0.035em | Hero landing |
| `text-4xl` | 2.25 | 36 | 700 | -0.03em | Số lớn (điểm TB, level) |
| `text-3xl` | 1.875 | 30 | 700 | -0.025em | H1 desktop |
| `text-2xl` | 1.5 | 24 | 700 | -0.02em | H1 mobile / H2 desktop |
| `text-xl` | 1.25 | 20 | 600 | -0.015em | H2 mobile / tiêu đề card lớn |
| `text-lg` | 1.125 | 18 | 600 | -0.01em | Tiêu đề card, body Phụ huynh |
| `text-base` | 1 | 16 | 400 | 0 | Body mặc định, input |
| `text-sm` | 0.875 | 14 | 400/500 | 0 | Phụ trợ, label |
| `text-xs` | 0.75 | 12 | 500 | 0.01em | Metadata (không dùng cho nội dung chính; không dùng ở khu Phụ huynh) |

Quy tắc:
- Input luôn `text-base` trở lên (tránh iOS zoom).
- Heading: `font-bold tracking-tight` (hoặc `font-semibold`), line-height 1.15–1.3.
- Body: line-height 1.55; Phụ huynh 1.6.
- Không dùng `uppercase tracking-wider` cho tiêu đề nhóm (cảm giác meta-label rẻ tiền). Dùng sentence case `text-sm font-semibold text-ink-2`.

### 4.3 Cỡ chữ người dùng (Text size preference)

```css
html[data-text-size="md"] { font-size: 100%;   } /* 16px — Vừa (mặc định) */
html[data-text-size="lg"] { font-size: 112.5%; } /* 18px — Lớn (mặc định Phụ huynh) */
html[data-text-size="xl"] { font-size: 125%;   } /* 20px — Rất lớn */
```

Vì mọi kích thước dùng rem, đổi root font-size sẽ phóng to cả chữ, khoảng cách, control, icon (icon dùng `size-5` = 1.25rem).

## 5. Spacing

Dùng thang spacing mặc định của Tailwind (bội số 0.25rem = 4px @16). Không dùng giá trị px tùy ý.

| Ngữ cảnh | Admin | GLV | Phụ huynh | Học sinh |
|---|---|---|---|---|
| Padding card | `p-4` | `p-4 sm:p-5` | `p-5 sm:p-6` | `p-5 sm:p-6` |
| Gap giữa card | `gap-3 sm:gap-4` | `gap-3 sm:gap-4` | `gap-4 sm:gap-5` | `gap-4 sm:gap-5` |
| Gap giữa section | `space-y-6` | `space-y-6` | `space-y-8` | `space-y-8` |
| Page padding | `px-4 sm:px-6 lg:px-8` (mọi vai trò) |||

Landing (`/welcome`) dùng khoảng cách điện ảnh `py-32 md:py-48` giữa các section.

## 6. Radius

| Token | Utility | Mặc định | STUDENT | Usage |
|---|---|---:|---:|---|
| `--radius-xs` | `rounded-xs` | 0.375rem | = | Tag nhỏ, checkbox |
| `--radius-sm` | `rounded-sm` | 0.625rem | = | Chip nhỏ, tooltip |
| `--radius-control` | `rounded-control` | 0.875rem | 1rem | Input, select, list item, tile |
| `--radius-card` | `rounded-card` | 1.25rem | 1.5rem | Card |
| `--radius-card-lg` | `rounded-card-lg` | 1.75rem | 2rem | Hero card, sheet, modal |
| pill | `rounded-full` | 9999px | = | **Button**, badge, avatar, bottom nav |

Button v2 mặc định bo tròn hoàn toàn (pill) — thân thiện với trẻ em và phụ huynh.

## 7. Elevation

| Utility | Light | Dark | Usage |
|---|---|---|---|
| `shadow-xs` | `0 1px 2px rgb(28 23 20 / .06)` | `0 1px 2px rgb(0 0 0 / .4)` | Control |
| `shadow-card` | `0 1px 2px rgb(28 23 20 / .04), 0 6px 20px -8px rgb(28 23 20 / .10)` | `0 1px 2px rgb(0 0 0 / .5), 0 8px 24px -10px rgb(0 0 0 / .6)` | Card mặc định |
| `shadow-float` | `0 16px 48px -16px rgb(28 23 20 / .30), 0 2px 8px rgb(28 23 20 / .06)` | `0 16px 48px -12px rgb(0 0 0 / .75)` | Bottom nav, popover, sheet |
| `shadow-glow` | `0 10px 28px -10px rgb(180 35 44 / .55)` | `0 10px 28px -10px rgb(217 59 68 / .6)` | Nút chính nổi (FAB) |

Surface hierarchy: `canvas` (L0) → `surface-2` (L1 section) → `surface` + `shadow-card` (L2 card) → `surface` + `shadow-float` (L3 floating).

**Glass** (header, bottom nav, landing nav): `bg-surface/75 backdrop-blur-xl border border-line/70`.

## 8. Iconography

**Lucide** duy nhất. Stroke 2 (Học sinh có thể 2.25), linecap/linejoin round.

| Size | Utility | Usage |
|---|---|---|
| 16 | `size-4` | Inline, metadata |
| 20 | `size-5` | Mặc định, nav |
| 24 | `size-6` | Nav Học sinh/Phụ huynh, tile |
| 32 | `size-8` | Feature |
| 40–48 | `size-10`/`size-12` | Empty state, huy hiệu |

Icon tile: icon đặt trong khối `size-10 rounded-control bg-{color}-soft text-{color}` — tạo nhịp màu có kiểm soát.

## 9. Controls

### 9.1 Chiều cao control theo vai trò

| Token | Utility | ADMIN | GLV | PARENT | STUDENT |
|---|---|---:|---:|---:|---:|
| `--control` | `h-(--control)` | 2.75rem (44) | 3rem (48) | 3.5rem (56) | 3.5rem (56) |
| `--control-sm` | | 2.25rem | 2.25rem | 2.75rem | 2.75rem |
| `--control-lg` | | 3.25rem | 3.25rem | 3.75rem | 3.75rem |

Button `size="md"` = `--control`; `size="sm"` = `--control-sm`; `size="lg"` = `--control-lg`; `size="parent"` = 3.5rem cố định.

### 9.2 Button

Variants: `primary` (bg-primary, text-on-primary, shadow-glow khi hover), `secondary` (bg-night text-on-night), `outline` (bg-surface border-line-strong text-ink), `ghost` (text-ink-2 hover:bg-surface-2), `danger` (bg-danger text-on-solid).
Hình dạng: `rounded-full`, font 600, gap icon 0.5rem.
Press: `active:scale-[0.97]` transition 140ms. Loading giữ nguyên kích thước.

### 9.3 Input

Nền `surface`, border `line-strong`, bo `rounded-control`, `text-base`, cao `--control` (tối thiểu 3rem). Focus: border `primary` + ring `primary/20` 4px. Error: border `danger` + message có icon.

## 10. Focus

```css
:focus-visible {
  outline: 3px solid color-mix(in oklab, var(--primary) 55%, transparent);
  outline-offset: 2px;
}
```

## 11. Motion

### 11.1 Token

| Token | Giá trị | GSAP tương đương | Usage |
|---|---|---|---|
| `--ease-out-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` | `power3.out` | Mặc định vào/ra |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `back.out(1.6)` | Chip, huy hiệu, FAB |
| `--dur-fast` | 140ms | 0.14 | Press, hover |
| `--dur-base` | 220ms | 0.22 | Toggle, popover |
| `--dur-slow` | 420ms | 0.42 | Page enter, sheet |

### 11.2 GSAP (thư viện `gsap` + `@gsap/react`, bọc trong `src/lib/motion.ts`)

| Pattern | API | Mô tả |
|---|---|---|
| Stagger reveal | `useReveal(ref)` + `data-reveal` trên con | y 16 → 0, opacity 0 → 1, 0.5s, stagger 0.045 |
| Page enter | AppShell tự áp khi đổi route | y 10 → 0, opacity, 0.28s |
| Count up | `<CountUp value={128} decimals={0} />` | Đếm số 0.9s `power2.out` |
| Progress fill | `<ProgressBar>` / `<ProgressRing>` | Lấp đầy từ 0 khi mount |
| Celebrate | `celebrate(element)` | Burst 14 hạt màu kid palette, 0.9s |
| Hover physics | CSS | Media trong `overflow-hidden`: `group-hover:scale-105 transition-transform duration-700 ease-out` |
| Landing | ScrollTrigger | Card Stacking (pin + scale), Scrubbing Text Reveal (word opacity 0.12 → 1) |

Tất cả pattern GSAP dùng `gsap.matchMedia()` với `(prefers-reduced-motion: no-preference)`; khi reduce → hiển thị trạng thái cuối ngay lập tức.

## 12. Role-based adaptation (`data-role`)

```text
<div data-role="STUDENT" class="app-shell">...</div>
```

| Thuộc tính | ADMIN | GLV | PARENT | STUDENT |
|---|---|---|---|---|
| Density | Compact | Comfortable | Spacious | Playful |
| Cỡ chữ mặc định | Vừa | Vừa | **Lớn** | Vừa |
| `--control` | 44 | 48 | 56 | 56 |
| `--radius-card` | 20 | 20 | 20 | 24 |
| Bottom nav label | có | có | có (to hơn) | có (to hơn) |
| Giọng văn | Chuyên môn | Ngắn, hành động | Lịch sự, đời thường ("Con...") | Thân thiện, xưng "em" |
| Kid palette | Không | Không | Hạn chế | Có |
| Nút trung tâm bottom nav | — | **Điểm danh** | — | — |

Custom variant Tailwind: `student:`, `parent:`, `glv:`, `admin:` (VD `student:rounded-card-lg`).

## 13. Z-index

| Token | Giá trị |
|---|---:|
| `--z-sticky` | 20 |
| `--z-header` | 30 |
| `--z-nav` | 40 |
| `--z-overlay` | 50 |
| `--z-modal` | 60 |
| `--z-toast` | 70 |
| `--z-demo` | 80 |

## 14. Breakpoints

Mặc định Tailwind: `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`. Sidebar hiện từ `lg`; bottom nav hiện dưới `lg`.

## 15. Data visualization

| Token | Giá trị |
|---|---|
| `--chart-1` | `primary` |
| `--chart-2` | `info` |
| `--chart-3` | `success` |
| `--chart-4` | `warning` |
| `--chart-5` | `grape` |
| grid | `line` |
| label | `ink-3` |

Tối đa 5 màu/biểu đồ; bar bo tròn `rounded-full`; luôn có nhãn số.

## 16. Complete Token Source (`src/tokens.css`)

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
@custom-variant student (&:where([data-role="STUDENT"], [data-role="STUDENT"] *));
@custom-variant parent (&:where([data-role="PARENT"], [data-role="PARENT"] *));
@custom-variant glv (&:where([data-role="GLV"], [data-role="GLV"] *));
@custom-variant admin (&:where([data-role="ADMIN"], [data-role="ADMIN"] *));

@theme inline {
  --font-sans: "Geist", ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Consolas, monospace;
  --font-accent: "Fraunces", Georgia, serif;

  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-surface-3: var(--surface-3);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-night: var(--night);
  --color-on-night: var(--on-night);

  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-soft: var(--primary-soft);
  --color-primary-ink: var(--primary-ink);
  --color-on-primary: var(--on-primary);
  --color-gold: var(--gold);
  --color-gold-soft: var(--gold-soft);
  --color-gold-ink: var(--gold-ink);

  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-warning: var(--warning);
  --color-warning-soft: var(--warning-soft);
  --color-danger: var(--danger);
  --color-danger-soft: var(--danger-soft);
  --color-info: var(--info);
  --color-info-soft: var(--info-soft);
  --color-on-solid: var(--on-solid);

  --color-sky: var(--sky);
  --color-sky-soft: var(--sky-soft);
  --color-mint: var(--mint);
  --color-mint-soft: var(--mint-soft);
  --color-sun: var(--sun);
  --color-sun-soft: var(--sun-soft);
  --color-grape: var(--grape);
  --color-grape-soft: var(--grape-soft);
  --color-coral: var(--coral);
  --color-coral-soft: var(--coral-soft);
  --color-rose: var(--rose);
  --color-rose-soft: var(--rose-soft);

  --radius-xs: 0.375rem;
  --radius-sm: 0.625rem;
  --radius-control: var(--r-control);
  --radius-card: var(--r-card);
  --radius-card-lg: var(--r-card-lg);

  --shadow-xs: var(--elev-xs);
  --shadow-card: var(--elev-card);
  --shadow-float: var(--elev-float);
  --shadow-glow: var(--elev-glow);

  --text-display: clamp(2.25rem, 5vw, 5rem);
  --text-display--line-height: 1.02;
  --text-display--letter-spacing: -0.035em;

  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

:root {
  color-scheme: light;
  --canvas: #F7F3ED;
  --surface: #FFFFFF;
  --surface-2: #F2ECE3;
  --surface-3: #E9E1D5;
  --ink: #1C1714;
  --ink-2: #574D45;
  --ink-3: #7A6F66;
  --line: #E7DFD4;
  --line-strong: #D4C8B9;
  --night: #1C1714;
  --on-night: #F7F3ED;

  --primary: #B4232C;
  --primary-hover: #971C24;
  --primary-soft: #FBE9EA;
  --primary-ink: #9E1F27;
  --on-primary: #FFFFFF;
  --gold: #E3B341;
  --gold-soft: #FBF1D6;
  --gold-ink: #7A5610;

  --success: #157A4F;
  --success-soft: #E4F3EA;
  --warning: #A15F05;
  --warning-soft: #FCEFD9;
  --danger: #C23636;
  --danger-soft: #FBE8E7;
  --info: #2358D8;
  --info-soft: #E6EEFD;
  --on-solid: #FFFFFF;

  --sky: #3E86F5;   --sky-soft: #E3EEFE;
  --mint: #16A57A;  --mint-soft: #DDF4EC;
  --sun: #F5A30B;   --sun-soft: #FEF1D3;
  --grape: #7C5CF6; --grape-soft: #EEE9FE;
  --coral: #F2624F; --coral-soft: #FDE6E2;
  --rose: #E0578F;  --rose-soft: #FCE6EF;

  --r-control: 0.875rem;
  --r-card: 1.25rem;
  --r-card-lg: 1.75rem;

  --control: 2.75rem;
  --control-sm: 2.25rem;
  --control-lg: 3.25rem;

  --elev-xs: 0 1px 2px rgb(28 23 20 / 0.06);
  --elev-card: 0 1px 2px rgb(28 23 20 / 0.04), 0 6px 20px -8px rgb(28 23 20 / 0.10);
  --elev-float: 0 16px 48px -16px rgb(28 23 20 / 0.30), 0 2px 8px rgb(28 23 20 / 0.06);
  --elev-glow: 0 10px 28px -10px rgb(180 35 44 / 0.55);

  --dur-fast: 140ms;
  --dur-base: 220ms;
  --dur-slow: 420ms;

  --chart-1: var(--primary);
  --chart-2: var(--info);
  --chart-3: var(--success);
  --chart-4: var(--warning);
  --chart-5: var(--grape);
}

[data-theme="dark"] {
  color-scheme: dark;
  --canvas: #110F0D;
  --surface: #1A1714;
  --surface-2: #231F1B;
  --surface-3: #2E2924;
  --ink: #F5EFE7;
  --ink-2: #C2B7AB;
  --ink-3: #948A7F;
  --line: #2F2A25;
  --line-strong: #433C35;
  --night: #2A221D;
  --on-night: #F7F3ED;

  --primary: #D93B44;
  --primary-hover: #C5323B;
  --primary-soft: #3A2020;
  --primary-ink: #FF9A9F;
  --gold: #EDBE52;
  --gold-soft: #3A2F16;
  --gold-ink: #F3CF7A;

  --success: #3CC48A;  --success-soft: #15291F;
  --warning: #F0A93A;  --warning-soft: #33260F;
  --danger: #F06A6A;   --danger-soft: #361A1A;
  --info: #6D9BFF;     --info-soft: #172440;
  --on-solid: #12100E;

  --sky: #6AA3FF;   --sky-soft: #16233B;
  --mint: #3CD3A2;  --mint-soft: #12291F;
  --sun: #FFBD3D;   --sun-soft: #35280C;
  --grape: #A08BFF; --grape-soft: #231D3D;
  --coral: #FF8A7A; --coral-soft: #3A1E1A;
  --rose: #FF86B5;  --rose-soft: #3A1A28;

  --elev-xs: 0 1px 2px rgb(0 0 0 / 0.4);
  --elev-card: 0 1px 2px rgb(0 0 0 / 0.5), 0 8px 24px -10px rgb(0 0 0 / 0.6);
  --elev-float: 0 16px 48px -12px rgb(0 0 0 / 0.75);
  --elev-glow: 0 10px 28px -10px rgb(217 59 68 / 0.6);
}

[data-role="GLV"]     { --control: 3rem; }
[data-role="PARENT"]  { --control: 3.5rem; --control-sm: 2.75rem; --control-lg: 3.75rem; }
[data-role="STUDENT"] { --control: 3.5rem; --control-sm: 2.75rem; --control-lg: 3.75rem;
                        --r-control: 1rem; --r-card: 1.5rem; --r-card-lg: 2rem; }

html[data-text-size="md"] { font-size: 100%; }
html[data-text-size="lg"] { font-size: 112.5%; }
html[data-text-size="xl"] { font-size: 125%; }
```

## 17. Frontend Rules v2

```text
RULE-001 Mobile-first.
RULE-002 Chỉ dùng semantic token utility; cấm hex và palette mặc định Tailwind.
RULE-003 Chỉ dùng thang spacing/type rem; cấm px tùy ý (trừ border 1px, outline).
RULE-004 Không dùng đỏ brand làm nền toàn màn hình (khối night được phép).
RULE-005 Primary action = primary (đỏ); Thành tích = gold.
RULE-006 Error = danger; Success = success; Warning = warning; Info = info.
RULE-007 Font: Geist (UI/heading), Geist Mono (số), Fraunces italic (trích dẫn). Cấm Inter, cấm font-serif.
RULE-008 Vùng chạm ≥ 44px; Phụ huynh/Học sinh ≥ 52px.
RULE-009 Input ≥ 48px và ≥ text-base.
RULE-010 Phụ huynh mặc định cỡ chữ Lớn; không text-xs trong khu Phụ huynh.
RULE-011 Chỉ Lucide icon.
RULE-012 Không icon-only cho thao tác quan trọng của Phụ huynh/Học sinh.
RULE-013 Focus-visible luôn thấy.
RULE-014 Không chỉ dùng màu để biểu diễn trạng thái (icon + chữ).
RULE-015 Kid palette chỉ ở khu Học sinh, landing, minh họa.
RULE-016 Mọi component phải đẹp ở cả Light và Dark.
RULE-017 Không emoji; không meta-label kiểu "SECTION 01".
RULE-018 Animation đi qua lib/motion, tôn trọng reduced-motion.
```

## 18. Summary

```text
Primary      #B4232C (dark #D93B44)
Gold         #E3B341
Canvas       #F7F3ED (dark #110F0D)
Ink          #1C1714 (dark #F5EFE7)

Font         Geist / Geist Mono / Fraunces italic (accent)
Base         16px — người dùng chọn 16 / 18 / 20
Parent       mặc định 18px

Button       pill, 44–56px theo vai trò
Input        rounded 14px, ≥ 48px
Card         rounded 20px (Học sinh 24px)
Theme        Light / Dark
Motion       GSAP, reduced-motion safe
```
