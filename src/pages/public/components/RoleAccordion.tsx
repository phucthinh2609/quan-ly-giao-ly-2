import { useId, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Button } from "../../../components/ui/Button";
import { IconTile } from "../../../components/ui/IconTile";
import { PUBLIC_ROLES, ROLE_SOFT_BG, ROLE_WASH, type LoginHandler } from "./roles";

export interface RoleAccordionProps {
  onLogin: LoginHandler;
}

// Nội dung lát mở: hiện ngay (visibility không trễ) để Tab vào nút "Vào với vai trò này" không bị bỏ qua,
// opacity/translate trễ 200ms chờ lát giãn ra. Khi đóng: mờ dần rồi mới ẩn hẳn.
const PANEL_OPEN =
  "visible translate-y-0 opacity-100 [transition:opacity_500ms_var(--ease-out-soft)_200ms,translate_500ms_var(--ease-out-soft)_200ms]";
const PANEL_CLOSED =
  "invisible translate-y-4 opacity-0 [transition:opacity_250ms_ease-out,translate_250ms_ease-out,visibility_0s_linear_250ms]";

/**
 * Action (1) — Horizontal Accordion "Bạn là ai?" (03 §12 RoleAccordion).
 * md+: 4 lát ngang flex-[1] -> flex-[4]; mở bằng hover, focus (focus-within) hoặc click.
 * < md: thẻ xếp dọc, chạm tiêu đề để mở (aria-expanded), mỗi thẻ có nút đăng nhập.
 */
export function RoleAccordion({ onLogin }: RoleAccordionProps) {
  const uid = useId();
  const [active, setActive] = useState(2);

  return (
    <section aria-labelledby={`${uid}-title`} className="py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id={`${uid}-title`} className="text-4xl leading-[1.08] font-bold tracking-tight text-ink md:text-6xl">
            Bạn là ai?
          </h2>
          <p className="max-w-md text-lg text-ink-2 md:text-right">Chọn vai trò để vào thẳng không gian của bạn</p>
        </div>

        {/* md+ : horizontal accordion */}
        <div className="mt-14 hidden h-[30rem] gap-3 md:flex">
          {PUBLIC_ROLES.map((item, index) => {
            const open = active === index;
            const Icon = item.icon;
            const buttonId = `${uid}-slice-${index}`;
            const panelId = `${uid}-slice-panel-${index}`;
            return (
              <div
                key={item.role}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={cn(
                  "group relative min-w-0 overflow-hidden rounded-card-lg border border-line transition-[flex-grow] duration-700 ease-out-soft",
                  ROLE_SOFT_BG[item.tone],
                  open ? "flex-[4]" : "flex-[1]"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 ease-out-soft",
                    open ? "opacity-100" : "opacity-0"
                  )}
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div aria-hidden="true" className={cn("absolute inset-0 mix-blend-multiply", ROLE_WASH[item.tone])} />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-night/95 via-night/55 to-night/10"
                  />
                </div>

                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setActive(index)}
                  className="absolute inset-0 flex flex-col items-center justify-between rounded-card-lg px-2 py-6 focus-visible:-outline-offset-4"
                >
                  <span className={cn("transition-opacity duration-300", open ? "opacity-0" : "opacity-100")}>
                    <IconTile icon={<Icon />} tone={item.tone} size="lg" solid />
                  </span>
                  <span
                    className={cn(
                      "rotate-180 text-2xl font-semibold tracking-tight whitespace-nowrap text-ink transition-opacity duration-300 [writing-mode:vertical-rl]",
                      open ? "opacity-0" : "opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 p-8 text-on-night lg:p-10",
                    open ? PANEL_OPEN : PANEL_CLOSED
                  )}
                >
                  <div className="max-w-xl min-w-[18rem]">
                    <IconTile icon={<Icon />} tone={item.tone} size="lg" solid />
                    <h3 className="mt-5 text-3xl font-bold tracking-tight">{item.label}</h3>
                    <p className="mt-3 text-base text-on-night/85 lg:text-lg">{item.pitch}</p>
                    <Button
                      size="lg"
                      rightIcon={<ArrowRight />}
                      onClick={() => onLogin(item.role)}
                      className="pointer-events-auto mt-7"
                    >
                      Vào với vai trò này
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* < md : vertical accordion */}
        <ul className="mt-12 flex flex-col gap-3 md:hidden">
          {PUBLIC_ROLES.map((item, index) => {
            const open = active === index;
            const Icon = item.icon;
            const buttonId = `${uid}-card-${index}`;
            const panelId = `${uid}-card-panel-${index}`;
            return (
              <li
                key={item.role}
                className={cn(
                  "overflow-hidden rounded-card-lg border border-line transition-colors duration-300",
                  open ? "bg-surface shadow-card" : ROLE_SOFT_BG[item.tone]
                )}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setActive(open ? -1 : index)}
                    className="flex min-h-18 w-full items-center gap-4 rounded-card-lg p-4 text-left focus-visible:-outline-offset-4"
                  >
                    <IconTile icon={<Icon />} tone={item.tone} size="lg" solid />
                    <span className="min-w-0 flex-1 text-xl font-semibold tracking-tight text-ink">{item.label}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn("size-5 shrink-0 text-ink-2 transition-transform duration-300", open && "rotate-180")}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-out-soft",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div
                    className={cn(
                      "min-h-0 overflow-hidden transition-[visibility] duration-500",
                      open ? "visible" : "invisible"
                    )}
                  >
                    <div className="px-4 pb-4">
                      <div className="group relative aspect-[16/9] overflow-hidden rounded-card">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 size-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div aria-hidden="true" className={cn("absolute inset-0 mix-blend-multiply", ROLE_WASH[item.tone])} />
                      </div>
                      <p className="mt-4 text-base text-ink-2">{item.pitch}</p>
                      <Button
                        size="lg"
                        fullWidth
                        rightIcon={<ArrowRight />}
                        onClick={() => onLogin(item.role)}
                        className="mt-4"
                      >
                        Vào với vai trò này
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
