import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
  className?: string;
  id?: string;
}

/**
 * BottomSheet Component (§18, §20)
 * Dành cho Mobile Filter/Select/Action/short detail.
 * Hỗ trợ kéo vuốt, đóng bằng Escape, backdrop lock, và tối ưu hóa touch-target ≥ 48px trên thiết bị di động.
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxHeight = "max-h-[85vh]",
  className = "",
  id,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Khóa cuộn trang nền khi mở BottomSheet
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "bottom-sheet-title" : undefined}
      className="fixed inset-0 z-[500] flex flex-col justify-end"
    >
      {/* Backdrop mờ nền */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container trượt từ dưới lên */}
      <div
        ref={sheetRef}
        className={`
          relative z-10 w-full bg-white rounded-t-[20px] shadow-xl border-t border-[#E7E5E4]
          flex flex-col ${maxHeight} animate-in slide-in-from-bottom duration-250 ease-out
          ${className}
        `}
      >
        {/* Drag Handle Bar */}
        <div className="w-full pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-[#D6D3D1]" />
        </div>

        {/* Sheet Header */}
        {(title || description) && (
          <div className="flex items-start justify-between px-5 py-3 border-b border-[#E7E5E4] shrink-0">
            <div>
              {title && (
                <h2
                  id="bottom-sheet-title"
                  className="text-[18px] sm:text-[19px] font-bold text-[#1C1917] tracking-tight font-serif"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[13px] text-[#78716C] mt-0.5">{description}</p>
              )}
            </div>

            <IconButton
              aria-label="Đóng bảng chọn"
              variant="ghost"
              size="md"
              onClick={onClose}
              className="text-[#78716C] hover:text-[#1C1917] -mr-1"
            >
              <X className="w-5 h-5" />
            </IconButton>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1 overscroll-contain text-[#292524]">
          {children}
        </div>

        {/* Sticky Footer */}
        {footer && (
          <div className="px-5 py-3.5 border-t border-[#E7E5E4] bg-[#FAFAF9] rounded-b-none shrink-0 safe-bottom">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
