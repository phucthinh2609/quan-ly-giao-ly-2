import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// ============================================================================
// MOTION LIBRARY (01 §11, 03 §3.2)
// Mọi animation trong app đi qua đây để tôn trọng prefers-reduced-motion.
// ============================================================================

gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface RevealOptions {
  /** Selector các phần tử con cần xuất hiện theo nhịp. Mặc định "[data-reveal]". */
  selector?: string;
  y?: number;
  stagger?: number;
  delay?: number;
  /** Chạy lại hiệu ứng khi các giá trị này đổi (VD: đổi con, đổi tab). */
  deps?: unknown[];
}

/**
 * Stagger reveal: các phần tử con có `data-reveal` trượt lên và hiện dần.
 * Lưu ý: không đặt `data-reveal` lên phần tử chứa thanh `position: fixed`
 * (transform tạm thời sẽ làm lệch vị trí thanh cố định).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: RevealOptions = {}) {
  const { selector = "[data-reveal]", y = 16, stagger = 0.045, delay = 0, deps = [] } = options;
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const targets = root.querySelectorAll<HTMLElement>(selector);
      if (targets.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          targets,
          { y, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: "power3.out",
            stagger,
            delay,
            clearProps: "transform,opacity,visibility",
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: deps }
  );

  return ref;
}

/**
 * Page enter: nội dung trang hiện dần khi đổi route.
 * Chỉ dùng opacity (không transform) để không làm lệch các thanh fixed bên trong trang.
 */
export function usePageEnter<T extends HTMLElement = HTMLDivElement>(key: string) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: "power2.out", clearProps: "opacity" }
        );
      });
      return () => mm.revert();
    },
    { dependencies: [key] }
  );

  return ref;
}

const CELEBRATE_COLORS = [
  "var(--grape)",
  "var(--sky)",
  "var(--mint)",
  "var(--sun)",
  "var(--coral)",
  "var(--rose)",
  "var(--gold)",
];

/**
 * Hiệu ứng ăn mừng: bắn các hạt màu kid palette từ tâm phần tử.
 * Dùng khi mở huy hiệu mới, hoàn thành nhiệm vụ, lưu điểm danh thành công.
 */
export function celebrate(target: HTMLElement | null, opts: { count?: number } = {}): void {
  if (!target || typeof document === "undefined" || prefersReducedMotion()) return;
  const count = opts.count ?? 14;
  const rect = target.getBoundingClientRect();

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, {
    position: "fixed",
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top + rect.height / 2}px`,
    width: "0",
    height: "0",
    pointerEvents: "none",
    zIndex: "90",
  });
  document.body.appendChild(layer);

  const tl = gsap.timeline({ onComplete: () => layer.remove() });

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    const size = 6 + Math.random() * 6;
    Object.assign(dot.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: i % 3 === 0 ? "2px" : "9999px",
      background: CELEBRATE_COLORS[i % CELEBRATE_COLORS.length],
    });
    layer.appendChild(dot);

    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 48 + Math.random() * 56;
    tl.fromTo(
      dot,
      { x: 0, y: 0, scale: 0.4, opacity: 1 },
      {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 18,
        scale: 1,
        rotation: Math.random() * 200,
        duration: 0.7,
        ease: "power3.out",
      },
      0
    ).to(dot, { opacity: 0, y: "+=26", duration: 0.35, ease: "power1.in" }, 0.5);
  }
}

/** Rung nhẹ khi chạm (chỉ trên thiết bị hỗ trợ). */
export function haptic(ms = 8): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  } catch {
    // Một số trình duyệt chặn vibrate khi chưa có tương tác — bỏ qua.
  }
}
