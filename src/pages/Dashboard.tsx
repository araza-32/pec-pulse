
import { useState, useMemo, useEffect } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { WorkbodyDistribution } from "@/components/dashboard/WorkbodyDistribution";
import { ActionCompletionProgress } from "@/components/dashboard/ActionCompletionProgress";
import { ExpiringTaskForceAlert } from "@/components/workbody/ExpiringTaskForceAlert"; 
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";

export default function Dashboard() {
  const { workbodies, isLoading, refetch } = useWorkbodies();
  const { meetings, isLoading: isLoadingMeetings } = useScheduledMeetings();
  const { session } = useAuth();
  
  useEffect(() => {
    // Refetch data when component mounts to ensure fresh data
    refetch().catch(error => {
      console.error("Failed to fetch workbodies data:", error);
      toast({
        title: "Data refresh failed",
        description: "Unable to load the latest workbody data.",
        variant: "destructive",
      });
    });
    
    // Set up interval to periodically refresh data
    const intervalId = setInterval(() => {
      refetch().catch(error => {
        console.error("Auto-refresh failed:", error);
      });
    }, 300000); // Refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  // Show all workbodies for admin and coordination users
  const user = session || JSON.parse(localStorage.getItem('user') || '{}');
  const isCoordinationUser = user?.email?.includes('coordination');
  const shouldShowAllWorkbodies = user?.role === 'admin' || isCoordinationUser;
  
  const filteredWorkbodies = shouldShowAllWorkbodies
    ? workbodies
    : workbodies.filter(w => w.id === user.workbodyId);

  // Sort workbodies alphabetically
  const sortedFilteredWorkbodies = [...filteredWorkbodies].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
    
  // Get task forces that are expiring within the next 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiringTaskForces = useMemo(() => {
    return workbodies
      .filter(wb => 
        wb.type === 'task-force' && 
        wb.endDate && 
        new Date(wb.endDate) >= today && 
        new Date(wb.endDate) <= thirtyDaysFromNow
      )
      .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime());
  }, [workbodies]);

  // Get upcoming meetings count for the stats display
  const upcomingMeetingsCount = meetings ? meetings.length : 0;

  const stats = {
    totalWorkbodies: filteredWorkbodies.length,
    committees: filteredWorkbodies.filter(w => w.type === 'committee').length,
    workingGroups: filteredWorkbodies.filter(w => w.type === 'working-group').length,
    taskForces: filteredWorkbodies.filter(w => w.type === 'task-force').length,
    totalMeetings: filteredWorkbodies.reduce((sum, w) => sum + w.totalMeetings, 0),
    meetingsThisYear: filteredWorkbodies.reduce((sum, w) => sum + w.meetingsThisYear, 0),
    completionRate: filteredWorkbodies.length ? Math.round(
      (filteredWorkbodies.reduce((sum, w) => sum + w.actionsCompleted, 0) / 
       Math.max(1, filteredWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0))) * 100
    ) : 0
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading workbody statistics...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (user?.role === 'secretary' && !isCoordinationUser) {
    const workbody = sortedFilteredWorkbodies[0];
    if (!workbody) {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">No workbody assigned.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{workbody.name}</h1>
          <p className="text-muted-foreground">
            Workbody Overview and Statistics
          </p>
        </div>
        
        {expiringTaskForces.length > 0 && (
          <ExpiringTaskForceAlert expiringTaskForces={expiringTaskForces} />
        )}
        
        <OverviewStats stats={{
          totalWorkbodies: workbody.totalMeetings,
          meetingsThisYear: workbody.meetingsThisYear,
          completionRate: workbody.actionsAgreed ? 
            Math.round((workbody.actionsCompleted / workbody.actionsAgreed) * 100) : 0,
          upcomingMeetingsCount: upcomingMeetingsCount
        }} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <UpcomingMeetings />
          <ActionCompletionProgress workbodies={[workbody]} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PEC Pulse</h1>
        <p className="text-muted-foreground">
          Organizational Overview & Analytics
        </p>
      </div>

      {expiringTaskForces.length > 0 && (
        <ExpiringTaskForceAlert expiringTaskForces={expiringTaskForces} />
      )}

      <OverviewStats stats={{
        totalWorkbodies: stats.totalWorkbodies,
        meetingsThisYear: stats.meetingsThisYear,
        completionRate: stats.completionRate,
        upcomingMeetingsCount: upcomingMeetingsCount
      }} />

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingMeetings />
        <WorkbodyDistribution data={{
          committees: stats.committees,
          workingGroups: stats.workingGroups,
          taskForces: stats.taskForces
        }} />
      </div>

      <ActionCompletionProgress workbodies={sortedFilteredWorkbodies} />
    </div>
  );
}
