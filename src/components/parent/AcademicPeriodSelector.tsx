import React, { useState } from "react";
import { ChevronDown, Calendar, Check } from "lucide-react";
import { AcademicPeriod, AcademicPeriodOption } from "../../types";
import { MOCK_ACADEMIC_PERIODS } from "../../services/parentMockData";

export interface AcademicPeriodSelectorProps {
  periods?: AcademicPeriodOption[];
  selectedPeriod: AcademicPeriod;
  onChange: (period: AcademicPeriod) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

/**
 * AcademicPeriodSelector (Wireframe C §8, §27)
 *
 * Wireframe C:
 * Kỳ học
 * ┌─────────────────────────────────┐
 * │ Học kỳ I                    ▼  │
 * └─────────────────────────────────┘
 *
 * RULE-010: font-size ≥18px (body-lg), touch target ≥52–56px.
 */
export const AcademicPeriodSelector: React.FC<AcademicPeriodSelectorProps> = ({
  periods = MOCK_ACADEMIC_PERIODS,
  selectedPeriod,
  onChange,
  isLoading = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPeriod =
    periods.find((p) => p.id === selectedPeriod) || periods[0];

  const handleSelect = async (periodId: AcademicPeriod) => {
    setIsOpen(false);
    if (periodId !== selectedPeriod) {
      await onChange(periodId);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label as per Wireframe C */}
      <div className="flex items-center justify-between px-1">
        <label
          htmlFor="academic-period-button"
          className="text-[15px] sm:text-[16px] font-semibold text-[#78716C]"
        >
          Kỳ học
        </label>
        <span className="text-[13px] text-[#A8A29E] font-medium">
          Niên khóa {currentPeriod.academicYear}
        </span>
      </div>

      {/* Main Selector Button - min-h >= 56px, font >= 18px */}
      <div className="relative">
        <button
          id="academic-period-button"
          type="button"
          disabled={isLoading}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Chọn kỳ học. Kỳ hiện tại: ${currentPeriod.label}`}
          className={`w-full min-h-[56px] p-3.5 sm:p-4 rounded-[14px] bg-white border text-left transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
            isOpen
              ? "border-[#B4232C] ring-3 ring-[#B4232C]/15"
              : "border-[#E7E5E4] hover:border-[#D6D3D1] hover:bg-[#FAFAF9]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[18px] sm:text-[19px] font-bold text-[#1C1917] font-serif block">
                {currentPeriod.label}
              </span>
              <span className="text-[13px] text-[#78716C]">
                Năm học {currentPeriod.academicYear}
              </span>
            </div>
          </div>

          <div
            className={`w-8 h-8 rounded-full bg-[#FAFAF9] flex items-center justify-center transition-transform duration-200 text-[#78716C] ${
              isOpen ? "rotate-180 bg-[#FFF1F2] text-[#B4232C]" : ""
            }`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        {/* Backdrop for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/10 sm:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="listbox"
            aria-label="Chọn kỳ học"
            className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-[16px] border border-[#E7E5E4] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-2 space-y-1"
          >
            {periods.map((period) => {
              const isSelected = period.id === currentPeriod.id;
              return (
                <div
                  key={period.id}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => handleSelect(period.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(period.id);
                    }
                  }}
                  className={`w-full min-h-[52px] p-3 rounded-[12px] flex items-center justify-between gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#FFF1F2] border-[#FECDD3] text-[#B4232C] font-bold"
                      : "bg-white border-transparent hover:bg-[#FAFAF9] text-[#1C1917]"
                  }`}
                >
                  <span className="text-[17px] sm:text-[18px] font-medium font-serif">
                    {period.label}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[13px] font-bold text-[#B4232C]">
                      <Check className="w-4 h-4" />
                      <span>Đang chọn</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
