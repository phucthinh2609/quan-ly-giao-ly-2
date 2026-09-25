import React from "react";
import { Spinner } from "./Spinner";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "soft";
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

// md dùng --control → chiều cao tự thích ứng theo vai trò (01 §9.1)
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-(--control-sm) px-3.5 text-sm gap-1.5 [&_svg]:size-4",
  md: "h-(--control) px-5 text-[0.9375rem] gap-2 [&_svg]:size-[1.125rem]",
  lg: "h-(--control-lg) px-6 text-base gap-2.5 [&_svg]:size-5",
  parent: "h-14 px-7 text-lg gap-3 [&_svg]:size-6",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover hover:shadow-glow",
  secondary: "bg-night text-on-night hover:bg-night/90",
  outline: "bg-surface text-ink border border-line-strong hover:border-ink-3 hover:bg-surface-2",
  ghost: "bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink",
  danger: "bg-danger text-on-solid hover:bg-danger/90",
  soft: "bg-primary-soft text-primary-ink hover:bg-primary-soft/70",
};

const spinnerColor: Record<ButtonVariant, "white" | "current"> = {
  primary: "white",
  secondary: "current",
  outline: "current",
  ghost: "current",
  danger: "current",
  soft: "current",
};

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

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onClick={onClick}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap select-none",
          "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out-soft",
          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50",
          fullWidth ? "w-full" : "w-auto",
          sizeClasses[size],
          variantClasses[variant],
          isDisabled ? "cursor-not-allowed opacity-50 shadow-none" : "active:scale-[0.97]",
          className
        )}
        {...rest}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size={size === "sm" ? "sm" : size === "parent" ? "lg" : "md"} color={spinnerColor[variant]} />
          </span>
        )}

        <span className={cn("inline-flex items-center justify-center gap-[inherit]", loading && "invisible")}>
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
