import React, { useState, useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { TONE_SOFT, Tone, toneFromString } from "./tone";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";
export type AvatarRole = "ADMIN" | "GLV" | "HS" | "PH";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  roleBadge?: AvatarRole;
  /** Vòng màu quanh avatar (Level học sinh, con đang được chọn...) */
  ring?: Tone;
  className?: string;
}

// Initials: chữ đầu của từ đầu + từ cuối (tên tiếng Việt), hoặc 2 ký tự nếu chỉ một từ
function getInitials(name?: string): string {
  if (!name || !name.trim()) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

// 03 §4.6: xs 24 · sm 32 · md 40 · lg 48 · xl 64 · 2xl 88 (rem)
const sizeClasses: Record<AvatarSize, { box: string; text: string; icon: string; status: string; role: string }> = {
  xs: {
    box: "size-6",
    text: "text-[0.625rem] font-semibold",
    icon: "size-3",
    status: "size-2 ring-1",
    role: "hidden",
  },
  sm: {
    box: "size-8",
    text: "text-xs font-semibold",
    icon: "size-4",
    status: "size-2.5 ring-2",
    role: "h-4 px-1 text-[0.5625rem] -bottom-1",
  },
  md: {
    box: "size-10",
    text: "text-sm font-semibold",
    icon: "size-5",
    status: "size-3 ring-2",
    role: "h-4 px-1.5 text-[0.625rem] -bottom-1.5",
  },
  lg: {
    box: "size-12",
    text: "text-base font-semibold",
    icon: "size-6",
    status: "size-3.5 ring-2",
    role: "h-5 px-1.5 text-[0.625rem] -bottom-1.5",
  },
  xl: {
    box: "size-16",
    text: "text-xl font-semibold",
    icon: "size-8",
    status: "size-4 ring-2",
    role: "h-5 px-2 text-xs -bottom-2",
  },
  "2xl": {
    box: "size-22",
    text: "text-3xl font-semibold",
    icon: "size-10",
    status: "size-5 ring-3",
    role: "h-6 px-2.5 text-xs -bottom-2",
  },
};

const STATUS_POSITION: Record<AvatarSize, { top: string; bottom: string }> = {
  xs: { top: "top-0 right-0", bottom: "bottom-0 right-0" },
  sm: { top: "top-0 right-0", bottom: "bottom-0 right-0" },
  md: { top: "top-0 right-0", bottom: "bottom-0 right-0" },
  lg: { top: "top-0 right-0", bottom: "bottom-0 right-0" },
  xl: { top: "top-0.5 right-0.5", bottom: "bottom-0.5 right-0.5" },
  "2xl": { top: "top-1 right-1", bottom: "bottom-1 right-1" },
};

// Viết đầy đủ để Tailwind nhận diện (không ghép chuỗi động)
const RING_CLASSES: Record<Tone, string> = {
  neutral: "ring-line-strong",
  primary: "ring-primary",
  gold: "ring-gold",
  success: "ring-success",
  warning: "ring-warning",
  danger: "ring-danger",
  info: "ring-info",
  sky: "ring-sky",
  mint: "ring-mint",
  sun: "ring-sun",
  grape: "ring-grape",
  coral: "ring-coral",
  rose: "ring-rose",
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-success",
  offline: "bg-ink-3",
  busy: "bg-danger",
  away: "bg-warning",
};

const statusLabels: Record<AvatarStatus, string> = {
  online: "Đang hoạt động",
  offline: "Ngoại tuyến",
  busy: "Đang bận",
  away: "Vắng mặt",
};

const roleStyles: Record<AvatarRole, string> = {
  ADMIN: "bg-night text-on-night",
  GLV: "bg-primary text-on-primary",
  HS: "bg-sky text-on-solid",
  PH: "bg-gold text-night",
};

const roleLabels: Record<AvatarRole, string> = {
  ADMIN: "Quản trị",
  GLV: "Giáo lý viên",
  HS: "Học sinh",
  PH: "Phụ huynh",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  status,
  roleBadge,
  ring,
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset trạng thái lỗi khi đổi ảnh
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = getInitials(name);
  const fallbackTone: Tone = name && name.trim() ? toneFromString(name.trim()) : "neutral";
  const currentSize = sizeClasses[size];
  const shouldShowImage = Boolean(src && !hasError);

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full select-none",
        currentSize.box,
        ring && cn("ring-2 ring-offset-2 ring-offset-surface", RING_CLASSES[ring]),
        className
      )}
    >
      {shouldShowImage ? (
        <img
          src={src || undefined}
          alt={alt || name || "Ảnh đại diện"}
          onError={() => setHasError(true)}
          className="size-full rounded-full border border-line object-cover"
        />
      ) : (
        // Fallback: initials trên nền màu xác định theo tên (không hiển thị ảnh vỡ)
        <div
          role="img"
          aria-label={alt || name || "Người dùng"}
          className={cn("flex size-full items-center justify-center rounded-full", TONE_SOFT[fallbackTone])}
        >
          {initials ? (
            <span className={cn("leading-none tracking-tight", currentSize.text)} aria-hidden="true">
              {initials}
            </span>
          ) : (
            <UserIcon className={currentSize.icon} aria-hidden="true" />
          )}
        </div>
      )}

      {/* Chấm trạng thái (có nhãn cho trình đọc màn hình, không chỉ dựa vào màu) */}
      {status && (
        <span
          role="img"
          aria-label={`Trạng thái: ${statusLabels[status]}`}
          title={statusLabels[status]}
          className={cn(
            "absolute rounded-full ring-surface",
            // Có nhãn vai trò ở đáy → chấm trạng thái lên góc trên để không chồng nhau
            roleBadge ? STATUS_POSITION[size].top : STATUS_POSITION[size].bottom,
            currentSize.status,
            statusColors[status]
          )}
        />
      )}

      {/* Nhãn vai trò (ADMIN, GLV, HS, PH) */}
      {roleBadge && (
        <span
          title={roleLabels[roleBadge]}
          className={cn(
            "absolute left-1/2 inline-flex -translate-x-1/2 items-center justify-center rounded-full font-bold leading-none whitespace-nowrap ring-2 ring-surface",
            currentSize.role,
            roleStyles[roleBadge]
          )}
        >
          <span aria-hidden="true">{roleBadge}</span>
          <span className="sr-only">{roleLabels[roleBadge]}</span>
        </span>
      )}
    </div>
  );
};
