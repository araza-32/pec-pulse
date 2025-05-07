
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";
import { WorkbodyDistributionChart } from "@/components/chairman/WorkbodyDistributionChart";
import { MonthlyMeetingsChart } from "@/components/chairman/MonthlyMeetingsChart";
import { ActionCompletionChart } from "@/components/chairman/ActionCompletionChart";
import { RecentMeetingMinutes } from "@/components/chairman/RecentMeetingMinutes";
import { ExpiringTaskForces } from "@/components/chairman/ExpiringTaskForces";
import { ChairmanUpcomingMeetings } from "@/components/chairman/ChairmanUpcomingMeetings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Workbody, MeetingMinutes, ScheduledMeeting } from "@/types";

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
  const currentYear = new Date().getFullYear();
  
  // Mock data for charts
  const typeDistribution = [
    { type: 'Committee', count: 12 },
    { type: 'Working Group', count: 8 },
    { type: 'Task Force', count: 5 }
  ];

  const monthlyMeetings = [
    { month: "Jan", meetings: 5 },
    { month: "Feb", meetings: 7 },
    { month: "Mar", meetings: 10 },
    { month: "Apr", meetings: 8 },
    { month: "May", meetings: 12 },
    { month: "Jun", meetings: 9 },
    { month: "Jul", meetings: 6 },
    { month: "Aug", meetings: 8 },
    { month: "Sep", meetings: 11 },
    { month: "Oct", meetings: 9 },
    { month: "Nov", meetings: 7 },
    { month: "Dec", meetings: 3 }
  ];

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
          .lte('date', thirtyDaysDate);
          
        if (upcomingError) throw upcomingError;
        setUpcomingMeetings(upcomingData || []);
        
        // Fetch task forces expiring in next 60 days
        const sixtyDaysLater = new Date();
        sixtyDaysLater.setDate(sixtyDaysLater.getDate() + 60);
        const sixtyDaysDate = sixtyDaysLater.toISOString();
        
        // Just use mock data for now
        const mockExpiringForces = workbodiesData?.filter(wb => 
          wb.type === 'task-force' && wb.end_date && new Date(wb.end_date) < sixtyDaysLater
        ) || [];
        setExpiringTaskForces(mockExpiringForces);
        
        // Fetch recent meeting minutes
        const { data: minutesData, error: minutesError } = await supabase
          .from('meeting_minutes')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);
          
        if (minutesError) throw minutesError;
        setRecentMinutes(minutesData || []);
        setWorkbodies(workbodiesData || []);
        
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
              <CardHeader>
                <CardTitle>Workbody Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkbodyDistributionChart typeDistribution={typeDistribution} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyMeetingsChart 
                  monthlyMeetings={monthlyMeetings} 
                  timeframe={timeframe} 
                  setTimeframe={setTimeframe} 
                  currentYear={currentYear}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <ChairmanUpcomingMeetings upcomingMeetings={upcomingMeetings} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Forces Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpiringTaskForces expiringTaskForces={expiringTaskForces} />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Action Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <ActionCompletionChart completionByType={completionByType} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Meeting Minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentMeetingMinutes recentMeetings={recentMinutes} workbodies={workbodies} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
