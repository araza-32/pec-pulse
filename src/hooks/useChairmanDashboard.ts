
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

export interface NestedWorkbodies {
  [category: string]: {
    [subcategory: string]: Workbody[];
  } | Workbody[];
}

export interface OrganizedWorkbodies {
  committees: Workbody[];
  workingGroups: Workbody[];
  taskForces: Workbody[];
  nested: NestedWorkbodies;
}

export function useChairmanDashboard() {
  const { workbodies, isLoading: workbodiesLoading } = useWorkbodies();
  const { meetings, isLoading: meetingsLoading } = useScheduledMeetings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Organize workbodies by type and nested structure
  const organizedWorkbodies: OrganizedWorkbodies = useMemo(() => {
    const committees = workbodies.filter(wb => wb.type === 'committee');
    const workingGroups = workbodies.filter(wb => wb.type === 'working-group');
    const taskForces = workbodies.filter(wb => wb.type === 'task-force');
    
    // Create nested structure by category and subcategory
    const nested: NestedWorkbodies = {};
    
    workbodies.forEach(wb => {
      const category = wb.category || 'Uncategorized';
      const subcategory = wb.subcategory;
      
      if (!nested[category]) {
        nested[category] = {};
      }
      
      if (subcategory) {
        if (!nested[category][subcategory]) {
          nested[category][subcategory] = [];
        }
        (nested[category][subcategory] as Workbody[]).push(wb);
      } else {
        // For categories without subcategories (like Executive)
        if (!Array.isArray(nested[category])) {
          nested[category] = [];
        }
        (nested[category] as Workbody[]).push(wb);
      }
    });

    return {
      committees,
      workingGroups,
      taskForces,
      nested
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
      case 'executive':
        return (organizedWorkbodies.nested['Executive'] as Workbody[]) || [];
      case 'regulations':
        const regulationsWorkbodies: Workbody[] = [];
        const regulations = organizedWorkbodies.nested['Regulations'];
        if (regulations && typeof regulations === 'object' && !Array.isArray(regulations)) {
          Object.values(regulations).forEach(subcategoryWorkbodies => {
            regulationsWorkbodies.push(...subcategoryWorkbodies);
          });
        }
        return regulationsWorkbodies;
      case 'operations':
        const operationsWorkbodies: Workbody[] = [];
        const operations = organizedWorkbodies.nested['Operations'];
        if (operations && typeof operations === 'object' && !Array.isArray(operations)) {
          Object.values(operations).forEach(subcategoryWorkbodies => {
            operationsWorkbodies.push(...subcategoryWorkbodies);
          });
        }
        return operationsWorkbodies;
      case 'corporateAffairs':
        const corporateWorkbodies: Workbody[] = [];
        const corporate = organizedWorkbodies.nested['Corporate Affairs'];
        if (corporate && typeof corporate === 'object' && !Array.isArray(corporate)) {
          Object.values(corporate).forEach(subcategoryWorkbodies => {
            corporateWorkbodies.push(...subcategoryWorkbodies);
          });
        }
        return corporateWorkbodies;
      case 'specialInitiatives':
        const specialWorkbodies: Workbody[] = [];
        const special = organizedWorkbodies.nested['Special Initiatives'];
        if (special && typeof special === 'object' && !Array.isArray(special)) {
          Object.values(special).forEach(subcategoryWorkbodies => {
            specialWorkbodies.push(...subcategoryWorkbodies);
          });
        }
        return specialWorkbodies;
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
