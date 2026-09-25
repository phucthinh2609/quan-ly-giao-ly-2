import React, { useId, useState } from "react";
import { AlertCircle } from "lucide-react";

export type InputType = "text" | "number" | "email" | "password" | "date";
export type InputSize = "sm" | "md" | "lg" | "parent";

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  type?: InputType;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange: (value: string) => void;
  // Optional convenience props
  id?: string;
  name?: string;
  size?: InputSize;
  className?: string;
  autoComplete?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      type = "text",
      disabled = false,
      readOnly = false,
      required = false,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onChange,
      id,
      name,
      size = "md",
      className = "",
      autoComplete,
      onBlur,
      onFocus,
      onKeyDown,
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const [isFocused, setIsFocused] = useState(false);
    const hasError = Boolean(error);

    // Height & font token specifications
    // sm: height 40px
    // md: height 48px
    // lg: height 52px
    // parent: height 56px, font-size 18px
    const sizeClasses: Record<InputSize, string> = {
      sm: "h-[40px] text-[15px] px-3.5 rounded-[8px]",
      md: "h-[48px] text-[16px] px-4 rounded-[10px]",
      lg: "h-[52px] text-[16px] px-4 rounded-[10px]",
      parent: "h-[56px] text-[18px] px-5 rounded-[12px] font-medium",
    };

    const labelSizeClasses: Record<InputSize, string> = {
      sm: "text-[13px] mb-1",
      md: "text-[14px] mb-1.5",
      lg: "text-[15px] mb-1.5",
      parent: "text-[16px] mb-2 font-semibold text-[#1C1917]",
    };

    return (
      <div className={`w-full flex flex-col font-sans ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`font-medium text-[#292524] flex items-center gap-1 ${labelSizeClasses[size]}`}
          >
            <span>{label}</span>
            {required && <span className="text-[#DC4C4C] font-bold" aria-hidden="true">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div
          className={`
            relative flex items-center w-full transition-colors duration-150
            border bg-white
            ${sizeClasses[size]}
            ${
              hasError
                ? "border-[#DC4C4C] text-[#DC4C4C] focus-within:ring-3 focus-within:ring-[#DC4C4C]/25"
                : isFocused
                ? "border-[#B4232C] ring-3 ring-[#B4232C]/20"
                : "border-[#D6D3D1] hover:border-[#A8A29E]"
            }
            ${disabled ? "bg-[#F5F5F4] border-[#E7E5E4] opacity-70 cursor-not-allowed text-[#A8A29E]" : ""}
            ${readOnly && !disabled ? "bg-[#FAFAF9] border-[#E7E5E4] text-[#57534E]" : ""}
          `}
        >
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={`flex items-center justify-center shrink-0 mr-2.5 text-[#78716C] ${
                hasError ? "text-[#DC4C4C]" : ""
              }`}
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          {/* Actual Input */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            onChange={(e) => onChange(e.target.value)}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onKeyDown={onKeyDown}
            className={`
              w-full h-full bg-transparent border-none outline-none p-0
              text-[#292524] placeholder:text-[#A8A29E]
              disabled:cursor-not-allowed disabled:text-[#A8A29E]
            `}
          />

          {/* Right Icon / Error Indicator */}
          {hasError ? (
            <div className="flex items-center justify-center shrink-0 ml-2 text-[#DC4C4C]" aria-hidden="true">
              <AlertCircle className="w-5 h-5" />
            </div>
          ) : rightIcon ? (
            <div className="flex items-center justify-center shrink-0 ml-2 text-[#78716C]" aria-hidden="true">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {/* Error message or Helper text */}
        {hasError ? (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-[13px] font-medium text-[#DC4C4C] flex items-center gap-1"
          >
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="mt-1.5 text-[13px] text-[#78716C]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
