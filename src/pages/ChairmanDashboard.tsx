
import { useState, useEffect } from "react";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, sub } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

import { workbodies, meetingMinutes, getWorkbodyStats } from "@/data/mockData";
import { initialMeetings } from "../data/mockData";
import { WorkbodyDistributionChart } from "@/components/chairman/WorkbodyDistributionChart";
import { ActionCompletionChart } from "@/components/chairman/ActionCompletionChart";
import { MonthlyMeetingsChart } from "@/components/chairman/MonthlyMeetingsChart";
import { ChairmanUpcomingMeetings } from "@/components/chairman/ChairmanUpcomingMeetings";
import { ExpiringTaskForces } from "@/components/chairman/ExpiringTaskForces";
import { RecentMeetingMinutes } from "@/components/chairman/RecentMeetingMinutes";

// Import executive dashboard components
import { OverviewStats } from "@/components/chairman-dashboard/OverviewStats";
import { WorkbodiesOverview } from "@/components/chairman-dashboard/WorkbodiesOverview";
import { MeetingsDecisions } from "@/components/chairman-dashboard/MeetingsDecisions";
import { PerformanceMetrics } from "@/components/chairman-dashboard/PerformanceMetrics";
import { AlertsQuickAccess } from "@/components/chairman-dashboard/AlertsQuickAccess";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

