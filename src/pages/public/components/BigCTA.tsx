import { ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { NavigateHandler } from "./roles";

export interface BigCTAProps {
  onNavigate: NavigateHandler;
}

/**
 * Action (2) — khối CTA cực lớn nền night (03 §12 BigCTA).
 * Nền tối -> nút primary chữ trắng (on-primary), tương phản >= 4.5:1 ở cả Light/Dark.
 */
export function BigCTA({ onNavigate }: BigCTAProps) {
  return (
    <section aria-labelledby="cta-title" className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
      <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-card-lg bg-night px-6 py-24 text-center text-on-night ring-1 ring-on-night/10 sm:px-10 md:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/2 left-1/2 -z-10 size-[56rem] -translate-x-1/2 rounded-full bg-radial from-primary/50 via-primary/10 to-transparent to-70%"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1/2 -left-1/4 -z-10 size-[36rem] rounded-full bg-radial from-gold/20 to-transparent to-70%"
        />

        <h2 id="cta-title" className="mx-auto max-w-4xl text-display font-bold tracking-tight">
          Sẵn sàng cho Chúa Nhật này?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-on-night/80 md:text-xl">
          Chọn vai trò của bạn và bắt đầu ngay, không cần cài đặt hay ghi nhớ mật khẩu.
        </p>
        <div className="mt-12 flex justify-center">
          <Button size="lg" rightIcon={<ArrowRight />} onClick={() => onNavigate("/login")} className="w-full sm:w-auto">
            Vào ứng dụng
          </Button>
        </div>
      </div>
    </section>
  );
}
