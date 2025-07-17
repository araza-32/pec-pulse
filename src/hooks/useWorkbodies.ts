
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkbodyType } from "@/types";
import { Workbody, WorkbodyFormData } from "@/types/workbody";

export const useWorkbodies = () => {
  const queryClient = useQueryClient();

  const { data: workbodies = [], isLoading, error, refetch } = useQuery({
    queryKey: ['workbodies'],
    queryFn: async () => {
      console.log("Fetching workbodies from Supabase");
      const { data, error } = await supabase
        .from('workbodies')
        .select(`
          *,
          workbody_members (*)
        `)
        .order('name', { ascending: true });

      if (error) {
        console.error("Error fetching workbodies:", error);
        throw error;
      }
      
      console.log("Workbodies fetched:", data);
      return (data || []).map(item => ({
        id: item.id,
        code: item.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 3),
        name: item.name,
        type: item.type as WorkbodyType,
        description: item.description || undefined,
        createdDate: item.created_date,
        endDate: item.end_date || undefined,
        termsOfReference: item.terms_of_reference || undefined,
        totalMeetings: item.total_meetings || 0,
        meetingsThisYear: item.meetings_this_year || 0,
        actionsAgreed: item.actions_agreed || 0,
        actionsCompleted: item.actions_completed || 0,
        members: (item.workbody_members || []).map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
          email: member.email || undefined,
          phone: member.phone || undefined,
          hasCV: member.has_cv || false
        }))
      })) as Workbody[];
    }
  });

  const createWorkbody = useMutation({
    mutationFn: async (newWorkbody: WorkbodyFormData) => {
      console.log("Creating new workbody:", newWorkbody);
      
      if (newWorkbody.type === 'task-force' && !newWorkbody.endDate) {
        throw new Error("End date is required for task forces");
      }
      
      const { data, error } = await supabase
        .from('workbodies')
        .insert({
          name: newWorkbody.name,
          type: newWorkbody.type,
          description: newWorkbody.description || "",
          created_date: newWorkbody.createdDate.toISOString(),
          end_date: newWorkbody.endDate ? newWorkbody.endDate.toISOString() : null,
          terms_of_reference: newWorkbody.termsOfReference || "",
          total_meetings: 0,
          meetings_this_year: 0,
          actions_agreed: 0,
          actions_completed: 0
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting workbody:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbodies'] });
    }
  });

  const updateWorkbody = useMutation({
    mutationFn: async (updatedWorkbody: WorkbodyFormData & { id: string }) => {
      console.log("Updating workbody:", updatedWorkbody);
      
      if (updatedWorkbody.type === 'task-force' && !updatedWorkbody.endDate) {
        throw new Error("End date is required for task forces");
      }
      
      const { data, error } = await supabase
        .from('workbodies')
        .update({
          name: updatedWorkbody.name,
          type: updatedWorkbody.type,
          description: updatedWorkbody.description || "",
          created_date: updatedWorkbody.createdDate.toISOString(),
          end_date: updatedWorkbody.endDate ? updatedWorkbody.endDate.toISOString() : null,
          terms_of_reference: updatedWorkbody.termsOfReference || ""
        })
        .eq('id', updatedWorkbody.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating workbody:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbodies'] });
    }
  });

  const deleteWorkbody = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting workbody:", id);
      const { error } = await supabase
        .from('workbodies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting workbody:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbodies'] });
    }
  });

  return {
    workbodies,
    isLoading,
    error,
    refetch,
    createWorkbody,
    updateWorkbody,
    deleteWorkbody
  };
};
