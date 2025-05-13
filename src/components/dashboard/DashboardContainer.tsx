
import { useState } from "react";
import { OverviewStats } from "./OverviewStats";
import { DashboardHero } from "./DashboardHero";
import { MeetingsOverview } from "./MeetingsOverview";
import { ActionItemsTracking } from "./ActionItemsTracking";
import { ActivityFeed } from "./ActivityFeed";
import { useNavigate } from "react-router-dom";

interface DashboardContainerProps {
  userRole: string;
  workbodiesStats: {
    totalWorkbodies: number;
    committees: number;
    workingGroups: number;
    taskForces: number;
    meetingsThisYear: number;
    completionRate: number;
    upcomingMeetingsCount: number;
    actionsCompleted: number;
    actionsAgreed: number;
    overdueActions: number;
  };
  upcomingMeetings: Array<{
    id: string;
    date: Date;
    workbodyName: string;
    type: string;
  }>;
  recentActivities?: Array<{
    id: string;
    type: 'meeting' | 'document' | 'member' | 'action' | 'progress';
    title: string;
    description: string;
    timestamp: Date;
    user: string;
    workbody?: string;
  }>;
}

export function DashboardContainer({
  userRole,
  workbodiesStats,
  upcomingMeetings,
  recentActivities = []
}: DashboardContainerProps) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleWorkbodyTypeClick = (type: string) => {
    setActiveDialog(`${type}Dialog`);
  };
  
  const handleStatClick = (statType: string) => {
    setActiveDialog(`${statType}Dialog`);
  };
  
  const handleViewAllMeetings = () => {
    navigate('/calendar');
  };
  
  const handleViewAllActions = () => {
    navigate('/reports');
  };
  
  const handleViewAllActivity = () => {
    navigate('/reports/activity');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow-sm mb-6 border-l-4 border-pec-green">
        <h1 className="text-3xl font-bold">PEC Pulse Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive overview of all workbodies, meetings and action items across Pakistan Engineering Council.
        </p>
      </div>

      <OverviewStats 
        stats={{
          totalWorkbodies: workbodiesStats.totalWorkbodies,
          meetingsThisYear: workbodiesStats.meetingsThisYear,
          completionRate: workbodiesStats.completionRate,
          upcomingMeetingsCount: workbodiesStats.upcomingMeetingsCount
        }}
        onStatClick={handleStatClick}
      />

      <DashboardHero 
        stats={{
          committees: workbodiesStats.committees,
          workingGroups: workbodiesStats.workingGroups,
          taskForces: workbodiesStats.taskForces
        }}
        onWorkbodyTypeClick={handleWorkbodyTypeClick}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <MeetingsOverview
            meetings={upcomingMeetings}
            meetingsThisYear={workbodiesStats.meetingsThisYear}
            onViewAllClick={handleViewAllMeetings}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <ActionItemsTracking
            completionRate={workbodiesStats.completionRate}
            total={workbodiesStats.actionsAgreed}
            completed={workbodiesStats.actionsCompleted}
            overdue={workbodiesStats.overdueActions}
            onViewAllClick={handleViewAllActions}
          />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <ActivityFeed
            activities={recentActivities}
            onViewAllClick={handleViewAllActivity}
          />
        </div>
      </div>
    </div>
  );
}
