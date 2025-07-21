
import { useState, useEffect } from 'react';
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
}

export const useReportsHistory = () => {
  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem('reportsHistory');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setHistory(historyWithDates);
      } catch (error) {
        console.error('Error loading reports history:', error);
        setHistory([]);
      }
    }
  };

  const addToHistory = (report: Omit<ReportHistoryItem, 'id'>) => {
    const newReport: ReportHistoryItem = {
      ...report,
      id: crypto.randomUUID(),
    };
    
    const updatedHistory = [newReport, ...history];
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem('reportsHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving reports history:', error);
      toast({
        title: 'Warning',
        description: 'Report generated but history could not be saved',
        variant: 'destructive'
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('reportsHistory');
    toast({
      title: 'History Cleared',
      description: 'All report history has been cleared',
    });
  };

  const removeFromHistory = (id: string) => {
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
    addToHistory,
    clearHistory,
    removeFromHistory,
    loadHistory
  };
};
