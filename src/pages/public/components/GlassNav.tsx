import { Button } from "../../../components/ui/Button";
import { KitoVuaLogo } from "../../../components/ui/KitoVuaLogo";
import type { NavigateHandler } from "./roles";
import { handleAnchorClick } from "./scroll";

export const SECTION_LINKS = [
  { id: "tinh-nang", label: "Tính năng" },
  { id: "vai-tro", label: "Vai trò" },
  { id: "hanh-trinh", label: "Hành trình" },
] as const;

export interface GlassNavProps {
  onNavigate: NavigateHandler;
}

/** Thanh điều hướng dạng viên thuốc kính mờ, nổi trên trang giới thiệu (03 §12). */
export function GlassNav({ onNavigate }: GlassNavProps) {
  return (
    <header className="fixed inset-x-4 top-4 z-40 mx-auto max-w-5xl rounded-full border border-line/70 bg-surface/70 shadow-float backdrop-blur-xl">
      <nav aria-label="Điều hướng chính" className="flex items-center justify-between gap-3 py-2 pr-2 pl-2.5 sm:pl-3">
        <a
          href="#top"
          onClick={(event) => handleAnchorClick(event, "top")}
          aria-label="Đoàn Kitô Vua, về đầu trang"
          className="flex min-w-0 items-center gap-3 rounded-full pr-2"
        >
          <KitoVuaLogo size="2.5rem" className="shrink-0" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-base font-bold tracking-tight text-ink">Đoàn Kitô Vua</span>
            <span className="hidden truncate text-xs font-medium text-ink-3 sm:block">Giáo lý Chúa Nhật</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {SECTION_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(event) => handleAnchorClick(event, link.id)}
                className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Button size="md" onClick={() => onNavigate("/login")}>
          Đăng nhập
        </Button>
      </nav>
    </header>
  );
}
