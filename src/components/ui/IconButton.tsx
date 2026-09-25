import React from "react";
import { Spinner } from "./Spinner";
import { cn } from "../../lib/cn";

export type IconButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "soft";
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

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "size-9 [&_svg]:size-4",
  md: "size-11 [&_svg]:size-5",
  lg: "size-13 [&_svg]:size-6",
  parent: "size-14 [&_svg]:size-6",
};

const variantClasses: Record<IconButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover hover:shadow-glow",
  secondary: "bg-night text-on-night hover:bg-night/90",
  outline: "bg-surface text-ink border border-line-strong hover:bg-surface-2",
  ghost: "bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink",
  danger: "bg-transparent text-danger hover:bg-danger-soft",
  soft: "bg-surface-2 text-ink hover:bg-surface-3",
};

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
    const content = icon || children;

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onClick={onClick}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center rounded-full select-none",
          "transition-[background-color,color,box-shadow,transform] duration-150 ease-out-soft",
          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50",
          sizeClasses[size],
          variantClasses[variant],
          isDisabled ? "cursor-not-allowed opacity-50" : "active:scale-95",
          className
        )}
        {...rest}
      >
        {loading ? (
          <Spinner size={size === "sm" ? "xs" : "sm"} color={variant === "primary" ? "white" : "current"} />
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
