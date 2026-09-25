import React from "react";
import { Home, ShieldAlert } from "lucide-react";
import { UserRole } from "../../types";
import { Button } from "../ui/Button";
import { IconTile } from "../ui/IconTile";
import { ROLE_DEFAULT_PATHS } from "../../context/AuthContext";
import { cn } from "../../lib/cn";
import { ROLE_LABELS } from "../../lib/format";

export interface Forbidden403Props {
  role?: UserRole;
  message?: string;
  onGoHome?: (homePath: string) => void;
  className?: string;
}

/**
 * Forbidden403 — trang dành cho vai trò khác: giải thích ngắn + nút về trang chủ theo vai trò.
 */
export const Forbidden403: React.FC<Forbidden403Props> = ({
  role = "STUDENT",
  message = "Bạn không có quyền truy cập trang này.",
  onGoHome,
  className,
}) => {
  const homePath = ROLE_DEFAULT_PATHS[role] || "/dashboard";

  const handleReturnHome = () => {
    if (onGoHome) {
      onGoHome(homePath);
    } else {
      window.location.href = homePath;
    }
  };

  return (
    <section
      aria-labelledby="forbidden-heading"
      className={cn("flex min-h-[60vh] items-center justify-center px-4 py-12", className)}
    >
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <IconTile icon={<ShieldAlert />} tone="warning" size="xl" />
        <h1 id="forbidden-heading" className="mt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Trang này dành cho vai trò khác
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-2">{message}</p>
        <p className="mt-2 text-sm text-ink-3">
          Bạn đang đăng nhập với vai trò <span className="font-semibold text-ink-2">{ROLE_LABELS[role]}</span>. Nếu
          cần quyền truy cập, vui lòng liên hệ Ban Giáo lý.
        </p>
        <Button size="lg" leftIcon={<Home />} onClick={handleReturnHome} className="mt-8 w-full sm:w-auto">
          Về trang chủ
        </Button>
        <p className="mt-6 font-mono text-xs text-ink-3">Mã lỗi 403</p>
      </div>
    </section>
  );
};
