import React from "react";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  label,
  className = "",
}) => {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block w-[1px] self-stretch bg-[#E7E5E4] min-h-[16px] ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center w-full my-4 font-sans ${className}`}
      >
        <div className="flex-grow border-t border-[#E7E5E4]" />
        <span className="px-3 text-[13px] font-medium text-[#78716C] uppercase tracking-wider shrink-0 select-none">
          {label}
        </span>
        <div className="flex-grow border-t border-[#E7E5E4]" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={`w-full border-0 border-t border-[#E7E5E4] my-3 ${className}`}
    />
  );
};
