
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScheduledMeeting, Workbody } from "@/types";
import { format, parseISO, addDays } from "date-fns";
import { AlertCircle, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface AlertsQuickAccessProps {
  workbodies: Workbody[];
  meetings: ScheduledMeeting[];
  isLoading: boolean;
}

export const AlertsQuickAccess = ({ workbodies, meetings, isLoading }: AlertsQuickAccessProps) => {
  const navigate = useNavigate();
  
  // Identify task forces nearing expiry (within next 30 days)
  const expiringTaskForces = workbodies
    .filter(wb => 
      wb.type === "task-force" && 
      wb.endDate && 
      new Date(wb.endDate) <= addDays(new Date(), 30) &&
      new Date(wb.endDate) >= new Date()
    )
    .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime());
  
  // Identify upcoming meetings (next 7 days)
  const upcomingMeetings = meetings
    .filter(m => {
      const meetingDate = parseISO(m.date);
      const today = new Date();
      const nextWeek = addDays(today, 7);
      return meetingDate >= today && meetingDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Identify low completion workbodies (completion rate < 50%)
  const lowCompletionWorkbodies = workbodies
    .filter(wb => {
      if (!wb.actionsAgreed || wb.actionsAgreed === 0) return false;
      const completionRate = (wb.actionsCompleted || 0) / wb.actionsAgreed * 100;
      return completionRate < 50;
    })
    .sort((a, b) => {
      const rateA = a.actionsAgreed ? (a.actionsCompleted || 0) / a.actionsAgreed : 0;
      const rateB = b.actionsAgreed ? (b.actionsCompleted || 0) / b.actionsAgreed : 0;
      return rateA - rateB;
    });
  
  const renderExpiringTaskForces = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      );
    }
    
    if (expiringTaskForces.length === 0) {
      return <p className="text-sm text-muted-foreground">No task forces expiring soon.</p>;
    }
    
    return (
      <div className="space-y-2">
        {expiringTaskForces.slice(0, 3).map(taskForce => {
          const daysRemaining = Math.ceil(
            (new Date(taskForce.endDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return (
            <div key={taskForce.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">{taskForce.name}</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="border-red-500 text-red-500">
                  {daysRemaining} days left
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => navigate(`/workbodies/${taskForce.id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderUpcomingMeetings = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      );
    }
    
    if (upcomingMeetings.length === 0) {
      return <p className="text-sm text-muted-foreground">No meetings scheduled this week.</p>;
    }
    
    return (
      <div className="space-y-2">
        {upcomingMeetings.slice(0, 3).map(meeting => {
          return (
            <div key={meeting.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">{meeting.workbodyName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">
                  {format(parseISO(meeting.date), "MMM dd")} at {meeting.time}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => navigate("/calendar")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderLowCompletionWorkbodies = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      );
    }
    
    if (lowCompletionWorkbodies.length === 0) {
      return <p className="text-sm text-muted-foreground">All workbodies are meeting completion targets.</p>;
    }
    
    return (
      <div className="space-y-2">
        {lowCompletionWorkbodies.slice(0, 3).map(workbody => {
          const completionRate = Math.round((workbody.actionsCompleted || 0) / (workbody.actionsAgreed || 1) * 100);
          
          return (
            <div key={workbody.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">{workbody.name}</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  {completionRate}% complete
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => navigate(`/workbodies/${workbody.id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Expiring Task Forces</h3>
          {renderExpiringTaskForces()}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Upcoming Meetings</h3>
          {renderUpcomingMeetings()}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Low Completion Rate</h3>
          {renderLowCompletionWorkbodies()}
        </div>
      </CardContent>
    </Card>
  );
};
