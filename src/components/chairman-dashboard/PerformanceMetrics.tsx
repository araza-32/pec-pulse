
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { ScheduledMeeting, Workbody } from "@/types";
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isWithinInterval } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceMetricsProps {
  workbodies: Workbody[];
  meetings: ScheduledMeeting[];
  timeFilter: "30days" | "quarter" | "year";
  isLoading: boolean;
}

export const PerformanceMetrics = ({ workbodies, meetings, timeFilter, isLoading }: PerformanceMetricsProps) => {
  const [metricType, setMetricType] = useState<"actions" | "meetings">("actions");
  
  // Calculate date range based on time filter
  const getDateRange = () => {
    const endDate = new Date();
    let startDate: Date;
    
    switch (timeFilter) {
      case "30days":
        startDate = subMonths(endDate, 1);
        break;
      case "quarter":
        startDate = subMonths(endDate, 3);
        break;
      case "year":
        startDate = subMonths(endDate, 12);
        break;
      default:
        startDate = subMonths(endDate, 1);
    }
    
    return { startDate, endDate };
  };
  
  // Generate action completion data
  const generateActionCompletionData = () => {
    const { startDate, endDate } = getDateRange();
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      // This is a simplified example - in a real app you'd need data that shows when actions were completed
      const actionsCompleted = Math.floor(Math.random() * 20) + 10; // Placeholder data
      const actionsTotal = Math.floor(Math.random() * 10) + actionsCompleted; // Placeholder data
      
      return {
        name: format(month, "MMM yyyy"),
        completed: actionsCompleted,
        agreed: actionsTotal,
        rate: Math.round((actionsCompleted / actionsTotal) * 100)
      };
    });
  };
  
  // Generate meetings data
  const generateMeetingsData = () => {
    const { startDate, endDate } = getDateRange();
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthMeetings = meetings.filter(meeting => {
        const meetingDate = parseISO(meeting.date);
        return isWithinInterval(meetingDate, { start: monthStart, end: monthEnd });
      });
      
      return {
        name: format(month, "MMM yyyy"),
        meetings: monthMeetings.length,
        committee: monthMeetings.filter(m => {
          const wb = workbodies.find(w => w.id === m.workbodyId);
          return wb && wb.type === "committee";
        }).length,
        workingGroup: monthMeetings.filter(m => {
          const wb = workbodies.find(w => w.id === m.workbodyId);
          return wb && wb.type === "working-group";
        }).length,
        taskForce: monthMeetings.filter(m => {
          const wb = workbodies.find(w => w.id === m.workbodyId);
          return wb && wb.type === "task-force";
        }).length
      };
    });
  };
  
  const actionCompletionData = generateActionCompletionData();
  const meetingsData = generateMeetingsData();
  
  const renderActionChart = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Skeleton className="h-64 w-full" /></div>;
    }
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={actionCompletionData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" unit="%" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="agreed" name="Actions Agreed" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="left" type="monotone" dataKey="completed" name="Actions Completed" stroke="#82ca9d" />
            <Line yAxisId="right" type="monotone" dataKey="rate" name="Completion Rate %" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderMeetingsChart = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Skeleton className="h-64 w-full" /></div>;
    }
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={meetingsData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="committee" name="Committee" stackId="a" fill="#007A33" />
            <Bar dataKey="workingGroup" name="Working Group" stackId="a" fill="#3B82F6" />
            <Bar dataKey="taskForce" name="Task Force" stackId="a" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Performance Metrics</CardTitle>
          <Tabs value={metricType} onValueChange={(v) => setMetricType(v as "actions" | "meetings")}>
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="actions">Action Completion</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {metricType === "actions" ? renderActionChart() : renderMeetingsChart()}
      </CardContent>
    </Card>
  );
};
