import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";
import { WorkbodyDistributionChart } from "@/components/chairman/WorkbodyDistributionChart";
import { WorkbodiesOverview } from "@/components/chairman-dashboard/WorkbodiesOverview";
import { ActionCompletionChart } from "@/components/chairman/ActionCompletionChart";
import { ExpiringTaskForces } from "@/components/chairman/ExpiringTaskForces";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { EngagementChart } from "@/components/chairman/EngagementChart";
import { Button } from "@/components/ui/button";
import { Clock, PieChart, Calendar, TrendingUp, Search } from "lucide-react";
import { useWorkBodiesQuery } from "@/hooks/useWorkBodiesQuery";

export default function ChairmanDashboard() {
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();
  const { meetings } = useScheduledMeetings();
  const [typeDistribution, setTypeDistribution] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">("month");
  const [isWorkbodiesModalOpen, setIsWorkbodiesModalOpen] = useState(false);
  const [isMeetingsModalOpen, setIsMeetingsModalOpen] = useState(false);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [engagementFilter, setEngagementFilter] = useState<"all" | "committees" | "workingGroups" | "taskForces">("all");
  
  const currentYear = new Date().getFullYear();
  
  // Enhanced query with additional metrics
  const { counts } = useWorkBodiesQuery();

  useEffect(() => {
    if (workbodies.length > 0) {
      const committees = workbodies.filter(wb => wb.type === "committee").length;
      const workingGroups = workbodies.filter(wb => wb.type === "working-group").length;
      const taskForces = workbodies.filter(wb => wb.type === "task-force").length;
      
      setTypeDistribution([
        { name: "Committees", value: committees, color: "#10B981" }, // Green
        { name: "Working Groups", value: workingGroups, color: "#3B82F6" }, // Blue
        { name: "Task Forces", value: taskForces, color: "#F59E0B" } // Amber
      ]);
    }
  }, [workbodies]);

  // Generate monthly meetings data
  const monthlyMeetingsData = useMemo(() => {
    if (!meetings || meetings.length === 0) return [];
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthCounts = new Array(12).fill(0);
    
    meetings.forEach(meeting => {
      try {
        const date = new Date(meeting.date);
        if (date.getFullYear() === currentYear) {
          monthCounts[date.getMonth()]++;
        }
      } catch (e) {
        console.error("Error parsing meeting date:", e);
      }
    });
    
    return monthNames.map((month, index) => ({
      month,
      meetings: monthCounts[index]
    }));
  }, [meetings, currentYear]);

  // Calculate action completion metrics
  const totalActionsAgreed = workbodies.reduce((sum, wb) => sum + (wb.actionsAgreed || 0), 0);
  const totalActionsCompleted = workbodies.reduce((sum, wb) => sum + (wb.actionsCompleted || 0), 0);
  const completionRate = totalActionsAgreed > 0 ? Math.round((totalActionsCompleted / totalActionsAgreed) * 100) : 0;
  
  // Get upcoming meetings
  const upcomingMeetings = meetings.filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Mock engagement data for the chart
  const engagementData = [
    { month: "Jan", attendance: 85, participation: 72, actionRate: 68 },
    { month: "Feb", attendance: 82, participation: 75, actionRate: 70 },
    { month: "Mar", attendance: 88, participation: 78, actionRate: 65 },
    { month: "Apr", attendance: 90, participation: 80, actionRate: 75 },
    { month: "May", attendance: 87, participation: 76, actionRate: 72 },
    { month: "Jun", attendance: 91, participation: 82, actionRate: 78 },
  ];

  // Task forces expiring in the next 60 days
  const today = new Date();
  const sixtyDaysLater = new Date(today);
  sixtyDaysLater.setDate(today.getDate() + 60);
  
  // Find task forces expiring soon
  const expiringTaskForces = workbodies.filter(wb => 
    wb.type === 'task-force' && 
    wb.endDate && 
    new Date(wb.endDate) > today && 
    new Date(wb.endDate) <= sixtyDaysLater
  );
  
  // Find recently ended task forces
  const sixtyDaysAgo = new Date(today);
  sixtyDaysAgo.setDate(today.getDate() - 60);
  
  const endedTaskForces = workbodies.filter(wb => 
    wb.type === 'task-force' && 
    wb.endDate && 
    new Date(wb.endDate) <= today && 
    new Date(wb.endDate) >= sixtyDaysAgo
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Chairman's Dashboard</h1>
        <p className="mt-2 text-green-100">
          Comprehensive overview of all workbodies and their activities
        </p>
      </div>

      {/* KPI Cards */}
      <ChairmanStatCards 
        totalWorkbodies={workbodies.length}
        committees={counts.committees}
        workingGroups={counts.workingGroups}
        taskForces={counts.taskForces}
        meetingsThisYear={meetings.length}
        completionRate={completionRate}
        upcomingMeetingsCount={upcomingMeetings.length}
        onStatClick={(statType) => {
          if (statType === 'totalWorkbodies') setIsWorkbodiesModalOpen(true);
          else if (statType === 'meetingsThisYear') setIsMeetingsModalOpen(true);
          else if (statType === 'upcomingMeetings') setIsUpcomingModalOpen(true);
        }}
      />

      {/* Workbodies Overview */}
      <div className="mt-8">
        <WorkbodiesOverview workbodies={workbodies} isLoading={isLoadingWorkbodies} />
      </div>

      {/* Engagement Analysis and Task Force Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Engagement Analysis</CardTitle>
                <CardDescription>Trends over the last 6 months</CardDescription>
              </div>
              <div className="inline-flex items-center">
                <select 
                  className="p-1 text-sm border rounded-md"
                  value={engagementFilter}
                  onChange={(e) => setEngagementFilter(e.target.value as any)}
                >
                  <option value="all">All Bodies</option>
                  <option value="committees">Committees</option>
                  <option value="workingGroups">Working Groups</option>
                  <option value="taskForces">Task Forces</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <EngagementChart data={engagementData} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Task Force Status</CardTitle>
              <CardDescription>Task forces requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs defaultValue="expiring">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="expiring" className="flex-1">Expiring Soon</TabsTrigger>
                  <TabsTrigger value="ended" className="flex-1">Recently Ended</TabsTrigger>
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
        </div>
      </div>

      {/* Analysis & Comment box (optional) */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analysis & Comments</CardTitle>
          <CardDescription>Add your observations and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea 
            className="w-full h-32 p-2 border rounded-md resize-none" 
            placeholder="Type your analysis or comments here..."
          />
          <div className="flex justify-end mt-4">
            <Button>Add Comment</Button>
          </div>
        </CardContent>
      </Card>

      {/* Workbodies Distribution Modal */}
      <Dialog open={isWorkbodiesModalOpen} onOpenChange={setIsWorkbodiesModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Workbody Distribution</DialogTitle>
          </DialogHeader>
          <div className="h-96">
            <WorkbodyDistributionChart typeDistribution={typeDistribution} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Meetings List Modal */}
      <Dialog open={isMeetingsModalOpen} onOpenChange={setIsMeetingsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Meetings This Year</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {/* Meetings Table */}
            <div className="overflow-auto max-h-96">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Workbody</th>
                    <th className="p-2 text-left">Location</th>
                    <th className="p-2 text-left">Agenda</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="border-t hover:bg-muted/50">
                      <td className="p-2">{new Date(meeting.date).toLocaleDateString()}</td>
                      <td className="p-2">{meeting.workbodyName}</td>
                      <td className="p-2">{meeting.location}</td>
                      <td className="p-2">
                        {meeting.agendaItems && meeting.agendaItems.length > 0
                          ? meeting.agendaItems[0].substring(0, 100) + "..."
                          : "No agenda items"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upcoming Meetings Modal */}
      <Dialog open={isUpcomingModalOpen} onOpenChange={setIsUpcomingModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upcoming Meetings</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {/* Upcoming Meetings Table */}
            <div className="overflow-auto max-h-96">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Time</th>
                    <th className="p-2 text-left">Workbody</th>
                    <th className="p-2 text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingMeetings.map((meeting) => (
                    <tr key={meeting.id} className="border-t hover:bg-muted/50">
                      <td className="p-2">{new Date(meeting.date).toLocaleDateString()}</td>
                      <td className="p-2">{meeting.time}</td>
                      <td className="p-2">{meeting.workbodyName}</td>
                      <td className="p-2">{meeting.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>
        {`
        .colorful-card {
          position: relative;
          overflow: hidden;
        }
        
        .colorful-card.blue::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #3B82F6, #10B981);
        }
        
        .colorful-card.purple::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
        }
        
        .colorful-card.green::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #10B981, #3B82F6);
        }
        
        .colorful-card.amber::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #F59E0B, #EF4444);
        }
        
        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
}
