# 01 — DESIGN SYSTEM & DESIGN TOKENS

## Nền tảng
**Quản lý Học tập Giáo lý – Đoàn Kitô Vua**

## 1. Design Principles

| Principle | Quy tắc triển khai |
|---|---|
| Mobile-first | Thiết kế từ viewport 320px trở lên, sau đó mở rộng cho tablet/iPad/desktop |
| Touch-first | Tất cả vùng thao tác chính có kích thước tối thiểu 44×44px |
| Fast Input | Điểm danh/nhập điểm ưu tiên thao tác 1 tay, giảm số lần chuyển màn hình |
| Clear Hierarchy | Mỗi màn hình chỉ có 1 Primary Action chính |
| Elder-friendly | Chữ dễ đọc, tương phản cao, khoảng cách rộng, hạn chế menu lồng nhiều tầng |
| Child-friendly | Gamification dùng màu/accent/icon nhưng không làm ảnh hưởng khả năng đọc |
| Accessible | Không chỉ dùng màu để thể hiện trạng thái; luôn có icon/text hỗ trợ |
| Consistent | Cùng một token được dùng xuyên suốt hệ thống |
| Faith & Community | Nhận diện mang tính cộng đồng Công giáo nhưng UI hiện đại, không quá trang trí |

## 2. Brand Direction

**Keyword:** `Tin cậy` · `Ấm áp` · `Hiện đại` · `Rõ ràng` · `Cộng đồng` · `Thân thiện`

Không dùng đỏ/vàng quá chói. Đỏ chuyển sang sắc trầm; vàng ấm; nền hơi ấm; text chính là xám than/navy đậm.

## 3. Brand Color — Primary Red

| Token | Hex | Usage |
|---|---:|---|
| `primary-50` | `#FFF1F2` | Background rất nhẹ |
| `primary-100` | `#FFE4E6` | Selected background |
| `primary-200` | `#FECDD3` | Border/highlight |
| `primary-300` | `#FDA4AF` | Decorative |
| `primary-400` | `#FB7185` | Hover-light |
| `primary-500` | `#D64550` | Brand accent |
| `primary-600` | `#B4232C` | **Primary Brand** |
| `primary-700` | `#941D25` | Hover / pressed |
| `primary-800` | `#7A1A21` | Strong emphasis |
| `primary-900` | `#641A1E` | Deep accent |

**Primary brand mặc định:** `#B4232C`

## 4. Brand Gold

| Token | Hex | Usage |
|---|---:|---|
| `gold-50` | `#FFFBEB` | Background |
| `gold-100` | `#FEF3C7` | Highlight |
| `gold-200` | `#FDE68A` | Soft accent |
| `gold-300` | `#FCD34D` | Decorative |
| `gold-400` | `#F4C95D` | Accent |
| `gold-500` | `#E3B341` | **Brand Gold** |
| `gold-600` | `#C99526` | Strong accent |
| `gold-700` | `#A87917` | Dark accent |
| `gold-800` | `#8B6419` | Text/emphasis |

Gold chủ yếu dùng cho huy hiệu, thành tích, rank/level, highlight và chi tiết thương hiệu; không dùng cho quá nhiều Primary Button.

## 5. Neutral Color System

| Token | Hex | Usage |
|---|---:|---|
| `neutral-0` | `#FFFFFF` | Card / surface |
| `neutral-50` | `#FAFAF9` | App background |
| `neutral-100` | `#F5F5F4` | Secondary background |
| `neutral-200` | `#E7E5E4` | Divider / border |
| `neutral-300` | `#D6D3D1` | Disabled border |
| `neutral-400` | `#A8A29E` | Placeholder |
| `neutral-500` | `#78716C` | Secondary text |
| `neutral-600` | `#57534E` | Body secondary |
| `neutral-700` | `#44403C` | Body primary |
| `neutral-800` | `#292524` | Heading/body emphasis |
| `neutral-900` | `#1C1917` | Strongest text |

Không dùng `#000000` cho text thông thường. Text chính `neutral-800`, text phụ `neutral-600`, placeholder `neutral-400`, border `neutral-200`.

## 6. Semantic Colors

### Success
`success-50 #ECFDF3` · `success-100 #D1FAE5` · `success-500 #22A06B` · `success-600 #168154` · `success-700 #146C47`

### Error
`error-50 #FEF2F2` · `error-100 #FEE2E2` · `error-500 #DC4C4C` · `error-600 #C73A3A` · `error-700 #A52D2D`

