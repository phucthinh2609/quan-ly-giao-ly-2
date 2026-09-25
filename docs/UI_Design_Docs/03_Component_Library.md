# 03 — COMPONENT LIBRARY v2

## 1. Architecture

```text
TIER 0 — TOKENS            src/tokens.css (01 §16)
TIER 0.5 — FOUNDATION      lib/motion.ts · hooks/useDraft.ts · context/PreferencesContext.tsx · ui/tone.ts
TIER 1 — PRIMITIVES        Button · IconButton · Input · NumericInput · Select · Checkbox · Radio · Badge · Avatar
                           Divider · Spinner · Skeleton · Card* · IconTile* · ProgressBar* · ProgressRing* · CountUp*
                           SegmentedControl*
TIER 2 — COMPOSITE         SearchBar · FilterBar · PageHeader · StatCard · EmptyState · ErrorState · DataTable
                           Pagination · Modal · BottomSheet · Toast
TIER 3 — APP SHELL         AppShell · Header · Sidebar · MobileBottomNav · Breadcrumb · DemoPanel* · PreferenceControls*
TIER 4 — DOMAIN            attendance/* · score/* · student/* · class/* · notification/* · parent/* · gamification/* · dashboard/*
TIER 5 — FEATURE / PAGE    pages/* · pages/public/* (WelcomePage*, LoginPage*)
```

`*` = mới ở v2.

## 2. Quy ước

- Component `PascalCase`, props `camelCase`, sự kiện `on + Verb`.
- **Giữ nguyên API props v1** (MIG-06); v2 chỉ thêm prop tùy chọn.
- className theo token (01 §3). Ghép class bằng template string hoặc `cn()` (`src/lib/cn.ts`, dùng `clsx` + `tailwind-merge`).
- Không emoji; icon Lucide.

```ts
type AsyncStatus = "idle" | "loading" | "success" | "error";
type Tone = "neutral" | "primary" | "gold" | "success" | "warning" | "danger" | "info"
          | "sky" | "mint" | "sun" | "grape" | "coral" | "rose";
```

## 3. Foundation

### 3.1 `ui/tone.ts`

```ts
export const TONE_SOFT: Record<Tone, string>   // "bg-success-soft text-success"
export const TONE_SOLID: Record<Tone, string>  // "bg-success text-on-solid"
export const TONE_TEXT: Record<Tone, string>   // "text-success"
export const TONE_BORDER: Record<Tone, string> // "border-success/30"
export const TONE_STROKE: Record<Tone, string> // "stroke-success" (SVG)
```

`neutral` = `bg-surface-2 text-ink-2` / `bg-ink text-canvas`. `primary` soft dùng `text-primary-ink`. `gold` solid dùng `text-ink`.

### 3.2 `lib/motion.ts`

```ts
export { gsap } from "gsap";
export { useGSAP } from "@gsap/react";
export function prefersReducedMotion(): boolean;
export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: {
  selector?: string;   // mặc định "[data-reveal]"
  y?: number;          // 16
  stagger?: number;    // 0.045
  delay?: number;      // 0
  deps?: unknown[];    // chạy lại khi deps đổi (VD đổi con, đổi tab)
}): React.RefObject<T>;
export function usePageEnter<T extends HTMLElement>(key: string): React.RefObject<T>;
export function celebrate(target: HTMLElement | null, opts?: { count?: number }): void;
export function haptic(ms?: number): void; // navigator.vibrate an toàn
```

Cách dùng:

```tsx
const ref = useReveal<HTMLDivElement>({ deps: [selectedChildId] });
return (
  <div ref={ref} className="space-y-6">
    <Card data-reveal>...</Card>
    <Card data-reveal>...</Card>
  </div>
);
```

### 3.3 `hooks/useDraft.ts`

```ts
export function useDraft<T>(key: string): {
  draft: { data: T; savedAt: string } | null; // đọc 1 lần khi mount / đổi key
  saveDraft: (data: T) => void;               // ghi localStorage (debounce 400ms)
  clearDraft: () => void;
};
// key convention: "qlgl.draft.attendance.{classId}.{date}" | "qlgl.draft.scores.{classId}.{subjectId}.{examType}"
```

