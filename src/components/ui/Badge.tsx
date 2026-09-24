import React from "react";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "gold";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  dot = false,
  icon,
  children,
  className = "",
}) => {
  // Phase 0 Token mappings
  const variantStyles: Record<
    BadgeVariant,
    { bg: string; text: string; border: string; dotColor: string }
  > = {
    neutral: {
      bg: "bg-[#F5F5F4]",
      text: "text-[#57534E]",
      border: "border-[#E7E5E4]",
      dotColor: "bg-[#78716C]",
    },
    primary: {
      bg: "bg-[#FFF1F2]",
      text: "text-[#B4232C]",
      border: "border-[#FECDD3]",
      dotColor: "bg-[#B4232C]",
    },
    success: {
      bg: "bg-[#ECFDF3]",
      text: "text-[#168154]",
      border: "border-[#D1FAE5]",
      dotColor: "bg-[#22A06B]",
    },
    warning: {
      bg: "bg-[#FFF8E7]",
      text: "text-[#B86F08]",
      border: "border-[#FEF0C7]",
      dotColor: "bg-[#D9901A]",
    },
    error: {
      bg: "bg-[#FEF2F2]",
      text: "text-[#C73A3A]",
      border: "border-[#FEE2E2]",
      dotColor: "bg-[#DC4C4C]",
    },
    info: {
      bg: "bg-[#EFF6FF]",
      text: "text-[#2563EB]",
      border: "border-[#DBEAFE]",
      dotColor: "bg-[#3B82F6]",
    },
    gold: {
      bg: "bg-[#FFFBEB]",
      text: "text-[#8B6419]",
      border: "border-[#FDE68A]",
      dotColor: "bg-[#E3B341]",
    },
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "text-[11px] px-2 py-0.5 gap-1 font-medium",
    md: "text-[12px] px-2.5 py-0.5 gap-1.5 font-semibold",
    lg: "text-[13px] px-3 py-1 gap-1.5 font-semibold",
  };

  const style = variantStyles[variant];

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full border font-sans select-none tracking-tight
        ${style.bg}
        ${style.text}
        ${style.border}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dotColor}`}
          aria-hidden="true"
        />
      )}
      {icon && (
        <span className="shrink-0 flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
