
import { useState, useEffect, useMemo } from 'react';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { toast } from '@/hooks/use-toast';

export type WorkbodyType = 'committee' | 'working-group' | 'task-force';
export type SortOption = 'progress' | 'meetings' | 'alphabetical';

export interface EnhancedWorkbody {
  id: string;
  abbreviation: string;
  name: string;
  type: WorkbodyType;
  meetingsYtd: number;
  actionsClosed: number;
  progressPercent: number;
  // Additional fields for details display
  mandate?: string;
  termsOfReference?: string;
  members: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  meetings: {
    id: string;
    date: string;
    title: string;
    hasMinutes: boolean;
  }[];
  lastProgressLog?: {
    content: string;
    date: string;
    author: string;
  };
}

interface UseWorkBodiesQueryResult {
  workbodies: EnhancedWorkbody[];
  filteredWorkbodies: EnhancedWorkbody[];
  isLoading: boolean;
  error: Error | null;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: SortOption) => void;
  refresh: () => void;
  counts: {
    committees: number;
    workingGroups: number;
    taskForces: number;
  };
  getWorkbodyById: (id: string) => EnhancedWorkbody | null;
}

export function useWorkBodiesQuery(): UseWorkBodiesQueryResult {
  const { workbodies: rawWorkbodies, isLoading, refetch } = useWorkbodies();
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('progress');

  // Transform raw workbodies into enhanced format with additional fields
  const workbodies = useMemo(() => {
    return rawWorkbodies.map(wb => {
      // For demo, create abbreviation from name if not available
      const abbr = wb.name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      
      // Map the raw workbody type to our expected format
      let mappedType: WorkbodyType = 'committee';
      if (wb.type === 'working-group') mappedType = 'working-group';
      if (wb.type === 'task-force') mappedType = 'task-force';
      
      // Use actionsCompleted and actionsAgreed to calculate actionsClosed percentage
      const actionsClosed = wb.actionsAgreed 
        ? Math.round((wb.actionsCompleted / wb.actionsAgreed) * 100) 
        : 0;
      
      return {
        id: wb.id,
        abbreviation: abbr,
        name: wb.name,
        type: mappedType,
        meetingsYtd: wb.meetingsThisYear || 0,
        actionsClosed,
        progressPercent: Math.min(wb.totalMeetings ? wb.totalMeetings * 10 : 0, 100), // Mock progress data
        mandate: wb.description,
        termsOfReference: wb.termsOfReference,
        members: wb.members?.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role,
        })) || [],
        meetings: generateMockMeetings(wb.id, wb.meetingsThisYear || 0),
        lastProgressLog: wb.meetingsThisYear > 0 ? {
          content: `The ${wb.name} has made progress on several key initiatives this quarter.`,
          date: new Date().toLocaleDateString(),
          author: 'System'
        } : undefined
      };
    });
  }, [rawWorkbodies]);

  // Generate mock meetings for demo purposes
  function generateMockMeetings(workbodyId: string, count: number) {
    const meetings = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const meetingDate = new Date();
      meetingDate.setDate(today.getDate() - (i * 30)); // Roughly monthly meetings
      
      meetings.push({
        id: `${workbodyId}-meeting-${i}`,
        date: meetingDate.toLocaleDateString(),
        title: `Regular Meeting ${i + 1}`,
        hasMinutes: i < 2 // Only recent meetings have minutes
      });
    }
    
    return meetings;
  }

  // Get counts for each type
  const counts = useMemo(() => {
    return {
      committees: workbodies.filter(wb => wb.type === 'committee').length,
      workingGroups: workbodies.filter(wb => wb.type === 'working-group').length,
      taskForces: workbodies.filter(wb => wb.type === 'task-force').length
    };
  }, [workbodies]);

  // Filter workbodies based on category and search query
  const filteredWorkbodies = useMemo(() => {
    let filtered = [...workbodies];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      const typeMapping: Record<string, WorkbodyType> = {
        committees: 'committee',
        workingGroups: 'working-group',
        taskForces: 'task-force'
      };
      
      filtered = filtered.filter(wb => wb.type === typeMapping[selectedCategory]);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(wb => 
        wb.abbreviation.toLowerCase().includes(query) || 
        wb.name.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'progress':
          return b.progressPercent - a.progressPercent;
        case 'meetings':
          return b.meetingsYtd - a.meetingsYtd;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [workbodies, selectedCategory, searchQuery, sortOption]);

  // Function to refresh data
  const refresh = async () => {
    try {
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workbodies'));
      toast({
        title: 'Error',
        description: 'Failed to refresh workbodies data',
        variant: 'destructive'
      });
    }
  };

  // Function to get a workbody by ID
  const getWorkbodyById = (id: string): EnhancedWorkbody | null => {
    return workbodies.find(wb => wb.id === id) || null;
  };

  return {
    workbodies,
    filteredWorkbodies,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    setSortOption,
    refresh,
    counts,
    getWorkbodyById
  };
}
