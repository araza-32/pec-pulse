
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScheduledMeeting } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useMeetingMutations = (
  meetings: ScheduledMeeting[], 
  setMeetings: React.Dispatch<React.SetStateAction<ScheduledMeeting[]>>,
  refetchMeetings: () => Promise<void>
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Add a new meeting with improved validation
  const addMeeting = async (meetingData: Omit<ScheduledMeeting, 'id'>) => {
    const { 
      workbodyId, 
      workbodyName, 
      date, 
      time, 
      location, 
      agendaItems,
      notificationFile,
      notificationFilePath,
      agendaFile,
      agendaFilePath
    } = meetingData;

    try {
      console.log("Creating meeting with data:", meetingData);
      
      // Check for exact duplicates before inserting
      const { data: existingMeetings, error: checkError } = await supabase
        .from('scheduled_meetings')
        .select('*')
        .eq('workbody_id', workbodyId)
        .eq('date', date)
        .eq('time', time)
        .ilike('location', location.trim());

      if (checkError) {
        console.error("Error checking for duplicates:", checkError);
        throw checkError;
      }

      if (existingMeetings && existingMeetings.length > 0) {
        throw new Error('A meeting with identical details already exists');
      }
      
      const meetingPayload = {
        workbody_id: workbodyId,
        workbody_name: workbodyName,
        date,
        time,
        location: location.trim(),
        agenda_items: agendaItems || [],
        notification_file_name: notificationFile || null,
        notification_file_path: notificationFilePath || null,
        agenda_file_name: agendaFile || null, 
        agenda_file_path: agendaFilePath || null
      };

      console.log("Inserting meeting payload:", meetingPayload);

      const { data, error } = await supabase
        .from('scheduled_meetings')
        .insert(meetingPayload)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Successfully inserted meeting:", data);

      // Convert data to ScheduledMeeting format
      const newMeeting: ScheduledMeeting = {
        id: data.id,
        workbodyId: data.workbody_id,
        workbodyName: data.workbody_name,
        date: data.date,
        time: data.time,
        location: data.location,
        agendaItems: data.agenda_items || [],
        notificationFile: data.notification_file_name,
        notificationFilePath: data.notification_file_path,
        agendaFile: data.agenda_file_name,
        agendaFilePath: data.agenda_file_path
      };

      // Update state with the new meeting
      setMeetings(prev => [...prev, newMeeting]);
      
      return newMeeting;
    } catch (error: any) {
      console.error('Error adding meeting:', error);
      toast({
        title: 'Error adding meeting',
        description: error.message || 'Failed to save meeting to database',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update an existing meeting
  const updateMeeting = async (id: string, updates: Partial<ScheduledMeeting>) => {
    setIsUpdating(true);
    try {
      console.log("Updating meeting with ID:", id, "Updates:", updates);
      
      // Transform updates to database column format
      const dbUpdates: any = {};
      
      if (updates.workbodyId !== undefined) dbUpdates.workbody_id = updates.workbodyId;
      if (updates.workbodyName !== undefined) dbUpdates.workbody_name = updates.workbodyName;
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.time !== undefined) dbUpdates.time = updates.time;
      if (updates.location !== undefined) dbUpdates.location = updates.location.trim();
      if (updates.agendaItems !== undefined) dbUpdates.agenda_items = updates.agendaItems;
      if (updates.notificationFile !== undefined) dbUpdates.notification_file_name = updates.notificationFile;
      if (updates.notificationFilePath !== undefined) dbUpdates.notification_file_path = updates.notificationFilePath;
      if (updates.agendaFile !== undefined) dbUpdates.agenda_file_name = updates.agendaFile;
      if (updates.agendaFilePath !== undefined) dbUpdates.agenda_file_path = updates.agendaFilePath;
      
      console.log("Database updates:", dbUpdates);
      
      const { error } = await supabase
        .from('scheduled_meetings')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error("Database update error:", error);
        throw error;
      }

      console.log("Successfully updated meeting in database");

      // Update the meetings state
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === id 
            ? { ...meeting, ...updates } 
            : meeting
        )
      );

      await refetchMeetings();
      
      return true;
    } catch (error: any) {
      console.error('Error updating meeting:', error);
      toast({
        title: 'Error updating meeting',
        description: error.message || 'Failed to update meeting in database',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete a meeting
  const deleteMeeting = async (id: string) => {
    try {
      console.log("Deleting meeting with ID:", id);
      
      const { error } = await supabase
        .from('scheduled_meetings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Database delete error:", error);
        throw error;
      }

      console.log("Successfully deleted meeting from database");

      // Update state by removing the deleted meeting
      setMeetings(prev => prev.filter(meeting => meeting.id !== id));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
      toast({
        title: 'Error deleting meeting',
        description: error.message || 'Failed to delete meeting from database',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return { 
    addMeeting, 
    updateMeeting, 
    deleteMeeting, 
    isUpdating 
  };
};
