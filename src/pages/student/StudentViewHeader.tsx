import React from "react";
import { cn } from "../../lib/cn";
import { IconTile } from "../../components/ui/IconTile";
import { Tone } from "../../components/ui/tone";

export interface StudentViewHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
  /** Nội dung bên phải (số đếm, nút) */
  aside?: React.ReactNode;
  className?: string;
}

/** Tiêu đề trong nội dung của mỗi màn hình học sinh (header app ẩn tiêu đề cho tới khi cuộn). */
export const StudentViewHeader: React.FC<StudentViewHeaderProps> = ({
  title,
  subtitle,
  icon,
  tone = "grape",
  aside,
  className,
}) => (
  <header data-reveal className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
    <div className="flex min-w-0 items-center gap-4">
      {icon && <IconTile icon={icon} tone={tone} size="lg" />}
      <div className="min-w-0">
        <h1 className="text-2xl leading-tight font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-base text-ink-2">{subtitle}</p>}
      </div>
    </div>
    {aside}
  </header>
);
