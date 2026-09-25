import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  LinkedStudent,
  AcademicPeriod,
  StudentAcademicReport,
  NotificationData,
} from "../types";
import {
  MOCK_LINKED_STUDENTS,
  fetchStudentAcademicReport,
  fetchStudentNotifications,
  buildAttendanceHistory,
  getTeacherContact,
  ParentAttendanceSession,
  ParentTeacherContact,
} from "../services/parentMockData";

interface ParentContextType {
  // Children list
  linkedChildren: LinkedStudent[];
  selectedChildId: string;
  selectedChild: LinkedStudent;
  switchChild: (childId: string) => Promise<void>;

  // Academic Period
  selectedPeriod: AcademicPeriod;
  switchPeriod: (period: AcademicPeriod) => Promise<void>;

  // Academic Report Data
  report: StudentAcademicReport | null;
  isLoadingReport: boolean;

  /** Lịch sử từng buổi học của kỳ đang chọn (mới nhất trước) */
  attendanceHistory: ParentAttendanceSession[];
  /** GLV phụ trách lớp của con đang chọn (lối tắt Gọi GLV) */
  teacherContact: ParentTeacherContact | null;

  // Notifications Data
  notifications: NotificationData[];
  unreadCount: number;
  isLoadingNotifications: boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Global Refresh State
  isRefreshing: boolean;
  refreshAll: () => Promise<void>;
  lastRefreshedAt: Date | null;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export const ParentProvider: React.FC<{
  children: React.ReactNode;
  initialChildId?: string;
  initialPeriod?: AcademicPeriod;
}> = ({
  children,
  initialChildId = "s-01",
  initialPeriod = "HK1",
}) => {
  const [selectedChildId, setSelectedChildId] = useState<string>(initialChildId);
  const [selectedPeriod, setSelectedPeriod] = useState<AcademicPeriod>(initialPeriod);

  const [report, setReport] = useState<StudentAcademicReport | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  // Mã yêu cầu mới nhất — bỏ qua kết quả trả về muộn khi phụ huynh đổi con/kỳ liên tục
  const reportRequest = useRef(0);
  const notificationRequest = useRef(0);
  const refreshRequest = useRef(0);

  const selectedChild = useMemo(() => {
    return (
      MOCK_LINKED_STUDENTS.find((c) => c.id === selectedChildId) ||
      MOCK_LINKED_STUDENTS[0]
    );
  }, [selectedChildId]);

  // Load report data for selected child & period
  const loadReport = useCallback(
    async (childId: string, period: AcademicPeriod, delay: number = 240) => {
      const requestId = ++reportRequest.current;
      setIsLoadingReport(true);
      try {
        const data = await fetchStudentAcademicReport(childId, period, delay);
        if (requestId === reportRequest.current) setReport(data);
      } catch (err) {
        console.error("Failed to load academic report:", err);
      } finally {
        if (requestId === reportRequest.current) setIsLoadingReport(false);
      }
    },
    []
  );

  // Load notifications for selected child
  const loadNotifications = useCallback(
    async (childId: string, delay: number = 200) => {
      const requestId = ++notificationRequest.current;
      setIsLoadingNotifications(true);
      try {
        const notifs = await fetchStudentNotifications(childId, delay);
        if (requestId === notificationRequest.current) setNotifications(notifs);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        if (requestId === notificationRequest.current) setIsLoadingNotifications(false);
      }
    },
    []
  );

  /** Tải lại toàn bộ dữ liệu của một con (dashboard / điểm / điểm danh / thông báo). */
  const refreshFor = useCallback(
    async (childId: string, period: AcademicPeriod, reportDelay: number, notifDelay: number) => {
      const requestId = ++refreshRequest.current;
      setIsRefreshing(true);
      await Promise.all([
        loadReport(childId, period, reportDelay),
        loadNotifications(childId, notifDelay),
      ]);
      if (requestId === refreshRequest.current) {
        setLastRefreshedAt(new Date());
        setIsRefreshing(false);
      }
    },
    [loadReport, loadNotifications]
  );

  // Switch child: BẮT BUỘC refresh context dashboard/score/attendance/notification
  const switchChild = useCallback(
    async (childId: string) => {
      if (childId === selectedChildId && !isRefreshing) return;
      setSelectedChildId(childId);
      await refreshFor(childId, selectedPeriod, 300, 280);
    },
    [selectedChildId, selectedPeriod, isRefreshing, refreshFor]
  );

  // Switch period
  const switchPeriod = useCallback(
    async (period: AcademicPeriod) => {
      setSelectedPeriod(period);
      await loadReport(selectedChildId, period, 200);
    },
    [selectedChildId, loadReport]
  );

  // Refresh all data
  const refreshAll = useCallback(
    () => refreshFor(selectedChildId, selectedPeriod, 300, 250),
    [selectedChildId, selectedPeriod, refreshFor]
  );

  // Initial load (một lần khi mount — các lần đổi con/kỳ đã tự tải lại ở trên)
  useEffect(() => {
    refreshFor(selectedChildId, selectedPeriod, 200, 180);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notification actions
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const attendanceHistory = useMemo(
    () => (report ? buildAttendanceHistory(report.studentId, report.period, report.attendance) : []),
    [report]
  );

  const teacherContact = useMemo(() => getTeacherContact(selectedChildId), [selectedChildId]);

  return (
    <ParentContext.Provider
      value={{
        linkedChildren: MOCK_LINKED_STUDENTS,
        selectedChildId,
        selectedChild,
        switchChild,
        selectedPeriod,
        switchPeriod,
        report,
        isLoadingReport,
        attendanceHistory,
        teacherContact,
        notifications,
        unreadCount,
        isLoadingNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isRefreshing,
        refreshAll,
        lastRefreshedAt,
      }}
    >
      {children}
    </ParentContext.Provider>
  );
};

export function useParentContext() {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error("useParentContext must be used within a ParentProvider");
  }
  return context;
}
