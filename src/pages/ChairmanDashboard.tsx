
import { useState } from "react";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";

import { workbodies, meetingMinutes, getWorkbodyStats } from "@/data/mockData";
import { initialMeetings } from "../data/mockData";
import { WorkbodyDistributionChart } from "@/components/chairman/WorkbodyDistributionChart";
import { ActionCompletionChart } from "@/components/chairman/ActionCompletionChart";
import { MonthlyMeetingsChart } from "@/components/chairman/MonthlyMeetingsChart";
import { ChairmanUpcomingMeetings } from "@/components/chairman/ChairmanUpcomingMeetings";
import { ExpiringTaskForces } from "@/components/chairman/ExpiringTaskForces";
import { RecentMeetingMinutes } from "@/components/chairman/RecentMeetingMinutes";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";

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
      
      <ChairmanStatCards 
        totalWorkbodies={stats.totalWorkbodies} 
        meetingsThisYear={stats.meetingsThisYear}
        completionRate={stats.completionRate}
        upcomingMeetingsCount={upcomingMeetings?.length || 0}
      />
      
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
    </div>
  );
}
