import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WorkbodyComposition {
  id: string;
  workbody_id: string;
  user_id: string;
  role: 'Convener' | 'Chair' | 'Co-Chair' | 'Member' | 'Secretary';
  assigned_at: string;
  assigned_by: string | null;
  status: 'active' | 'inactive';
}

export interface CompositionMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  assigned_at: string;
  status: 'active' | 'inactive';
}

export const useWorkbodyComposition = (workbodyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: composition = [], isLoading, error } = useQuery({
    queryKey: ['workbody-composition', workbodyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workbody_composition')
        .select('*')
        .eq('workbody_id', workbodyId)
        .eq('status', 'active')
        .order('assigned_at', { ascending: true });

      if (error) {
        console.error("Error fetching composition:", error);
        throw error;
      }

      // For now, return basic data without profile join until we set up proper relationships
      return (data || []).map(item => ({
        id: item.id,
        name: `User ${item.user_id.substring(0, 8)}`, // Temporary display name
        email: undefined,
        phone: undefined,
        role: item.role,
        assigned_at: item.assigned_at,
        status: item.status,
        user_id: item.user_id
      })) as CompositionMember[];
    },
    enabled: !!workbodyId
  });

  const addMember = useMutation({
    mutationFn: async (memberData: {
      user_id: string;
      role: string;
    }) => {
      const { data, error } = await supabase
        .from('workbody_composition')
        .insert({
          workbody_id: workbodyId,
          user_id: memberData.user_id,
          role: memberData.role,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbody-composition', workbodyId] });
      toast({
        title: "Success",
        description: "Member added successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive"
      });
    }
  });

  const updateMember = useMutation({
    mutationFn: async (data: {
      id: string;
      role?: string;
      status?: 'active' | 'inactive';
    }) => {
      const { error } = await supabase
        .from('workbody_composition')
        .update({
          ...(data.role && { role: data.role }),
          ...(data.status && { status: data.status })
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbody-composition', workbodyId] });
      toast({
        title: "Success",
        description: "Member updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive"
      });
    }
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      // Mark as inactive instead of deleting for audit trail
      const { error } = await supabase
        .from('workbody_composition')
        .update({ status: 'inactive' })
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbody-composition', workbodyId] });
      toast({
        title: "Success",
        description: "Member removed successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive"
      });
    }
  });

  return {
    composition,
    isLoading,
    error,
    addMember,
    updateMember,
    removeMember
  };
};