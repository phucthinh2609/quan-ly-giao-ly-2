import React from "react";
import { AcademicPeriod, AcademicPeriodOption } from "../../types";
import { cn } from "../../lib/cn";
import { SegmentedControl } from "../ui/SegmentedControl";
import { MOCK_ACADEMIC_PERIODS } from "../../services/parentMockData";

export interface AcademicPeriodSelectorProps {
  periods?: AcademicPeriodOption[];
  selectedPeriod: AcademicPeriod;
  onChange: (period: AcademicPeriod) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const SHORT_LABELS: Record<AcademicPeriod, string> = {
  HK1: "HK I",
  HK2: "HK II",
  FULL_YEAR: "Cả năm",
};

/**
 * AcademicPeriodSelector (03 §9) — SegmentedControl 1 chạm: HK I · HK II · Cả năm.
 */
export const AcademicPeriodSelector: React.FC<AcademicPeriodSelectorProps> = ({
  periods = MOCK_ACADEMIC_PERIODS,
  selectedPeriod,
  onChange,
  isLoading = false,
  className,
}) => {
  const currentPeriod = periods.find((p) => p.id === selectedPeriod) || periods[0];

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2", className)} aria-busy={isLoading || undefined}>
      <SegmentedControl<AcademicPeriod>
        ariaLabel="Chọn kỳ học"
        size="lg"
        value={selectedPeriod}
        onChange={(period) => {
          void onChange(period);
        }}
        options={periods.map((period) => ({
          value: period.id,
          label: SHORT_LABELS[period.id] ?? period.label,
        }))}
        className="max-w-full"
      />
      {currentPeriod && (
        <p className="text-sm text-ink-3">
          {currentPeriod.label} · Năm học {currentPeriod.academicYear}
        </p>
      )}
    </div>
  );
};
