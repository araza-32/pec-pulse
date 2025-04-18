
import { useState } from "react";
import {
  Users,
  CalendarClock,
  FileText,
  CheckSquare,
  BarChart4,
  PieChart,
  Activity,
  AlertTriangle,
  Clock,
  Mail,
  BookOpen,
} from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { workbodies, meetingMinutes, getWorkbodyStats } from "@/data/mockData";
import { initialMeetings } from "../data/mockData";  // We'll need to export these from mockData

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ChairmanDashboard() {
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">("month");
  
  const stats = getWorkbodyStats();
  
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chairman's Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of all PEC workbodies and their performance
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Workbodies"
          value={stats.totalWorkbodies}
          icon={Users}
          colorClass="bg-pec-green"
        />
        <StatCard
          title="Meetings This Year"
          value={stats.meetingsThisYear}
          icon={CalendarClock}
          colorClass="bg-pec-gold"
        />
        <StatCard
          title="Action Completion Rate"
          value={`${stats.completionRate}%`}
          icon={CheckSquare}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Upcoming Meetings"
          value={upcomingMeetings?.length || 0}
          icon={BookOpen}
          colorClass="bg-purple-500"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Workbody Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Actions Completion Rate by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={completionByType}
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
                  <Bar name="Actions Agreed" dataKey="agreed" fill="#8884d8" />
                  <Bar name="Actions Completed" dataKey="completed" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Monthly Meetings in {currentYear}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeframe === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("month")}
              >
                Month
              </Button>
              <Button
                variant={timeframe === "quarter" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("quarter")}
              >
                Quarter
              </Button>
              <Button
                variant={timeframe === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("year")}
              >
                Year
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyMeetings}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar name="Meetings" dataKey="meetings" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMeetings && upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.slice(0, 5).map(meeting => (
                  <div key={meeting.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="bg-blue-100 rounded p-2 text-blue-700">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{meeting.workbodyName}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(parseISO(meeting.date), "EEEE, MMM d")} at {meeting.time}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="inline-flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {meeting.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingMeetings.length > 5 && (
                  <Button variant="link" className="mt-2">
                    View all {upcomingMeetings.length} upcoming meetings
                  </Button>
                )}
              </div>
            ) : (
              <p>No upcoming meetings scheduled in the next 30 days.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Task Forces Nearing Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringTaskForces.length > 0 ? (
              <div className="space-y-4">
                {expiringTaskForces.map(taskForce => (
                  <div key={taskForce.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="bg-amber-100 rounded p-2 text-amber-700">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{taskForce.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Expires on {format(new Date(taskForce.endDate!), "MMMM d, yyyy")}
                      </div>
                      <div className="text-sm mt-1">
                        <Badge variant="outline" className="bg-amber-50 text-amber-800">
                          {getDaysRemaining(new Date(taskForce.endDate!))} days remaining
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No task forces are expiring in the next 30 days.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Recent Meeting Minutes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentMeetings.length > 0 ? (
            <div className="space-y-4">
              {recentMeetings.slice(0, 5).map(minutes => {
                const workbody = workbodies.find(wb => wb.id === minutes.workbodyId);
                return (
                  <div key={minutes.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="bg-green-100 rounded p-2 text-green-700">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{workbody?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Meeting on {format(new Date(minutes.date), "MMMM d, yyyy")}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="inline-flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {minutes.location}
                        </span>
                      </div>
                      <Button variant="link" className="h-auto p-0 text-sm mt-1">
                        View Minutes
                      </Button>
                    </div>
                  </div>
                );
              })}
              {recentMeetings.length > 5 && (
                <Button variant="link" className="mt-2">
                  View all {recentMeetings.length} recent meetings
                </Button>
              )}
            </div>
          ) : (
            <p>No meeting minutes uploaded in the last 30 days.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to calculate remaining days
function getDaysRemaining(endDate: Date): number {
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
