import React from "react";
import { Quote } from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar } from "../ui/Avatar";
import { IconTile } from "../ui/IconTile";

export interface TeacherCommentProps {
  comment: string;
  teacherName?: string;
  className?: string;
}

/** "GLV. Giuse Trần Văn Minh" → "Giuse Trần Văn Minh" (bỏ tiền tố chức danh cho avatar). */
function personName(name: string): string {
  return name.replace(/^GLV\.?\s*/i, "").trim() || name;
}

/**
 * TeacherComment (03 §9, 04 §11) — trích dẫn nhận xét GLV bằng font-accent nghiêng
 * + avatar và tên GLV.
 */
export const TeacherComment: React.FC<TeacherCommentProps> = ({
  comment,
  teacherName = "Giáo lý viên phụ trách",
  className,
}) => (
  <figure className={cn("rounded-card border border-line bg-surface p-5 shadow-card sm:p-6", className)}>
    <div className="flex items-center gap-3">
      <IconTile icon={<Quote />} tone="gold" size="md" />
      <h3 className="text-lg font-semibold text-ink">Nhận xét của GLV</h3>
    </div>

    <blockquote className="mt-4 font-accent text-lg leading-relaxed text-pretty text-ink italic">
      &ldquo;{comment}&rdquo;
    </blockquote>

    <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
      <Avatar name={personName(teacherName)} alt="" size="sm" />
      <span className="min-w-0 text-base font-medium text-ink-2">{teacherName}</span>
    </figcaption>
  </figure>
);
