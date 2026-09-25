import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { Skeleton } from "../../components/ui/Skeleton";
import { activityService } from "../../services/api";

export const ActivityLogPage: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    activityService.getActivities().then((data) => {
      setActivities(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Nhật Ký Hoạt Động (Activity Log)"
        description="Ghi nhận mọi thao tác điểm danh, cập nhật điểm số, thay đổi hồ sơ trong hệ thống"
        badge={<Badge variant="neutral">Audit Trail</Badge>}
      />

      <div className="bg-white rounded-[16px] border border-[#E7E5E4] p-5 sm:p-6 shadow-xs">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <ActivityFeed
            title="Toàn bộ lịch sử thao tác hệ thống"
            activities={activities}
          />
        )}
      </div>
    </div>
  );
};
