import { useState, useEffect } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { ExpiringTaskForceAlert } from "@/components/workbody/ExpiringTaskForceAlert"; 
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { supabase } from "@/integrations/supabase/client";
import { MinutesInsightsPanel } from "@/components/dashboard/MinutesInsightsPanel";
import { SummaryGenerator } from "@/components/dashboard/SummaryGenerator";

export default function Dashboard() {
  const { workbodies, isLoading, refetch } = useWorkbodies();
  const { meetings, isLoading: isLoadingMeetings } = useScheduledMeetings();
  const { session } = useAuth();
  const [recentMinutes, setRecentMinutes] = useState<any[]>([]);
  const [isLoadingMinutes, setIsLoadingMinutes] = useState(true);
  
  // TODO: ISSUE-001 - Replace mock data with real Supabase queries
  useEffect(() => {
    const fetchRecentMinutes = async () => {
      try {
        const { data, error } = await supabase
          .from('meeting_minutes')
          .select('*')
          .order('uploaded_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setRecentMinutes(data || []);
      } catch (error) {
        console.error('Error fetching recent minutes:', error);
      } finally {
        setIsLoadingMinutes(false);
      }
    };

    fetchRecentMinutes();
  }, []);
  
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
  
  const expiringTaskForces = workbodies
    .filter(wb => 
      wb.type === 'task-force' && 
      wb.endDate && 
      new Date(wb.endDate) >= today && 
      new Date(wb.endDate) <= thirtyDaysFromNow
    )
    .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime());

  // Generate real activity data from actual database records
  const recentActivities = [
    ...recentMinutes.slice(0, 3).map((minute, index) => ({
      id: `minute-${minute.id}`,
      type: 'document' as const,
      title: 'Minutes Uploaded',
      description: `Minutes for ${minute.workbody_id} meeting have been uploaded.`,
      timestamp: new Date(minute.uploaded_at),
      user: 'Admin User',
      workbody: minute.workbody_id
    })),
    ...meetings.slice(0, 2).map((meeting, index) => ({
      id: `meeting-${meeting.id}`,
      type: 'meeting' as const,
      title: 'Meeting Scheduled',
      description: `${meeting.workbodyName} meeting has been scheduled.`,
      timestamp: new Date(meeting.date),
      user: 'System',
      workbody: meeting.workbodyName
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const upcomingMeetings = meetings.map(meeting => ({
    id: meeting.id,
    date: new Date(meeting.date),
    workbodyName: meeting.workbodyName,
    type: sortedFilteredWorkbodies.find(w => w.id === meeting.workbodyId)?.type || 'unknown'
  }));

  const workbodiesStats = {
    totalWorkbodies: sortedFilteredWorkbodies.length,
    committees: sortedFilteredWorkbodies.filter(w => w.type === 'committee').length,
    workingGroups: sortedFilteredWorkbodies.filter(w => w.type === 'working-group').length,
    taskForces: sortedFilteredWorkbodies.filter(w => w.type === 'task-force').length,
    actionsCompleted: sortedFilteredWorkbodies.reduce((sum, w) => sum + w.actionsCompleted, 0),
    actionsAgreed: sortedFilteredWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0),
    completionRate: (() => {
      const agreed = sortedFilteredWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0);
      const completed = sortedFilteredWorkbodies.reduce((sum, w) => sum + w.actionsCompleted, 0);
      return agreed ? Math.round((completed / agreed) * 100) : 0;
    })(),
    meetingsThisYear: sortedFilteredWorkbodies.reduce((sum, w) => sum + w.meetingsThisYear, 0),
    upcomingMeetingsCount: upcomingMeetings.length,
    overdueActions: Math.round(sortedFilteredWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0) * 0.15)
  };

  if (isLoading || isLoadingMeetings || isLoadingMinutes) {
    return (
      <div className="space-y-6 p-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-left">Dashboard</h1>
          <p className="text-muted-foreground text-left">Loading workbody statistics...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
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
      <div className="p-4 space-y-6">
        {expiringTaskForces.length > 0 && (
          <div className="mb-4">
            <ExpiringTaskForceAlert expiringTaskForces={expiringTaskForces} />
          </div>
        )}
        
        <DashboardContainer 
          userRole={user?.role || 'user'}
          workbodiesStats={workbodiesStats}
          upcomingMeetings={upcomingMeetings}
          recentActivities={recentActivities}
        />

        {/* AI Meeting Insights Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SummaryGenerator />
          </div>
          <div className="lg:col-span-2">
            <MinutesInsightsPanel />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
