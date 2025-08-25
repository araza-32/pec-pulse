import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WorkbodyMemberWithWorkbody {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  workbody_id: string;
  workbody_name: string;
  workbody_type: string;
}

export const useWorkbodyMembersSearch = (searchQuery: string) => {
  return useQuery({
    queryKey: ['workbody-members-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) {
        return [];
      }

      const { data, error } = await supabase
        .from('workbody_members')
        .select(`
          id,
          name,
          role,
          email,
          phone,
          workbody_id,
          workbodies!inner(
            name,
            type
          )
        `)
        .or(`name.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);

      if (error) {
        console.error("Error searching workbody members:", error);
        throw error;
      }

      return (data || []).map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        email: member.email || undefined,
        phone: member.phone || undefined,
        workbody_id: member.workbody_id,
        workbody_name: member.workbodies?.name || '',
        workbody_type: member.workbodies?.type || '',
      })) as WorkbodyMemberWithWorkbody[];
    },
    enabled: searchQuery.length >= 2,
  });
};