export default function ChairmanDashboard() {
  // Original chairman dashboard state
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">("month");
  const stats = getWorkbodyStats();
  
  // Executive dashboard state
  const { workbodies: dbWorkbodies, isLoading: workbodiesLoading, refetch: refetchWorkbodies } = useWorkbodies();
  const { meetings: dbMeetings, isLoading: meetingsLoading, refetchMeetings } = useScheduledMeetings();
  const { toast } = useToast();
  
  const [timeFilter, setTimeFilter] = useState<"30days" | "quarter" | "year">("30days");
  const [workbodyTypeFilter, setWorkbodyTypeFilter] = useState<"all" | "committee" | "working-group" | "task-force">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [dashboardView, setDashboardView] = useState<"standard" | "executive">("standard");
  
  // Calculate workbody type distribution for pie chart
  const typeDistribution = [
    { name: "Committees", value: stats.committees },
    { name: "Working Groups", value: stats.workingGroups },
    { name: "Task Forces", value: stats.taskForces },
  ];
  
  // Calculate action completion by workbody type
  const completionByType = [
    {
      name: "Committees",
      agreed: workbodies
        .filter(w => w.type === "committee")
        .reduce((sum, w) => sum + w.actionsAgreed, 0),
      completed: workbodies
        .filter(w => w.type === "committee")
        .reduce((sum, w) => sum + w.actionsCompleted, 0),
    },
    {
      name: "Working Groups",
      agreed: workbodies
        .filter(w => w.type === "working-group")
        .reduce((sum, w) => sum + w.actionsAgreed, 0),
      completed: workbodies
        .filter(w => w.type === "working-group")
        .reduce((sum, w) => sum + w.actionsCompleted, 0),
    },
    {
      name: "Task Forces",
      agreed: workbodies
        .filter(w => w.type === "task-force")
        .reduce((sum, w) => sum + w.actionsAgreed, 0),
      completed: workbodies
        .filter(w => w.type === "task-force")
        .reduce((sum, w) => sum + w.actionsCompleted, 0),
    },
  ];
  
  // Get upcoming meetings (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const upcomingMeetings = initialMeetings?.filter(meeting => {
    const meetingDate = parseISO(meeting.date);
    return meetingDate >= today && meetingDate <= thirtyDaysFromNow;
  }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  
  // Get recently held meetings (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const recentMeetings = meetingMinutes
    .filter(minutes => {
      const meetingDate = new Date(minutes.date);
      return meetingDate >= thirtyDaysAgo && meetingDate <= today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate meetings per month for the current year
  const currentYear = new Date().getFullYear();
  const monthlyMeetings = Array.from({ length: 12 }, (_, i) => {
    const month = i;
    const start = startOfMonth(new Date(currentYear, month));
    const end = endOfMonth(new Date(currentYear, month));
    
    const count = meetingMinutes.filter(minutes => {
      const date = new Date(minutes.date);
      return isWithinInterval(date, { start, end });
    }).length;
    
    return {
      month: format(new Date(currentYear, month), "MMM"),
      meetings: count,
    };
  });
  
  // Task Forces nearing completion (expire within 30 days)
  const expiringTaskForces = workbodies
    .filter(wb => 
      wb.type === "task-force" && 
      wb.endDate && 
      new Date(wb.endDate) >= today && 
      new Date(wb.endDate) <= thirtyDaysFromNow
    )
    .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime());
  
  // Executive Dashboard Functions
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
    const filteredWorkbodies = dbWorkbodies.filter(wb => {
      const matchesType = workbodyTypeFilter === "all" || wb.type === workbodyTypeFilter;
      const matchesSearch = searchQuery === "" || 
        wb.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
    
    // Filter meetings by date range
    const filteredMeetings = dbMeetings.filter(meeting => {
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
    totalWorkbodies: filteredWorkbodies.length || stats.totalWorkbodies,
    activeMeetings: filteredMeetings.length,
    completionRate: calculateCompletionRate(filteredWorkbodies.length > 0 ? filteredWorkbodies : workbodies),
    upcomingDeadlines: calculateUpcomingDeadlines(filteredWorkbodies.length > 0 ? filteredWorkbodies : workbodies)
  };
  
  // Helper function to calculate completion rate
  function calculateCompletionRate(workbodiesData: any[]) {
    const totalActions = workbodiesData.reduce((sum, wb) => sum + (wb.actionsAgreed || 0), 0);
    const completedActions = workbodiesData.reduce((sum, wb) => sum + (wb.actionsCompleted || 0), 0);
    return totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : stats.completionRate;
  }
  
  // Helper function to calculate upcoming deadlines
  function calculateUpcomingDeadlines(workbodiesData: any[]) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return workbodiesData.filter(wb => 
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
      workbodies: filteredWorkbodies.length > 0 ? filteredWorkbodies : workbodies,
      meetings: filteredMeetings.length > 0 ? filteredMeetings : initialMeetings,
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
          <h1 className="text-3xl font-bold">Chairman's Dashboard</h1>
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
          <Select value={dashboardView} onValueChange={(value: any) => setDashboardView(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard View</SelectItem>
              <SelectItem value="executive">Executive View</SelectItem>
            </SelectContent>
          </Select>
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
            <Button variant="outline" size="icon" onClick={() => handleExport('excel')} title="Export to Excel">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleExport('pdf')} title="Export to PDF">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Overview Statistics */}
      <OverviewStats stats={calculatedStats} />

      {/* Main Dashboard Content - Toggle between views */}
      {dashboardView === "standard" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <WorkbodyDistributionChart typeDistribution={typeDistribution} />
            <ActionCompletionChart completionByType={completionByType} />
          </div>
          
          <MonthlyMeetingsChart 
            monthlyMeetings={monthlyMeetings}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            currentYear={currentYear}
          />
          
          <div className="grid gap-4 md:grid-cols-2">
            <ChairmanUpcomingMeetings upcomingMeetings={upcomingMeetings} />
            <ExpiringTaskForces expiringTaskForces={expiringTaskForces} />
          </div>
          
          <RecentMeetingMinutes recentMeetings={recentMeetings} workbodies={workbodies} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WorkbodiesOverview 
              workbodies={filteredWorkbodies.length > 0 ? filteredWorkbodies : workbodies} 
              isLoading={isLoading} 
            />
            
            <MeetingsDecisions 
              meetings={filteredMeetings.length > 0 ? filteredMeetings : dbMeetings}
              workbodies={filteredWorkbodies.length > 0 ? filteredWorkbodies : workbodies}
              isLoading={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceMetrics 
              workbodies={filteredWorkbodies.length > 0 ? filteredWorkbodies : workbodies}
              meetings={filteredMeetings.length > 0 ? filteredMeetings : dbMeetings}
              timeFilter={timeFilter}
              isLoading={isLoading}
            />
            
            <AlertsQuickAccess 
              workbodies={filteredWorkbodies.length > 0 ? filteredWorkbodies : workbodies}
              meetings={filteredMeetings.length > 0 ? filteredMeetings : dbMeetings}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}
