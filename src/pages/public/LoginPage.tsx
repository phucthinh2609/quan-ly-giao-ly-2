import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { IconTile } from "../../components/ui/IconTile";
import { KitoVuaLogo } from "../../components/ui/KitoVuaLogo";
import { useReveal } from "../../lib/motion";
import { PUBLIC_ROLES, type LoginHandler, type NavigateHandler } from "./components/roles";

export interface LoginPageProps {
  onLogin: LoginHandler;
  onNavigate: NavigateHandler;
}

/**
 * /login — Split: ảnh + trích dẫn Fraunces (ẩn dưới lg) / 4 ô vai trò lớn (04 §5).
 * Đăng nhập demo = chọn vai trò. Các ô xuất hiện theo nhịp qua useReveal (tự tắt khi reduced motion).
 */
export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const revealRef = useReveal<HTMLDivElement>({ stagger: 0.06, y: 18 });

  return (
    <main className="grid min-h-dvh bg-canvas text-ink lg:grid-cols-2">
      <div className="hidden overflow-hidden bg-night lg:sticky lg:top-0 lg:block lg:h-dvh lg:self-start">
        <img
          src="https://picsum.photos/seed/chapel-light/1400/1800"
          alt="Ánh sáng ban mai tràn vào lòng nhà nguyện"
          decoding="async"
          className="absolute inset-0 size-full object-cover grayscale contrast-125"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-night/80 via-night/20 to-transparent" />
        <figure className="absolute inset-x-12 bottom-12 max-w-lg xl:inset-x-16 xl:bottom-16">
          <blockquote>
            <p className="font-accent text-3xl leading-snug text-on-night italic">“Hãy để trẻ em đến với Thầy”</p>
          </blockquote>
          <figcaption className="mt-4 text-base font-medium text-on-night/80">— Mc 10,14</figcaption>
        </figure>
      </div>

      <section
        aria-labelledby="login-title"
        className="relative isolate flex items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 -z-10 size-[28rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 -z-10 size-[24rem] rounded-full bg-gold/15 blur-3xl"
        />

        <div ref={revealRef} className="w-full max-w-md">
          <div data-reveal>
            <KitoVuaLogo size="3.5rem" />
          </div>
          <h1 id="login-title" data-reveal className="mt-8 text-3xl font-bold tracking-tight text-ink">
            Chào mừng bạn
          </h1>
          <p data-reveal className="mt-2 text-base text-ink-2">
            Chọn vai trò để tiếp tục
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-3">
            {PUBLIC_ROLES.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.role} data-reveal className="flex">
                  <button
                    type="button"
                    onClick={() => onLogin(item.role)}
                    className="group relative flex min-h-36 w-full flex-col justify-between gap-4 rounded-card border border-line bg-surface p-4 text-left shadow-card transition-[translate,box-shadow,border-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-float focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50 active:scale-[0.98]"
                  >
                    <span className="flex items-start justify-between gap-2">
                      <IconTile icon={<Icon />} tone={item.tone} size="lg" />
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 shrink-0 text-ink-3 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                      />
                    </span>
                    <span>
                      <span className="block text-lg leading-snug font-semibold text-ink">{item.label}</span>
                      <span className="mt-0.5 block text-sm text-ink-2">{item.short}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p data-reveal className="mt-6 text-sm text-ink-3">
            Bản demo: chọn vai trò để đăng nhập, không cần mật khẩu.
          </p>

          <div data-reveal className="mt-8">
            <button
              type="button"
              onClick={() => onNavigate("/welcome")}
              className="-ml-3 inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Về trang giới thiệu
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
