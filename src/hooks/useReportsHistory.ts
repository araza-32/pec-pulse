
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportHistoryItem {
  id: string;
  name: string;
  type: string;
  format: string;
  date: Date;
  workbodyType: string;
  workbodyName?: string;
  downloadUrl?: string;
  parameters: any; // Changed from specific object to any to handle Json type
  generatedBy: string;
  fileSize?: number;
}

export const useReportsHistory = () => {
  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const { data: dbHistory, error } = await supabase
        .from('report_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading report history from database:', error);
        toast({
          title: 'Error',
          description: 'Failed to load report history',
          variant: 'destructive'
        });
        return;
      }

      const historyData: ReportHistoryItem[] = dbHistory ? dbHistory.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        format: item.format,
        date: new Date(item.created_at),
        workbodyType: item.workbody_type,
        workbodyName: item.workbody_name || undefined,
        downloadUrl: item.download_url || undefined,
        parameters: item.parameters || {}, // Handle Json type properly
        generatedBy: item.generated_by,
        fileSize: item.file_size || undefined
      })) : [];

      setHistory(historyData);
    } catch (error) {
      console.error('Error loading reports history:', error);
      toast({
        title: 'Error',
        description: 'Could not load report history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = async (report: Omit<ReportHistoryItem, 'id'>) => {
    const newReport: ReportHistoryItem = {
      ...report,
      id: crypto.randomUUID(),
    };
    
    try {
      const { error } = await supabase
        .from('report_history')
        .insert({
          id: newReport.id,
          name: newReport.name,
          type: newReport.type,
          format: newReport.format,
          workbody_type: newReport.workbodyType,
          workbody_name: newReport.workbodyName,
          download_url: newReport.downloadUrl,
          parameters: newReport.parameters,
          generated_by: newReport.generatedBy,
          file_size: newReport.fileSize,
          created_at: newReport.date.toISOString()
        });

      if (error) {
        console.error('Error saving to database:', error);
        toast({
          title: 'Error',
          description: 'Failed to save report to history',
          variant: 'destructive'
        });
        return;
      }

      // Refresh from database
      await loadHistory();
      
      toast({
        title: 'Success',
        description: 'Report added to history',
      });
    } catch (error) {
      console.error('Error adding to history:', error);
      toast({
        title: 'Error',
        description: 'Failed to add report to history',
        variant: 'destructive'
      });
    }
  };

  const clearHistory = async () => {
    try {
      const { error } = await supabase
        .from('report_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.error('Error clearing database history:', error);
        toast({
          title: 'Error',
          description: 'Failed to clear report history',
          variant: 'destructive'
        });
        return;
      }

      setHistory([]);
      
      toast({
        title: 'History Cleared',
        description: 'All report history has been cleared',
      });
    } catch (error) {
      console.error('Error clearing database history:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear report history',
        variant: 'destructive'
      });
    }
  };

  const removeFromHistory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('report_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing from database:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove report from history',
          variant: 'destructive'
        });
        return;
      }

      // Remove from local state
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
      
      toast({
        title: 'Report Removed',
        description: 'Report has been removed from history',
      });
    } catch (error) {
      console.error('Error removing from database:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove report from history',
        variant: 'destructive'
      });
    }
  };

  return {
    history,
    isLoading,
    addToHistory,
    clearHistory,
    removeFromHistory,
    loadHistory
  };
};
