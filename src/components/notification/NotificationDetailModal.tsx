import React from "react";
import { X, Clock, ExternalLink } from "lucide-react";
import { NotificationData } from "../../types";

export interface NotificationDetailModalProps {
  notification: NotificationData | null;
  isOpen: boolean;
  onClose: () => void;
  onActionClick?: (path?: string) => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  isOpen,
  onClose,
  onActionClick,
}) => {
  if (!isOpen || !notification) return null;

  const {
    title,
    type,
    content,
    formattedDate,
    timestamp,
    studentName,
    actionLabel,
    actionPath,
  } = notification;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
        className="relative w-full max-w-lg bg-white rounded-[20px] shadow-2xl border border-[#E7E5E4] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with red/theme banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FFF1F2] to-white border-b border-[#FECDD3]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase bg-[#B4232C] text-white">
                {type}
              </span>
              {studentName && (
                <span className="text-[13px] font-medium text-[#57534E] bg-white/80 border border-[#E7E5E4] px-2.5 py-0.5 rounded-full">
                  👦 {studentName}
                </span>
              )}
            </div>

            {/* Close Button - min touch target >= 44px */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng thông báo"
              className="p-2 -mr-1 -mt-1 text-[#78716C] hover:text-[#1C1917] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3
            id="notification-modal-title"
            className="text-[20px] sm:text-[22px] font-bold text-[#1C1917] font-serif mt-3 leading-snug"
          >
            {title}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-[13px] text-[#78716C]">
            <Clock className="w-4 h-4 text-[#A8A29E]" />
            <span>{formattedDate || timestamp}</span>
          </div>
        </div>

        {/* Body Content - Parent body font >= 18px */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto text-[16px] sm:text-[18px] text-[#292524] leading-relaxed">
          <p className="whitespace-pre-line">{content}</p>
        </div>

        {/* Footer Actions (RULE-010: touch target >= 52-56px, RULE-012: text + icon) */}
        <div className="p-4 sm:p-5 bg-[#FAFAF9] border-t border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[52px] px-6 py-2.5 rounded-[10px] text-[16px] font-semibold text-[#57534E] hover:bg-[#E7E5E4]/60 border border-[#D6D3D1] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            Đóng
          </button>

          {actionLabel && (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onActionClick) {
                  onActionClick(actionPath);
                }
              }}
              className="w-full sm:w-auto min-h-[52px] px-6 py-2.5 rounded-[10px] text-[16px] font-bold text-white bg-[#B4232C] hover:bg-[#9B1C24] shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{actionLabel}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
