
import { useState } from 'react';
import { ScheduledMeeting } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useMeetingValidation } from './useMeetingValidation';

export const useMeetingMutations = (meetings: ScheduledMeeting[], setMeetings: React.Dispatch<React.SetStateAction<ScheduledMeeting[]>>) => {
  const { checkForDuplicates } = useMeetingValidation(meetings);

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

  return { addMeeting, updateMeeting, deleteMeeting };
};
