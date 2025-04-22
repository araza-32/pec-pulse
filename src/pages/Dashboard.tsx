
import { useState } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { WorkbodyDistribution } from "@/components/dashboard/WorkbodyDistribution";
import { ActionCompletionProgress } from "@/components/dashboard/ActionCompletionProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { workbodies, isLoading } = useWorkbodies();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const filteredWorkbodies = user?.role === 'secretary' 
    ? workbodies.filter(w => w.id === user.workbodyId)
    : workbodies;

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
        <OverviewStats stats={{
          totalWorkbodies: workbody.totalMeetings,
          meetingsThisYear: workbody.meetingsThisYear,
          completionRate: workbody.actionsAgreed ? 
            Math.round((workbody.actionsCompleted / workbody.actionsAgreed) * 100) : 0,
          upcomingMeetingsCount: upcomingMeetings?.length || 0
        }} />
        <ActionCompletionProgress workbodies={[workbody]} />
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

      <OverviewStats stats={{
        totalWorkbodies: stats.totalWorkbodies,
        meetingsThisYear: stats.meetingsThisYear,
        completionRate: stats.completionRate,
        upcomingMeetingsCount: upcomingMeetings?.length || 0
      }} />

      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingMeetings meetings={upcomingMeetings || []} />
        <WorkbodyDistribution data={{
          committees: stats.committees,
          workingGroups: stats.workingGroups,
          taskForces: stats.taskForces
        }} />
      </div>

      <ActionCompletionProgress workbodies={filteredWorkbodies} />
    </div>
  );
}
