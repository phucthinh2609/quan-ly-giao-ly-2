import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Ghép className an toàn: loại bỏ giá trị rỗng và giải quyết xung đột utility Tailwind
 * (VD: cn("px-4", condition && "px-6") → "px-6").
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
