
import { useState, useMemo } from 'react';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { useScheduledMeetings } from '@/hooks/useScheduledMeetings';
import { Workbody, ScheduledMeeting } from '@/types';

export interface DashboardStats {
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
}

export interface OrganizedWorkbodies {
  committees: Workbody[];
  workingGroups: Workbody[];
  taskForces: Workbody[];
}

export function useChairmanDashboard() {
  const { workbodies, isLoading: workbodiesLoading } = useWorkbodies();
  const { meetings, isLoading: meetingsLoading } = useScheduledMeetings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Organize workbodies by type
  const organizedWorkbodies: OrganizedWorkbodies = useMemo(() => {
    return {
      committees: workbodies.filter(wb => wb.type === 'committee'),
      workingGroups: workbodies.filter(wb => wb.type === 'working-group'),
      taskForces: workbodies.filter(wb => wb.type === 'task-force')
    };
  }, [workbodies]);

  // Calculate dashboard statistics from real data
  const stats: DashboardStats = useMemo(() => {
    const totalMeetingsThisYear = workbodies.reduce((sum, wb) => sum + (wb.meetingsThisYear || 0), 0);
    const totalActionsAgreed = workbodies.reduce((sum, wb) => sum + (wb.actionsAgreed || 0), 0);
    const totalActionsCompleted = workbodies.reduce((sum, wb) => sum + (wb.actionsCompleted || 0), 0);
    const completionRate = totalActionsAgreed > 0 ? Math.round((totalActionsCompleted / totalActionsAgreed) * 100) : 0;

    // Filter upcoming meetings (future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate >= today;
    });

    return {
      totalWorkbodies: workbodies.length,
      committees: organizedWorkbodies.committees.length,
      workingGroups: organizedWorkbodies.workingGroups.length,
      taskForces: organizedWorkbodies.taskForces.length,
      meetingsThisYear: totalMeetingsThisYear,
      completionRate,
      upcomingMeetingsCount: upcomingMeetings.length,
      actionsCompleted: totalActionsCompleted,
      actionsAgreed: totalActionsAgreed,
      overdueActions: Math.max(0, totalActionsAgreed - totalActionsCompleted)
    };
  }, [workbodies, meetings, organizedWorkbodies]);

  // Filter workbodies based on selected category
  const filteredWorkbodies = useMemo(() => {
    switch (selectedCategory) {
      case 'committees':
        return organizedWorkbodies.committees;
      case 'workingGroups':
        return organizedWorkbodies.workingGroups;
      case 'taskForces':
        return organizedWorkbodies.taskForces;
      default:
        return workbodies;
    }
  }, [selectedCategory, workbodies, organizedWorkbodies]);

  // Get upcoming meetings with workbody details
  const upcomingMeetings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return meetings
      .filter(meeting => {
        const meetingDate = new Date(meeting.date);
        return meetingDate >= today;
      })
      .slice(0, 5) // Show only next 5 meetings
      .map(meeting => ({
        id: meeting.id,
        date: new Date(meeting.date),
        workbodyName: meeting.workbodyName,
        type: workbodies.find(wb => wb.id === meeting.workbodyId)?.type || 'committee'
      }));
  }, [meetings, workbodies]);

  return {
    workbodies,
    organizedWorkbodies,
    filteredWorkbodies,
    stats,
    upcomingMeetings,
    isLoading: workbodiesLoading || meetingsLoading,
    selectedCategory,
    setSelectedCategory
  };
}