### 3.4 `context/PreferencesContext.tsx`

```ts
type ThemeMode = "light" | "dark";
type TextSize = "md" | "lg" | "xl";
interface PreferencesContextType {
  theme: ThemeMode;          setTheme(t: ThemeMode): void;  toggleTheme(): void;
  textSize: TextSize;        setTextSize(s: TextSize): void; // mặc định theo vai trò nếu chưa chọn
  demoMode: boolean;         setDemoMode(v: boolean): void;  // bật công cụ test trong trang
  mobileFrame: boolean;      setMobileFrame(v: boolean): void;
}
export function usePreferences(): PreferencesContextType;
```

Ghi `data-theme` và `data-text-size` lên `<html>`. Lưu `qlgl.theme`, `qlgl.textSize`, `qlgl.demoMode`.

## 4. Primitives

### 4.1 Button

```tsx
<Button variant="primary" size="md" leftIcon={<Plus className="size-5" />} loading={false} fullWidth>
  Thêm học sinh
</Button>
```

| Prop | Giá trị |
|---|---|
| `variant` | `primary` · `secondary` (night) · `outline` · `ghost` · `danger` · **`soft`** (v2: bg-primary-soft text-primary-ink) |
| `size` | `sm` · `md` (= `--control`, theo vai trò) · `lg` · `parent` |
| `loading`, `disabled`, `fullWidth`, `leftIcon`, `rightIcon`, `type`, `onClick`, `className` | như v1 |
| mới: mọi `ButtonHTMLAttributes` khác (`aria-*`, `title`, `form`...) | được forward |

Hình: `rounded-full font-semibold`, press `active:scale-[0.97]`. Primary hover `shadow-glow`. Loading: spinner thay icon trái, giữ nguyên kích thước.

### 4.2 IconButton

Bắt buộc `aria-label`. Variants `ghost` (mặc định) · `primary` · `secondary` (night) · `outline` · `soft` (surface-2) · `danger`. Size `sm 36` · `md 44` · `lg 52` · `parent 56`. Bo `rounded-full`.

### 4.3 Input / NumericInput / Select

- Label trên, `text-sm font-medium text-ink-2`; required có dấu `*` màu `danger`.
- Field: `bg-surface border border-line-strong rounded-control h-(--control) min-h-12 text-base px-4`.
- Focus: `border-primary ring-4 ring-primary/15`. Error: `border-danger` + message `text-danger text-sm` có icon `AlertCircle`.
- NumericInput: `inputMode="decimal"`, căn giữa, `font-mono`; state `valid` viền `success/40`.
- Select: desktop dropdown `shadow-float rounded-control`; mobile (< md) mở BottomSheet danh sách lựa chọn lớn.

### 4.4 Checkbox / Radio

Hộp `size-5 rounded-xs` (Radio tròn), checked `bg-primary text-on-primary`. Cả dòng label là vùng chạm ≥ 44px.

### 4.5 Badge

Variants v1 giữ nguyên: `neutral · primary · success · warning · error · info · gold`. Thêm: `grape · sky · mint · sun · coral · rose · night`. Size `sm · md · lg`. Hình pill, nền soft + chữ tone (không viền mặc định). `dot` = chấm tròn trước chữ.

### 4.6 Avatar

Fallback initials với nền màu **xác định theo tên** (hash → một trong kid palette soft). Size `xs 24 · sm 32 · md 40 · lg 48 · xl 64 · 2xl 88`. Prop mới `ring?: Tone` (vòng màu quanh avatar — dùng cho Level học sinh, con đang chọn).

### 4.7 Card (mới)

```tsx
<Card variant="surface" padding="md" interactive onClick={...}>...</Card>
```

| Prop | Giá trị |
|---|---|
| `variant` | `surface` (bg-surface border-line shadow-card) · `muted` (bg-surface-2) · `night` (bg-night text-on-night) · `outline` (viền, không bóng) · `soft` (bg `{tone}-soft`) |
| `tone` | `Tone` (dùng với `soft`) |
| `padding` | `none` · `sm` (p-3) · `md` (p-4 sm:p-5) · `lg` (p-5 sm:p-7) |
| `radius` | `card` (mặc định) · `card-lg` |
| `interactive` | hover `-translate-y-0.5 shadow-float`, press `scale-[0.99]`; có `onClick` → `role="button"`, `tabIndex=0`, Enter/Space kích hoạt |
| `as` | `div` · `section` · `article` · `li` |
| còn lại | `HTMLAttributes<HTMLDivElement>` (hỗ trợ `data-reveal`) |

