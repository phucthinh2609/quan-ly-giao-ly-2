import React from "react";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "parent";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      type = "button",
      onClick,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Size variants based on Phase 0 Tokens
    // sm: height 36px, min-h-[36px]
    // md: height 44px (touch target standard min 44px)
    // lg: height 52px (GLV fast input touch target 52px)
    // parent: height 56px (Parent elderly-friendly touch target 56px, font 18px)
    const sizeClasses: Record<ButtonSize, string> = {
      sm: "h-[36px] px-3 text-[14px] gap-1.5 font-medium rounded-[8px]",
      md: "h-[44px] px-4 text-[15px] gap-2 font-semibold rounded-[10px]",
      lg: "h-[52px] px-5 text-[16px] gap-2.5 font-semibold rounded-[10px]",
      parent: "h-[56px] px-6 text-[18px] gap-3 font-bold rounded-[12px] tracking-wide",
    };

    // Variant color styles with state tokens (Default, Hover, Active, Disabled)
    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        "bg-[#B4232C] text-white hover:bg-[#941D25] active:bg-[#7A1A21] focus-visible:ring-[#B4232C]/30 shadow-xs active:shadow-none",
      secondary:
        "bg-[#F5F5F4] text-[#292524] hover:bg-[#E7E5E4] active:bg-[#D6D3D1] focus-visible:ring-[#292524]/20 border border-[#E7E5E4]",
      outline:
        "bg-transparent text-[#292524] border border-[#D6D3D1] hover:bg-[#FAFAF9] hover:border-[#A8A29E] active:bg-[#F5F5F4] focus-visible:ring-[#B4232C]/20",
      ghost:
        "bg-transparent text-[#44403C] hover:bg-[#F5F5F4] active:bg-[#E7E5E4] focus-visible:ring-[#44403C]/20",
      danger:
        "bg-[#C73A3A] text-white hover:bg-[#A52D2D] active:bg-[#852222] focus-visible:ring-[#DC4C4C]/30 shadow-xs active:shadow-none",
    };

    // Disabled state overrides
    const disabledStyle = isDisabled
      ? "opacity-60 cursor-not-allowed hover:bg-none pointer-events-none shadow-none"
      : "cursor-pointer active:scale-[0.985]";

    const spinnerColor =
      variant === "primary" || variant === "danger"
        ? "white"
        : variant === "ghost" || variant === "outline"
        ? "neutral"
        : "neutral";

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading}
        onClick={onClick}
        className={`
          relative inline-flex items-center justify-center font-sans transition-all duration-150 select-none
          outline-none focus-visible:ring-3 focus-visible:ring-offset-2
          ${fullWidth ? "w-full" : "w-auto"}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabledStyle}
          ${className}
        `}
        {...rest}
      >
        {/* Loading Spinner: Absolute center to preserve exact button dimensions */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner
              size={size === "sm" ? "sm" : size === "parent" ? "lg" : "md"}
              color={spinnerColor}
            />
          </div>
        )}

        {/* Button Content: Hidden visibility when loading to maintain exact size */}
        <span
          className={`inline-flex items-center justify-center gap-[inherit] ${
            loading ? "invisible" : "visible"
          }`}
        >
          {leftIcon && (
            <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <span>{children}</span>
          {rightIcon && (
            <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
