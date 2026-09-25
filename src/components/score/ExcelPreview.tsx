import React from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet, RefreshCw } from "lucide-react";
import { ExcelImportResult } from "../../types";
import { Button } from "../ui/Button";
import { IconTile } from "../ui/IconTile";
import { cn } from "../../lib/cn";
import { formatScore } from "./scoreUtils";

export interface ExcelPreviewProps {
  result: ExcelImportResult;
  onConfirmImport: () => void;
  onCancel: () => void;
  isImporting?: boolean;
  className?: string;
  /** Quay lại bước chọn file (hiện nút "Chọn file khác") */
  onChooseAnother?: () => void;
}

const PREVIEW_LIMIT = 10;

/**
 * Bước 2 — Kiểm tra (02 §12): "28 dòng hợp lệ · 2 dòng lỗi" + lỗi theo từng dòng
 * + xem trước dữ liệu hợp lệ. Hành động: [Hủy] [Nhập N dòng hợp lệ].
 */
export const ExcelPreview: React.FC<ExcelPreviewProps> = ({
  result,
  onConfirmImport,
  onCancel,
  isImporting = false,
  className = "",
  onChooseAnother,
}) => {
  const { fileName, totalRows, validCount, errorCount, errors, validData } = result;
  const hasErrors = errorCount > 0;
  const canImport = validCount > 0;
  const th = "sticky top-0 border-b border-line bg-surface-2 px-3 py-2 text-sm font-semibold text-ink-2";

  return (
    <div className={cn("space-y-5", className)}>
      {/* Tệp đã chọn */}
      <div className="flex items-center gap-3 rounded-card bg-surface-2 p-3">
        <IconTile icon={<FileSpreadsheet />} tone="success" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-ink" title={fileName}>
            {fileName}
          </p>
          <p className="text-sm text-ink-3">
            Đã đọc <span className="font-mono tabular-nums">{totalRows}</span> dòng
          </p>
        </div>
        {onChooseAnother && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw />}
            onClick={onChooseAnother}
            disabled={isImporting}
            className="min-h-11"
          >
            Chọn file khác
          </Button>
        )}
      </div>

      {/* Tổng quan */}
      <div>
        <p className="text-lg font-semibold text-ink" aria-live="polite">
          <span className="font-mono tabular-nums">{validCount}</span> dòng hợp lệ ·{" "}
          <span className={hasErrors ? "text-danger" : undefined}>
            <span className="font-mono tabular-nums">{errorCount}</span> dòng lỗi
          </span>
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-card bg-success-soft p-3 sm:p-4">
            <CheckCircle2 className="size-6 shrink-0 text-success" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-mono text-2xl font-bold text-success tabular-nums">{validCount}</p>
              <p className="text-sm text-ink-2">Sẵn sàng nhập</p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-3 rounded-card p-3 sm:p-4",
              hasErrors ? "bg-danger-soft" : "bg-surface-2"
            )}
          >
            <AlertCircle
              className={cn("size-6 shrink-0", hasErrors ? "text-danger" : "text-ink-3")}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p
                className={cn(
                  "font-mono text-2xl font-bold tabular-nums",
                  hasErrors ? "text-danger" : "text-ink-3"
                )}
              >
                {errorCount}
              </p>
              <p className="text-sm text-ink-2">{hasErrors ? "Sẽ được bỏ qua" : "Không có lỗi"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lỗi theo dòng */}
      {hasErrors && (
        <section aria-label="Các dòng lỗi" className="space-y-2">
          <h3 className="text-sm font-semibold text-ink-2">Các dòng lỗi</h3>
          <ul className="max-h-48 divide-y divide-line overflow-y-auto rounded-card border border-danger/25">
            {errors.map((err, idx) => (
              <li key={`${err.rowNumber}-${idx}`} className="flex items-start gap-3 p-3">
                <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-danger-soft px-2.5 font-mono text-xs font-semibold text-danger tabular-nums">
                  Dòng {err.rowNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-start gap-1.5 text-sm font-medium text-danger">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{err.message}</span>
                  </p>
                  {(err.studentName || err.studentCode || err.scoreRaw !== undefined) && (
                    <p className="mt-0.5 text-sm text-ink-3">
                      {err.studentName}
                      {err.studentCode && (
                        <span className="font-mono">
                          {err.studentName ? " · " : ""}
                          {err.studentCode}
                        </span>
                      )}
                      {err.scoreRaw !== undefined && (
                        <>
                          {" · Giá trị "}
                          <span className="font-mono text-ink-2">{String(err.scoreRaw)}</span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Xem trước dữ liệu hợp lệ */}
      {validData.length > 0 && (
        <section aria-label="Xem trước dữ liệu hợp lệ" className="space-y-2">
          <h3 className="text-sm font-semibold text-ink-2">
            Xem trước{" "}
            {validData.length > PREVIEW_LIMIT && (
              <span className="font-normal text-ink-3">
                ({PREVIEW_LIMIT}/{validData.length} dòng)
              </span>
            )}
          </h3>
          <div className="max-h-56 overflow-auto rounded-card border border-line">
            <table className="w-full border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr>
                  <th scope="col" className={cn(th, "w-16")}>
                    Dòng
                  </th>
                  <th scope="col" className={cn(th, "hidden sm:table-cell")}>
                    Mã HS
                  </th>
                  <th scope="col" className={th}>
                    Học sinh
                  </th>
                  <th scope="col" className={cn(th, "text-right")}>
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody>
                {validData.slice(0, PREVIEW_LIMIT).map((item) => (
                  <tr key={item.studentId} className="hover:bg-surface-2/60 [&:last-child>td]:border-b-0">
                    <td className="border-b border-line px-3 py-2 font-mono text-ink-3 tabular-nums">
                      {item.rowNumber}
                    </td>
                    <td className="hidden border-b border-line px-3 py-2 font-mono text-ink-2 sm:table-cell">
                      {item.studentCode}
                    </td>
                    <td className="border-b border-line px-3 py-2 font-medium text-ink">{item.studentName}</td>
                    <td className="border-b border-line px-3 py-2 text-right font-mono font-semibold text-success tabular-nums">
                      {formatScore(item.score)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Hành động */}
      <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isImporting}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={onConfirmImport}
          disabled={!canImport}
          loading={isImporting}
          leftIcon={<CheckCircle2 />}
        >
          {canImport ? `Nhập ${validCount} dòng hợp lệ` : "Không có dòng hợp lệ"}
        </Button>
      </div>
    </div>
  );
};