### 4.8 IconTile (mới)

`<IconTile icon={<Bell />} tone="sky" size="md" />` — khối `rounded-control` nền soft, icon tone. Size `sm 32 · md 40 · lg 48 · xl 64`.

### 4.9 ProgressBar / ProgressRing (mới)

```tsx
<ProgressBar value={18} max={20} tone="success" size="md" label="Chuyên cần" showValue />
<ProgressRing value={86} tone="grape" size="lg" label="Tiến độ Level">
  <span className="text-2xl font-bold">5</span>
</ProgressRing>
```

Lấp đầy động bằng GSAP khi mount và khi `value` đổi. `role="progressbar"` + `aria-valuenow/min/max` + `aria-label`. Ring size `sm 48 · md 64 · lg 96 · xl 128` (rem-based).

### 4.10 CountUp (mới)

`<CountUp value={8.5} decimals={1} />` — đếm từ 0 (hoặc giá trị trước) tới value; `tabular-nums`; reduced-motion hiển thị ngay.

### 4.11 SegmentedControl (mới)

```tsx
<SegmentedControl
  ariaLabel="Trạng thái điểm danh"
  value={status}
  onChange={setStatus}
  options={[
    { value: "PRESENT", label: "Có mặt", icon: <CheckCircle2 />, tone: "success" },
    { value: "ABSENT",  label: "Vắng",   icon: <XCircle />,      tone: "danger"  },
  ]}
  size="md"
/>
```

`role="radiogroup"`, mỗi mục `role="radio"`, ←/→ di chuyển. Mục chọn: nền `TONE_SOLID[tone]` (mặc định `bg-surface shadow-xs text-ink`), chuyển động "thumb" 220ms. Prop `hideLabelsBelow?: "sm" | "md"` để chỉ hiện icon trên màn nhỏ (vẫn có `aria-label`).

### 4.12 Skeleton / Spinner / Divider

Skeleton: `bg-surface-3` + shimmer gradient (tắt khi reduced-motion). Spinner: vòng `currentColor`. Divider: `border-line`, có label giữa.

## 5. Composite

| Component | v2 thay đổi |
|---|---|
| SearchBar | pill `rounded-full bg-surface-2`, icon trái, nút xóa; size `parent` = 56px; debounce 300ms |
| FilterBar | desktop inline chip lọc; mobile nút `Bộ lọc (n)` → BottomSheet; hàng chip đang áp dụng có thể xóa từng cái |
| PageHeader | Title `text-2xl sm:text-3xl font-bold tracking-tight`; description `text-ink-2`; actions phải; mobile actions xuống dòng full-width |
| StatCard | Card + IconTile + giá trị `CountUp` `text-3xl font-bold tabular-nums` + trend pill (`success`/`danger` soft, có icon mũi tên) |
| EmptyState | IconTile `xl` tone neutral, tiêu đề `text-lg font-semibold`, mô tả, action |
| ErrorState | IconTile `danger`, nút Thử lại (outline) |
| DataTable | header sticky `bg-surface-2 text-ink-2 text-sm font-semibold`, hàng hover `bg-surface-2/60`, mobile → card list |
| Pagination | pill buttons; mobile `← 1 / 10 →` |
| Modal | `rounded-card-lg shadow-float`, backdrop `bg-night/50 backdrop-blur-sm`, enter scale 0.96 → 1; mobile < sm hiển thị như bottom sheet |
| BottomSheet | `rounded-t-card-lg`, tay nắm, kéo xuống để đóng (drag > 80px), safe-area |
| Toast | pill/card nổi `bg-night text-on-night shadow-float`; icon tone; **`action?: { label; onClick }`** (VD Hoàn tác); mobile nằm trên bottom nav; desktop góc dưới phải |

Toast API v2:

