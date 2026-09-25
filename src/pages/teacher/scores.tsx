import React from "react";
import { ExamType } from "../../types";
import { BulkScoreEntry } from "../../components/score";

export interface TeacherScoresPageProps {
  onBack?: () => void;
  initialClassId?: string;
  initialSubjectId?: string;
  initialExamType?: ExamType;
  className?: string;
}

/**
 * TeacherScoresPage (/teacher/scores) — màn hình Nhập điểm của Giáo lý viên.
 * Toàn bộ luồng (chọn bảng điểm, nhập nhanh, nháp, Excel, lưu) nằm trong BulkScoreEntry.
 */
export const TeacherScoresPage: React.FC<TeacherScoresPageProps> = (props) => {
  return <BulkScoreEntry {...props} />;
};
