import React from "react";
import { ShieldAlert, Home, Lock } from "lucide-react";
import { UserRole } from "../../types";
import { Button } from "../ui";
import { ROLE_DEFAULT_PATHS } from "../../context/AuthContext";

export interface Forbidden403Props {
  role?: UserRole;
  message?: string;
  onGoHome?: (homePath: string) => void;
  className?: string;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({
  role = "STUDENT",
  message = "Bạn không có quyền truy cập trang này.",
  onGoHome,
  className = "",
}) => {
  const homePath = ROLE_DEFAULT_PATHS[role] || "/dashboard";

  const handleReturnHome = () => {
    if (onGoHome) {
      onGoHome(homePath);
    } else {
      window.location.href = homePath;
    }
  };

  return (
    <div
      className={`min-h-[420px] flex items-center justify-center p-6 bg-white rounded-[16px] border border-[#E7E5E4] shadow-xs ${className}`}
    >
      <div className="max-w-md w-full text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Shield Alert Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#FEF2F2] border border-[#FECDD3] flex items-center justify-center text-[#C73A3A] shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Heading & Code */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F5F4] text-[#78716C] text-[12px] font-semibold">
            <Lock className="w-3.5 h-3.5 text-[#A8A29E]" />
            Mã lỗi 403 · Forbidden
          </div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1C1917] font-serif">
            Truy cập bị từ chối
          </h2>
          <p className="text-[15px] text-[#57534E] leading-relaxed">
            {message}
          </p>
          <p className="text-[12px] text-[#A8A29E]">
            Vai trò hiện tại của bạn ({role}) không có quyền thực hiện thao tác hoặc xem tài nguyên này.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Home className="w-4 h-4" />}
            onClick={handleReturnHome}
            className="w-full sm:w-auto shadow-xs"
          >
            Quay về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};
