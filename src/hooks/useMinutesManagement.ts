
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWorkbodies } from "@/hooks/useWorkbodies";

interface MinutesData {
  id: string;
  workbodyName: string;
  date: string;
  fileUrl: string;
}

export const useMinutesManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [meetingMinutes, setMeetingMinutes] = useState<MinutesData[]>([]);
  const { toast } = useToast();
  const { refetch: refetchWorkbodies } = useWorkbodies();

  const fetchMeetingMinutes = async (workbodyId?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('meeting_minutes')
        .select('id, workbody_id, date, file_url, workbodies(name)')
        .order('date', { ascending: false });
      
      if (workbodyId) {
        query = query.eq('workbody_id', workbodyId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedMinutes = data.map(item => ({
        id: item.id,
        workbodyName: item.workbodies?.name || "Unknown",
        date: item.date,
        fileUrl: item.file_url
      }));
      
      setMeetingMinutes(formattedMinutes);
    } catch (error) {
      console.error('Error fetching meeting minutes:', error);
      toast({
        title: "Error",
        description: "Failed to load meeting minutes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMinutes = async (id: string) => {
    try {
      // Get the minutes data first to reference workbody stats
      const { data: minutesData, error: fetchError } = await supabase
        .from('meeting_minutes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete the minutes record
      const { error: deleteError } = await supabase
        .from('meeting_minutes')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      // Update the workbody stats
      if (minutesData.workbody_id) {
        const { data: workbodyData, error: workbodyFetchError } = await supabase
          .from('workbodies')
          .select('total_meetings, meetings_this_year, actions_agreed, actions_completed')
          .eq('id', minutesData.workbody_id)
          .single();
          
        if (!workbodyFetchError && workbodyData) {
          // Decrement the meeting count
          await supabase
            .from('workbodies')
            .update({
              total_meetings: Math.max(0, workbodyData.total_meetings - 1),
              meetings_this_year: Math.max(0, workbodyData.meetings_this_year - 1),
              actions_agreed: Math.max(0, workbodyData.actions_agreed - minutesData.actions_agreed.length)
            })
            .eq('id', minutesData.workbody_id);
        }
      }
      
      // Refetch the workbodies data to update statistics
      await refetchWorkbodies();
      
      toast({
        title: "Success",
        description: "Meeting minutes deleted successfully",
      });
      
      // Remove from local state
      setMeetingMinutes(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting minutes:', error);
      toast({
        title: "Error",
        description: "Failed to delete meeting minutes",
        variant: "destructive"
      });
    }
  };

  return {
    isLoading,
    meetingMinutes,
    fetchMeetingMinutes,
    deleteMinutes
  };
};