```ts
toast.success("Đã đánh dấu 32 em có mặt", {
  action: { label: "Hoàn tác", onClick: undo },
  duration: 6000,
});
```

## 6. App Shell

### 6.1 AppShell

```tsx
<AppShell role={role} user={user} title="..." currentPath={pathname} onNavigate={navigate}
          notificationCount={n} breadcrumbs={items} showBackButton onBack={goBack}
          onLogout={logout} notificationPath="/parent/notifications">
```

- Root: `<div data-role={role} class="min-h-dvh bg-canvas text-ink">`.
- Desktop: sidebar nổi (`lg:pl-...`), nội dung `max-w-7xl`.
- Main có `usePageEnter(pathname)`.
- Bottom padding đủ cho floating nav: `pb-32 lg:pb-12`.
- Prop mới: `onLogout?`, `notificationPath?`.

### 6.2 Header

```text
[Back | Menu]  Tiêu đề (+ breadcrumb desktop)      [Aa] [Sun/Moon] [Bell n] [Avatar ▾]
```

- Sticky, glass `bg-canvas/75 backdrop-blur-xl`, viền dưới xuất hiện khi cuộn.
- `[Aa]` mở popover chọn cỡ chữ (Vừa / Lớn / Rất lớn) — hiện với mọi vai trò; Phụ huynh hiển thị cả chữ "Cỡ chữ".
- Avatar menu: tên, vai trò, lớp; Giao diện; Cỡ chữ; Đăng xuất.
- Mobile: tiêu đề `text-lg`, ẩn breadcrumb.

### 6.3 Sidebar

- Floating panel: `m-3 rounded-card-lg bg-surface border border-line shadow-card`, cao `calc(100dvh - 1.5rem)`, sticky.
- Nhóm mục: tiêu đề nhóm sentence case `text-xs font-medium text-ink-3` (không uppercase).
- Mục active: `bg-night text-on-night` + icon; hover `bg-surface-2`.
- Thu gọn: chỉ icon (tooltip bằng `title`), rộng 5rem ↔ 17rem.
- Footer: thẻ người dùng.

### 6.4 MobileBottomNav

- Floating pill: `fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] rounded-full bg-surface/85 backdrop-blur-xl border border-line shadow-float`.
- Mỗi mục: icon `size-6` + nhãn `text-xs font-semibold`; active: icon trong khối pill `bg-primary-soft text-primary-ink`.
- GLV: mục giữa là nút tròn `size-16 -mt-8 bg-primary text-on-primary shadow-glow` nhãn "Điểm danh".
- Admin "Thêm" → BottomSheet lưới 2 cột IconTile.

### 6.5 PreferenceControls (mới)

`<TextSizeControl />` (segmented Vừa/Lớn/Rất lớn, xem trước "Aa"), `<ThemeToggle />` (Sun/Moon, `aria-pressed`).

### 6.6 DemoPanel (mới, `src/dev/DemoPanel.tsx`)

Nút nổi "Demo" + sheet: đổi vai trò, đăng xuất, theme, cỡ chữ, chế độ demo, khung mobile, bảng route, phân quyền dữ liệu. Không nằm trong luồng người dùng thật.

## 7. Domain — Attendance

| Component | v2 |
|---|---|
| `AttendanceStatusChip` (mới) | Chip pill tone theo trạng thái + icon + nhãn; chạm → xoay vòng; `haptic()`; spring scale khi đổi |
| `AttendanceRow` | Avatar · Tên thánh + tên (text-base font-semibold) · mã (font-mono text-ink-3). Phải: mobile = `AttendanceStatusChip` + nút `...` (menu chọn trực tiếp); ≥ md = `SegmentedControl` 4 trạng thái |
| `AttendanceQuickToggle` | Giữ API; restyle theo chip + menu popover |
| `AttendanceSummary` | Hàng 4 ô số (CountUp) + ProgressRing tỷ lệ có mặt |
| `AttendanceBulkAction` | Nút: Có mặt tất cả (soft success) · Vắng tất cả · Đặt lại (ghost) → toast Hoàn tác |
| `AttendanceDraftBanner` (mới) | "Có bản nháp chưa lưu lúc HH:mm" [Khôi phục] [Bỏ qua] |
| `AttendanceList` | Ô tìm tên + chip lọc trạng thái; hàng `min-h-15` (60px) |
| `AttendanceSaveBar` | Sticky nổi trên bottom nav: ProgressRing mini + tóm tắt + nút Lưu; state `NO_CHANGES · DIRTY · SAVING · SAVED · ERROR` |
| `AttendanceDateSelector` / `ClassSelector` | Chip ngày dạng dải ngang (các Chúa Nhật gần nhất) + nút lịch; lớp dạng Select |

