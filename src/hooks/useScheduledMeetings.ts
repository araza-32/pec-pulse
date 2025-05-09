
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScheduledMeeting } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useMeetingMutations } from './meetings/useMeetingMutations';
import { useMeetingSubscription } from './meetings/useMeetingSubscription';
import { format } from 'date-fns';

export const useScheduledMeetings = () => {
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchMeetings = useCallback(async () => {
    console.log("Fetching meetings...");
    setIsLoading(true);
    try {
      // Get all meetings, including past meetings
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
          time: timeWithoutSeconds, // Use formatted time without seconds
          location: meeting.location,
          agendaItems: meeting.agenda_items || [],
          notificationFile: meeting.notification_file_name,
          notificationFilePath: meeting.notification_file_path,
          agendaFile: meeting.agenda_file_name || null,
          agendaFilePath: meeting.agenda_file_path || null
        };
      }) : [];

      console.log("Formatted meetings:", formattedMeetings);
      setMeetings(formattedMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch scheduled meetings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Create meeting mutations
  const { addMeeting, updateMeeting, deleteMeeting } = useMeetingMutations(meetings, setMeetings, fetchMeetings);

  // Initial fetch
  useEffect(() => {
    fetchMeetings();
    
    // Set up a regular polling interval as a fallback
    const interval = setInterval(() => {
      fetchMeetings();
    }, 60000); // Poll every minute
    
    return () => clearInterval(interval);
  }, [fetchMeetings]);

  // Set up real-time subscription
  useMeetingSubscription(fetchMeetings);

  return { 
    meetings, 
    isLoading, 
    addMeeting, 
    updateMeeting,
    deleteMeeting,
    refetchMeetings: fetchMeetings 
  };
};
