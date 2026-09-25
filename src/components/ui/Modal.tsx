import React, { useCallback, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";
import { useOverlayBehavior } from "./BottomSheet";
import { cn } from "../../lib/cn";
import { gsap, useGSAP } from "../../lib/motion";

/**
 * Quy tắc sử dụng:
 * Modal chỉ dùng cho xác nhận hành động không đảo ngược được và CRUD nhỏ (tạo/sửa nhanh).
 * Không dùng Modal để nhập điểm từng học sinh — nhập điểm luôn inline trên bảng/thẻ
 * (BulkScoreEntry / ScoreTable) để GLV nhập liên tục bằng bàn phím số.
 *
 * Dưới breakpoint sm, Modal hiển thị như bottom sheet (neo đáy, full width, bo góc trên).
 */

export interface ModalProps {
  /** Trạng thái mở/đóng modal */
  isOpen: boolean;
  /** Gọi khi người dùng yêu cầu đóng (nút X, backdrop hoặc Escape) */
  onClose: () => void;
  /** Tiêu đề Modal */
  title: React.ReactNode;
  /** Mô tả phụ bên dưới tiêu đề */
  description?: React.ReactNode;
  /** Nội dung chính (xác nhận hoặc form CRUD nhỏ) */
  children: React.ReactNode;
  /** Các nút hành động phía dưới */
  footer?: React.ReactNode;
  /**
   * Độ rộng tối đa (từ sm trở lên):
   * - sm: 26.25rem (xác nhận/xóa)
   * - md: 33.75rem (form CRUD nhỏ)
   * - lg: 42.5rem (chi tiết ngắn)
   */
  size?: "sm" | "md" | "lg";
  /** Đang xử lý: ẩn nút đóng, chặn đóng bằng backdrop/Escape */
  loading?: boolean;
  /** 'dialog' cho form thông thường, 'alertdialog' cho hộp thoại xác nhận quan trọng */
  role?: "dialog" | "alertdialog";
  className?: string;
}

const MOTION_QUERIES = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  mobile: "(max-width: 639.98px)",
};

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "sm:max-w-[26.25rem]",
  md: "sm:max-w-[33.75rem]",
  lg: "sm:max-w-[42.5rem]",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  loading = false,
  role = "dialog",
  className = "",
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Giữ modal trong DOM đến khi hiệu ứng đóng chạy xong.
  const [mounted, setMounted] = useState(isOpen);
  if (isOpen && !mounted) setMounted(true);

  const handleClose = useCallback(() => {
    if (!loading) onClose();
  }, [loading, onClose]);

  useOverlayBehavior({ isOpen, onClose: handleClose, rootRef, panelRef, closeOnEscape: !loading });

  useGSAP(
    () => {
      if (!mounted) return;
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!panel || !backdrop) return;
      gsap.killTweensOf([panel, backdrop]);

      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (ctx) => {
        const reduce = Boolean(ctx.conditions?.reduce);
        const mobile = Boolean(ctx.conditions?.mobile);
        if (reduce) {
          if (!isOpen) setMounted(false);
          return;
        }
        if (isOpen) {
          gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
          if (mobile) {
            gsap.fromTo(
              panel,
              { yPercent: 100 },
              { yPercent: 0, duration: 0.42, ease: "power3.out", clearProps: "transform" }
            );
          } else {
            gsap.fromTo(
              panel,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1, duration: 0.24, ease: "power3.out", clearProps: "transform,opacity" }
            );
          }
        } else {
          const done = () => setMounted(false);
          gsap.to(backdrop, { opacity: 0, duration: 0.18, ease: "power2.in" });
          if (mobile) {
            gsap.to(panel, { yPercent: 100, duration: 0.26, ease: "power2.in", onComplete: done });
          } else {
            gsap.to(panel, { opacity: 0, scale: 0.97, duration: 0.16, ease: "power2.in", onComplete: done });
          }
        }
      });
      return () => mm.revert();
    },
    { dependencies: [isOpen, mounted], revertOnUpdate: true }
  );

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={rootRef}
      data-overlay-root={isOpen ? "" : undefined}
      className={cn(
        "fixed inset-0 z-(--z-modal) flex items-end justify-center sm:items-center sm:p-6",
        !isOpen && "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-night/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Hộp thoại */}
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={loading || undefined}
        tabIndex={-1}
        className={cn(
          "relative flex w-full flex-col overflow-hidden bg-surface text-ink shadow-float outline-none",
          "max-h-[92dvh] rounded-t-card-lg border-t border-line",
          "sm:max-h-[85dvh] sm:rounded-card-lg sm:border",
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 pb-3 sm:px-6 sm:pt-6">
          <div className="min-w-0 space-y-1">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm leading-relaxed text-ink-2">
                {description}
              </p>
            )}
          </div>

          {!loading && (
            <IconButton
              aria-label="Đóng hộp thoại"
              variant="ghost"
              size="md"
              onClick={handleClose}
              className="-mt-2 -mr-2 shrink-0"
            >
              <X />
            </IconButton>
          )}
        </div>

        {/* Nội dung */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3 text-base text-ink sm:px-6">
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          <div
            className={cn(
              "flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-line bg-surface-2/50",
              "px-5 pt-3 pb-safe sm:px-6",
              "max-sm:[&>button]:flex-1"
            )}
          >
            {footer}
          </div>
        ) : (
          <div className="shrink-0 pb-safe" aria-hidden="true" />
        )}
      </div>
    </div>,
    document.body
  );
};
