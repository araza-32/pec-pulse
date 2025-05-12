
import { useState, useMemo, useEffect } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { ExpiringTaskForceAlert } from "@/components/workbody/ExpiringTaskForceAlert"; 
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardProvider } from "@/contexts/DashboardContext";

export default function Dashboard() {
  const { workbodies, isLoading, refetch } = useWorkbodies();
  const { meetings, isLoading: isLoadingMeetings } = useScheduledMeetings();
  const { session } = useAuth();
  
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('dashboardVisited');
    
    if (isFirstVisit) {
      toast({
        title: "Welcome to PEC Pulse!",
        description: "This dashboard provides an overview of all workbodies. Click on any tile to explore details.",
      });
      localStorage.setItem('dashboardVisited', 'true');
    }
    
    refetch().catch(error => {
      console.error("Failed to fetch workbodies data:", error);
      toast({
        title: "Data refresh failed",
        description: "Unable to load the latest workbody data.",
        variant: "destructive",
      });
    });
    
    const intervalId = setInterval(() => {
      refetch().catch(error => {
        console.error("Auto-refresh failed:", error);
      });
    }, 300000);
    
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  const user = session || JSON.parse(localStorage.getItem('user') || '{}');
  const isCoordinationUser = user?.email?.includes('coordination');
  const shouldShowAllWorkbodies = user?.role === 'admin' || isCoordinationUser;
  
  const filteredWorkbodies = shouldShowAllWorkbodies
    ? workbodies
    : workbodies.filter(w => w.id === user.workbodyId);

  const sortedFilteredWorkbodies = [...filteredWorkbodies].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
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

  // Transform meetings data
  const upcomingMeetings = useMemo(() => {
    if (!meetings) return [];
    
    return meetings.map(meeting => ({
      id: meeting.id,
      date: new Date(meeting.date),
      workbodyName: meeting.workbodyName,
      type: sortedFilteredWorkbodies.find(w => w.id === meeting.workbodyId)?.type || 'unknown'
    }));
  }, [meetings, sortedFilteredWorkbodies]);

  // Calculate stats for dashboard
  const workbodiesStats = useMemo(() => {
    const committees = sortedFilteredWorkbodies.filter(w => w.type === 'committee').length;
    const workingGroups = sortedFilteredWorkbodies.filter(w => w.type === 'working-group').length;
    const taskForces = sortedFilteredWorkbodies.filter(w => w.type === 'task-force').length;
    const actionsCompleted = sortedFilteredWorkbodies.reduce((sum, w) => sum + w.actionsCompleted, 0);
    const actionsAgreed = sortedFilteredWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0);
    const completionRate = actionsAgreed ? Math.round((actionsCompleted / actionsAgreed) * 100) : 0;
    const meetingsThisYear = sortedFilteredWorkbodies.reduce((sum, w) => sum + w.meetingsThisYear, 0);
    
    // Mock data for now, would come from API
    const overdueActions = Math.round(actionsAgreed * 0.15);
    
    return {
      totalWorkbodies: sortedFilteredWorkbodies.length,
      committees,
      workingGroups,
      taskForces,
      actionsCompleted,
      actionsAgreed,
      completionRate,
      meetingsThisYear,
      upcomingMeetingsCount: upcomingMeetings.length,
      overdueActions
    };
  }, [sortedFilteredWorkbodies, upcomingMeetings.length]);
  
  // Mock activity data
  const recentActivities = useMemo(() => {
    // Generate sample activities based on workbodies and meetings
    const activities = [];
    
    // Add meeting activities
    if (meetings && meetings.length) {
      for (let i = 0; i < Math.min(3, meetings.length); i++) {
        activities.push({
          id: `meeting-${i}`,
          type: 'meeting' as const,
          title: `Meeting Scheduled`,
          description: `${meetings[i].workbodyName} meeting has been scheduled.`,
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // days ago
          user: 'System',
          workbody: meetings[i].workbodyName
        });
      }
    }
    
    // Add document activities
    if (sortedFilteredWorkbodies.length) {
      for (let i = 0; i < Math.min(2, sortedFilteredWorkbodies.length); i++) {
        activities.push({
          id: `doc-${i}`,
          type: 'document' as const,
          title: `Minutes Uploaded`,
          description: `Minutes for ${sortedFilteredWorkbodies[i].name} have been uploaded.`,
          timestamp: new Date(Date.now() - (i + 3) * 24 * 60 * 60 * 1000), // days ago
          user: 'Admin User',
          workbody: sortedFilteredWorkbodies[i].name
        });
      }
    }
    
    // Add action activities
    activities.push({
      id: 'action-1',
      type: 'action' as const,
      title: 'Action Item Completed',
      description: 'Finalize annual report action has been completed.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      user: 'Coordination Team',
      workbody: 'Annual Report Committee'
    });
    
    // Add progress activity
    activities.push({
      id: 'progress-1',
      type: 'progress' as const,
      title: 'Progress Updated',
      description: 'ICT Taskforce progress has been updated to 75%.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      user: 'ICT Manager',
      workbody: 'ICT Taskforce'
    });
    
    // Sort by timestamp (newest first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [meetings, sortedFilteredWorkbodies]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading workbody statistics...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg p-6 shadow-sm">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <>
        {expiringTaskForces.length > 0 && (
          <ExpiringTaskForceAlert expiringTaskForces={expiringTaskForces} />
        )}
        
        <DashboardContainer 
          userRole={user?.role || 'user'}
          workbodiesStats={workbodiesStats}
          upcomingMeetings={upcomingMeetings}
          recentActivities={recentActivities}
        />
      </>
    </DashboardProvider>
  );
}
