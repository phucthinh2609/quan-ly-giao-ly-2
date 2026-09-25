import { KitoVuaLogo } from "../../../components/ui/KitoVuaLogo";
import type { NavigateHandler } from "./roles";
import { handleAnchorClick } from "./scroll";

export interface SiteFooterProps {
  onNavigate: NavigateHandler;
}

const LINK_CLASS =
  "inline-flex h-10 items-center rounded-full px-3 text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-surface-2 hover:text-ink";

export function SiteFooter({ onNavigate }: SiteFooterProps) {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <KitoVuaLogo size="3rem" className="shrink-0" />
          <div className="min-w-0 leading-tight">
            <p className="text-base font-bold tracking-tight text-ink">Đoàn Kitô Vua</p>
            <p className="mt-1 text-sm text-ink-2">Giáo xứ Đức Mẹ Hằng Cứu Giúp</p>
          </div>
        </div>

        <nav aria-label="Liên kết cuối trang">
          <ul className="-mx-3 flex flex-wrap items-center gap-1">
            <li>
              <a href="#tinh-nang" onClick={(event) => handleAnchorClick(event, "tinh-nang")} className={LINK_CLASS}>
                Tính năng
              </a>
            </li>
            <li>
              <a href="#vai-tro" onClick={(event) => handleAnchorClick(event, "vai-tro")} className={LINK_CLASS}>
                Vai trò
              </a>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate("/login")} className={LINK_CLASS}>
                Đăng nhập
              </button>
            </li>
          </ul>
        </nav>

        <p className="text-sm text-ink-3">© 2026 Đoàn Kitô Vua</p>
      </div>
    </footer>
  );
}