### Warning
`warning-50 #FFF8E7` · `warning-100 #FEF0C7` · `warning-500 #D9901A` · `warning-600 #B86F08` · `warning-700 #925A0A`

### Info
`info-50 #EFF6FF` · `info-100 #DBEAFE` · `info-500 #3B82F6` · `info-600 #2563EB` · `info-700 #1D4ED8`

## 7. Gamification Colors

| Token | Hex | Usage |
|---|---:|---|
| `game-purple` | `#7C5CFC` | XP / Level |
| `game-blue` | `#3B82F6` | Mission |
| `game-cyan` | `#18B7C9` | Progress |
| `game-orange` | `#F28C28` | Streak |
| `game-gold` | `#E3B341` | Badge / Achievement |
| `game-pink` | `#E86A92` | Friendly accent |

Chỉ tăng visual richness ở khu vực học sinh.

## 8. Semantic UI Tokens

```css
:root {
  --color-bg-page: var(--color-neutral-50);
  --color-bg-surface: var(--color-neutral-0);
  --color-bg-muted: var(--color-neutral-100);

  --color-text-primary: var(--color-neutral-800);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-muted: var(--color-neutral-400);
  --color-text-inverse: var(--color-neutral-0);

  --color-border-default: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-300);

  --color-primary: var(--color-primary-600);
  --color-primary-hover: var(--color-primary-700);
  --color-primary-active: var(--color-primary-800);
  --color-primary-soft: var(--color-primary-50);

  --color-accent: var(--color-gold-500);
  --color-accent-soft: var(--color-gold-50);

  --color-success: var(--color-success-600);
  --color-success-soft: var(--color-success-50);

  --color-warning: var(--color-warning-600);
  --color-warning-soft: var(--color-warning-50);

  --color-error: var(--color-error-600);
  --color-error-soft: var(--color-error-50);

  --color-info: var(--color-info-600);
  --color-info-soft: var(--color-info-50);
}
```

## 9. Typography

### Heading — Serif

Ưu tiên:
```text
"Noto Serif", "Source Serif 4", "Georgia", serif
```

### Body — Sans-serif

Ưu tiên:
```text
"Inter", "Noto Sans", "Segoe UI", sans-serif
```

Inter là font UI mặc định; Noto Serif phù hợp heading tiếng Việt và ngữ cảnh Giáo lý.

## 10. Typography Scale

| Token | Size | Line Height | Weight | Usage |
|---|---:|---:|---:|---|
| `display-xl` | 40px | 1.15 | 700 | Hero / desktop |
| `display-lg` | 32px | 1.2 | 700 | Page hero |
| `heading-xl` | 28px | 1.25 | 700 | H1 |
| `heading-lg` | 24px | 1.3 | 700 | H2 |
| `heading-md` | 20px | 1.35 | 700 | H3 |
| `heading-sm` | 18px | 1.4 | 700 | Section title |
| `body-lg` | 18px | 1.55 | 400 | Parent-facing |
| `body-md` | 16px | 1.5 | 400 | Default body |
| `body-sm` | 14px | 1.45 | 400 | Supporting |
| `caption` | 12px | 1.4 | 500 | Metadata |
| `button-lg` | 16px | 1.0 | 600 | Large button |
| `button-md` | 15px | 1.0 | 600 | Default button |
| `button-sm` | 14px | 1.0 | 600 | Compact |
| `input-md` | 16px | 1.0 | 400 | Form input |

Input không nhỏ hơn 16px. Parent ưu tiên body 18px.

## 11. Typography CSS

```css
:root {
  --font-family-heading:
    "Noto Serif",
    "Source Serif 4",
    Georgia,
    serif;

  --font-family-body:
    "Inter",
    "Noto Sans",
    "Segoe UI",
    sans-serif;

  --font-size-display-xl: 40px;
  --font-size-display-lg: 32px;
  --font-size-heading-xl: 28px;
  --font-size-heading-lg: 24px;
  --font-size-heading-md: 20px;
  --font-size-heading-sm: 18px;
  --font-size-body-lg: 18px;
  --font-size-body-md: 16px;
  --font-size-body-sm: 14px;
  --font-size-caption: 12px;
  --font-size-button-lg: 16px;
  --font-size-button-md: 15px;
  --font-size-button-sm: 14px;
  --font-size-input-md: 16px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.15;
  --line-height-heading: 1.3;
  --line-height-body: 1.5;
  --line-height-relaxed: 1.6;
}
```

