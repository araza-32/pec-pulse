
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

export interface CategorizedWorkbodies {
  executive: Workbody[];
  regulations: Workbody[];
  operations: Workbody[];
  corporateAffairs: Workbody[];
}

export interface OrganizedWorkbodies {
  committees: Workbody[];
  workingGroups: Workbody[];
  taskForces: Workbody[];
  categorized: CategorizedWorkbodies;
}

// Workbody categorization based on organizational structure
const categorizeWorkbody = (workbody: Workbody): keyof CategorizedWorkbodies => {
  const name = workbody.name.toLowerCase();
  
  // Executive category
  if (name.includes('governing body') || name.includes('management committee')) {
    return 'executive';
  }
  
  // Regulations category  
  if (name.includes('examination committee') || name.includes('ec ') ||
      name.includes('engineering services committee') || name.includes('esc ') ||
      name.includes('engineering accreditation board') || name.includes('eab ') ||
      name.includes('engineering practices') || name.includes('epdc ') ||
      name.includes('cpd policy') || name.includes('tf-cpd') ||
      name.includes('appeals') || name.includes('bylaws') || name.includes('a&bc') ||
      name.includes('quality enhancement') || name.includes('qec ')) {
    return 'regulations';
  }
  
  // Operations category
  if (name.includes('pec information repository') || name.includes('wg-pecir') ||
      name.includes('pec administration') || name.includes('wg-pecadm') ||
      name.includes('central procurement') || name.includes('cpc ') ||
      name.includes('special initiatives')) {
    return 'operations';
  }
  
  // Corporate Affairs category (default for most working groups)
  return 'corporateAffairs';
};

export function useChairmanDashboard() {
  const { workbodies, isLoading: workbodiesLoading } = useWorkbodies();
  const { meetings, isLoading: meetingsLoading } = useScheduledMeetings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Organize workbodies by type and category
  const organizedWorkbodies: OrganizedWorkbodies = useMemo(() => {
    const committees = workbodies.filter(wb => wb.type === 'committee');
    const workingGroups = workbodies.filter(wb => wb.type === 'working-group');
    const taskForces = workbodies.filter(wb => wb.type === 'task-force');
    
    // Categorize all workbodies
    const categorized: CategorizedWorkbodies = {
      executive: [],
      regulations: [],
      operations: [],
      corporateAffairs: []
    };
    
    workbodies.forEach(wb => {
      const category = categorizeWorkbody(wb);
      categorized[category].push(wb);
    });

    return {
      committees,
      workingGroups,
      taskForces,
      categorized
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
        return organizedWorkbodies.categorized.executive;
      case 'regulations':
        return organizedWorkbodies.categorized.regulations;
      case 'operations':
        return organizedWorkbodies.categorized.operations;
      case 'corporateAffairs':
        return organizedWorkbodies.categorized.corporateAffairs;
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
