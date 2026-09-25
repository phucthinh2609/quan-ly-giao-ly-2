import { CircleCheck, CircleX, CornerDownLeft, FileCheck2, Flame, Heart, Lock, Medal, Star, type LucideIcon } from "lucide-react";
import { cn } from "../../../lib/cn";
import { TONE_SOFT, TONE_SOLID, type Tone } from "../../../components/ui/tone";

// ----------------------------------------------------------------------------
// Dữ liệu minh hoạ (không phải dữ liệu thật). Các mock đều aria-hidden;
// nội dung có nghĩa nằm ở tiêu đề + mô tả của từng thẻ.
// ----------------------------------------------------------------------------

type MockStatus = "present" | "absent" | "excused";

const STATUS_META: Record<MockStatus, { label: string; icon: LucideIcon; className: string }> = {
  present: { label: "Có mặt", icon: CircleCheck, className: "bg-success-soft text-success" },
  absent: { label: "Vắng", icon: CircleX, className: "bg-danger-soft text-danger" },
  excused: { label: "Có phép", icon: FileCheck2, className: "bg-info-soft text-info" },
};

const ATTENDANCE_ROWS: { name: string; initials: string; tone: Tone; status: MockStatus }[] = [
  { name: "Maria Ngọc Anh", initials: "NA", tone: "sky", status: "present" },
  { name: "Giuse Minh Khang", initials: "MK", tone: "mint", status: "absent" },
  { name: "Têrêsa Bảo Ngọc", initials: "BN", tone: "grape", status: "excused" },
];

const SCORE_ROWS: { name: string; oral: string; quiz: string; active?: boolean }[] = [
  { name: "Ngọc Anh", oral: "9,0", quiz: "8,5" },
  { name: "Minh Khang", oral: "7,5", quiz: "8,0" },
  { name: "Bảo Ngọc", oral: "8,5", quiz: "9", active: true },
];

const BADGES: { icon: LucideIcon; tone: Tone; delay: string }[] = [
  { icon: Medal, tone: "sun", delay: "delay-0" },
  { icon: Star, tone: "grape", delay: "delay-75" },
  { icon: Flame, tone: "coral", delay: "delay-150" },
];

const CARD_BASE =
  "group relative overflow-hidden rounded-card-lg border shadow-card transition-[translate,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-float";

