import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
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
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const selectedChild = useMemo(() => {
    return (
      MOCK_LINKED_STUDENTS.find((c) => c.id === selectedChildId) ||
      MOCK_LINKED_STUDENTS[0]
    );
  }, [selectedChildId]);

  // Load report data for selected child & period
  const loadReport = useCallback(
    async (childId: string, period: AcademicPeriod, delay: number = 240) => {
      setIsLoadingReport(true);
      try {
        const data = await fetchStudentAcademicReport(childId, period, delay);
        setReport(data);
      } catch (err) {
        console.error("Failed to load academic report:", err);
      } finally {
        setIsLoadingReport(false);
      }
    },
    []
  );

  // Load notifications for selected child
  const loadNotifications = useCallback(
    async (childId: string, delay: number = 200) => {
      setIsLoadingNotifications(true);
      try {
        const notifs = await fetchStudentNotifications(childId, delay);
        setNotifications(notifs);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setIsLoadingNotifications(false);
      }
    },
    []
  );

  // Switch child: BẮT BUỘC refresh context dashboard/score/attendance/notification
  const switchChild = useCallback(
    async (childId: string) => {
      if (childId === selectedChildId && !isRefreshing) return;
      setSelectedChildId(childId);
      setIsRefreshing(true);

      // Trigger concurrent fetch for both report and notifications
      await Promise.all([
        loadReport(childId, selectedPeriod, 300),
        loadNotifications(childId, 280),
      ]);

      setLastRefreshedAt(new Date());
      setIsRefreshing(false);
    },
    [selectedChildId, selectedPeriod, loadReport, loadNotifications, isRefreshing]
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
  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadReport(selectedChildId, selectedPeriod, 300),
      loadNotifications(selectedChildId, 250),
    ]);
    setLastRefreshedAt(new Date());
    setIsRefreshing(false);
  }, [selectedChildId, selectedPeriod, loadReport, loadNotifications]);

  // Initial load
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setIsRefreshing(true);
      await Promise.all([
        loadReport(selectedChildId, selectedPeriod, 200),
        loadNotifications(selectedChildId, 180),
      ]);
      if (mounted) {
        setLastRefreshedAt(new Date());
        setIsRefreshing(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [selectedChildId, selectedPeriod, loadReport, loadNotifications]);

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
