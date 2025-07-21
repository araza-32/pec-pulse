
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CompositionChange {
  id: string;
  workbody_id: string;
  change_type: 'member_added' | 'member_removed' | 'member_role_changed' | 'composition_updated';
  change_details: {
    member_name?: string;
    member_role?: string;
    previous_role?: string;
    changes?: any[];
  };
  changed_by: string;
  changed_at: string;
  source_document?: string;
  notes?: string;
}

export const useWorkbodyHistory = (workbodyId: string) => {
  const [history, setHistory] = useState<CompositionChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = async () => {
    if (!workbodyId) return;
    
    setIsLoading(true);
    try {
      // Using direct query since the table exists but isn't in the generated types yet
      const { data, error } = await supabase
        .rpc('get_workbody_composition_history', { workbody_id: workbodyId });

      if (error) {
        // Fallback to direct query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('workbody_composition_history' as any)
          .select('*')
          .eq('workbody_id', workbodyId)
          .order('changed_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        setHistory(fallbackData || []);
      } else {
        setHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching workbody history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workbody history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logCompositionChange = async (change: Omit<CompositionChange, 'id' | 'changed_at'>) => {
    try {
      const { data, error } = await supabase
        .from('workbody_composition_history' as any)
        .insert({
          ...change,
          changed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add to local state
      setHistory(prev => [data, ...prev]);
      
      return data;
    } catch (error) {
      console.error('Error logging composition change:', error);
      toast({
        title: 'Warning',
        description: 'Change was made but history logging failed',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [workbodyId]);

  return {
    history,
    isLoading,
    fetchHistory,
    logCompositionChange
  };
};
