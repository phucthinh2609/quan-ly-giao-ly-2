import React, { createContext, useContext, useState, useCallback, useId, useRef, useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { gsap } from "../../lib/motion";
import { cn } from "../../lib/cn";

export type ToastVariant = "SUCCESS" | "ERROR" | "WARNING" | "INFO";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  title?: string;
  message: React.ReactNode;
  variant: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const variantConfig: Record<ToastVariant, { Icon: typeof CheckCircle2; iconClass: string }> = {
  SUCCESS: { Icon: CheckCircle2, iconClass: "text-mint" },
  ERROR: { Icon: AlertCircle, iconClass: "text-coral" },
  WARNING: { Icon: AlertTriangle, iconClass: "text-sun" },
  INFO: { Icon: Info, iconClass: "text-sky" },
};

/**
 * Toast v2 (03 §5): khối night nổi, icon tone, hỗ trợ hành động (VD "Hoàn tác").
 */
export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, title, message, variant, action } = toast;
  const { Icon, iconClass } = variantConfig[variant];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(el, { y: 16, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: "back.out(1.4)" });
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      role={variant === "ERROR" ? "alert" : "status"}
      className="flex w-full items-center gap-3 rounded-card bg-night py-3 pr-2 pl-4 text-on-night shadow-float sm:w-[26rem]"
    >
      <Icon className={cn("size-5 shrink-0", iconClass)} aria-hidden="true" />

      <div className="min-w-0 flex-1 py-0.5">
        {title && <p className="text-sm font-semibold leading-snug">{title}</p>}
        <div className={cn("text-sm leading-snug", title ? "text-on-night/75" : "font-medium")}>{message}</div>
      </div>

      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            onDismiss(id);
          }}
          className="h-9 shrink-0 rounded-full bg-on-night/12 px-3.5 text-sm font-semibold text-on-night transition-colors hover:bg-on-night/20 active:scale-95"
        >
          {action.label}
        </button>
      )}

      <button
        type="button"
        aria-label="Đóng thông báo"
        onClick={() => onDismiss(id)}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-on-night/70 transition-colors hover:bg-on-night/10 hover:text-on-night"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
};

// ============================================================================
// TOAST CONTEXT & PROVIDER SYSTEM
// ============================================================================

export interface ToastOptions {
  title?: string;
  duration?: number;
  /** Hành động kèm theo, VD { label: "Hoàn tác", onClick: undo } */
  action?: ToastAction;
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

const MAX_VISIBLE = 3;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const baseId = useId();
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: React.ReactNode, variant: ToastVariant = "INFO", options?: ToastOptions) => {
      const id = `${baseId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      // Toast có hành động (Hoàn tác) hiển thị lâu hơn để người dùng kịp bấm
      const duration = options?.duration ?? (options?.action ? 6000 : 4000);

      const newToast: ToastItem = { id, title: options?.title, message, variant, duration, action: options?.action };
      setToasts((prev) => [...prev, newToast].slice(-MAX_VISIBLE));

      if (duration > 0) {
        timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
      }
      return id;
    },
    [baseId, dismiss]
  );

  const success = useCallback((m: React.ReactNode, o?: ToastOptions) => showToast(m, "SUCCESS", o), [showToast]);
  const error = useCallback((m: React.ReactNode, o?: ToastOptions) => showToast(m, "ERROR", o), [showToast]);
  const warning = useCallback((m: React.ReactNode, o?: ToastOptions) => showToast(m, "WARNING", o), [showToast]);
  const info = useCallback((m: React.ReactNode, o?: ToastOptions) => showToast(m, "INFO", o), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, dismiss, clearAll }}>
      {children}
      {/* Mobile: phía trên floating bottom nav; Desktop: góc dưới phải */}
      <div
        className="pointer-events-none fixed inset-x-3 bottom-[calc(var(--toast-bottom,6.5rem)_+_env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 lg:inset-x-auto lg:right-6 lg:bottom-[calc(var(--toast-bottom-desktop,1.5rem))] lg:items-end"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full sm:w-auto">
            <Toast toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Đẩy vùng toast lên trên khi trang có thanh hành động dính đáy (SaveBar),
 * để toast "Hoàn tác" không che nút Lưu. Tự khôi phục khi unmount.
 * @param mobile khoảng cách đáy trên mobile (mặc định 6.5rem = trên bottom nav)
 * @param desktop khoảng cách đáy trên desktop (mặc định 1.5rem)
 */
export function useToastOffset(mobile: string, desktop = "1.5rem") {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--toast-bottom", mobile);
    root.style.setProperty("--toast-bottom-desktop", desktop);
    return () => {
      root.style.removeProperty("--toast-bottom");
      root.style.removeProperty("--toast-bottom-desktop");
    };
  }, [mobile, desktop]);
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
