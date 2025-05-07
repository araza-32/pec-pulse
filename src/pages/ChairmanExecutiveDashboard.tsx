
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

export default function ChairmanExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalWorkbodies: 0,
    meetingsThisYear: 0,
    completionRate: 0,
    upcomingMeetingsCount: 0
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch workbodies count
        const { data: workbodiesData, error: workbodiesError } = await supabase
          .from('workbodies')
          .select('*', { count: 'exact' });
          
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
        
        const { count: upcomingCount, error: upcomingError } = await supabase
          .from('scheduled_meetings')
          .select('*', { count: 'exact' })
          .gte('date', today)
          .lte('date', thirtyDaysDate);
          
        if (upcomingError) throw upcomingError;
        
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
                <WorkbodyDistributionChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyMeetingsChart />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <ChairmanUpcomingMeetings />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Forces Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpiringTaskForces />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Action Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <ActionCompletionChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Meeting Minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentMeetingMinutes />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
