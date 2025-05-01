
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScheduledMeeting, Workbody } from "@/types";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

interface MeetingsDecisionsProps {
  meetings: ScheduledMeeting[];
  workbodies: Workbody[];
  isLoading: boolean;
}

export const MeetingsDecisions = ({ meetings, workbodies, isLoading }: MeetingsDecisionsProps) => {
  const [view, setView] = useState<"chart" | "list">("chart");
  const navigate = useNavigate();
  
  // Calculate meetings by workbody type
  const meetingsByType = [
    {
      name: "Committees",
      value: meetings.filter(m => {
        const workbody = workbodies.find(w => w.id === m.workbodyId);
        return workbody && workbody.type === "committee";
      }).length
    },
    {
      name: "Working Groups",
      value: meetings.filter(m => {
        const workbody = workbodies.find(w => w.id === m.workbodyId);
        return workbody && workbody.type === "working-group";
      }).length
    },
    {
      name: "Task Forces",
      value: meetings.filter(m => {
        const workbody = workbodies.find(w => w.id === m.workbodyId);
        return workbody && workbody.type === "task-force";
      }).length
    }
  ];
  
  // Recent and upcoming meetings
  const upcomingMeetings = meetings
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  const renderMeetingsChart = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Skeleton className="h-64 w-full" /></div>;
    }
    
    const chartColors = ["#007A33", "#3B82F6", "#F59E0B"];
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={meetingsByType}
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
            <Tooltip formatter={(value) => [`${value} meetings`, 'Count']} />
            <Legend />
            <Bar dataKey="value" name="Meetings" fill="#007A33" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderMeetingsList = () => {
    if (isLoading) {
      return Array(5).fill(0).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        </TableRow>
      ));
    }
    
    return upcomingMeetings.map(meeting => (
      <TableRow key={meeting.id} className="cursor-pointer hover:bg-slate-100">
        <TableCell>{format(parseISO(meeting.date), "MMM dd, yyyy")}</TableCell>
        <TableCell className="font-medium">{meeting.workbodyName}</TableCell>
        <TableCell>{meeting.time}</TableCell>
        <TableCell>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/calendar")}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Meetings & Decisions</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as "chart" | "list")}>
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {view === "chart" ? (
          renderMeetingsChart()
        ) : (
          <div className="overflow-auto max-h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Workbody</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderMeetingsList()}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-2 text-right">
          <Button variant="link" size="sm" onClick={() => navigate("/calendar")}>
            View all meetings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
