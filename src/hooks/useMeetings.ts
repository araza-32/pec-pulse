import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface Meeting {
  id: string;
  workbody_id: string;
  title: string;
  datetime: string;
  location?: string;
  agenda_items?: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingData {
  workbody_id: string;
  title: string;
  datetime: string;
  location?: string;
  agenda_items?: string[];
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export const useMeetings = (workbodyId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: meetings = [], isLoading, error } = useQuery({
    queryKey: ['meetings', workbodyId],
    queryFn: async () => {
      let query = supabase
        .from('meetings')
        .select('*')
        .order('datetime', { ascending: true });

      if (workbodyId) {
        query = query.eq('workbody_id', workbodyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching meetings:", error);
        throw error;
      }

      return data || [];
    }
  });

  const createMeeting = useMutation({
    mutationFn: async (meetingData: CreateMeetingData) => {
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          ...meetingData,
          created_by: user?.id,
          status: meetingData.status || 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create meeting",
        variant: "destructive"
      });
    }
  });

  const updateMeeting = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<CreateMeetingData> }) => {
      const { error } = await supabase
        .from('meetings')
        .update(data.updates)
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive"
      });
    }
  });

  const deleteMeeting = useMutation({
    mutationFn: async (meetingId: string) => {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive"
      });
    }
  });

  return {
    meetings,
    isLoading,
    error,
    createMeeting,
    updateMeeting,
    deleteMeeting
  };
};