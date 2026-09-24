import React from "react";
import { ExcelImportResult } from "../../types";
import { Button } from "../ui/Button";
import { FileSpreadsheet, X, Check } from "lucide-react";

export interface ExcelPreviewProps {
  result: ExcelImportResult;
  onConfirmImport: () => void;
  onCancel: () => void;
  isImporting?: boolean;
  className?: string;
}

/**
 * ExcelPreview Component (§23 - 03_Component_Library.md & Sitemap §10)
 *
 * ĐỊNH DẠNG BẮT BUỘC THEO SITEMAP §10:
 * ✓ 28 dòng hợp lệ
 * ⚠ 2 dòng lỗi
 *
 * Dòng 12 — Điểm > 10
 * Dòng 19 — Không tìm thấy HS
 *
 * [Hủy] [Import hợp lệ]
 */
export const ExcelPreview: React.FC<ExcelPreviewProps> = ({
  result,
  onConfirmImport,
  onCancel,
  isImporting = false,
  className = "",
}) => {
  const { fileName, totalRows, validCount, errorCount, errors, validData } = result;
  const hasErrors = errorCount > 0;
  const canImport = validCount > 0;

  return (
    <div className={`space-y-5 font-sans ${className}`}>
      {/* File Information Header */}
      <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#FAFAF9] border border-[#E7E5E4]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#DCFCE7] text-[#168154] flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-[15px] text-[#1C1917]">{fileName}</div>
            <div className="text-[12px] text-[#78716C]">
              Tổng số {totalRows} dòng được quét từ tệp bảng tính
            </div>
          </div>
        </div>
      </div>

      {/* Summary Counts (Exact Sitemap §10 format) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Valid Count */}
        <div className="p-4 rounded-[12px] bg-[#F0FDF4] border-2 border-[#BBF7D0] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#168154] text-white flex items-center justify-center flex-shrink-0 font-bold">
            ✓
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#166534]">
              ✓ {validCount} dòng hợp lệ
            </div>
            <div className="text-[12px] text-[#15803D]">
              Sẵn sàng cập nhật trực tiếp vào bảng điểm
            </div>
          </div>
        </div>

        {/* Error Count */}
        <div
          className={`p-4 rounded-[12px] border-2 flex items-center gap-3 ${
            hasErrors
              ? "bg-[#FFF1F2] border-[#FECDD3] text-[#991B1B]"
              : "bg-[#FAFAF9] border-[#E7E5E4] text-[#78716C]"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
              hasErrors ? "bg-[#DC4C4C] text-white" : "bg-[#E7E5E4] text-[#78716C]"
            }`}
          >
            ⚠
          </div>
          <div>
            <div className={`text-[18px] font-bold ${hasErrors ? "text-[#DC4C4C]" : "text-[#78716C]"}`}>
              ⚠ {errorCount} dòng lỗi
            </div>
            <div className="text-[12px]">
              {hasErrors ? "Sẽ bị bỏ qua hoặc cần chỉnh sửa lại trong file" : "Không có lỗi nào"}
            </div>
          </div>
        </div>
      </div>

      {/* Error Details by Row (Format: Dòng X — Lý do lỗi) */}
      {hasErrors && (
        <div className="rounded-[12px] bg-[#FFF5F5] border border-[#FECDD3] p-4 space-y-2">
          <div className="text-[13px] font-bold text-[#991B1B] uppercase tracking-wide">
            Chi tiết các dòng bị lỗi:
          </div>
          <div className="divide-y divide-[#FECDD3]/60 max-h-[160px] overflow-y-auto">
            {errors.map((err, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-[13px] font-medium text-[#B4232C]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-[#FEE2E2] px-2 py-0.5 rounded text-[#991B1B]">
                    Dòng {err.rowNumber}
                  </span>
                  <span>—</span>
                  <span className="font-bold">{err.message}</span>
                </div>
                {err.scoreRaw !== undefined && (
                  <span className="text-[12px] font-mono text-[#78716C]">
                    (Giá trị: {String(err.scoreRaw)})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Valid rows preview table (sample) */}
      {validData.length > 0 && (
        <div className="rounded-[12px] border border-[#E7E5E4] overflow-hidden">
          <div className="bg-[#FAFAF9] px-4 py-2 text-[12px] font-bold text-[#57534E] uppercase border-b border-[#E7E5E4]">
            Xem trước dữ liệu hợp lệ ({validData.length} học sinh)
          </div>
          <div className="max-h-[160px] overflow-y-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead className="bg-[#F5F5F4] sticky top-0 text-[#78716C]">
                <tr>
                  <th className="py-1.5 px-3">Dòng</th>
                  <th className="py-1.5 px-3">Mã HS</th>
                  <th className="py-1.5 px-3">Học sinh</th>
                  <th className="py-1.5 px-3 text-right">Điểm nhập</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F4]">
                {validData.slice(0, 10).map((item) => (
                  <tr key={item.studentId} className="hover:bg-[#FAFAF9]">
                    <td className="py-1.5 px-3 font-mono text-[#78716C]">#{item.rowNumber}</td>
                    <td className="py-1.5 px-3 font-mono text-[#57534E]">{item.studentCode}</td>
                    <td className="py-1.5 px-3 font-medium text-[#1C1917]">{item.studentName}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-[#168154]">{item.score.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {validData.length > 10 && (
              <div className="p-2 text-center text-[12px] text-[#78716C] bg-[#FAFAF9] border-t border-[#F5F5F4]">
                ... và {validData.length - 10} học sinh hợp lệ khác
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Bar: [Hủy] [Import hợp lệ] (§10) */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E5E4]">
        <Button
          variant="outline"
          size="md"
          onClick={onCancel}
          disabled={isImporting}
          leftIcon={<X className="w-4 h-4" />}
          className="min-h-[44px] font-semibold text-[#57534E]"
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onConfirmImport}
          disabled={!canImport || isImporting}
          leftIcon={<Check className="w-4 h-4" />}
          className="min-h-[44px] font-bold cursor-pointer"
        >
          {isImporting
            ? "Đang nạp dữ liệu..."
            : "Import hợp lệ"}
        </Button>
      </div>
    </div>
  );
};
