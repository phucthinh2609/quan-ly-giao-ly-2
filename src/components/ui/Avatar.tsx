import React, { useState, useEffect } from "react";
import { User as UserIcon } from "lucide-react";

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
  className?: string;
}

// Generate consistent initials from Vietnamese or international names
function getInitials(name?: string): string {
  if (!name || !name.trim()) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  // For Vietnamese names: First letter of first word + First letter of last word
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

// Deterministic pastel color palette based on name hash
const palette = [
  { bg: "bg-[#FFE4E6]", text: "text-[#B4232C]", border: "border-[#FECDD3]" }, // Primary red tint
  { bg: "bg-[#FEF3C7]", text: "text-[#8B6419]", border: "border-[#FDE68A]" }, // Gold tint
  { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", border: "border-[#BFDBFE]" }, // Blue tint
  { bg: "bg-[#D1FAE5]", text: "text-[#146C47]", border: "border-[#A7F3D0]" }, // Green tint
  { bg: "bg-[#EDE9FE]", text: "text-[#6D28D9]", border: "border-[#DDD6FE]" }, // Purple tint
];

function getPaletteByName(name?: string) {
  if (!name) return palette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palette.length;
  return palette[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  status,
  roleBadge,
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = getInitials(name);
  const colorScheme = getPaletteByName(name);

  const sizeClasses: Record<AvatarSize, { box: string; text: string; icon: string; status: string; role: string }> = {
    xs: {
      box: "w-6 h-6 min-w-6 min-h-6 rounded-full",
      text: "text-[10px] font-semibold",
      icon: "w-3 h-3",
      status: "w-1.5 h-1.5 right-0 bottom-0",
      role: "text-[8px] px-1 -bottom-1",
    },
    sm: {
      box: "w-8 h-8 min-w-8 min-h-8 rounded-full",
      text: "text-[12px] font-semibold",
      icon: "w-4 h-4",
      status: "w-2 h-2 right-0 bottom-0",
      role: "text-[9px] px-1 -bottom-1",
    },
    md: {
      box: "w-10 h-10 min-w-10 min-h-10 rounded-full",
      text: "text-[14px] font-bold",
      icon: "w-5 h-5",
      status: "w-2.5 h-2.5 right-0.5 bottom-0.5",
      role: "text-[10px] px-1.5 -bottom-1.5",
    },
    lg: {
      box: "w-12 h-12 min-w-12 min-h-12 rounded-full",
      text: "text-[16px] font-bold",
      icon: "w-6 h-6",
      status: "w-3 h-3 right-0.5 bottom-0.5",
      role: "text-[10px] px-1.5 -bottom-1.5",
    },
    xl: {
      box: "w-14 h-14 min-w-14 min-h-14 rounded-full",
      text: "text-[18px] font-bold",
      icon: "w-7 h-7",
      status: "w-3.5 h-3.5 right-1 bottom-1",
      role: "text-[11px] px-2 -bottom-2",
    },
    "2xl": {
      box: "w-16 h-16 min-w-16 min-h-16 rounded-full",
      text: "text-[20px] font-bold",
      icon: "w-8 h-8",
      status: "w-4 h-4 right-1 bottom-1",
      role: "text-[12px] px-2 -bottom-2",
    },
  };

  const statusColors: Record<AvatarStatus, string> = {
    online: "bg-[#22A06B]",
    offline: "bg-[#78716C]",
    busy: "bg-[#DC4C4C]",
    away: "bg-[#D9901A]",
  };

  const roleStyles: Record<AvatarRole, string> = {
    ADMIN: "bg-[#641A1E] text-white border-white",
    GLV: "bg-[#B4232C] text-white border-white",
    HS: "bg-[#3B82F6] text-white border-white",
    PH: "bg-[#C99526] text-white border-white",
  };

  const currentSize = sizeClasses[size];
  const shouldShowImage = Boolean(src && !hasError);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${currentSize.box} ${className}`}
    >
      {shouldShowImage ? (
        <img
          src={src || undefined}
          alt={alt || name || "Avatar"}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover rounded-full border border-[#E7E5E4]`}
        />
      ) : (
        /* Fallback initials or icon - không hiển thị ảnh vỡ */
        <div
          className={`
            w-full h-full rounded-full flex items-center justify-center border
            ${colorScheme.bg}
            ${colorScheme.text}
            ${colorScheme.border}
          `}
          aria-label={name || "Người dùng"}
        >
          {initials ? (
            <span className={currentSize.text}>{initials}</span>
          ) : (
            <UserIcon className={currentSize.icon} aria-hidden="true" />
          )}
        </div>
      )}

      {/* Online / Status Dot */}
      {status && (
        <span
          className={`
            absolute rounded-full ring-2 ring-white
            ${currentSize.status}
            ${statusColors[status]}
          `}
          aria-label={`Trạng thái: ${status}`}
        />
      )}

      {/* Role Badge (ADMIN, GLV, HS, PH) */}
      {roleBadge && (
        <span
          className={`
            absolute font-bold rounded-full border shadow-xs tracking-wider uppercase
            ${currentSize.role}
            ${roleStyles[roleBadge]}
          `}
        >
          {roleBadge}
        </span>
      )}
    </div>
  );
};
