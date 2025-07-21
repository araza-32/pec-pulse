
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompositionChange {
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
  source_document: string;
  notes: string;
}

export const useWorkbodyHistory = (workbodyId: string) => {
  const [history, setHistory] = useState<CompositionChange[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const convertToCompositionChange = (item: any): CompositionChange => {
    let changeDetails = {};
    
    // Handle change_details conversion from Supabase Json type
    if (item.change_details && typeof item.change_details === 'object') {
      changeDetails = item.change_details;
    }

    return {
      id: item.id,
      workbody_id: item.workbody_id,
      change_type: item.change_type as CompositionChange['change_type'],
      change_details: changeDetails,
      changed_by: item.changed_by,
      changed_at: item.changed_at,
      source_document: item.source_document || '',
      notes: item.notes || ''
    };
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('workbody_composition_history')
        .select('*')
        .eq('workbody_id', workbodyId)
        .order('changed_at', { ascending: false });

      if (error) {
        console.error('Error fetching workbody history:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch workbody history',
          variant: 'destructive'
        });
        return;
      }

      if (data) {
        const convertedHistory = data.map(convertToCompositionChange);
        setHistory(convertedHistory);
      }
    } catch (error) {
      console.error('Error fetching workbody history:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch workbody history',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addHistoryEntry = async (entry: Omit<CompositionChange, 'id' | 'changed_at'>) => {
    try {
      const { data, error } = await supabase
        .from('workbody_composition_history')
        .insert([{
          workbody_id: entry.workbody_id,
          change_type: entry.change_type,
          change_details: entry.change_details,
          changed_by: entry.changed_by,
          source_document: entry.source_document,
          notes: entry.notes
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding history entry:', error);
        toast({
          title: 'Error',
          description: 'Failed to add history entry',
          variant: 'destructive'
        });
        return;
      }

      if (data) {
        const convertedEntry = convertToCompositionChange(data);
        setHistory(prev => [convertedEntry, ...prev]);
        
        toast({
          title: 'Success',
          description: 'History entry added successfully',
        });
      }
    } catch (error) {
      console.error('Error adding history entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to add history entry',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (workbodyId) {
      fetchHistory();
    }
  }, [workbodyId]);

  return {
    history,
    loading,
    addHistoryEntry,
    refetchHistory: fetchHistory
  };
};
