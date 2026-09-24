import React, { useEffect, useRef, useId } from "react";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  description,
  error,
  id,
  name,
  className = "",
  onChange,
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync indeterminate property on real DOM input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate && !checked);
    }
  }, [indeterminate, checked]);

  const isChecked = checked && !indeterminate;
  const isIndeterminate = indeterminate && !checked;
  const hasError = Boolean(error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(e.target.checked);
  };

  return (
    <div className={`inline-flex flex-col font-sans ${className}`}>
      <label
        htmlFor={checkboxId}
        className={`
          inline-flex items-start gap-3 select-none min-h-[44px] py-1 cursor-pointer
          ${disabled ? "cursor-not-allowed opacity-60" : ""}
        `}
      >
        {/* Hidden Native Checkbox */}
        <input
          ref={inputRef}
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only peer"
        />

        {/* Custom Visual Box with Touch Target Container */}
        <div className="relative flex items-center justify-center shrink-0 w-6 h-6 mt-0.5">
          <div
            className={`
              w-5 h-5 rounded-[6px] transition-all duration-150 flex items-center justify-center
              border text-white
              ${
                isChecked || isIndeterminate
                  ? "bg-[#B4232C] border-[#B4232C]"
                  : "bg-white border-[#D6D3D1] hover:border-[#A8A29E]"
              }
              ${hasError ? "border-[#DC4C4C]" : ""}
              ${
                disabled
                  ? "bg-[#F5F5F4] border-[#E7E5E4] text-[#A8A29E]"
                  : "peer-focus-visible:ring-3 peer-focus-visible:ring-[#B4232C]/25"
              }
            `}
          >
            {isChecked && (
              <Check className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-75 duration-100" />
            )}
            {isIndeterminate && (
              <Minus className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-75 duration-100" />
            )}
          </div>
        </div>

        {/* Label & Description */}
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span
                className={`text-[15px] font-medium leading-snug ${
                  disabled ? "text-[#A8A29E]" : "text-[#292524]"
                }`}
              >
                {label}
              </span>
            )}
            {description && (
              <span className="text-[13px] text-[#78716C] mt-0.5 leading-normal">
                {description}
              </span>
            )}
          </div>
        )}
      </label>

      {hasError && (
        <span role="alert" className="text-[12px] font-medium text-[#DC4C4C] mt-0.5 ml-9">
          {error}
        </span>
      )}
    </div>
  );
};
