
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";
import { ActionCompletionChart } from "@/components/chairman/ActionCompletionChart";
import { RecentMeetingMinutes } from "@/components/chairman/RecentMeetingMinutes";
import { ExpiringTaskForces } from "@/components/chairman/ExpiringTaskForces";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import { Workbody, MeetingMinutes, ScheduledMeeting, WorkbodyType } from "@/types";
import { WorkbodyTypeNumbers } from "@/components/chairman/WorkbodyTypeNumbers";
import { ChairmanAnalysisSection } from "@/components/chairman/ChairmanAnalysisSection";
import { useNavigate } from "react-router-dom";
import { format, parseISO, subMonths } from "date-fns";
import { LowCompletionWorkbodies } from "@/components/chairman/LowCompletionWorkbodies";
import { MeetingsDecisions } from "@/components/chairman-dashboard/MeetingsDecisions";
import { AlertsQuickAccess } from "@/components/chairman-dashboard/AlertsQuickAccess";
import { EngagementTrendsChart } from "@/components/chairman/EngagementTrendsChart";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";

export default function ChairmanExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalWorkbodies: 0,
    meetingsThisYear: 0,
    completionRate: 0,
    upcomingMeetingsCount: 0
  });
  const [workbodies, setWorkbodies] = useState<Workbody[]>([]);
  const { meetings: upcomingMeetings, isLoading: isLoadingMeetings } = useScheduledMeetings();
  const [expiringTaskForces, setExpiringTaskForces] = useState<Workbody[]>([]);
  const [endedTaskForces, setEndedTaskForces] = useState<Workbody[]>([]);
  const [recentMinutes, setRecentMinutes] = useState<MeetingMinutes[]>([]);
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">("month");
  const [workbodyCounts, setWorkbodyCounts] = useState({
    committees: 0,
    workingGroups: 0,
    taskForces: 0
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const completionByType = [
    { name: "Committee", agreed: 45, completed: 38 },
    { name: "Working Group", agreed: 32, completed: 25 },
    { name: "Task Force", agreed: 28, completed: 22 }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch workbodies count
        const { data: workbodiesData, error: workbodiesError } = await supabase
          .from('workbodies')
          .select('*');
          
        if (workbodiesError) throw workbodiesError;
        
        // Map workbody data to our Workbody type
        const mappedWorkbodies: Workbody[] = (workbodiesData || []).map(wb => ({
          id: wb.id,
          name: wb.name,
          type: wb.type as WorkbodyType,
          description: wb.description || undefined,
          createdDate: wb.created_date,
          endDate: wb.end_date || undefined,
          termsOfReference: wb.terms_of_reference || undefined,
          totalMeetings: wb.total_meetings || 0,
          meetingsThisYear: wb.meetings_this_year || 0,
          actionsAgreed: wb.actions_agreed || 0,
          actionsCompleted: wb.actions_completed || 0,
          members: [] // We'll fetch members separately if needed
        }));
        
        // Calculate workbody type counts
        const committees = mappedWorkbodies.filter(wb => wb.type === 'committee').length;
        const workingGroups = mappedWorkbodies.filter(wb => wb.type === 'working-group').length;
        const taskForces = mappedWorkbodies.filter(wb => wb.type === 'task-force').length;
        
        setWorkbodyCounts({
          committees,
          workingGroups,
          taskForces
        });
        
        // Fetch meetings from current year
        const currentYear = new Date().getFullYear();
        const startOfYear = `${currentYear}-01-01`;
        const endOfYear = `${currentYear}-12-31`;
        
        const { count: meetingsCount, error: meetingsError } = await supabase
          .from('scheduled_meetings')
          .select('*', { count: 'exact' })
          .gte('date', startOfYear)
          .lte('date', endOfYear);
          
        if (meetingsError) throw meetingsError;
        
        // Find task forces expiring in next 60 days
        const today = new Date();
        const sixtyDaysLater = new Date();
        sixtyDaysLater.setDate(sixtyDaysLater.getDate() + 60);
        const sixtyDaysDate = sixtyDaysLater.toISOString();
        
        // Filter for expiring task forces
        const expiringTFs = mappedWorkbodies.filter(wb => 
          wb.type === 'task-force' && 
          wb.endDate && 
          new Date(wb.endDate) > today &&
          new Date(wb.endDate) <= sixtyDaysLater
        );
        
        setExpiringTaskForces(expiringTFs);
        
        // Filter for ended task forces (within the last 60 days)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const endedTFs = mappedWorkbodies.filter(wb => 
          wb.type === 'task-force' && 
          wb.endDate && 
          new Date(wb.endDate) <= today &&
          new Date(wb.endDate) >= sixtyDaysAgo
        );
        
        setEndedTaskForces(endedTFs);
        
        setWorkbodies(mappedWorkbodies);
        
        // Fetch recent meeting minutes
        const { data: minutesData, error: minutesError } = await supabase
          .from('meeting_minutes')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);
          
        if (minutesError) throw minutesError;
        
        // Map minutes data to our MeetingMinutes type
        const mappedMinutes: MeetingMinutes[] = (minutesData || []).map(item => ({
          id: item.id,
          workbodyId: item.workbody_id,
          workbodyName: getWorkbodyName(item.workbody_id, mappedWorkbodies),
          meetingDate: item.date,
          date: item.date,  // For backward compatibility
          venue: item.location,
          location: item.location,  // For backward compatibility
          attendees: [],
          agenda: item.agenda_items || [],
          agendaItems: item.agenda_items || [],
          minutes: [],
          actionItems: [],
          actionsAgreed: item.actions_agreed || [],
          decisions: [],
          createdAt: item.uploaded_at,
          updatedAt: item.uploaded_at,
          documentUrl: item.file_url,
          uploadedAt: item.uploaded_at,
          uploadedBy: item.uploaded_by || ""
        }));
        
        setRecentMinutes(mappedMinutes);
        
        // For now using mock data for completion rate (would ideally come from action items)
        const completionRate = 78;
        
        setDashboardData({
          totalWorkbodies: workbodiesData?.length || 0,
          meetingsThisYear: meetingsCount || 0,
          completionRate,
          upcomingMeetingsCount: upcomingMeetings?.length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Dashboard Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast, upcomingMeetings]);

  // Helper function to get workbody name
  const getWorkbodyName = (workbodyId: string, workbodies: Workbody[]): string => {
    const workbody = workbodies.find(wb => wb.id === workbodyId);
    return workbody?.name || "Unknown Workbody";
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-pec-green" />
        </div>
      ) : (
        <>
          <ChairmanStatCards 
            totalWorkbodies={dashboardData.totalWorkbodies}
            meetingsThisYear={dashboardData.meetingsThisYear}
            completionRate={dashboardData.completionRate}
            upcomingMeetingsCount={dashboardData.upcomingMeetingsCount}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Reduced size workbody distribution card */}
            <Card className="md:col-span-1">
              <CardHeader className="text-left">
                <CardTitle>Workbody Types</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkbodyTypeNumbers counts={workbodyCounts} />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="text-left">
                <CardTitle>Action Completion</CardTitle>
                <CardDescription>Performance by workbody type</CardDescription>
              </CardHeader>
              <CardContent>
                <ActionCompletionChart completionByType={completionByType} />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Task Force section with tabs for expired and expiring */}
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 text-left">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Task Force Status
                  </CardTitle>
                  <CardDescription>Task forces requiring attention</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="expiring">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="expiring" className="flex-1">Expiring Soon ({expiringTaskForces.length})</TabsTrigger>
                    <TabsTrigger value="ended" className="flex-1">Recently Ended ({endedTaskForces.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="expiring" className="mt-0">
                    <ExpiringTaskForces expiringTaskForces={expiringTaskForces} />
                  </TabsContent>
                  <TabsContent value="ended" className="mt-0">
                    <ExpiringTaskForces expiringTaskForces={endedTaskForces} showEnded={true} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Alerts & Quick Access */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-left">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alerts & Quick Access
                </CardTitle>
                <CardDescription>Important items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsQuickAccess 
                  workbodies={workbodies} 
                  meetings={upcomingMeetings} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
            
            {/* Enhanced Engagement Trends */}
            <Card className="lg:col-span-1">
              <CardContent className="p-0">
                <EngagementTrendsChart workbodies={workbodies} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
          
          {/* Meetings & Decisions Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="text-left">
                <CardTitle>Meetings & Decisions</CardTitle>
                <CardDescription>Meetings by workbody type</CardDescription>
              </CardHeader>
              <CardContent>
                <MeetingsDecisions 
                  meetings={upcomingMeetings} 
                  workbodies={workbodies} 
                  isLoading={isLoading || isLoadingMeetings} 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-left">
                <CardTitle>Recent Meeting Minutes</CardTitle>
                <CardDescription>Latest workbody meeting records</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentMeetingMinutes recentMeetings={recentMinutes} workbodies={workbodies} />
              </CardContent>
            </Card>
          </div>
          
          {/* Add the Low Completion Workbodies card */}
          <div className="mt-6">
            <LowCompletionWorkbodies 
              workbodies={workbodies} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-6">
            <ChairmanAnalysisSection />
          </div>
        </>
      )}
    </>
  );
}
