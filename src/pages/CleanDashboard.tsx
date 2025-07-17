
import { useState, useEffect } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { useAuth } from "@/contexts/AuthContext";
import { CleanDashboardContainer } from "@/components/dashboard/CleanDashboardContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CleanDashboard() {
  const { workbodies, isLoading } = useWorkbodies();
  const { meetings, isLoading: isLoadingMeetings } = useScheduledMeetings();
  const { session } = useAuth();

  const user = session || JSON.parse(localStorage.getItem('user') || '{}');
  const isCoordinationUser = user?.email?.includes('coordination');
  const shouldShowAllWorkbodies = user?.role === 'admin' || isCoordinationUser;
  
  const filteredWorkbodies = shouldShowAllWorkbodies
    ? workbodies
    : workbodies.filter(w => w.id === user.workbodyId);

  const workbodiesStats = {
    totalWorkbodies: filteredWorkbodies.length,
    committees: filteredWorkbodies.filter(w => w.type === 'committee').length,
    workingGroups: filteredWorkbodies.filter(w => w.type === 'working-group').length,
    taskForces: filteredWorkbodies.filter(w => w.type === 'task-force').length,
    meetingsThisYear: filteredWorkbodies.reduce((sum, w) => sum + w.meetingsThisYear, 0),
    completionRate: (() => {
      const agreed = filteredWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0);
      const completed = filteredWorkbodies.reduce((sum, w) => sum + w.actionsCompleted, 0);
      return agreed ? Math.round((completed / agreed) * 100) : 0;
    })(),
    upcomingMeetingsCount: meetings.length
  };

  if (isLoading || isLoadingMeetings) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <CleanDashboardContainer workbodiesStats={workbodiesStats} />;
}
