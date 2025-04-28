import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScheduledMeeting } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useMeetingMutations } from './meetings/useMeetingMutations';
import { useMeetingSubscription } from './meetings/useMeetingSubscription';
import { format, addWeeks } from 'date-fns';

export const useScheduledMeetings = () => {
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const twoWeeksFromNow = addWeeks(today, 2);
      
      const { data, error } = await supabase
        .from('scheduled_meetings')
        .select('*')
        .gte('date', format(today, 'yyyy-MM-dd'))
        .lte('date', format(twoWeeksFromNow, 'yyyy-MM-dd'))
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      const uniqueMeetings = data.reduce((acc: any[], meeting) => {
        const exists = acc.some(m => 
          m.workbody_id === meeting.workbody_id && 
          m.date === meeting.date && 
          m.time === meeting.time
        );
        if (!exists) {
          acc.push(meeting);
        }
        return acc;
      }, []);

      const formattedMeetings = uniqueMeetings.map(meeting => ({
        id: meeting.id,
        workbodyId: meeting.workbody_id,
        workbodyName: meeting.workbody_name,
        date: meeting.date,
        time: meeting.time,
        location: meeting.location,
        agendaItems: meeting.agenda_items,
        notificationFile: meeting.notification_file_name,
        notificationFilePath: meeting.notification_file_path
      }));

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
  
  const { addMeeting, updateMeeting, deleteMeeting } = useMeetingMutations(meetings, setMeetings, fetchMeetings);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

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
