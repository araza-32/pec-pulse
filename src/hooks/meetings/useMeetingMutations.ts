
import { ScheduledMeeting } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useMeetingValidation } from './useMeetingValidation';

export const useMeetingMutations = (
  meetings: ScheduledMeeting[], 
  setMeetings: React.Dispatch<React.SetStateAction<ScheduledMeeting[]>>,
  refetchMeetings: () => Promise<void>
) => {
  const { checkForDuplicates } = useMeetingValidation(meetings);

  const addMeeting = async (newMeeting: Omit<ScheduledMeeting, 'id'>) => {
    console.log("Adding new meeting:", newMeeting);
    
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
          notification_file_path: newMeeting.notificationFilePath,
          agenda_file_name: newMeeting.agendaFile,
          agenda_file_path: newMeeting.agendaFilePath
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Meeting added successfully:", data);
      
      // Force a refetch to ensure data consistency
      await refetchMeetings();
      
      const addedMeeting: ScheduledMeeting = {
        id: data.id,
        workbodyId: data.workbody_id,
        workbodyName: data.workbody_name,
        date: data.date,
        time: data.time,
        location: data.location,
        agendaItems: data.agenda_items,
        notificationFile: data.notification_file_name,
        notificationFilePath: data.notification_file_path,
        agendaFile: data.agenda_file_name || null,
        agendaFilePath: data.agenda_file_path || null
      };

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
      if (updates.notificationFile !== undefined) updateData.notification_file_name = updates.notificationFile;
      if (updates.notificationFilePath !== undefined) updateData.notification_file_path = updates.notificationFilePath;
      if (updates.agendaFile !== undefined) updateData.agenda_file_name = updates.agendaFile;
      if (updates.agendaFilePath !== undefined) updateData.agenda_file_path = updates.agendaFilePath;

      console.log("Updating meeting with data:", updateData);

      const { error } = await supabase
        .from('scheduled_meetings')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error("Error in supabase update:", error);
        throw error;
      }

      console.log("Meeting updated successfully:", id);
      
      // Force a refetch to ensure data consistency
      await refetchMeetings();
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      console.log("Deleting meeting:", id);
      
      if (!id) {
        console.error("Invalid meeting ID provided for deletion");
        throw new Error("Invalid meeting ID");
      }
      
      // First verify the meeting exists before attempting to delete
      const { data: meetingToDelete, error: fetchError } = await supabase
        .from('scheduled_meetings')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // Change from single() to maybeSingle() to prevent crash if meeting doesn't exist
        
      if (fetchError) {
        console.error("Error fetching meeting to delete:", fetchError);
        throw new Error("Meeting not found or could not be accessed");
      }
      
      // If meeting not found, handle gracefully
      if (!meetingToDelete) {
        console.warn("Meeting already deleted or doesn't exist:", id);
        // Force a refetch to update UI
        await refetchMeetings();
        return;
      }
      
      const { error } = await supabase
        .from('scheduled_meetings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error in supabase delete:", error);
        throw error;
      }

      console.log("Meeting deleted successfully");
      
      // Force a refetch rather than manipulating the local state directly
      await refetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      // Don't re-throw error here to prevent app crash
      // Instead, force a refresh to make sure UI is in sync with actual data
      await refetchMeetings();
    }
  };

  return { addMeeting, updateMeeting, deleteMeeting };
};
