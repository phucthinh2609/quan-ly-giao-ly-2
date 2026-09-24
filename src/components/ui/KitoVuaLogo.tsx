import React from "react";

interface KitoVuaLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  subtitle?: string;
}

export const KitoVuaLogo: React.FC<KitoVuaLogoProps> = ({
  size = 40,
  className = "",
  showText = false,
  subtitle = "Quản lý Giáo lý",
}) => {
  const dimension = typeof size === "number" ? `${size}px` : size;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        style={{ width: dimension, height: dimension }}
        className="relative flex-shrink-0 select-none overflow-hidden rounded-full shadow-xs transition-transform duration-200 hover:scale-105"
        title="Đoàn Kitô Vua - Gx. Đức Mẹ Hằng Cứu Giúp"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full object-contain"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo Đoàn Kitô Vua - Giáo xứ Đức Mẹ Hằng Cứu Giúp"
          role="img"
        >
          <defs>
            <path id="arch-top-left-comp" d="M 46,280 A 166,166 0 0,1 210,34" fill="none" />
            <filter id="subtle-shadow-comp" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background */}
          <circle cx="200" cy="200" r="198" fill="#FFFFFF" />

          {/* Bold Red Outer Ring */}
          <circle cx="200" cy="200" r="190" fill="#FFFFFF" stroke="#E01A22" strokeWidth="14" />

          {/* Golden Yellow Halo of Our Lady */}
          <circle cx="236" cy="188" r="124" fill="#FDE047" opacity="0.9" />

          {/* Silhouette lines of Our Lady holding Infant Jesus */}
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

          {/* White Host Background for the Cross */}
          <circle cx="272" cy="226" r="68" fill="#FFFFFF" filter="url(#subtle-shadow-comp)" />

          {/* Red Eucharistic Cross (Jerusalem Cross) */}
          <g fill="#E01A22">
            <polygon points="240,128 304,128 290,226 254,226" />
            <polygon points="254,226 290,226 304,316 240,316" />
            <polygon points="176,192 272,206 272,246 176,260" />
            <polygon points="272,206 368,192 368,260 272,246" />
          </g>

          {/* Central Communion Host */}
          <circle cx="272" cy="226" r="21" fill="#FFFFFF" stroke="#FDE047" strokeWidth="1.5" />

          {/* Golden Chalice */}
          <g fill="#F59E0B">
            <path d="M 258,252 L 286,252 L 278,268 L 266,268 Z" />
            <rect x="270" y="268" width="4" height="12" />
            <polygon points="262,284 282,284 278,280 266,280" />
          </g>

          {/* Open Holy Bible Book at the bottom */}
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

          {/* Arched Text: Gx. Đức Mẹ Hằng Cứu Giúp */}
          <text
            fill="#E01A22"
            fontFamily="'Noto Serif', 'Times New Roman', Georgia, serif"
            fontWeight="700"
            fontSize="22"
            letterSpacing="1"
          >
            <textPath href="#arch-top-left-comp" startOffset="6%">
              Gx. Đức Mẹ Hằng Cứu Giúp
            </textPath>
          </text>

          {/* Bottom Text: ĐOÀN KITÔ VUA */}
          <text
            x="200"
            y="362"
            textAnchor="middle"
            fill="#E01A22"
            fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="800"
            fontSize="21"
            letterSpacing="2.5"
          >
            ĐOÀN KITÔ VUA
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <span className="font-serif font-bold text-[16px] text-[#1C1917] tracking-tight leading-tight truncate">
            Đoàn Kitô Vua
          </span>
          <span className="text-[11px] text-[#78716C] truncate font-medium">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
