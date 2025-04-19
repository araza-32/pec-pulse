import { 
  Users, 
  FileCheck, 
  CalendarClock, 
  CheckSquare,
  BookOpen,
  FileSpreadsheet,
  GitMerge,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const { workbodies, isLoading } = useWorkbodies();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const filteredWorkbodies = user?.role === 'secretary' 
    ? workbodies.filter(w => w.id === user.workbodyId)
    : workbodies;
  
  const stats = {
    totalWorkbodies: filteredWorkbodies.length,
    committees: filteredWorkbodies.filter(w => w.type === 'committee').length,
    workingGroups: filteredWorkbodies.filter(w => w.type === 'working-group').length,
    taskForces: filteredWorkbodies.filter(w => w.type === 'task-force').length,
    totalMeetings: filteredWorkbodies.reduce((sum, w) => sum + w.totalMeetings, 0),
    meetingsThisYear: filteredWorkbodies.reduce((sum, w) => sum + w.meetingsThisYear, 0),
    completionRate: filteredWorkbodies.length ? Math.round(
      (filteredWorkbodies.reduce((sum, w) => sum + w.actionsCompleted, 0) / 
       filteredWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0)) * 100
    ) : 0
  };

  const initialMeetings = [
    {
      id: "meeting-1",
      workbodyId: "committee-1",
      workbodyName: "Education Committee",
      date: "2025-05-10",
      time: "10:00",
      location: "PEC Headquarters, Islamabad",
      agendaItems: [
        "Review of Accreditation Process",
        "Curriculum Standardization",
        "New Engineering Programs Approval",
      ],
    },
    {
      id: "meeting-2",
      workbodyId: "workgroup-1",
      workbodyName: "Digital Transformation Working Group",
      date: "2025-04-22",
      time: "14:30",
      location: "Virtual Meeting",
      agendaItems: [
        "Online Portal Progress Update",
        "Mobile App Development Status",
        "Digital Verification System Implementation",
      ],
    },
  ];
  
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const upcomingMeetings = initialMeetings?.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    return meetingDate >= today && meetingDate <= thirtyDaysFromNow;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading workbody statistics...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (user?.role === 'secretary') {
    const workbody = filteredWorkbodies[0];
    if (!workbody) {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">No workbody assigned.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{workbody.name}</h1>
          <p className="text-muted-foreground">
            Workbody Overview and Statistics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Meetings"
            value={workbody.totalMeetings}
            icon={CalendarClock}
            colorClass="bg-pec-gold"
          />
          <StatCard
            title="Meetings This Year"
            value={workbody.meetingsThisYear}
            icon={BookOpen}
            colorClass="bg-blue-500"
          />
          <StatCard
            title="Actions Agreed"
            value={workbody.actionsAgreed}
            icon={FileCheck}
            colorClass="bg-pec-green"
          />
          <StatCard
            title="Actions Completed"
            value={workbody.actionsCompleted}
            icon={CheckSquare}
            colorClass="bg-purple-500"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded bg-pec-green p-2 text-white">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p>Actions Completed</p>
                    <p className="font-bold">
                      {workbody.actionsCompleted} / {workbody.actionsAgreed}
                    </p>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-pec-green"
                      style={{ 
                        width: `${workbody.actionsAgreed ? 
                          (workbody.actionsCompleted / workbody.actionsAgreed) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PEC Pulse</h1>
        <p className="text-muted-foreground">
          Organizational Overview & Analytics
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
          title="Action Completion"
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
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {upcomingMeetings && upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.map(meeting => (
                  <div 
                    key={meeting.id} 
                    className="flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="bg-blue-100 rounded p-2 text-blue-700 flex-shrink-0">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{meeting.workbodyName}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(meeting.date)} at {meeting.time}
                      </div>
                      <div className="mt-2">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => {/* Add view agenda handler */}}
                        >
                          View Agenda <ChevronRight className="h-4 w-4 inline" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming meetings scheduled.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workbody Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Committees', value: stats.committees },
                      { name: 'Working Groups', value: stats.workingGroups },
                      { name: 'Task Forces', value: stats.taskForces }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#F59E0B" />
                    <Cell fill="#3B82F6" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action Completion Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                barSize={10}
                data={[
                  {
                    name: 'Committees',
                    value: (workbodies
                      .filter(w => w.type === 'committee')
                      .reduce((acc, curr) => acc + curr.actionsCompleted, 0) /
                      workbodies
                        .filter(w => w.type === 'committee')
                        .reduce((acc, curr) => acc + curr.actionsAgreed, 0)) * 100,
                    fill: '#10B981'
                  },
                  {
                    name: 'Working Groups',
                    value: (workbodies
                      .filter(w => w.type === 'working-group')
                      .reduce((acc, curr) => acc + curr.actionsCompleted, 0) /
                      workbodies
                        .filter(w => w.type === 'working-group')
                        .reduce((acc, curr) => acc + curr.actionsAgreed, 0)) * 100,
                    fill: '#F59E0B'
                  },
                  {
                    name: 'Task Forces',
                    value: (workbodies
                      .filter(w => w.type === 'task-force')
                      .reduce((acc, curr) => acc + curr.actionsCompleted, 0) /
                      workbodies
                        .filter(w => w.type === 'task-force')
                        .reduce((acc, curr) => acc + curr.actionsAgreed, 0)) * 100,
                    fill: '#3B82F6'
                  }
                ]}
              >
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="value"
                />
                <Legend />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
