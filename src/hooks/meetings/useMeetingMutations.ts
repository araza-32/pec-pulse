
import { useState } from 'react';
import { ScheduledMeeting } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useMeetingValidation } from './useMeetingValidation';

export const useMeetingMutations = (meetings: ScheduledMeeting[], setMeetings: React.Dispatch<React.SetStateAction<ScheduledMeeting[]>>) => {
  const { checkForDuplicates } = useMeetingValidation(meetings);

  const addMeeting = async (newMeeting: Omit<ScheduledMeeting, 'id'>) => {
    console.log("Adding new meeting:", newMeeting);
    const duplicate = checkForDuplicates(newMeeting);
    
    if (duplicate) {
      console.error("Duplicate meeting detected:", duplicate);
      throw new Error(`A meeting for ${newMeeting.workbodyName} is already scheduled on ${newMeeting.date} at ${newMeeting.time}. Please choose a different time or modify the existing meeting instead.`);
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
          notification_file_name: newMeeting.notificationFile,
          notification_file_path: newMeeting.notificationFilePath
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Meeting added successfully:", data);

      const addedMeeting = {
        id: data.id,
        workbodyId: data.workbody_id,
        workbodyName: data.workbody_name,
        date: data.date,
        time: data.time,
        location: data.location,
        agendaItems: data.agenda_items,
        notificationFile: data.notification_file_name,
        notificationFilePath: data.notification_file_path
      };

      setMeetings(prevMeetings => [...prevMeetings, addedMeeting]);
      return addedMeeting;
    } catch (error) {
      console.error('Error adding meeting:', error);
      throw error;
    }
  };

  const updateMeeting = async (id: string, updates: Partial<ScheduledMeeting>) => {
    try {
      const updateData: any = {};
      
      if (updates.workbodyId) updateData.workbody_id = updates.workbodyId;
      if (updates.workbodyName) updateData.workbody_name = updates.workbodyName;
      if (updates.date) updateData.date = updates.date;
      if (updates.time) updateData.time = updates.time;
      if (updates.location) updateData.location = updates.location;
      if (updates.agendaItems) updateData.agenda_items = updates.agendaItems;
      if (updates.notificationFile) updateData.notification_file_name = updates.notificationFile;
      if (updates.notificationFilePath) updateData.notification_file_path = updates.notificationFilePath;

      const { error } = await supabase
        .from('scheduled_meetings')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setMeetings(prevMeetings =>
        prevMeetings.map(meeting =>
          meeting.id === id ? { ...meeting, ...updates } : meeting
        )
      );
      
      console.log("Meeting updated successfully:", id, updates);
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      console.log("Deleting meeting:", id);
      
      const { error } = await supabase
        .from('scheduled_meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMeetings(prevMeetings => 
        prevMeetings.filter(meeting => meeting.id !== id)
      );
      
      console.log("Meeting deleted successfully");
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  };

  return { addMeeting, updateMeeting, deleteMeeting };
};
