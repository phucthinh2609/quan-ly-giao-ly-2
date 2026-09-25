import React from "react";
import { Smartphone, X } from "lucide-react";
import { usePreferences } from "../context/PreferencesContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui";

// ============================================================================
// MOBILE FRAME PREVIEW — xem app trong khung 390×844 bằng iframe (viewport thật,
// nên breakpoint mobile hoạt động đúng). Chỉ dùng cho trình diễn.
// ============================================================================

export const MobileFramePreview: React.FC<{ path: string }> = ({ path }) => {
  const { setMobileFrame, theme, textSize } = usePreferences();
  const { role } = useAuth();
  const src = `${path}${path.includes("?") ? "&" : "?"}embed=1`;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-surface-2 px-6 py-10 lg:flex-row lg:gap-16">
      <div className="max-w-xs space-y-4 text-center lg:text-left">
        <span className="inline-flex size-12 items-center justify-center rounded-control bg-night text-on-night">
          <Smartphone className="size-6" aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Khung điện thoại 390px</h1>
        <p className="text-ink-2">
          App chạy trong viewport mobile thật. Đổi vai trò, giao diện hoặc cỡ chữ ở bảng Demo sẽ tải lại khung.
        </p>
        <Button variant="outline" leftIcon={<X />} onClick={() => setMobileFrame(false)}>
          Thoát khung điện thoại
        </Button>
      </div>

      <div className="rounded-[3rem] bg-night p-3 shadow-float">
        <iframe
          key={`${role}-${theme}-${textSize}`}
          title="Xem trước trên điện thoại"
          src={src}
          className="block h-[52.75rem] max-h-[calc(100dvh-5rem)] w-[24.375rem] rounded-[2.4rem] bg-canvas"
        />
      </div>
    </div>
  );
};
