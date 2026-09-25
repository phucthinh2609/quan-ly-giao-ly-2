import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "../../lib/motion";
import { BigCTA } from "./components/BigCTA";
import { EditorialHero } from "./components/EditorialHero";
import { FeatureBento } from "./components/FeatureBento";
import { GlassNav } from "./components/GlassNav";
import { KhoiMarquee } from "./components/KhoiMarquee";
import { RoleAccordion } from "./components/RoleAccordion";
import { RoleStack } from "./components/RoleStack";
import { ScrubText } from "./components/ScrubText";
import { SiteFooter } from "./components/SiteFooter";
import type { LoginHandler, NavigateHandler } from "./components/roles";

gsap.registerPlugin(ScrollTrigger);

export interface WelcomePageProps {
  onLogin: LoginHandler;
  onNavigate: NavigateHandler;
}

/**
 * /welcome — Marketing surface (00 §4, 04 §4). Cấu trúc AIDA:
 *   Nav (glass pill)
 *   Attention: EditorialHero -> KhoiMarquee
 *   Interest:  FeatureBento (#tinh-nang)
 *   Desire:    RoleStack (#vai-tro, Card Stacking) -> ScrubText (#hanh-trinh, Scrubbing Text Reveal)
 *   Action:    RoleAccordion -> BigCTA -> SiteFooter
 *
 * Header và footer nằm ngoài <main> để giữ đúng landmark banner/contentinfo;
 * mọi section có thể tràn ngang đều nằm trong <main className="overflow-x-hidden w-full max-w-full">.
 */
export function WelcomePage({ onLogin, onNavigate }: WelcomePageProps) {
  // Sau khi mọi section đã tạo ScrollTrigger (pin + scrub), đo lại toàn trang một lần ở frame kế tiếp,
  // và thêm một lần khi font web (Geist/Fraunces) tải xong vì chiều cao chữ có thể đổi.
  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    document.fonts?.ready
      .then(() => {
        if (!cancelled) requestAnimationFrame(() => !cancelled && ScrollTrigger.refresh());
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <GlassNav onNavigate={onNavigate} />

      <main className="overflow-x-hidden w-full max-w-full bg-canvas text-ink">
        <EditorialHero onNavigate={onNavigate} />
        <KhoiMarquee />
        <FeatureBento />
        <RoleStack />
        <ScrubText />
        <RoleAccordion onLogin={onLogin} />
        <BigCTA onNavigate={onNavigate} />
      </main>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}