## 12. Spacing

Base unit = **4px**.

| Token | Value |
|---|---:|
| `space-0` | 0px |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |

```css
:root {
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

## 13. Layout

```css
:root {
  --container-mobile: 100%;
  --container-tablet: 768px;
  --container-desktop: 1200px;
  --container-wide: 1440px;

  --page-padding-mobile: 16px;
  --page-padding-tablet: 24px;
  --page-padding-desktop: 32px;
}
```

## 14. Radius

| Token | Value | Usage |
|---|---:|---|
| `radius-none` | 0px | Special |
| `radius-sm` | 6px | Small UI |
| `radius-md` | 10px | Input/Button |
| `radius-lg` | 14px | Card |
| `radius-xl` | 18px | Large card |
| `radius-2xl` | 24px | Feature card |
| `radius-full` | 9999px | Avatar/Badge/Pill |

## 15. Shadows

```css
:root {
  --shadow-xs: 0 1px 2px rgba(28,25,23,.05);
  --shadow-sm: 0 2px 6px rgba(28,25,23,.07);
  --shadow-md: 0 6px 16px rgba(28,25,23,.08);
  --shadow-lg: 0 12px 28px rgba(28,25,23,.10);
  --shadow-xl: 0 18px 40px rgba(28,25,23,.12);
}
```

Card mặc định shadow nhẹ; không lạm dụng glassmorphism/3D.

## 16. Z-index

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-header: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-toast: 700;
  --z-tooltip: 800;
}
```

## 17. Iconography

Đề xuất **Lucide Icons**.

```text
Stroke: 2px
Linecap: round
Linejoin: round
```

Không trộn nhiều icon family.

| Token | Size | Usage |
|---|---:|---|
| `icon-xs` | 14px | Metadata |
| `icon-sm` | 16px | Inline |
| `icon-md` | 20px | Default |
| `icon-lg` | 24px | Navigation |
| `icon-xl` | 32px | Feature |
| `icon-2xl` | 40px | Empty state |
| `icon-3xl` | 48px | Gamification |

## 18. Touch Targets

```css
:root {
  --touch-target-min: 44px;
  --touch-target-comfortable: 48px;
  --touch-target-large: 52px;
  --touch-target-parent: 56px;
}
```

| Role | Khuyến nghị |
|---|---:|
| Admin | 44–48px |
| GLV | 48–52px |
| Parent | 52–56px |
| Student | 48–56px |

## 19. Button

```css
:root {
  --button-height-sm: 36px;
  --button-height-md: 44px;
  --button-height-lg: 52px;
  --button-height-parent: 56px;
  --button-radius: 10px;
  --button-font-weight: 600;
}
```

Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`.

States: `DEFAULT`, `HOVER`, `FOCUS`, `ACTIVE`, `DISABLED`, `LOADING`.

## 20. Input

```css
:root {
  --input-height-sm: 40px;
  --input-height-md: 48px;
  --input-height-lg: 52px;
  --input-height-parent: 56px;
  --input-padding-x: 16px;
  --input-radius: 10px;
  --input-font-size: 16px;
  --input-line-height: 1.4;
}
```

States: Default, Hover, Focus, Filled, Disabled, Readonly, Error.

## 21. Focus

```css
:root {
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
  --focus-ring-color: rgba(180, 35, 44, 0.22);
}

:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

## 22. Motion

