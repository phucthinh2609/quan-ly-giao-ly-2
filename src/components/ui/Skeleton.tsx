import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  variant?: "rectangular" | "text" | "circular";
  className?: string;
}

/**
 * Skeleton Loading Component
 * Ưu tiên hiển thị Skeleton ở cấp trang (page-level) thay vì Spinner toàn màn hình (§18, §14 Wireframe)
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = "rectangular",
  className = "",
  style,
  ...rest
}) => {
  const variantStyles = {
    rectangular: "rounded-[10px]",
    text: "rounded-[4px] h-[16px] my-1",
    circular: "rounded-full",
  };

  const inlineStyles: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      role="status"
      aria-label="Đang tải dữ liệu…"
      className={`
        animate-pulse bg-[#E7E5E4] dark:bg-[#D6D3D1]/50
        ${variantStyles[variant]}
        ${className}
      `}
      style={inlineStyles}
      {...rest}
    >
      <span className="sr-only">Đang tải…</span>
    </div>
  );
};
