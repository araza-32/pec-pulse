
import { useState, useEffect } from "react";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, sub } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkbodiesOverview } from "@/components/chairman-dashboard/WorkbodiesOverview";
import { MeetingsDecisions } from "@/components/chairman-dashboard/MeetingsDecisions";
import { PerformanceMetrics } from "@/components/chairman-dashboard/PerformanceMetrics";
import { AlertsQuickAccess } from "@/components/chairman-dashboard/AlertsQuickAccess";
import { Separator } from "@/components/ui/separator";
import { OverviewStats } from "@/components/chairman-dashboard/OverviewStats";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

export default function ChairmanExecutiveDashboard() {
  const { workbodies, isLoading: workbodiesLoading, refetch: refetchWorkbodies } = useWorkbodies();
  const { meetings, isLoading: meetingsLoading, refetchMeetings } = useScheduledMeetings();
  const { toast } = useToast();
  
  const [timeFilter, setTimeFilter] = useState<"30days" | "quarter" | "year">("30days");
  const [workbodyTypeFilter, setWorkbodyTypeFilter] = useState<"all" | "committee" | "working-group" | "task-force">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Calculate filtered data based on time filter
  const getFilteredData = () => {
    const today = new Date();
    let startDate: Date;
    
    switch(timeFilter) {
      case "30days":
        startDate = sub(today, { days: 30 });
        break;
      case "quarter":
        startDate = sub(today, { months: 3 });
        break;
      case "year":
        startDate = sub(today, { years: 1 });
        break;
      default:
        startDate = sub(today, { days: 30 });
    }
    
    // Filter workbodies by type if needed
    const filteredWorkbodies = workbodies.filter(wb => {
      const matchesType = workbodyTypeFilter === "all" || wb.type === workbodyTypeFilter;
      const matchesSearch = searchQuery === "" || 
        wb.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
    
    // Filter meetings by date range
    const filteredMeetings = meetings.filter(meeting => {
      const meetingDate = parseISO(meeting.date);
      return meetingDate >= startDate && meetingDate <= today;
    });
    
    return {
      workbodies: filteredWorkbodies,
      meetings: filteredMeetings
    };
  };
  
  const { workbodies: filteredWorkbodies, meetings: filteredMeetings } = getFilteredData();
  
  // Calculate high-level stats
  const calculatedStats = {
    totalWorkbodies: filteredWorkbodies.length,
    activeMeetings: filteredMeetings.length,
    completionRate: calculateCompletionRate(filteredWorkbodies),
    upcomingDeadlines: calculateUpcomingDeadlines(filteredWorkbodies)
  };
  
  // Helper function to calculate completion rate
  function calculateCompletionRate(workbodies: any[]) {
    const totalActions = workbodies.reduce((sum, wb) => sum + (wb.actionsAgreed || 0), 0);
    const completedActions = workbodies.reduce((sum, wb) => sum + (wb.actionsCompleted || 0), 0);
    return totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;
  }
  
  // Helper function to calculate upcoming deadlines
  function calculateUpcomingDeadlines(workbodies: any[]) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return workbodies.filter(wb => 
      wb.type === "task-force" && 
      wb.endDate && 
      new Date(wb.endDate) <= thirtyDaysFromNow
    ).length;
  }
  
  // Refresh all data
  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchWorkbodies(),
        refetchMeetings()
      ]);
      
      setLastRefreshed(new Date());
      
      toast({
        title: "Dashboard Refreshed",
        description: "Latest data has been loaded",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to load latest data",
        variant: "destructive"
      });
    }
  };
  
  // Export dashboard data
  const handleExport = (format: 'excel' | 'pdf') => {
    const dashboardData = {
      workbodies: filteredWorkbodies,
      meetings: filteredMeetings,
      stats: calculatedStats
    };
    
    if (format === 'excel') {
      exportToExcel(dashboardData, 'Chairman_Dashboard_Export');
    } else {
      exportToPDF(dashboardData, 'Chairman_Dashboard_Export');
    }
    
    toast({
      title: "Export Successful",
      description: `Dashboard data exported as ${format.toUpperCase()}`,
    });
  };
  
  // Auto-refresh effect (every 15 mins)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      handleRefresh();
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Loading state
  const isLoading = workbodiesLoading || meetingsLoading;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Chairman's Executive Dashboard</h1>
          <p className="text-muted-foreground">
            PEC Pulse: Performance visibility and operational oversight
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            Last refreshed: {format(lastRefreshed, 'MMM d, yyyy HH:mm')}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 pb-4">
        <div className="flex-1">
          <Input 
            placeholder="Search workbodies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        
        <div className="flex flex-row gap-2">
          <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={workbodyTypeFilter} onValueChange={(value: any) => setWorkbodyTypeFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Workbody Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="committee">Committees</SelectItem>
              <SelectItem value="working-group">Working Groups</SelectItem>
              <SelectItem value="task-force">Task Forces</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Overview Statistics */}
      <OverviewStats stats={calculatedStats} />
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkbodiesOverview 
          workbodies={filteredWorkbodies} 
          isLoading={isLoading} 
        />
        
        <MeetingsDecisions 
          meetings={filteredMeetings}
          workbodies={filteredWorkbodies}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceMetrics 
          workbodies={filteredWorkbodies}
          meetings={filteredMeetings}
          timeFilter={timeFilter}
          isLoading={isLoading}
        />
        
        <AlertsQuickAccess 
          workbodies={filteredWorkbodies}
          meetings={filteredMeetings}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
