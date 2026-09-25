import type { MouseEvent } from "react";
import { prefersReducedMotion } from "../../../lib/motion";

/**
 * Cuộn mượt tới một section theo id, rồi chuyển focus vào section đó
 * (section cần tabIndex={-1}) để người dùng bàn phím/đọc màn hình tiếp tục từ đúng chỗ.
 * Không đổi URL để không ảnh hưởng router dựa trên History API.
 */
export function scrollToSection(id: string): void {
  if (typeof document === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
}

/** Handler cho thẻ <a href="#id">: giữ hành vi mở tab mới (Ctrl/Cmd + click). */
export function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, id: string): void {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  scrollToSection(id);
}
