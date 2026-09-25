import { Fragment, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "../../../lib/motion";
import { cn } from "../../../lib/cn";

gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// 60 từ. Cụm cuối "tình yêu của Chúa." là cụm nhấn Fraunces duy nhất của đoạn.
const MISSION =
  "Mỗi sáng Chúa Nhật, các em ôm cặp bước vào lớp, anh chị Giáo lý viên đón bằng nụ cười, còn cha mẹ lặng lẽ dõi theo từ hàng ghế phía sau. Chúng tôi muốn sổ sách không còn chen vào giữa thầy trò, để cả cộng đoàn cùng nhau bước đi và lớn lên trong tình yêu của Chúa.";

const WORDS = MISSION.split(" ");
const ACCENT_WORDS = 4;

/**
 * Desire — Scrubbing Text Reveal (03 §12 ScrubText).
 * Từng từ sáng dần opacity 0.12 -> 1 theo thanh cuộn (start "top 80%", end "bottom 40%").
 * Reduced motion: không tạo tween nào, mọi từ giữ opacity 1.
 */
export function ScrubText() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const paragraph = sectionRef.current?.querySelector<HTMLElement>("[data-scrub]");
      if (!paragraph) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = paragraph.querySelectorAll<HTMLElement>("[data-word]");
        // Dùng timeline (không phải tween đơn) để ScrollTrigger này đo vị trí SAU khi pin của RoleStack
        // đã thêm pin-spacer — cả hai cùng được đo ở tick kế tiếp, theo đúng thứ tự tạo.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: paragraph,
              start: "top 80%",
              end: "bottom 40%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(words, { opacity: 0.12 }, { opacity: 1, ease: "none", stagger: 0.08 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hanh-trinh"
      tabIndex={-1}
      aria-labelledby="hanh-trinh-title"
      className="relative isolate overflow-hidden py-32 outline-none md:py-48"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-gold/15 to-transparent to-70%"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="hanh-trinh-title" className="sr-only">
          Hành trình Giáo lý mỗi Chúa Nhật
        </h2>
        <figure className="mx-auto max-w-5xl">
          <blockquote>
            <p
              data-scrub
              className="text-3xl leading-tight font-semibold tracking-tight text-ink md:text-5xl"
            >
              {WORDS.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <span
                    data-word
                    className={cn(
                      index >= WORDS.length - ACCENT_WORDS && "font-accent font-normal text-primary italic"
                    )}
                  >
                    {word}
                  </span>
                  {index < WORDS.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
          </blockquote>
          <figcaption className="mt-10 text-base text-ink-3 md:text-lg">
            Ban Giáo lý, Giáo xứ Đức Mẹ Hằng Cứu Giúp
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
