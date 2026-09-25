import React from "react";
import { History } from "lucide-react";
import { Button } from "../ui/Button";
import { IconTile } from "../ui/IconTile";
import { cn } from "../../lib/cn";
import { formatTime } from "../../lib/format";

export interface ScoreDraftBannerProps {
  /** ISO time của bản nháp */
  savedAt: string;
  /** Số điểm có trong bản nháp */
  count?: number;
  onRestore: () => void;
  onDismiss: () => void;
  className?: string;
}

/**
 * Banner bản nháp (B-GLV-07): "Có bản nháp chưa lưu lúc HH:mm" [Khôi phục] [Bỏ qua].
 */
export const ScoreDraftBanner: React.FC<ScoreDraftBannerProps> = ({
  savedAt,
  count,
  onRestore,
  onDismiss,
  className,
}) => (
  <section
    aria-label="Bản nháp chưa lưu"
    className={cn(
      "flex flex-col gap-3 rounded-card border border-info/25 bg-info-soft p-4 sm:flex-row sm:items-center",
      className
    )}
  >
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <IconTile icon={<History />} tone="info" className="bg-surface" />
      <div className="min-w-0">
        <p className="text-base font-semibold text-ink">
          Có bản nháp chưa lưu lúc <span className="font-mono tabular-nums">{formatTime(savedAt)}</span>
        </p>
        <p className="text-sm text-ink-2">
          {count !== undefined ? (
            <>
              <span className="font-mono tabular-nums">{count}</span> điểm đã nhập trên máy này nhưng chưa lưu.
            </>
          ) : (
            "Điểm đã nhập trên máy này nhưng chưa lưu."
          )}
        </p>
      </div>
    </div>
    <div className="flex gap-2 sm:shrink-0">
      <Button variant="ghost" onClick={onDismiss} className="flex-1 sm:flex-none">
        Bỏ qua
      </Button>
      <Button variant="secondary" onClick={onRestore} className="flex-1 sm:flex-none">
        Khôi phục
      </Button>
    </div>
  </section>
);
