import React from "react";
import { AlertTriangle, ArrowRight, CalendarClock, GraduationCap, School } from "lucide-react";
import { NotificationData } from "../../types";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { IconTile } from "../ui/IconTile";
import { getNotificationTimeLabel, getNotificationTypeMeta } from "./notificationMeta";

export interface NotificationDetailModalProps {
  notification: NotificationData | null;
  isOpen: boolean;
  onClose: () => void;
  onActionClick?: (path?: string) => void;
}

/**
 * NotificationDetailModal (03 §11, 04 §16) — đọc thoải mái (text-base leading-relaxed),
 * có nút hành động liên quan (VD "Xem bảng điểm"). Mobile hiển thị dạng sheet (Modal lo phần này).
 */
export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  isOpen,
  onClose,
  onActionClick,
}) => {
  if (!isOpen || !notification) return null;

  const { title, type, content, preview, formattedDate, studentName, className, actionLabel, actionPath } =
    notification;
  const meta = getNotificationTypeMeta(type);
  const TypeIcon = meta.icon;
  const timeLabel = getNotificationTimeLabel(notification);
  const showAction = Boolean(actionLabel && actionPath && onActionClick);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={title}
      description={
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-3">
          {type === "URGENT" ? (
            <Badge variant="error" size="lg" icon={<AlertTriangle />}>
              Khẩn
            </Badge>
          ) : (
            <span className="font-semibold text-ink-2">{meta.label}</span>
          )}
          {(formattedDate || timeLabel) && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <CalendarClock className="size-4" aria-hidden="true" />
                {formattedDate || timeLabel}
              </span>
            </>
          )}
        </span>
      }
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Đóng
          </Button>
          {showAction && (
            <Button
              variant="primary"
              rightIcon={<ArrowRight />}
              className="h-auto min-h-(--control) w-full py-2 whitespace-normal sm:w-auto"
              onClick={() => {
                onClose();
                onActionClick?.(actionPath);
              }}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {(studentName || className) && (
          <div className="flex items-center gap-3 rounded-control bg-surface-2 p-3">
            <IconTile icon={studentName ? <GraduationCap /> : <School />} tone={meta.tone} size="md" />
            <div className="min-w-0">
              <p className="text-sm text-ink-3">{studentName ? "Dành cho học sinh" : "Dành cho lớp"}</p>
              <p className="truncate text-base font-semibold text-ink">
                {studentName || className}
                {studentName && className ? (
                  <span className="font-normal text-ink-2"> · {className}</span>
                ) : null}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <IconTile icon={<TypeIcon />} tone={meta.tone} size="md" className="hidden sm:inline-flex" />
          <p className="flex-1 text-base leading-relaxed whitespace-pre-line text-ink">{content || preview}</p>
        </div>
      </div>
    </Modal>
  );
};