function AttendanceMock() {
  return (
    <div aria-hidden="true" className="rounded-card border border-line bg-surface/95 p-2 shadow-float backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-3">
        <span className="text-sm font-semibold text-ink">Lớp Rước Lễ 2 · Chúa Nhật</span>
        <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-xs text-ink-2 tabular-nums">3/30</span>
      </div>
      <ul className="divide-y divide-line">
        {ATTENDANCE_ROWS.map((row) => {
          const status = STATUS_META[row.status];
          const StatusIcon = status.icon;
          return (
            <li key={row.name} className="flex items-center gap-3 px-3 py-2.5">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold",
                  TONE_SOFT[row.tone]
                )}
              >
                {row.initials}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{row.name}</span>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                  status.className
                )}
              >
                <StatusIcon className="size-3.5" />
                {status.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ScoreCell({ value, active = false }: { value: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-9 w-14 items-center justify-center rounded-control border bg-surface font-mono text-sm text-ink tabular-nums",
        active ? "border-primary ring-4 ring-primary/15" : "border-line-strong"
      )}
    >
      {value}
      {active && <span className="ml-0.5 h-4 w-0.5 animate-pulse rounded-full bg-primary" />}
    </span>
  );
}

function ScoreMock() {
  return (
    <div aria-hidden="true" className="w-full shrink-0 rounded-card border border-line bg-surface-2 p-3 md:w-72 lg:w-full">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
        <span className="px-1 text-xs font-medium text-ink-3">Học sinh</span>
        <span className="w-14 text-center text-xs font-medium text-ink-3">Miệng</span>
        <span className="w-14 text-center text-xs font-medium text-ink-3">Kiểm tra</span>
        {SCORE_ROWS.map((row) => (
          <div key={row.name} className="contents">
            <span className="truncate px-1 text-sm font-medium text-ink">{row.name}</span>
            <ScoreCell value={row.oral} />
            <ScoreCell value={row.quiz} active={row.active} />
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 px-1 text-xs text-ink-2">
        <kbd className="inline-flex items-center gap-1 rounded-xs border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-xs text-ink">
          <CornerDownLeft className="size-3" />
          Enter
        </kbd>
        sang em kế tiếp
      </p>
    </div>
  );
}

/**
 * Interest — Bento gapless (04 §4, 00 §4.2).
 */
export function FeatureBento() {
  return (
    <section
      id="tinh-nang"
      tabIndex={-1}
      aria-labelledby="tinh-nang-title"
      className="py-32 outline-none md:py-48"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="tinh-nang-title"
          className="max-w-4xl text-4xl leading-[1.08] font-bold tracking-tight text-ink md:text-6xl"
        >
          Mọi việc của một buổi Giáo lý, gọn trong một chạm
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-ink-2 md:text-xl">
          Làm cùng các anh chị Giáo lý viên, để thời gian trên lớp dành cho các em chứ không phải cho sổ sách.
        </p>

        {/*
          Bento density proof (lg, grid-cols-4, grid-flow-dense):
            A  md:col-span-2 lg:row-span-2  -> 2 x 2 = 4 cells
            B  md:col-span-2                -> 2 x 1 = 2 cells
            C  (default span)               -> 1 x 1 = 1 cell
            D  (default span)               -> 1 x 1 = 1 cell
            A(4) + B(2) + C(1) + D(1) = 8 cells = 4 cols x 2 rows -> zero empty cells.
          md (grid-cols-2): A(2) + B(2) + C(1) + D(1) = 6 cells = 2 cols x 3 rows -> zero empty cells.
          Mobile (grid-cols-1): 4 cards = 1 col x 4 rows.
          (Ở 768px mỗi cột của lưới 4 cột chỉ ~10.5rem nên md dùng 2 cột; lg trở lên đúng lưới 4 x 2.)
        */}
        <div className="mt-16 grid grid-flow-dense auto-rows-[minmax(15rem,auto)] grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {/* A — 2 x 2 */}
          <article className={cn(CARD_BASE, "flex flex-col border-line bg-surface md:col-span-2 lg:row-span-2")}>
            <div className="relative h-56 overflow-hidden sm:h-72 lg:h-auto lg:min-h-56 lg:flex-1">
              <img
                src="https://picsum.photos/seed/sunday-class/1400/1000"
                alt="Lớp Giáo lý thiếu nhi sau Thánh lễ Chúa Nhật"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-surface via-surface/10 to-transparent" />
            </div>
            <div className="relative -mt-24 px-5 pb-7 sm:px-8 sm:pb-9">
              <AttendanceMock />
              <h3 className="mt-7 text-2xl font-bold tracking-tight text-ink md:text-3xl">Điểm danh một chạm</h3>
              <p className="mt-2 max-w-lg text-base text-ink-2 md:text-lg">
                Chạm vào tên để đổi trạng thái, bấm Có mặt tất cả khi lớp đông đủ. Lỡ tay thì hoàn tác, mất mạng vẫn tự lưu nháp.
              </p>
            </div>
          </article>

          {/* B — 2 x 1 */}
          <article
            className={cn(
              CARD_BASE,
              "flex flex-col gap-6 border-line bg-surface p-6 sm:p-8 md:col-span-2 md:flex-row md:items-center lg:flex-col lg:items-stretch"
            )}
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-bold tracking-tight text-ink">Nhập điểm nhanh như bảng tính</h3>
              <p className="mt-2 text-base text-ink-2">
                Gõ điểm rồi Enter để sang em kế tiếp, mũi tên để quay lại. Điểm được lưu nháp liên tục.
              </p>
            </div>
            <ScoreMock />
          </article>

          {/* C — 1 x 1, tone rose */}
          <article className={cn(CARD_BASE, "flex flex-col justify-between gap-6 border-rose/20 bg-rose-soft p-6")}>
            <span
              aria-hidden="true"
              className={cn("grid size-12 place-items-center rounded-control [&_svg]:size-6", TONE_SOLID.rose)}
            >
              <Heart />
            </span>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink">Phụ huynh luôn nắm rõ</h3>
              <p className="mt-1 text-sm text-ink-2">Mỗi tuần một câu tóm tắt bằng lời đời thường.</p>
            </div>
            <div
              aria-hidden="true"
              className="rounded-card bg-surface p-4 shadow-card transition-transform duration-500 ease-out-soft group-hover:-rotate-1"
            >
              <p className="text-base font-semibold text-ink">
                An đi học đều <span className="font-mono tabular-nums">18/20</span> buổi
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full w-[90%] rounded-full bg-rose" />
              </div>
            </div>
          </article>

          {/* D — 1 x 1, tone grape + sun */}
          <article className={cn(CARD_BASE, "flex flex-col justify-between gap-6 border-grape/20 bg-grape-soft p-6")}>
            <div aria-hidden="true" className="flex -space-x-3">
              {BADGES.map(({ icon: BadgeIcon, tone, delay }) => (
                <span
                  key={tone}
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full ring-4 ring-grape-soft transition-transform duration-500 ease-spring group-hover:-translate-y-1.5 [&_svg]:size-5",
                    TONE_SOLID[tone],
                    delay
                  )}
                >
                  <BadgeIcon />
                </span>
              ))}
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-ink-3 ring-4 ring-grape-soft [&_svg]:size-4">
                <Lock />
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink">Góc thiếu nhi có huy hiệu</h3>
              <p className="mt-1 text-sm text-ink-2">
                Chuỗi Chúa Nhật, nhiệm vụ tuần và huy hiệu để các em sưu tầm. Huy hiệu khoá hiện rõ còn mấy buổi nữa.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
