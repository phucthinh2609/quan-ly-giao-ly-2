import React from "react";
import { cn } from "../../lib/cn";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
  className?: string;
}

/** Divider (03 §4.12): đường kẻ border-line, có thể kèm nhãn ở giữa. */
export const Divider: React.FC<DividerProps> = ({ orientation = "horizontal", label, className = "" }) => {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("inline-block min-h-4 w-px shrink-0 self-stretch bg-line", className)}
      />
    );
  }

  if (label) {
    return (
      <div role="separator" aria-orientation="horizontal" className={cn("my-4 flex w-full items-center gap-3", className)}>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="shrink-0 text-sm font-medium text-ink-3 select-none">{label}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>
    );
  }

  return <hr aria-orientation="horizontal" className={cn("my-3 w-full border-0 border-t border-line", className)} />;
};
