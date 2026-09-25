import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";
import { cn } from "../../lib/cn";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/motion";

// ============================================================================
// Overlay behavior dùng chung cho BottomSheet / Modal / Select (mobile):
// khóa cuộn nền, đưa focus vào hộp thoại, giữ focus bên trong (Tab),
// Esc đóng lớp trên cùng, trả focus về phần tử cũ khi đóng.
// ============================================================================

const MOTION_QUERIES = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** Khoảng kéo xuống (px) để đóng sheet. */
const DRAG_CLOSE_THRESHOLD = 80;

let scrollLockCount = 0;
let savedBodyStyle: { overflow: string; paddingRight: string } | null = null;

function lockBodyScroll() {
  if (typeof document === "undefined") return;
  if (scrollLockCount === 0) {
    const body = document.body;
    savedBodyStyle = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
  }
  scrollLockCount += 1;
}

function unlockBodyScroll() {
  if (typeof document === "undefined" || scrollLockCount === 0) return;
  scrollLockCount -= 1;
  if (scrollLockCount === 0 && savedBodyStyle) {
    document.body.style.overflow = savedBodyStyle.overflow;
    document.body.style.paddingRight = savedBodyStyle.paddingRight;
    savedBodyStyle = null;
  }
}

export interface OverlayBehaviorOptions {
  isOpen: boolean;
  onClose: () => void;
  /** Phần tử gốc của lớp phủ (mang thuộc tính data-overlay-root khi mở). */
  rootRef: React.RefObject<HTMLElement>;
  /** Khung hộp thoại (nhận focus ban đầu, giữ focus bên trong). */
  panelRef: React.RefObject<HTMLElement>;
  closeOnEscape?: boolean;
}

/**
 * Hành vi hộp thoại dùng chung. Focus ban đầu: phần tử có `data-autofocus`, nếu không có thì chính khung hộp thoại.
 */
export function useOverlayBehavior({
  isOpen,
  onClose,
  rootRef,
  panelRef,
  closeOnEscape = true,
}: OverlayBehaviorOptions): void {
  const onCloseRef = useRef(onClose);
  const escapeRef = useRef(closeOnEscape);

  useEffect(() => {
    onCloseRef.current = onClose;
    escapeRef.current = closeOnEscape;
  });

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockBodyScroll();

    const isTopMost = () => {
      const root = rootRef.current;
      if (!root) return false;
      const layers = document.querySelectorAll("[data-overlay-root]");
      return layers[layers.length - 1] === root;
    };

    // DOM của hộp thoại đã có ở thời điểm effect chạy (mounted được bật ngay trong render).
    const panel = panelRef.current;
    if (panel && !panel.contains(document.activeElement)) {
      const preferred = panel.querySelector<HTMLElement>("[data-autofocus]");
      (preferred ?? panel).focus({ preventScroll: true });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !isTopMost()) return;

      if (event.key === "Escape") {
        if (!escapeRef.current) return;
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
          (el) => el.getClientRects().length > 0
        );
        if (items.length === 0) {
          event.preventDefault();
          panel.focus();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        const outside = !panel.contains(active) || active === panel;
        if (event.shiftKey && (active === first || outside)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || (outside && active !== panel))) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll();
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen, rootRef, panelRef]);
}

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Class giới hạn chiều cao, VD "max-h-[85dvh]" */
  maxHeight?: string;
  className?: string;
  id?: string;
}