## 8. Domain — Score

| Component | v2 |
|---|---|
| `ScoreHeader` | Select Lớp + Select Môn + **SegmentedControl** Loại điểm; nút "Nhập từ Excel" (outline) |
| `ScoreRow` / `ScoreTable` | Desktop: bảng sticky header, cột STT · Học sinh · Điểm cũ · Điểm mới; mobile: thẻ |
| `ScoreInput` | NumericInput lớn `font-mono text-xl`, Enter/Tab/↓ kế tiếp, ↑ trước; trạng thái `DIRTY` chấm `warning`, `SAVED` icon check |
| `QuickFillBar` (mới) | Dải chip 10 · 9 · 8 · 7 · 6 · 5 cố định trên bàn phím mobile khi có ô đang focus → điền + nhảy em kế |
| `ScoreValidationSummary` | Card soft danger, danh sách lỗi dạng chip bấm được |
| `ScoreSaveBar` | Như AttendanceSaveBar |
| `ExcelUploader` / `ExcelPreview` | Sheet 3 bước (01 Chọn file · 02 Kiểm tra · 03 Nhập) — dùng số bước dạng stepper, không dùng meta-label |

## 9. Domain — Parent

| Component | v2 |
|---|---|
| `ParentChildSwitcher` | Chip ảnh ngang (≤ 4 con), chip chọn `bg-night text-on-night` + ring; > 4 → sheet |
| `WelcomeSummary` → "Tuần này của con" | Card night: câu tóm tắt đời thường + 2 chỉ số lớn (chuyên cần %, điểm TB) |
| `ShortcutGrid` (mới) | Lưới 2×2 tile lớn có nhãn: Bảng điểm · Điểm danh · Thông báo (n) · Gọi GLV |
| `GPAHighlight` | Số lớn CountUp + xếp loại badge + ProgressRing |
| `SubjectScoreCard` | IconTile môn + tên + điểm TB lớn + thành phần (GK/CK) + mini bar |
| `AttendanceSummaryCard` | ProgressBar + "18/20 buổi" + timeline chấm các buổi gần nhất |
| `TeacherComment` | Trích dẫn `font-accent italic text-lg` + avatar GLV |
| `AcademicPeriodSelector` | SegmentedControl (HK I · HK II · Cả năm) |

## 10. Domain — Student / Gamification

| Component | v2 |
|---|---|
| `StudentHero` (mới) | Card lớn gradient kid palette: avatar ring level, "Chào {tên}!", Level + XP ProgressBar, streak |
| `XPProgress` | Giữ API; thanh dày 0.75rem bo tròn, gradient grape → sky, lấp đầy động |
| `QuestCard` (mới) | IconTile + tên nhiệm vụ + tiến độ "2/3" + ProgressBar; hoàn thành → check + celebrate |
| `AchievementBadge` | Huy hiệu tròn lớn; LOCKED grayscale + "Còn N ..."; NEW có chấm + hiệu ứng |
| `BadgeShelf` (mới) | Cuộn ngang snap; chạm → BottomSheet chi tiết |
| `StarRating` (mới) | 1–5 sao `gold`, dùng cho điểm học sinh |
| `NextSessionCard` (mới) | Ngày · giờ · phòng · GLV |
| `StudentCard` / `StudentRow` / `StudentSelector` | Restyle token; dùng trong trang quản lý (không hiển thị ở Góc của em) |

## 11. Domain — Dashboard, Class, Notification