```css
:root {
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

Animation chỉ hỗ trợ hiểu trạng thái; không dùng quá mức cho nghiệp vụ.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 23. Breakpoints

```css
:root {
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;
}
```

## 24. Surface Hierarchy

```text
Level 0 — Page Background
Level 1 — Section Background
Level 2 — Card / Panel
Level 3 — Modal / Popover / Floating UI
```

## 25. Role-based Visual Density

| Role | Density | Base Font | Control |
|---|---|---|---|
| Admin | Compact | 14–16px | 44–48px |
| GLV | Comfortable | 16px | 48–52px |
| Parent | Spacious | 17–18px | 52–56px |
| Student | Comfortable | 16–18px | 48–56px |

### Parent Mode
```css
:root {
  --parent-font-size-base: 18px;
  --parent-line-height: 1.6;
  --parent-button-height: 56px;
  --parent-input-height: 56px;
  --parent-card-padding: 20px;
  --parent-section-gap: 24px;
  --parent-icon-size: 24px;
}
```

Không icon-only action cho thao tác quan trọng của Parent.

### GLV Fast Input
```css
:root {
  --glv-input-height: 52px;
  --glv-row-height: 60px;
  --glv-touch-target: 52px;
  --glv-grid-gap: 8px;
  --glv-section-gap: 16px;
}
```

### Student Gamification
```css
:root {
  --student-xp-color: var(--game-purple);
  --student-level-color: var(--game-blue);
  --student-streak-color: var(--game-orange);
  --student-badge-color: var(--game-gold);
  --student-card-radius: 18px;
  --student-progress-height: 10px;
}
```

## 26. Data Visualization

```css
:root {
  --chart-1: var(--color-primary);
  --chart-2: var(--color-info);
  --chart-3: var(--color-success);
  --chart-4: var(--color-warning);
  --chart-5: var(--game-purple);

  --chart-grid: var(--color-neutral-200);
  --chart-label: var(--color-neutral-600);
  --chart-axis: var(--color-neutral-300);
}
```

Tối đa 5 màu chính trong một chart; đỏ trong chart mang nghĩa cảnh báo/âm tính khi phù hợp.

## 27. Accessibility Rules

1. Không dùng màu làm tín hiệu duy nhất.
2. Focus state luôn nhìn thấy bằng keyboard.
3. Icon button có accessible label.
4. Error message gắn với field.
5. Text chính có contrast cao.
6. Button nghiệp vụ quan trọng không chỉ có icon.
7. Form input có label rõ ràng.

## 28. Complete Token Source

```css
:root {
  --color-primary-50: #FFF1F2;
  --color-primary-100: #FFE4E6;
  --color-primary-200: #FECDD3;
  --color-primary-300: #FDA4AF;
  --color-primary-400: #FB7185;
  --color-primary-500: #D64550;
  --color-primary-600: #B4232C;
  --color-primary-700: #941D25;
  --color-primary-800: #7A1A21;
  --color-primary-900: #641A1E;

  --color-gold-50: #FFFBEB;
  --color-gold-100: #FEF3C7;
  --color-gold-200: #FDE68A;
  --color-gold-300: #FCD34D;
  --color-gold-400: #F4C95D;
  --color-gold-500: #E3B341;
  --color-gold-600: #C99526;
  --color-gold-700: #A87917;
  --color-gold-800: #8B6419;

  --color-neutral-0: #FFFFFF;
  --color-neutral-50: #FAFAF9;
  --color-neutral-100: #F5F5F4;
  --color-neutral-200: #E7E5E4;
  --color-neutral-300: #D6D3D1;
  --color-neutral-400: #A8A29E;
  --color-neutral-500: #78716C;
  --color-neutral-600: #57534E;
  --color-neutral-700: #44403C;
  --color-neutral-800: #292524;
  --color-neutral-900: #1C1917;

  --color-success-50: #ECFDF3;
  --color-success-100: #D1FAE5;
  --color-success-500: #22A06B;
  --color-success-600: #168154;
  --color-success-700: #146C47;

  --color-error-50: #FEF2F2;
  --color-error-100: #FEE2E2;
  --color-error-500: #DC4C4C;
  --color-error-600: #C73A3A;
  --color-error-700: #A52D2D;

  --color-warning-50: #FFF8E7;
  --color-warning-100: #FEF0C7;
  --color-warning-500: #D9901A;
  --color-warning-600: #B86F08;
  --color-warning-700: #925A0A;

  --color-info-50: #EFF6FF;
  --color-info-100: #DBEAFE;
  --color-info-500: #3B82F6;
  --color-info-600: #2563EB;
  --color-info-700: #1D4ED8;

  --game-purple: #7C5CFC;
  --game-blue: #3B82F6;
  --game-cyan: #18B7C9;
  --game-orange: #F28C28;
  --game-gold: #E3B341;
  --game-pink: #E86A92;

  --color-bg-page: var(--color-neutral-50);
  --color-bg-surface: var(--color-neutral-0);
  --color-bg-muted: var(--color-neutral-100);

  --color-text-primary: var(--color-neutral-800);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-muted: var(--color-neutral-400);
  --color-text-inverse: var(--color-neutral-0);

  --color-border-default: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-300);

  --color-primary: var(--color-primary-600);
  --color-primary-hover: var(--color-primary-700);
  --color-primary-active: var(--color-primary-800);
  --color-primary-soft: var(--color-primary-50);

  --color-accent: var(--color-gold-500);
  --color-accent-soft: var(--color-gold-50);

  --color-success: var(--color-success-600);
  --color-success-soft: var(--color-success-50);

  --color-warning: var(--color-warning-600);
  --color-warning-soft: var(--color-warning-50);

  --color-error: var(--color-error-600);
  --color-error-soft: var(--color-error-50);

  --color-info: var(--color-info-600);
  --color-info-soft: var(--color-info-50);

  --font-family-heading: "Noto Serif", "Source Serif 4", Georgia, serif;
  --font-family-body: "Inter", "Noto Sans", "Segoe UI", sans-serif;

  --font-size-display-xl: 40px;
  --font-size-display-lg: 32px;
  --font-size-heading-xl: 28px;
  --font-size-heading-lg: 24px;
  --font-size-heading-md: 20px;
  --font-size-heading-sm: 18px;
  --font-size-body-lg: 18px;
  --font-size-body-md: 16px;
  --font-size-body-sm: 14px;
  --font-size-caption: 12px;
  --font-size-button-lg: 16px;
  --font-size-button-md: 15px;
  --font-size-button-sm: 14px;
  --font-size-input-md: 16px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.15;
  --line-height-heading: 1.3;
  --line-height-body: 1.5;
  --line-height-relaxed: 1.6;

  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  --radius-none: 0px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  --shadow-xs: 0 1px 2px rgba(28,25,23,.05);
  --shadow-sm: 0 2px 6px rgba(28,25,23,.07);
  --shadow-md: 0 6px 16px rgba(28,25,23,.08);
  --shadow-lg: 0 12px 28px rgba(28,25,23,.10);
  --shadow-xl: 0 18px 40px rgba(28,25,23,.12);

  --icon-xs: 14px;
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;
  --icon-xl: 32px;
  --icon-2xl: 40px;
  --icon-3xl: 48px;

  --touch-target-min: 44px;
  --touch-target-comfortable: 48px;
  --touch-target-large: 52px;
  --touch-target-parent: 56px;

  --button-height-sm: 36px;
  --button-height-md: 44px;
  --button-height-lg: 52px;
  --button-height-parent: 56px;
  --button-radius: 10px;
  --button-font-weight: 600;

  --input-height-sm: 40px;
  --input-height-md: 48px;
  --input-height-lg: 52px;
  --input-height-parent: 56px;
  --input-padding-x: 16px;
  --input-radius: 10px;
  --input-font-size: 16px;
  --input-line-height: 1.4;

  --container-mobile: 100%;
  --container-tablet: 768px;
  --container-desktop: 1200px;
  --container-wide: 1440px;

  --page-padding-mobile: 16px;
  --page-padding-tablet: 24px;
  --page-padding-desktop: 32px;

  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;

  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.2, 0.8, 0.2, 1);

  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
  --focus-ring-color: rgba(180, 35, 44, 0.22);

  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-header: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-toast: 700;
  --z-tooltip: 800;
}
```

## 29. Frontend Rules

```text
RULE-001 Mobile-first.
RULE-002 Không hard-code màu nếu token tương ứng tồn tại.
RULE-003 Không hard-code spacing ngoài hệ thống 4px.
RULE-004 Không dùng đỏ brand làm background toàn màn hình.
RULE-005 Primary action = Red; Achievement/Highlight = Gold.
RULE-006 Error = Red; Success = Green; Warning = Amber; Info = Blue.
RULE-007 Heading = Serif; Body/UI = Sans-serif.
RULE-008 Interactive element >= 44px.
RULE-009 Input mobile >= 48px.
RULE-010 Parent font >= 18px, control >= 52px.
RULE-011 Icon family thống nhất.
RULE-012 Không icon-only action quan trọng cho Parent.
RULE-013 Focus state luôn visible.
RULE-014 Không phụ thuộc màu duy nhất để biểu diễn state.
RULE-015 Gamification chỉ tăng visual richness ở Student area.
```

## 30. Summary

```text
Primary Red  #B4232C
Brand Gold   #E3B341
Surface      #FFFFFF / #FAFAF9
Text         #292524

Heading      Noto Serif
Body         Inter
Base         16px
Parent       18px

Spacing      4px base
Button       44–52px
Parent       56px
Input        48–52px
Card         14px
Modal        18px

Mobile-first
Touch-first
Fast-input
High-contrast
Accessible
Role-based density
```
