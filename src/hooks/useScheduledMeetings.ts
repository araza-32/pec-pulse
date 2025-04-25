
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScheduledMeeting } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useScheduledMeetings = () => {
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_meetings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMeetings = data.map(meeting => ({
        id: meeting.id,
        workbodyId: meeting.workbody_id,
        workbodyName: meeting.workbody_name,
        date: meeting.date,
        time: meeting.time,
        location: meeting.location,
        agendaItems: meeting.agenda_items,
        notificationFile: meeting.notification_file
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
  };

  const addMeeting = async (newMeeting: Omit<ScheduledMeeting, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('scheduled_meetings')
        .insert({
          workbody_id: newMeeting.workbodyId,
          workbody_name: newMeeting.workbodyName,
          date: newMeeting.date,
          time: newMeeting.time,
          location: newMeeting.location,
          agenda_items: newMeeting.agendaItems,
          notification_file: newMeeting.notificationFile
        })
        .select()
        .single();

      if (error) throw error;

      const addedMeeting = {
        id: data.id,
        ...newMeeting
      };

      setMeetings(prevMeetings => [...prevMeetings, addedMeeting]);
      return addedMeeting;
    } catch (error) {
      console.error('Error adding meeting:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return { 
    meetings, 
    isLoading, 
    addMeeting, 
    refetchMeetings: fetchMeetings 
  };
};
