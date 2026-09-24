import React, { createContext, useContext, useState, useCallback, useId } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { IconButton } from "./IconButton";

export type ToastVariant = "SUCCESS" | "ERROR" | "WARNING" | "INFO";

export interface ToastItem {
  id: string;
  title?: string;
  message: React.ReactNode;
  variant: ToastVariant;
  duration?: number;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

/**
 * Toast Component hiển thị thông điệp thông báo đơn lẻ (§18 - 03_Component_Library)
 * Hỗ trợ 4 variants chuẩn: SUCCESS, ERROR, WARNING, INFO
 */
export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, title, message, variant } = toast;

  const variantConfig = {
    SUCCESS: {
      Icon: CheckCircle2,
      iconColor: "text-[#168154]",
      bgColor: "bg-white",
      borderColor: "border-[#D1FAE5]",
      accentBar: "bg-[#168154]",
    },
    ERROR: {
      Icon: AlertCircle,
      iconColor: "text-[#C73A3A]",
      bgColor: "bg-white",
      borderColor: "border-[#FEE2E2]",
      accentBar: "bg-[#C73A3A]",
    },
    WARNING: {
      Icon: AlertTriangle,
      iconColor: "text-[#B86F08]",
      bgColor: "bg-white",
      borderColor: "border-[#FEF0C7]",
      accentBar: "bg-[#B86F08]",
    },
    INFO: {
      Icon: Info,
      iconColor: "text-[#2563EB]",
      bgColor: "bg-white",
      borderColor: "border-[#DBEAFE]",
      accentBar: "bg-[#2563EB]",
    },
  }[variant];

  const IconComponent = variantConfig.Icon;

  return (
    <div
      role={variant === "ERROR" ? "alert" : "status"}
      aria-live="polite"
      className={`
        relative flex items-start gap-3 p-4 rounded-[12px] shadow-lg border ${variantConfig.borderColor}
        ${variantConfig.bgColor} min-w-[300px] max-w-[420px] overflow-hidden select-none
        animate-in slide-in-from-top-2 sm:slide-in-from-bottom-2 fade-in duration-200
      `}
    >
      {/* Vạch màu chỉ thị trạng thái */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${variantConfig.accentBar}`}
        aria-hidden="true"
      />

      {/* Biểu tượng trạng thái */}
      <div className={`mt-0.5 shrink-0 ${variantConfig.iconColor}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Nội dung thông điệp */}
      <div className="flex-1 min-w-0 pr-1">
        {title && (
          <h4 className="text-[14px] font-bold text-[#1C1917] tracking-tight leading-snug">
            {title}
          </h4>
        )}
        <div className="text-[13px] text-[#57534E] leading-relaxed mt-0.5">
          {message}
        </div>
      </div>

      {/* Nút đóng */}
      <IconButton
        aria-label="Đóng thông báo"
        variant="ghost"
        size="sm"
        onClick={() => onDismiss(id)}
        className="text-[#78716C] hover:text-[#1C1917] -mr-1 -mt-1"
      >
        <X className="w-4 h-4" />
      </IconButton>
    </div>
  );
};

// ============================================================================
// TOAST CONTEXT & PROVIDER SYSTEM
// ============================================================================

export interface ToastOptions {
  title?: string;
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: React.ReactNode, variant?: ToastVariant, options?: ToastOptions) => string;
  success: (message: React.ReactNode, options?: ToastOptions) => string;
  error: (message: React.ReactNode, options?: ToastOptions) => string;
  warning: (message: React.ReactNode, options?: ToastOptions) => string;
  info: (message: React.ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const baseId = useId();

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: React.ReactNode, variant: ToastVariant = "INFO", options?: ToastOptions) => {
      const id = `${baseId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const duration = options?.duration ?? 4000;

      const newToast: ToastItem = {
        id,
        title: options?.title,
        message,
        variant,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [baseId, dismiss]
  );

  const success = useCallback(
    (message: React.ReactNode, options?: ToastOptions) => showToast(message, "SUCCESS", options),
    [showToast]
  );

  const error = useCallback(
    (message: React.ReactNode, options?: ToastOptions) => showToast(message, "ERROR", options),
    [showToast]
  );

  const warning = useCallback(
    (message: React.ReactNode, options?: ToastOptions) => showToast(message, "WARNING", options),
    [showToast]
  );

  const info = useCallback(
    (message: React.ReactNode, options?: ToastOptions) => showToast(message, "INFO", options),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, dismiss, clearAll }}>
      {children}
      {/* Container hiển thị Toast góc phải màn hình desktop, đáy màn hình mobile */}
      <div
        className="fixed bottom-4 right-4 z-[700] flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-32px)]"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
