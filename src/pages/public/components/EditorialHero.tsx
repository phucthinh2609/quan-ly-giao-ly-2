import { ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useReveal } from "../../../lib/motion";
import type { NavigateHandler } from "./roles";
import { scrollToSection } from "./scroll";

export interface EditorialHeroProps {
  onNavigate: NavigateHandler;
}

/**
 * Attention — Hero "Editorial Split" (04 §4).
 *
 * Kiểm tra số dòng H1 (đo bằng Geist 700 + Fraunces italic thật trên trình duyệt):
 * - Chiều rộng tự nhiên của câu ~24.2em; cần tối thiểu ~8.25em mỗi dòng để gói trong 3 dòng.
 * - lg:col-span-7 trong max-w-7xl (lg:px-8, lg:gap-x-10) = 7W/12 - 0.42 * gap.
 *   1024px: 531px / 51.2px = 10.4em; 1280px: 692px / 64px = 10.8em; >= 1600px: 692px / 80px = 8.66em.
 * - Mọi kích thước là rem nên tỉ lệ giữ nguyên khi cỡ chữ gốc là 18px hoặc 20px.
 * => Luôn <= 3 dòng từ 1024px trở lên. Không stamp, không pill-tag, không số liệu trong hero.
 */
export function EditorialHero({ onNavigate }: EditorialHeroProps) {
  const ref = useReveal<HTMLElement>({ stagger: 0.08, y: 20 });

  return (
    <section
      ref={ref}
      id="top"
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="grain relative isolate overflow-hidden outline-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-40 -z-10 size-[38rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-56 -z-10 size-[42rem] rounded-full bg-gold/20 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 pt-40 pb-32 sm:px-6 md:pb-48 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <h1 id="hero-title" data-reveal className="max-w-4xl text-display font-bold tracking-tight text-ink">
              Mỗi Chúa Nhật là một bước{" "}
              <span
                aria-hidden="true"
                className="inline-block h-[0.78em] w-[1.9em] rounded-full bg-cover bg-center align-middle grayscale contrast-125"
                style={{ backgroundImage: "url(https://picsum.photos/seed/sunday-light/480/240)" }}
              />{" "}
              lớn lên trong <span className="font-accent font-normal italic text-primary">Đức Tin</span>.
            </h1>

            <p data-reveal className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl">
              Điểm danh một chạm, nhập điểm trong vài phút, phụ huynh và các em theo dõi hành trình Giáo lý mọi lúc.
            </p>

            <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                rightIcon={<ArrowRight />}
                onClick={() => onNavigate("/login")}
                className="w-full sm:w-auto"
              >
                Vào ứng dụng
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("tinh-nang")}
                className="w-full sm:w-auto"
              >
                Xem cách hoạt động
              </Button>
            </div>
          </div>

          <div data-reveal className="lg:col-span-5">
            <figure className="group relative aspect-[4/3] w-full overflow-hidden rounded-card-lg bg-surface-3 shadow-float lg:aspect-[4/5]">
              <img
                src="https://picsum.photos/seed/chapel-window/1200/1500"
                alt="Ánh nắng sớm chiếu qua ô cửa kính nhà nguyện"
                width={1200}
                height={1500}
                decoding="async"
                className="absolute inset-0 size-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-primary/15 mix-blend-multiply" />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-night/60 via-transparent" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
