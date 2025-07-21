
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
  parameters: {
    workbodyType: string;
    selectedWorkbody: string;
    reportType: string;
    reportFormat: string;
  };
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
      // Try to load from database first
      const { data: dbHistory, error } = await supabase
        .from('report_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') { // PGRST116 is table not found
        console.error('Error loading report history from database:', error);
      }

      let historyData: ReportHistoryItem[] = [];

      if (dbHistory) {
        historyData = dbHistory.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          format: item.format,
          date: new Date(item.created_at),
          workbodyType: item.workbody_type,
          workbodyName: item.workbody_name,
          downloadUrl: item.download_url,
          parameters: item.parameters,
          generatedBy: item.generated_by,
          fileSize: item.file_size
        }));
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('reportsHistory');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            historyData = parsed.map((item: any) => ({
              ...item,
              date: new Date(item.date)
            }));
          } catch (error) {
            console.error('Error parsing localStorage history:', error);
          }
        }
      }

      setHistory(historyData);
    } catch (error) {
      console.error('Error loading reports history:', error);
      toast({
        title: 'Warning',
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
      // Try to save to database
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
        // Fallback to localStorage
        const updatedHistory = [newReport, ...history];
        localStorage.setItem('reportsHistory', JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      } else {
        // Refresh from database
        await loadHistory();
      }
    } catch (error) {
      console.error('Error adding to history:', error);
      // Fallback to localStorage
      const updatedHistory = [newReport, ...history];
      localStorage.setItem('reportsHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  };

  const clearHistory = async () => {
    try {
      // Clear from database
      const { error } = await supabase
        .from('report_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.error('Error clearing database history:', error);
      }
    } catch (error) {
      console.error('Error clearing database history:', error);
    }
    
    // Clear localStorage
    setHistory([]);
    localStorage.removeItem('reportsHistory');
    
    toast({
      title: 'History Cleared',
      description: 'All report history has been cleared',
    });
  };

  const removeFromHistory = async (id: string) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('report_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing from database:', error);
      }
    } catch (error) {
      console.error('Error removing from database:', error);
    }
    
    // Remove from local state
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('reportsHistory', JSON.stringify(updatedHistory));
    
    toast({
      title: 'Report Removed',
      description: 'Report has been removed from history',
    });
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
