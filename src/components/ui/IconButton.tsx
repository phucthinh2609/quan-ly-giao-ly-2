import React from "react";
import { Spinner } from "./Spinner";

export type IconButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type IconButtonSize = "sm" | "md" | "lg" | "parent";

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /**
   * Bắt buộc có aria-label cho accessibility (Notification/More/Close/Back/Edit/Delete)
   */
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      "aria-label": ariaLabel,
      variant = "ghost",
      size = "md",
      loading = false,
      disabled = false,
      icon,
      children,
      className = "",
      type = "button",
      onClick,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Minimum touch-target is 44x44px according to Phase 0 and §5
    const sizeClasses: Record<IconButtonSize, string> = {
      sm: "w-[36px] h-[36px] min-w-[36px] min-h-[36px] text-[16px] rounded-[8px]",
      md: "w-[44px] h-[44px] min-w-[44px] min-h-[44px] text-[20px] rounded-[10px]",
      lg: "w-[52px] h-[52px] min-w-[52px] min-h-[52px] text-[24px] rounded-[10px]",
      parent: "w-[56px] h-[56px] min-w-[56px] min-h-[56px] text-[26px] rounded-[12px]",
    };

    const variantClasses: Record<IconButtonVariant, string> = {
      primary:
        "bg-[#B4232C] text-white hover:bg-[#941D25] active:bg-[#7A1A21] focus-visible:ring-[#B4232C]/30 shadow-xs",
      secondary:
        "bg-[#F5F5F4] text-[#292524] hover:bg-[#E7E5E4] active:bg-[#D6D3D1] border border-[#E7E5E4] focus-visible:ring-[#292524]/20",
      outline:
        "bg-transparent text-[#292524] border border-[#D6D3D1] hover:bg-[#FAFAF9] hover:border-[#A8A29E] active:bg-[#F5F5F4] focus-visible:ring-[#B4232C]/20",
      ghost:
        "bg-transparent text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4] active:bg-[#E7E5E4] focus-visible:ring-[#57534E]/20",
      danger:
        "bg-transparent text-[#C73A3A] hover:bg-[#FEF2F2] active:bg-[#FEE2E2] focus-visible:ring-[#DC4C4C]/30",
    };

    const disabledStyle = isDisabled
      ? "opacity-50 cursor-not-allowed pointer-events-none shadow-none"
      : "cursor-pointer active:scale-95";

    const spinnerColor =
      variant === "primary" ? "white" : variant === "danger" ? "primary" : "neutral";

    const content = icon || children;

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={isDisabled}
        aria-busy={loading}
        onClick={onClick}
        className={`
          relative inline-flex items-center justify-center transition-colors duration-150 select-none
          outline-none focus-visible:ring-3 focus-visible:ring-offset-2 shrink-0
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabledStyle}
          ${className}
        `}
        {...rest}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner
              size={size === "sm" ? "xs" : size === "parent" ? "md" : "sm"}
              color={spinnerColor}
            />
          </div>
        ) : (
          <span className="inline-flex items-center justify-center" aria-hidden="true">
            {content}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
