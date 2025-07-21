
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
      const { data, error } = await supabase
        .from('workbody_composition_history')
        .select('*')
        .eq('workbody_id', workbodyId)
        .order('changed_at', { ascending: false });

      if (error) {
        console.error('Error fetching workbody history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load workbody history',
          variant: 'destructive'
        });
        return;
      }

      // Transform the data to match our CompositionChange interface
      const transformedData: CompositionChange[] = (data || []).map(item => ({
        id: item.id,
        workbody_id: item.workbody_id,
        change_type: item.change_type as 'member_added' | 'member_removed' | 'member_role_changed' | 'composition_updated',
        change_details: typeof item.change_details === 'object' ? item.change_details : {},
        changed_by: item.changed_by,
        changed_at: item.changed_at,
        source_document: item.source_document,
        notes: item.notes
      }));

      setHistory(transformedData);
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
        .from('workbody_composition_history')
        .insert({
          workbody_id: change.workbody_id,
          change_type: change.change_type,
          change_details: change.change_details,
          changed_by: change.changed_by,
          source_document: change.source_document,
          notes: change.notes,
          changed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error logging composition change:', error);
        toast({
          title: 'Warning',
          description: 'Change was made but history logging failed',
          variant: 'destructive'
        });
        return;
      }
      
      // Transform and add to local state
      const transformedData: CompositionChange = {
        id: data.id,
        workbody_id: data.workbody_id,
        change_type: data.change_type as 'member_added' | 'member_removed' | 'member_role_changed' | 'composition_updated',
        change_details: typeof data.change_details === 'object' ? data.change_details : {},
        changed_by: data.changed_by,
        changed_at: data.changed_at,
        source_document: data.source_document,
        notes: data.notes
      };
      
      setHistory(prev => [transformedData, ...prev]);
      
      return transformedData;
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