/**
 * BottomSheet (03 §5): bo góc trên lớn, tay nắm, kéo xuống > 80px để đóng,
 * trượt lên bằng GSAP (tắt khi reduced-motion), chừa vùng an toàn phía dưới.
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxHeight = "max-h-[85dvh]",
  className = "",
  id,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; dy: number; pointerId: number } | null>(null);
  // Vị trí kéo gần nhất: hiệu ứng đóng tiếp tục từ đây thay vì nhảy về đỉnh
  const dragOffsetRef = useRef(0);
  const titleId = useId();
  const descriptionId = useId();

  // Giữ sheet trong DOM đến khi hiệu ứng đóng chạy xong.
  const [mounted, setMounted] = useState(isOpen);
  if (isOpen && !mounted) setMounted(true);

  useOverlayBehavior({ isOpen, onClose, rootRef, panelRef });

  useGSAP(
    () => {
      if (!mounted) return;
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!panel || !backdrop) return;
      gsap.killTweensOf([panel, backdrop]);

      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (ctx) => {
        if (ctx.conditions?.reduce) {
          dragOffsetRef.current = 0;
          gsap.set(panel, { y: 0, yPercent: 0 });
          if (!isOpen) setMounted(false);
          return;
        }
        if (isOpen) {
          dragOffsetRef.current = 0;
          gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
          gsap.fromTo(
            panel,
            { y: 0, yPercent: 100 },
            { yPercent: 0, duration: 0.42, ease: "power3.out", clearProps: "transform" }
          );
        } else {
          gsap.to(backdrop, { opacity: 0, duration: 0.2, ease: "power2.in" });
          gsap.fromTo(
            panel,
            { y: dragOffsetRef.current, yPercent: 0 },
            { yPercent: 100, duration: 0.26, ease: "power2.in", onComplete: () => setMounted(false) }
          );
        }
      });
      return () => mm.revert();
    },
    { dependencies: [isOpen, mounted], revertOnUpdate: true }
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button, a, input, select, textarea")) return;
    dragRef.current = { startY: event.clientY, dy: 0, pointerId: event.pointerId };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Một số trình duyệt từ chối capture (pointer đã kết thúc) — vẫn kéo được trong vùng tay nắm.
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag.dy = Math.max(0, event.clientY - drag.startY);
    dragOffsetRef.current = drag.dy;
    if (panelRef.current) gsap.set(panelRef.current, { y: drag.dy });
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const panel = panelRef.current;
    if (!panel) return;
    if (drag.dy > DRAG_CLOSE_THRESHOLD) {
      onClose();
      return;
    }
    dragOffsetRef.current = 0;
    if (prefersReducedMotion()) gsap.set(panel, { y: 0 });
    else gsap.to(panel, { y: 0, duration: 0.22, ease: "power3.out" });
  };

  if (!mounted || typeof document === "undefined") return null;

  const hasHeader = Boolean(title || description);

  return createPortal(
    <div
      ref={rootRef}
      id={id}
      data-overlay-root={isOpen ? "" : undefined}
      className={cn("fixed inset-0 z-(--z-modal) flex flex-col justify-end", !isOpen && "pointer-events-none")}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-night/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex w-full flex-col bg-surface text-ink shadow-float outline-none",
          "rounded-t-card-lg border-t border-line",
          "md:mx-auto md:mb-4 md:max-w-xl md:rounded-card-lg md:border",
          maxHeight,
          className
        )}
      >
        {/* Vùng kéo: tay nắm + tiêu đề */}
        <div
          className="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <div className="flex justify-center pt-3 pb-2">
            <span className="h-1.5 w-10 rounded-full bg-line-strong" aria-hidden="true" />
          </div>

          {hasHeader && (
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 pb-3">
              <div className="min-w-0 pt-1">
                {title && (
                  <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId} className="mt-0.5 text-sm text-ink-2">
                    {description}
                  </p>
                )}
              </div>

              <IconButton aria-label="Đóng" variant="ghost" size="md" onClick={onClose} className="-mr-2 shrink-0">
                <X />
              </IconButton>
            </div>
          )}
        </div>

        {/* Nội dung cuộn */}
        <div className={cn("flex-1 overflow-y-auto overscroll-contain px-5 pt-4", footer ? "pb-4" : "pb-safe")}>
          {children}
        </div>

        {/* Footer cố định */}
        {footer && <div className="shrink-0 border-t border-line bg-surface px-5 pt-3 pb-safe">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
