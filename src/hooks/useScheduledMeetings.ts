
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

  const checkForDuplicates = (meetingData: Omit<ScheduledMeeting, 'id'>) => {
    return meetings.find(m => 
      m.workbodyId === meetingData.workbodyId && 
      m.date === meetingData.date
    );
  };

  const addMeeting = async (newMeeting: Omit<ScheduledMeeting, 'id'>) => {
    const duplicate = checkForDuplicates(newMeeting);
    if (duplicate) {
      throw new Error(`A meeting for ${newMeeting.workbodyName} is already scheduled on ${newMeeting.date}. Please modify the existing meeting instead.`);
    }

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

      setMeetings(prevMeetings => [addedMeeting, ...prevMeetings]);
      return addedMeeting;
    } catch (error) {
      console.error('Error adding meeting:', error);
      throw error;
    }
  };

  const updateMeeting = async (id: string, updates: Partial<ScheduledMeeting>) => {
    try {
      const { error } = await supabase
        .from('scheduled_meetings')
        .update({
          workbody_id: updates.workbodyId,
          workbody_name: updates.workbodyName,
          date: updates.date,
          time: updates.time,
          location: updates.location,
          agenda_items: updates.agendaItems,
          notification_file: updates.notificationFile
        })
        .eq('id', id);

      if (error) throw error;

      setMeetings(prevMeetings =>
        prevMeetings.map(meeting =>
          meeting.id === id ? { ...meeting, ...updates } : meeting
        )
      );
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMeetings(prevMeetings => 
        prevMeetings.filter(meeting => meeting.id !== id)
      );
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMeetings();

    // Set up real-time subscription
    const channel = supabase
      .channel('scheduled_meetings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_meetings'
        },
        () => {
          fetchMeetings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { 
    meetings, 
    isLoading, 
    addMeeting, 
    updateMeeting,
    deleteMeeting,
    refetchMeetings: fetchMeetings 
  };
};
