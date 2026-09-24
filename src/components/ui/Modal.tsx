import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

/**
 * ============================================================================
 * QUY TẮC BẮT BUỘC (§18, WIREFRAME B, §9 USER FLOW):
 * Modal CHỈ dùng cho Confirmation (Xác nhận hành động) và CRUD nhỏ (Tạo/Sửa nhanh).
 * TUYỆT ĐỐI KHÔNG ĐƯỢC DÙNG Modal cho việc nhập điểm từng học sinh!
 *
 * Lý do:
 * Nhập điểm cho học sinh bắt buộc phải dùng BulkScoreEntry / ScoreTable inline
 * fast-input trên toàn trang (Wireframe B) để đảm bảo tốc độ nhập liệu liên tục
 * bằng bàn phím số (Numeric Keyboard), tránh tình trạng mở/đóng popup liên tục
 * gây gián đoạn và mệt mỏi cho Giáo Lý Viên.
 * ============================================================================
 */

export interface ModalProps {
  /**
   * Trạng thái mở/đóng modal
   */
  isOpen: boolean;
  /**
   * Callback khi người dùng yêu cầu đóng modal (bấm X, backdrop hoặc Escape)
   */
  onClose: () => void;
  /**
   * Tiêu đề Modal
   */
  title: React.ReactNode;
  /**
   * Mô tả hoặc chú thích phụ bên dưới tiêu đề
   */
  description?: React.ReactNode;
  /**
   * Nội dung chính của Modal (Confirmation hoặc form CRUD nhỏ)
   */
  children: React.ReactNode;
  /**
   * Phần nút hành động phía dưới (Footer Buttons)
   */
  footer?: React.ReactNode;
  /**
   * Kích thước modal:
   * - sm: 400px (Phù hợp Confirmation/Xóa)
   * - md: 540px (Phù hợp form CRUD nhỏ)
   * - lg: 680px (Phù hợp chi tiết ngắn)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Vô hiệu hóa nút đóng khi đang xử lý tác vụ bất đồng bộ (loading)
   */
  loading?: boolean;
  /**
   * ARIA role: 'dialog' cho form thông thường hoặc 'alertdialog' cho hộp thoại xác nhận quan trọng
   */
  role?: "dialog" | "alertdialog";
  className?: string;
}

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
  const modalRef = useRef<HTMLDivElement>(null);

  // Khóa cuộn trang nền và lắng nghe phím ESC
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !loading) {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-[420px]",
    md: "max-w-[540px]",
    lg: "max-w-[680px]",
  }[size];

  return (
    <div
      role={role}
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop overlay mờ nền */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 animate-in fade-in"
        onClick={() => {
          if (!loading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Window */}
      <div
        ref={modalRef}
        className={`
          relative z-10 w-full bg-white rounded-[16px] sm:rounded-[18px] shadow-xl border border-[#E7E5E4]
          flex flex-col my-auto animate-in zoom-in-95 fade-in duration-200 ease-out
          ${sizeClasses}
          ${className}
        `}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-[#E7E5E4]">
          <div className="space-y-1 pr-4">
            <h2
              id="modal-title"
              className="text-[18px] sm:text-[20px] font-bold text-[#1C1917] tracking-tight font-serif"
            >
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="text-[13px] sm:text-[14px] text-[#78716C] leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {!loading && (
            <IconButton
              aria-label="Đóng hộp thoại"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#78716C] hover:text-[#1C1917] -mt-1 -mr-1"
            >
              <X className="w-5 h-5" />
            </IconButton>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh] text-[14px] sm:text-[15px] text-[#292524]">
          {children}
        </div>

        {/* Modal Footer Actions */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 p-4 sm:p-5 pt-3 border-t border-[#E7E5E4] bg-[#FAFAF9] rounded-b-[16px] sm:rounded-b-[18px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
