import { useRef, type CSSProperties } from "react";
import { BookOpen, Check, GraduationCap, Heart, type LucideIcon } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "../../../lib/motion";
import { cn } from "../../../lib/cn";
import { IconTile } from "../../../components/ui/IconTile";
import { ROLE_WASH, type RoleTone } from "./roles";

gsap.registerPlugin(ScrollTrigger);

/** Chỉ chồng thẻ trên desktop và khi người dùng không yêu cầu giảm chuyển động. */
const STACK_MEDIA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

interface StackCard {
  role: string;
  tagline: string;
  description: string;
  points: string[];
  icon: LucideIcon;
  tone: RoleTone;
  image: string;
  imageAlt: string;
}

const CARDS: StackCard[] = [
  {
    role: "Học sinh",
    tagline: "Học vui, nhận huy hiệu, thấy mình tiến bộ",
    description: "Góc của em hiện điểm bằng sao và lời khen dễ hiểu, cùng chuỗi Chúa Nhật đi học liên tiếp.",
    points: ["Điểm hiện bằng sao và lời khen", "Nhiệm vụ tuần vừa sức", "Kệ huy hiệu để sưu tầm"],
    icon: GraduationCap,
    tone: "sky",
    image: "https://picsum.photos/seed/kids-learning/1200/1000",
    imageAlt: "Các em thiếu nhi chăm chú học bài",
  },
  {
    role: "Phụ huynh",
    tagline: "Biết con học thế nào, không cần hỏi",
    description: "Mỗi tuần một câu tóm tắt bằng lời đời thường: con đi học ra sao, điểm thế nào, lớp có tin gì mới.",
    points: ["Tóm tắt tuần bằng lời dễ hiểu", "Đổi giữa các con chỉ một chạm", "Thông báo khẩn luôn ở trên cùng"],
    icon: Heart,
    tone: "rose",
    image: "https://picsum.photos/seed/family-evening/1200/1000",
    imageAlt: "Gia đình quây quần bên nhau buổi tối",
  },
  {
    role: "Giáo lý viên",
    tagline: "Ít giấy tờ hơn, nhiều thời gian cho các em",
    description: "Điểm danh cả lớp trong chưa đầy một phút, nhập điểm liên tục bằng bàn phím, tự lưu nháp khi mạng yếu.",
    points: ["Có mặt tất cả, hoàn tác khi lỡ tay", "Enter để sang em kế tiếp", "Không mất dữ liệu khi mất mạng"],
    icon: BookOpen,
    tone: "mint",
    image: "https://picsum.photos/seed/teacher-class/1200/1000",
    imageAlt: "Giáo lý viên đứng lớp cùng các em",
  },
];

const CHECK_TONE: Record<RoleTone, string> = {
  sky: "bg-sky-soft text-sky",
  rose: "bg-rose-soft text-rose",
  mint: "bg-mint-soft text-mint",
  grape: "bg-grape-soft text-grape",
};

/**
 * Desire — GSAP Card Stacking (03 §12 RoleStack).
 *
 * Desktop + motion OK: sân khấu thẻ được ghim ở giữa màn hình; mỗi thẻ sau trượt từ yPercent 100 -> 0
 * phủ lên thẻ trước, thẻ trước thu về scale 0.92 + opacity 0.5; scrub theo cuộn,
 * end = "+=" + (số thẻ - 1) * 100 + "%". Thuộc tính data-stacked chỉ được bật trong matchMedia,
 * nên mobile / reduced-motion luôn là danh sách dọc bình thường, đọc được đầy đủ.
 */
export function RoleStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const mm = gsap.matchMedia();
      mm.add(STACK_MEDIA, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", stage);
        if (cards.length < 2) return;

        // Chuyển sân khấu sang chế độ chồng thẻ (các thẻ cùng một ô lưới).
        stage.dataset.stacked = "true";

        gsap.set(cards, { transformOrigin: "50% 0%" });
        gsap.set(cards.slice(1), { yPercent: 100, autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "center center",
            end: "+=" + (cards.length - 1) * 100 + "%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Tính pin-spacer trước để ScrollTrigger của các section phía dưới (ScrubText) đo đúng vị trí.
            refreshPriority: 1,
          },
        });

        cards.forEach((card, index) => {
          if (index === 0) return;
          const previous = cards[index - 1];
          const at = index - 1;
          tl.to(card, { yPercent: 0, duration: 1 }, at)
            .to(card, { autoAlpha: 1, duration: 0.2 }, at)
            .to(previous, { scale: 0.92, opacity: 0.5, duration: 1 }, at);
        });

        return () => {
          delete stage.dataset.stacked;
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="vai-tro"
      tabIndex={-1}
      aria-labelledby="vai-tro-title"
      className="relative py-32 outline-none md:py-48"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="vai-tro-title"
            className="max-w-3xl text-4xl leading-[1.08] font-bold tracking-tight text-ink md:text-6xl"
          >
            Một ứng dụng, ba người đồng hành
          </h2>
          <p className="max-w-md text-lg text-ink-2">
            Mỗi người mở ứng dụng là thấy đúng điều mình cần, với giọng văn dành riêng cho mình.
          </p>
        </div>

        <div
          ref={stageRef}
          className="group/stack mt-16 flex flex-col gap-6 data-[stacked=true]:grid data-[stacked=true]:pb-12 md:mt-20"
        >
          {CARDS.map((card, index) => {
            const offset = { "--stack-offset": `${index * 1.5}rem` } as CSSProperties;
            return (
              <article
                key={card.role}
                data-stack-card
                style={offset}
                className={cn(
                  "group relative flex min-h-[28rem] flex-col overflow-hidden rounded-card-lg border border-line bg-surface shadow-float lg:flex-row",
                  // Chế độ chồng: mọi thẻ cùng một ô lưới; lệch xuống bằng `top` (không dùng CSS translate
                  // vì GSAP ghi đè thuộc tính translate khi điều khiển transform).
                  "group-data-[stacked=true]/stack:col-start-1 group-data-[stacked=true]/stack:row-start-1 group-data-[stacked=true]/stack:top-(--stack-offset)"
                )}
              >
                <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:basis-7/12 lg:p-12">
                  <div className="flex items-center gap-3">
                    <IconTile icon={<card.icon />} tone={card.tone} size="lg" />
                    <span className="text-lg font-semibold text-ink">{card.role}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl leading-[1.1] font-bold tracking-tight text-ink md:text-4xl">{card.tagline}</h3>
                    <p className="mt-4 max-w-xl text-base text-ink-2 md:text-lg">{card.description}</p>
                    <ul className="mt-6 flex flex-col gap-2.5">
                      {card.points.map((point) => (
                        <li key={point} className="flex items-center gap-3 text-base text-ink">
                          <span
                            aria-hidden="true"
                            className={cn("grid size-7 shrink-0 place-items-center rounded-full", CHECK_TONE[card.tone])}
                          >
                            <Check className="size-4" strokeWidth={2.5} />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:basis-5/12">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div aria-hidden="true" className={cn("absolute inset-0 mix-blend-multiply", ROLE_WASH[card.tone])} />
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-night/40 to-transparent" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
