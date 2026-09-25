import type { CSSProperties } from "react";
import { Sparkle } from "lucide-react";
import { cn } from "../../../lib/cn";

const KHOI = ["Khai Tâm", "Rước Lễ", "Thêm Sức", "Bao Đồng", "Vào Đời"] as const;

// Mỗi nhóm lặp danh sách 2 lần (10 mục) để kiểu chữ xen kẽ đều tuyệt đối,
// kể cả ở chỗ nối vòng lặp: mỗi khối lần lượt hiện ở cả kiểu mờ và kiểu nghiêng.
const GROUP_ITEMS = [...KHOI, ...KHOI];

// 40s cho mỗi 5 mục; nhóm có 10 mục nên 80s để giữ nguyên tốc độ trôi dự kiến.
const TRACK_STYLE = { "--marquee-duration": "80s" } as CSSProperties;

function MarqueeGroup() {
  return (
    <ul className="flex shrink-0 items-center gap-10 pr-10 md:gap-16 md:pr-16">
      {GROUP_ITEMS.map((name, index) => (
        <li key={`${name}-${index}`} className="flex shrink-0 items-center gap-10 md:gap-16">
          <span
            className={cn(
              "text-5xl leading-tight whitespace-nowrap md:text-7xl",
              index % 2 === 0
                ? "font-bold tracking-tight text-ink/15"
                : "font-accent font-normal tracking-tight text-primary/70 italic"
            )}
          >
            {name}
          </span>
          <Sparkle className="size-6 shrink-0 text-gold md:size-8" strokeWidth={1.75} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Infinite Marquee tên 5 khối Giáo lý. Hai nhóm giống hệt nhau trong một track `w-max`,
 * keyframe `marquee` dịch -50% nên vòng lặp liền mạch. Dừng khi rê chuột.
 * Người đọc màn hình chỉ nghe danh sách sr-only một lần; track chuyển động là aria-hidden.
 * Reduced motion: CSS toàn cục rút animation về 0.01ms, chữ đứng yên và vẫn hiển thị.
 */
export function KhoiMarquee() {
  return (
    <section aria-label="Năm khối Giáo lý" className="relative overflow-hidden border-y border-line py-10 md:py-14">
      <ul className="sr-only">
        {KHOI.map((name) => (
          <li key={name}>Khối {name}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-canvas to-transparent md:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-canvas to-transparent md:w-40"
      />

      <div
        aria-hidden="true"
        className="flex w-max animate-marquee hover:[animation-play-state:paused]"
        style={TRACK_STYLE}
      >
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </section>
  );
}
