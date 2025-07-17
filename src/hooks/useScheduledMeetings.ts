
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScheduledMeeting } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useMeetingMutations } from './meetings/useMeetingMutations';
import { useMeetingSubscription } from './meetings/useMeetingSubscription';
import { useAuth } from '@/contexts/AuthContext';

export const useScheduledMeetings = () => {
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchMeetings = useCallback(async () => {
    console.log("Fetching meetings for all users...");
    setIsLoading(true);
    setError(null);
    try {
      // Get ALL meetings for ALL users - no role-based filtering at database level
      const { data, error } = await supabase
        .from('scheduled_meetings')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error("Error fetching meetings:", error);
        throw error;
      }

      console.log("Fetched meetings data:", data);
      console.log("Fetched meetings count:", data?.length || 0);

      const formattedMeetings = data ? data.map(meeting => {
        // Format time to remove seconds (HH:MM format)
        const timeWithoutSeconds = meeting.time ? 
          meeting.time.substring(0, 5) : 
          meeting.time;
          
        return {
          id: meeting.id,
          workbodyId: meeting.workbody_id,
          workbodyName: meeting.workbody_name,
          date: meeting.date,
          time: timeWithoutSeconds,
          location: meeting.location,
          agendaItems: meeting.agenda_items || [],
          notificationFile: meeting.notification_file_name,
          notificationFilePath: meeting.notification_file_path,
          agendaFile: meeting.agenda_file_name || null,
          agendaFilePath: meeting.agenda_file_path || null
        };
      }) : [];

      console.log("Formatted meetings for display:", formattedMeetings);
      
      // Filter meetings based on user role for display purposes only
      let filteredMeetings = formattedMeetings;
      
      if (user?.role) {
        const userRole = user.role;
        const userWorkbodyId = user.workbodyId;
        
        console.log("User role:", userRole, "Workbody ID:", userWorkbodyId);
        
        // Show relevant meetings based on user role
        if (userRole === 'secretary' && userWorkbodyId) {
          // Secretaries see their workbody meetings
          filteredMeetings = formattedMeetings.filter(meeting => 
            meeting.workbodyId === userWorkbodyId
          );
        } else if (['admin', 'coordination', 'registrar', 'chairman'].includes(userRole)) {
          // Admin, coordination, registrar, and chairman see all meetings
          filteredMeetings = formattedMeetings;
        } else {
          // Members see meetings of their workbody if assigned
          if (userWorkbodyId) {
            filteredMeetings = formattedMeetings.filter(meeting => 
              meeting.workbodyId === userWorkbodyId
            );
          } else {
            // General members can see all meetings for awareness
            filteredMeetings = formattedMeetings;
          }
        }
      }

      console.log("Filtered meetings for user:", filteredMeetings);
      setMeetings(filteredMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError(error as Error);
      toast({
        title: 'Error',
        description: 'Failed to fetch scheduled meetings. Please refresh the page.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);
  
  // Create improved meeting mutations
  const { addMeeting, updateMeeting, deleteMeeting: deleteFromDatabase } = useMeetingMutations(meetings, setMeetings, fetchMeetings);

  // Enhanced delete function that ensures database consistency
  const deleteMeeting = async (id: string) => {
    try {
      console.log("Attempting to delete meeting:", id);
      
      // First delete from database
      await deleteFromDatabase(id);
      
      // Then update local state to remove the meeting
      setMeetings(currentMeetings => {
        const updated = currentMeetings.filter(meeting => meeting.id !== id);
        console.log("Updated meetings after deletion:", updated);
        return updated;
      });
      
      toast({
        title: 'Success',
        description: 'Meeting deleted successfully'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      
      // Re-fetch to restore state if delete failed
      await fetchMeetings();
      
      toast({
        title: 'Error',
        description: 'Failed to delete meeting. Please try again.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    console.log("Initializing scheduled meetings hook...");
    fetchMeetings();
    
    // Set up a regular polling interval as a fallback
    const interval = setInterval(() => {
      console.log("Polling for meeting updates...");
      fetchMeetings();
    }, 30000); // Poll every 30 seconds
    
    return () => {
      console.log("Cleaning up scheduled meetings hook...");
      clearInterval(interval);
    };
  }, [fetchMeetings]);

  // Set up real-time subscription
  useMeetingSubscription(fetchMeetings);

  return { 
    meetings, 
    isLoading,
    error,
    addMeeting, 
    updateMeeting,
    deleteMeeting,
    refetchMeetings: fetchMeetings 
  };
};
