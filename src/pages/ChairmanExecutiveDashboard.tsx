
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";
import { ActionCompletionChart } from "@/components/chairman/ActionCompletionChart";
import { RecentMeetingMinutes } from "@/components/chairman/RecentMeetingMinutes";
import { ExpiringTaskForces } from "@/components/chairman/ExpiringTaskForces";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, CalendarClock } from "lucide-react";
import { Workbody, MeetingMinutes, ScheduledMeeting, WorkbodyType } from "@/types";
import { WorkbodyTypeNumbers } from "@/components/chairman/WorkbodyTypeNumbers";
import { ChairmanAnalysisSection } from "@/components/chairman/ChairmanAnalysisSection";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

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
  const [upcomingMeetings, setUpcomingMeetings] = useState<ScheduledMeeting[]>([]);
  const [expiringTaskForces, setExpiringTaskForces] = useState<Workbody[]>([]);
  const [recentMinutes, setRecentMinutes] = useState<MeetingMinutes[]>([]);
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">("month");
  const [workbodyCounts, setWorkbodyCounts] = useState({
    committees: 0,
    workingGroups: 0,
    taskForces: 0
  });
  const navigate = useNavigate();
  
  const currentYear = new Date().getFullYear();
  
  // Mock data for charts
  const completionByType = [
    { name: "Committee", agreed: 45, completed: 38 },
    { name: "Working Group", agreed: 32, completed: 25 },
    { name: "Task Force", agreed: 28, completed: 22 }
  ];

  const { toast } = useToast();
  
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
        
        // Fetch upcoming meetings (next 30 days)
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
        const thirtyDaysDate = thirtyDaysLater.toISOString().split('T')[0];
        
        const { data: upcomingData, count: upcomingCount, error: upcomingError } = await supabase
          .from('scheduled_meetings')
          .select('*')
          .gte('date', today)
          .lte('date', thirtyDaysDate)
          .order('date', { ascending: true });
          
        if (upcomingError) throw upcomingError;
        
        // Map upcoming meetings to our ScheduledMeeting type
        const mappedUpcomingMeetings: ScheduledMeeting[] = (upcomingData || []).map(meeting => ({
          id: meeting.id,
          workbodyId: meeting.workbody_id,
          workbodyName: meeting.workbody_name,
          date: meeting.date,
          time: meeting.time,
          location: meeting.location,
          agendaItems: meeting.agenda_items || [],
          notificationFile: meeting.notification_file_name,
          notificationFilePath: meeting.notification_file_path,
          agendaFile: meeting.agenda_file_name || null,
          agendaFilePath: meeting.agenda_file_path || null
        }));
        
        setUpcomingMeetings(mappedUpcomingMeetings);
        setWorkbodies(mappedWorkbodies);
        
        // Fetch task forces expiring in next 60 days
        const sixtyDaysLater = new Date();
        sixtyDaysLater.setDate(sixtyDaysLater.getDate() + 60);
        const sixtyDaysDate = sixtyDaysLater.toISOString();
        
        // Just use filter for expiring task forces
        const expiringTaskForces = mappedWorkbodies.filter(wb => 
          wb.type === 'task-force' && wb.endDate && new Date(wb.endDate) < sixtyDaysLater
        );
        
        setExpiringTaskForces(expiringTaskForces);
        
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
          upcomingMeetingsCount: upcomingCount || 0
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
  }, [toast]);

  // Helper function to get workbody name
  const getWorkbodyName = (workbodyId: string, workbodies: Workbody[]): string => {
    const workbody = workbodies.find(wb => wb.id === workbodyId);
    return workbody?.name || "Unknown Workbody";
  };

  // Function to handle scheduling a new meeting
  const handleScheduleMeeting = () => {
    navigate('/calendar');
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="text-left">
                <CardTitle>Workbody Distribution</CardTitle>
                <CardDescription>Breakdown of workbody types</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkbodyTypeNumbers counts={workbodyCounts} />
              </CardContent>
            </Card>
            
            <Card>
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
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2 text-left">
                <div>
                  <CardTitle>Upcoming Meetings</CardTitle>
                  <CardDescription>Next scheduled workbody meetings</CardDescription>
                </div>
                <Button 
                  onClick={handleScheduleMeeting}
                  className="bg-pec-green hover:bg-pec-green/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMeetings.map(meeting => (
                      <div 
                        key={meeting.id} 
                        className="flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors animate-fade-in"
                      >
                        <div className="bg-blue-100 rounded p-2 text-blue-700 flex-shrink-0">
                          <CalendarClock className="h-5 w-5" />
                        </div>
                        <div className="flex-grow text-left">
                          <div className="font-medium">{meeting.workbodyName || "Unnamed Meeting"}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(parseISO(meeting.date), 'MMMM d, yyyy')} at {meeting.time.substring(0, 5)}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Location: {meeting.location}
                          </div>
                          {meeting.agendaItems && meeting.agendaItems.length > 0 && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Agenda:</span> {meeting.agendaItems.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-left text-muted-foreground py-6">
                    <p>No upcoming meetings in the next 30 days.</p>
                    <Button 
                      variant="link" 
                      onClick={handleScheduleMeeting}
                      className="mt-2 p-0"
                    >
                      Schedule a new meeting
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-left">
                <CardTitle>Task Forces Expiring Soon</CardTitle>
                <CardDescription>Task forces ending within 60 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpiringTaskForces expiringTaskForces={expiringTaskForces} />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="text-left">
                <CardTitle>Recent Meeting Minutes</CardTitle>
                <CardDescription>Latest workbody meeting records</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentMeetingMinutes recentMeetings={recentMinutes} workbodies={workbodies} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-left">
                <CardTitle>Analysis & Comments</CardTitle>
                <CardDescription>Admin/Coordination notes for Chairman's review</CardDescription>
              </CardHeader>
              <CardContent>
                <ChairmanAnalysisSection />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
