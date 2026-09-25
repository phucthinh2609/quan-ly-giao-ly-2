import React, { useId } from "react";
import { cn } from "../../lib/cn";

export interface KitoVuaLogoProps {
  /** Số → quy đổi sang rem (16 = 1rem) để co giãn theo cỡ chữ; chuỗi dùng nguyên giá trị CSS */
  size?: number | string;
  className?: string;
  showText?: boolean;
  subtitle?: string;
}

/**
 * Huy hiệu Đoàn Kitô Vua. Màu trong SVG là màu nhận diện thương hiệu (ngoại lệ duy nhất được phép dùng hex),
 * đặt trên đĩa trắng riêng nên đọc tốt ở cả giao diện Sáng và Tối. Phần chữ dùng token.
 */
export const KitoVuaLogo: React.FC<KitoVuaLogoProps> = ({
  size = 40,
  className = "",
  showText = false,
  subtitle = "Quản lý Giáo lý",
}) => {
  const dimension = typeof size === "number" ? `${size / 16}rem` : size;
  // id duy nhất cho mỗi instance (tránh trùng id khi logo xuất hiện nhiều nơi)
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const arcId = `kv-arc-${uid}`;
  const shadowId = `kv-shadow-${uid}`;

  return (
    <div
      className={cn(
        "inline-flex items-center transition-[gap] duration-300 ease-out-soft",
        showText ? "gap-3" : "gap-0",
        className
      )}
    >
      <div
        style={{ width: dimension, height: dimension }}
        className="relative shrink-0 overflow-hidden rounded-full shadow-xs ring-1 ring-line select-none"
        title="Đoàn Kitô Vua - Gx. Đức Mẹ Hằng Cứu Giúp"
      >
        <svg
          viewBox="0 0 400 400"
          className="size-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo Đoàn Kitô Vua - Giáo xứ Đức Mẹ Hằng Cứu Giúp"
          role="img"
        >
          <defs>
            <path id={arcId} d="M 46,280 A 166,166 0 0,1 210,34" fill="none" />
            <filter id={shadowId} x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Nền đĩa trắng (giữ cố định ở cả Light/Dark) */}
          <circle cx="200" cy="200" r="198" fill="#FFFFFF" />

          {/* Vòng đỏ ngoài */}
          <circle cx="200" cy="200" r="190" fill="#FFFFFF" stroke="#E01A22" strokeWidth="14" />

          {/* Vầng hào quang vàng */}
          <circle cx="236" cy="188" r="124" fill="#FDE047" opacity="0.9" />

          {/* Đường nét Đức Mẹ bồng Chúa Hài Đồng */}
          <path
            d="M 235,115 C 265,75 325,105 320,150 C 315,160 305,170 295,165 C 285,150 270,135 245,130 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          <path
            d="M 265,115 C 290,95 325,120 310,145"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 230,135 C 250,110 270,110 280,125"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Nền bánh thánh sau Thánh giá */}
          <circle cx="272" cy="226" r="68" fill="#FFFFFF" filter={`url(#${shadowId})`} />

          {/* Thánh giá đỏ */}
          <g fill="#E01A22">
            <polygon points="240,128 304,128 290,226 254,226" />
            <polygon points="254,226 290,226 304,316 240,316" />
            <polygon points="176,192 272,206 272,246 176,260" />
            <polygon points="272,206 368,192 368,260 272,246" />
          </g>

          {/* Bánh thánh */}
          <circle cx="272" cy="226" r="21" fill="#FFFFFF" stroke="#FDE047" strokeWidth="1.5" />

          {/* Chén thánh */}
          <g fill="#F59E0B">
            <path d="M 258,252 L 286,252 L 278,268 L 266,268 Z" />
            <rect x="270" y="268" width="4" height="12" />
            <polygon points="262,284 282,284 278,280 266,280" />
          </g>

          {/* Sách Thánh mở */}
          <g>
            <path
              d="M 60,332 Q 135,294 200,332 Q 265,294 340,332"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 65,327 Q 135,289 200,327 Q 265,289 335,327"
              fill="none"
              stroke="#FEF08A"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* Chữ vòng cung: Gx. Đức Mẹ Hằng Cứu Giúp */}
          <text
            fill="#E01A22"
            fontFamily="'Geist', ui-sans-serif, system-ui, 'Segoe UI', Roboto, sans-serif"
            fontWeight="700"
            fontSize="22"
            letterSpacing="1"
          >
            <textPath href={`#${arcId}`} startOffset="6%">
              Gx. Đức Mẹ Hằng Cứu Giúp
            </textPath>
          </text>

          {/* Chữ dưới: ĐOÀN KITÔ VUA */}
          <text
            x="200"
            y="362"
            textAnchor="middle"
            fill="#E01A22"
            fontFamily="'Geist', ui-sans-serif, system-ui, 'Segoe UI', Roboto, sans-serif"
            fontWeight="800"
            fontSize="21"
            letterSpacing="2.5"
          >
            ĐOÀN KITÔ VUA
          </text>
        </svg>
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-col overflow-hidden transition-[max-width,opacity] duration-300 ease-out-soft",
          showText ? "max-w-52 opacity-100" : "pointer-events-none max-w-0 opacity-0"
        )}
        aria-hidden={!showText || undefined}
      >
        <span className="truncate text-base leading-tight font-bold tracking-tight whitespace-nowrap text-ink">
          Đoàn Kitô Vua
        </span>
        <span className="truncate text-xs font-medium whitespace-nowrap text-ink-3">{subtitle}</span>
      </div>
    </div>
  );
};
