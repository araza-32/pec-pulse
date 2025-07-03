
import { useState } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";
import { WorkbodyTypeCards } from "@/components/chairman/WorkbodyTypeCards";
import { MeetingsList } from "@/components/chairman/MeetingsList";
import { ActionCompletionChart } from "@/components/chairman/ActionCompletionChart";
import { MonthlyMeetingsChart } from "@/components/chairman/MonthlyMeetingsChart";
import { ExpiringTaskForces } from "@/components/chairman/ExpiringTaskForces";
import { RecentMeetingMinutes } from "@/components/chairman/RecentMeetingMinutes";
import { LowCompletionWorkbodies } from "@/components/chairman/LowCompletionWorkbodies";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";
import { WorkbodyType } from "@/types";

export default function ChairmanExecutiveDashboard() {
  const { workbodies, isLoading } = useWorkbodies();
  const { meetings, isLoading: meetingsLoading } = useScheduledMeetings();
  const [activeTab, setActiveTab] = useState("overview");

  // Transform workbodies to match the expected interface
  const transformedWorkbodies = workbodies.map(wb => ({
    id: wb.id,
    code: wb.code || wb.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 3),
    name: wb.name,
    type: wb.type as WorkbodyType,
    description: wb.description,
    createdDate: wb.createdDate,
    endDate: wb.endDate,
    termsOfReference: wb.termsOfReference,
    totalMeetings: wb.totalMeetings || 0,
    meetingsThisYear: wb.meetingsThisYear || 0,
    actionsAgreed: wb.actionsAgreed || 0,
    actionsCompleted: wb.actionsCompleted || 0,
    members: wb.members || []
  }));

  // Convert ScheduledMeeting to MeetingMinutes format for RecentMeetingMinutes
  const meetingMinutes = meetings.slice(0, 5).map(meeting => ({
    id: meeting.id,
    workbodyId: meeting.workbodyId,
    workbodyName: meeting.workbodyName,
    date: meeting.date,
    location: meeting.location,
    meetingDate: meeting.date,
    venue: meeting.location,
    attendees: [],
    agenda: meeting.agendaItems || [],
    actionsAgreed: [],
    decisions: [],
    fileUrl: null
  }));

  // Calculate summary statistics
  const stats = {
    totalWorkbodies: transformedWorkbodies.length,
    committees: transformedWorkbodies.filter(w => w.type === 'committee').length,
    workingGroups: transformedWorkbodies.filter(w => w.type === 'working-group').length,
    taskForces: transformedWorkbodies.filter(w => w.type === 'task-force').length,
    totalMeetings: transformedWorkbodies.reduce((sum, w) => sum + w.totalMeetings, 0),
    meetingsThisYear: transformedWorkbodies.reduce((sum, w) => sum + w.meetingsThisYear, 0),
    totalActionsAgreed: transformedWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0),
    totalActionsCompleted: transformedWorkbodies.reduce((sum, w) => sum + w.actionsCompleted, 0)
  };

  const completionRate = stats.totalActionsAgreed > 0 
    ? Math.round((stats.totalActionsCompleted / stats.totalActionsAgreed) * 100) 
    : 0;

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chairman Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive oversight of all PEC workbodies and activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {stats.totalWorkbodies} Active Workbodies
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {completionRate}% Completion Rate
          </Badge>
        </div>
      </div>

      <ChairmanStatCards 
        totalWorkbodies={stats.totalWorkbodies}
        meetingsThisYear={stats.meetingsThisYear}
        actionsCompleted={stats.totalActionsCompleted}
        completionRate={completionRate}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WorkbodyTypeCards 
              committees={stats.committees}
              workingGroups={stats.workingGroups}
              taskForces={stats.taskForces}
            />
            <ActionCompletionChart workbodies={transformedWorkbodies} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyMeetingsChart />
            <RecentMeetingMinutes 
              recentMeetings={meetingMinutes} 
              workbodies={transformedWorkbodies}
            />
          </div>
        </TabsContent>

        <TabsContent value="meetings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MeetingsList meetings={meetings} />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Meeting Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total meetings this year:</span>
                    <span className="font-semibold">{stats.meetingsThisYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average per workbody:</span>
                    <span className="font-semibold">
                      {stats.totalWorkbodies > 0 ? Math.round(stats.meetingsThisYear / stats.totalWorkbodies) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Historical total:</span>
                    <span className="font-semibold">{stats.totalMeetings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            <LowCompletionWorkbodies workbodies={transformedWorkbodies} isLoading={isLoading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActionCompletionChart workbodies={transformedWorkbodies} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Actions agreed:</span>
                      <span className="font-semibold">{stats.totalActionsAgreed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actions completed:</span>
                      <span className="font-semibold text-green-600">{stats.totalActionsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overall completion rate:</span>
                      <span className="font-semibold">{completionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-6">
            <ExpiringTaskForces workbodies={transformedWorkbodies} />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transformedWorkbodies
                    .filter(wb => wb.type === 'task-force' && wb.endDate)
                    .map(wb => (
                      <div key={wb.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <div>
                          <p className="font-medium">{wb.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Task force ending: {wb.endDate}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-amber-100 text-amber-700">
                          Review Required
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
