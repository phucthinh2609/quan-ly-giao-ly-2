import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, FileSpreadsheet, FlaskConical, UploadCloud } from "lucide-react";
import { ExcelImportResult, Student } from "../../types";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { IconTile } from "../ui/IconTile";
import { Spinner } from "../ui/Spinner";
import { cn } from "../../lib/cn";
import { useDemoMode } from "./scoreUtils";

export type ExcelUploaderState =
  | "IDLE"
  | "DRAGGING"
  | "UPLOADING"
  | "PARSING"
  | "SUCCESS"
  | "ERROR";

export interface ExcelUploaderProps {
  students: Student[];
  onParsed: (result: ExcelImportResult) => void;
  className?: string;
}

const ACCEPT = ".xlsx,.xls";
const MAX_SIZE_MB = 10;

/**
 * Bước 1 — Chọn file Excel (02 §12).
 * States: IDLE · DRAGGING · UPLOADING · PARSING · SUCCESS · ERROR.
 * Desktop: vùng kéo-thả; mobile: nút lớn "Chọn file Excel".
 * Tệp mẫu để thử nhanh chỉ hiện khi bật Chế độ demo.
 */
export const ExcelUploader: React.FC<ExcelUploaderProps> = ({ students, onParsed, className = "" }) => {
  const demoMode = useDemoMode();
  const [state, setState] = useState<ExcelUploaderState>("IDLE");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const openPicker = () => fileInputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (state !== "DRAGGING") setState("DRAGGING");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Bỏ qua khi con trỏ chỉ đi qua phần tử con bên trong vùng thả
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setState("IDLE");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setState("IDLE");
    const files = e.dataTransfer.files;
    if (files && files.length > 0) processFile(files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processFile(files[0]);
    // Cho phép chọn lại cùng một tệp
    e.target.value = "";
  };

  // Mô phỏng đọc tệp: dòng 12 điểm > 10, dòng 19 không tìm thấy học sinh.
  const generateParsedResult = (
    name: string,
    currentStudents: Student[],
    includeErrors = true
  ): ExcelImportResult => {
    const validData: ExcelImportResult["validData"] = [];
    const errors: ExcelImportResult["errors"] = [];
    const baseScores = [8.5, 9.0, 7.5, 8.0, 9.5, 8.5, 7.0, 8.5, 9.0, 8.0];

    currentStudents.forEach((student, index) => {
      const rowNum = index + 2; // dòng 1 là tiêu đề

      if (includeErrors && rowNum === 12) {
        errors.push({
          rowNumber: 12,
          studentName: student.name,
          studentCode: student.code,
          message: "Điểm phải từ 0 đến 10",
          scoreRaw: 11.5,
        });
        return;
      }

      validData.push({
        rowNumber: rowNum,
        studentId: student.id,
        studentName: `${student.christianName || ""} ${student.name}`.trim(),
        studentCode: student.code,
        score: baseScores[index % baseScores.length],
      });
    });

    if (includeErrors) {
      errors.push({
        rowNumber: 19,
        studentName: "Nguyễn Hoàng Minh",
        studentCode: "HS999",
        message: "Không tìm thấy học sinh có mã này trong lớp",
        scoreRaw: 8.5,
      });
    }

    return {
      fileName: name,
      totalRows: validData.length + errors.length,
      validCount: validData.length,
      errorCount: errors.length,
      errors,
      validData,
    };
  };

  const simulateParse = (name: string, includeErrors: boolean) => {
    setUploadError(null);
    setFileName(name);
    setState("UPLOADING");
    later(() => {
      setState("PARSING");
      later(() => {
        setState("SUCCESS");
        onParsed(generateParsedResult(name, students, includeErrors));
      }, 400);
    }, 300);
  };

  const processFile = (file: File) => {
    setUploadError(null);
    const hasValidExt = [".xlsx", ".xls"].some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setState("ERROR");
      setUploadError("Tệp phải có đuôi .xlsx hoặc .xls");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setState("ERROR");
      setUploadError(`Tệp lớn hơn ${MAX_SIZE_MB}MB, hãy chọn tệp nhỏ hơn`);
      return;
    }

    simulateParse(file.name, true);
  };

  const isDragging = state === "DRAGGING";
  const isProcessing = state === "UPLOADING" || state === "PARSING";

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFileChange}
      />

      {isProcessing ? (
        <div
          role="status"
          className="flex items-center gap-4 rounded-card border border-line bg-surface-2 p-5"
        >
          <IconTile icon={<FileSpreadsheet />} tone="success" size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-ink">{fileName}</p>
            <p className="text-sm text-ink-2">
              {state === "UPLOADING" ? "Đang đọc tệp..." : "Đang kiểm tra từng dòng..."}
            </p>
          </div>
          <Spinner size="md" color="primary" />
        </div>
      ) : (
        <>
          {/* Mobile: nút lớn */}
          <div className="space-y-2 md:hidden">
            <Button variant="primary" size="lg" fullWidth leftIcon={<FileSpreadsheet />} onClick={openPicker}>
              Chọn file Excel
            </Button>
            <p className="text-center text-sm text-ink-3">
              Tệp .xlsx hoặc .xls, tối đa {MAX_SIZE_MB}MB
            </p>
          </div>

          {/* Desktop: vùng kéo-thả */}
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openPicker}
            className={cn(
              "hidden cursor-pointer flex-col items-center gap-4 rounded-card border-2 border-dashed p-8 text-center md:flex",
              "transition-[background-color,border-color] duration-200 ease-out-soft",
              isDragging
                ? "border-primary bg-primary-soft"
                : "border-line-strong bg-surface-2/50 hover:border-ink-3 hover:bg-surface-2"
            )}
          >
            <IconTile
              icon={<UploadCloud />}
              tone="primary"
              size="xl"
              className={cn("transition-transform duration-200", isDragging && "scale-110")}
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-ink">
                {isDragging ? "Thả tệp vào đây" : "Kéo thả file Excel vào đây"}
              </p>
              <p className="text-sm text-ink-3">Tệp .xlsx hoặc .xls, tối đa {MAX_SIZE_MB}MB</p>
            </div>
            <Button
              variant="outline"
              leftIcon={<FileSpreadsheet />}
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
            >
              Chọn file từ máy tính
            </Button>
          </div>
        </>
      )}

      {uploadError && (
        <p role="alert" className="flex items-start gap-2 rounded-control bg-danger-soft p-3 text-sm font-medium text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{uploadError}</span>
        </p>
      )}

      {demoMode && !isProcessing && (
        <div className="space-y-3 rounded-card border border-dashed border-line-strong p-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="size-4 text-ink-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-ink-2">Tệp mẫu để thử</p>
            <Badge variant="grape" size="sm">
              Chế độ demo
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => simulateParse("BangDiem_GiaoLy_CoLoi.xlsx", true)}>
              Tệp có 2 dòng lỗi
            </Button>
            <Button variant="outline" onClick={() => simulateParse("BangDiem_GiaoLy_HopLe.xlsx", false)}>
              Tệp hợp lệ hoàn toàn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
