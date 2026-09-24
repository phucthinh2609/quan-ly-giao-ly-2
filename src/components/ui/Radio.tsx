import React, { useId } from "react";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioProps {
  name?: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: string;
  id?: string;
  className?: string;
  onChange: (value: string) => void;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked,
  disabled = false,
  label,
  description,
  id,
  className = "",
  onChange,
}) => {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <label
      htmlFor={radioId}
      className={`
        inline-flex items-start gap-3 select-none min-h-[44px] py-1 cursor-pointer font-sans
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
        ${className}
      `}
    >
      <input
        id={radioId}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => !disabled && onChange(value)}
        className="sr-only peer"
      />

      {/* Custom Radio Circle Container */}
      <div className="relative flex items-center justify-center shrink-0 w-6 h-6 mt-0.5">
        <div
          className={`
            w-5 h-5 rounded-full transition-all duration-150 flex items-center justify-center
            border bg-white
            ${
              checked
                ? "border-[#B4232C]"
                : "border-[#D6D3D1] hover:border-[#A8A29E]"
            }
            ${
              disabled
                ? "bg-[#F5F5F4] border-[#E7E5E4]"
                : "peer-focus-visible:ring-3 peer-focus-visible:ring-[#B4232C]/25"
            }
          `}
        >
          {checked && (
            <div
              className={`w-2.5 h-2.5 rounded-full transition-transform animate-in zoom-in-50 duration-100 ${
                disabled ? "bg-[#A8A29E]" : "bg-[#B4232C]"
              }`}
            />
          )}
        </div>
      </div>

      {/* Label and Description */}
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
  );
};

export interface RadioGroupProps {
  name: string;
  label?: string;
  value: string;
  options: RadioOption[];
  disabled?: boolean;
  error?: string;
  helperText?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
  onChange: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  value,
  options,
  disabled = false,
  error,
  helperText,
  orientation = "vertical",
  className = "",
  onChange,
}) => {
  return (
    <fieldset className={`flex flex-col font-sans ${className}`} aria-invalid={Boolean(error)}>
      {label && (
        <legend className="text-[14px] font-medium text-[#292524] mb-2">
          {label}
        </legend>
      )}

      <div
        className={`flex ${
          orientation === "horizontal"
            ? "flex-row flex-wrap gap-x-6 gap-y-2"
            : "flex-col gap-y-1"
        }`}
      >
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={disabled || opt.disabled}
            label={opt.label}
            description={opt.description}
            onChange={onChange}
          />
        ))}
      </div>

      {error ? (
        <p role="alert" className="text-[12px] font-medium text-[#DC4C4C] mt-1.5">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[12px] text-[#78716C] mt-1.5">{helperText}</p>
      ) : null}
    </fieldset>
  );
};