| Component | v2 |
|---|---|
| `KPIGroup` | Grid `grid-cols-2 lg:grid-cols-4 gap-3`, StatCard CountUp |
| `ChartCard` | Card, header title + action; state Loading/Ready/Empty/Error |
| `ActivityFeed` | Timeline dọc: chấm tone + avatar + "Ai · làm gì · ở đâu" + thời gian tương đối |
| `ClassCard` | Tên lớp lớn, khối (badge), sĩ số, GLV (avatar stack), ProgressRing chuyên cần; hover lift |
| `NotificationCard` | IconTile theo loại (URGENT danger + nhãn "Khẩn"), tiêu đề đậm khi chưa đọc + chấm primary, preview 2 dòng, thời gian |
| `NotificationList` | Tabs Tất cả / Chưa đọc + chip loại; "Đánh dấu đã đọc tất cả" |
| `NotificationDetailModal` | Modal/sheet, nội dung đọc thoải mái `text-base leading-relaxed`, hành động liên quan |

## 12. Public surface (`src/pages/public/`)

| Component | Mô tả |
|---|---|
| `GlassNav` | Pill nổi `fixed top-4 inset-x-4 max-w-5xl mx-auto rounded-full bg-surface/70 backdrop-blur-xl` |
| `EditorialHero` | 12 cột; chữ `lg:col-span-7` + ảnh `lg:col-span-5` (bo `rounded-card-lg`, filter `grayscale contrast-125` + wash ấm); H1 chứa **inline pill image** |
| `KhoiMarquee` | Infinite marquee chữ lớn: Khai Tâm · Rước Lễ · Thêm Sức · Bao Đồng · Vào Đời |
| `FeatureBento` | Grid 4×2 `grid-flow-dense` (01 §4.2 brief) |
| `RoleStack` | GSAP Card Stacking: 3 thẻ vai trò pin và chồng lên nhau khi cuộn |
| `ScrubText` | Đoạn sứ mệnh, từng từ opacity 0.12 → 1 theo scroll (scrub) |
| `RoleAccordion` | Horizontal accordion 4 lát (Học sinh · Phụ huynh · GLV · Quản trị); hover/focus/chạm mở rộng; nút "Vào với vai trò này"; mobile xếp dọc |
| `BigCTA` + `SiteFooter` | Khối night, tiêu đề cực lớn, 1 nút primary tương phản cao |
| `LoginPage` | Split: ảnh + trích dẫn Fraunces / 4 ô vai trò lớn |

## 13. Permission

```tsx
<PermissionGate permission="score:update"><ScoreInput /></PermissionGate>
```

Keys `resource:action` giữ nguyên v1.

## 14. State Matrix (bắt buộc)

| Component | Default | Hover | Focus | Active | Disabled | Loading | Error |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Button / IconButton | x | x | x | x | x | x | — |
| Input / NumericInput / Select | x | x | x | — | x | — | x |
| SegmentedControl | x | x | x | x | x | — | — |
| Card (interactive) | x | x | x | x | — | — | — |
| AttendanceRow | x | x | x | x | x | x | x |
| ScoreInput | x | — | x | x | x | x | x |
| NotificationCard | x | x | x | x | — | — | — |

## 15. Folder Convention

```text
src/
├── components/{ui,layout,auth,attendance,score,student,class,notification,parent,gamification,dashboard}
├── context/        AuthContext · RouterContext · ParentContext · PreferencesContext
├── dev/            DemoPanel
├── hooks/          useDraft
├── lib/            motion · cn
├── pages/{admin,teacher,parent,student,classes,students,notifications,reports,settings,public}
├── services/
└── types/
```

## 16. Component Generation Contract v2

```text
1. Chỉ token utility; không hex, không px tùy ý, không palette mặc định.
2. Không hard-code quyền trong UI component.
3. Business component nhận data qua props; Page quản lý API/state/navigation.
4. Mọi mutation có loading/success/error; ưu tiên Hoàn tác thay vì xác nhận khi đảo ngược được.
5. Mọi form có validation inline.
6. Mobile layout là mặc định; kiểm tra 375px.
7. Mật độ theo vai trò (01 §12).
8. GLV UI tối ưu tốc độ; Phụ huynh tối ưu dễ hiểu; Học sinh tối ưu niềm vui + rõ ràng.
9. Light + Dark + 3 cỡ chữ đều phải hiển thị đúng.
10. Animation qua lib/motion; reduced-motion an toàn.
```
