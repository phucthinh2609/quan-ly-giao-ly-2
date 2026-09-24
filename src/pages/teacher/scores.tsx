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
 * TeacherScoresPage (/teacher/scores)
 *
 * Màn hình Nhập điểm dành cho Giáo lý viên.
 * Sử dụng BulkScoreEntry (§30 - Feature Component Tree).
 */
export const TeacherScoresPage: React.FC<TeacherScoresPageProps> = (props) => {
  return <BulkScoreEntry {...props} />;
};
