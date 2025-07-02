
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ActionItem {
  task: string;
  owner: string;
  dueDate: string;
  status: string;
}

interface MinutesSummary {
  id: string;
  meeting_minutes_id: string;
  summary_text: string;
  decisions: string[];
  action_items: ActionItem[];
  sentiment_score: number;
  topics: string[];
  created_at: string;
  updated_at: string;
}

export const useMinutesSummaries = () => {
  const [summaries, setSummaries] = useState<MinutesSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const fetchSummaries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('meeting_minutes_summaries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedSummaries: MinutesSummary[] = (data || []).map(summary => ({
        ...summary,
        decisions: Array.isArray(summary.decisions) ? summary.decisions as string[] : [],
        action_items: Array.isArray(summary.action_items) ? summary.action_items as ActionItem[] : [],
        sentiment_score: summary.sentiment_score || 0,
        topics: summary.topics || [],
      }));
      
      setSummaries(transformedSummaries);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch meeting summaries',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = async (minutesId: string) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('summarize-minutes', {
        body: { minutesId },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Meeting summary generated successfully',
      });

      await fetchSummaries(); // Refresh summaries
      return data;
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate meeting summary',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const getOverdueActions = () => {
    const today = new Date();
    const overdueActions: (ActionItem & { meetingId: string })[] = [];

    summaries.forEach(summary => {
      summary.action_items.forEach(action => {
        if (action.status !== 'completed' && action.dueDate) {
          const dueDate = new Date(action.dueDate);
          if (dueDate < today) {
            overdueActions.push({
              ...action,
              meetingId: summary.meeting_minutes_id,
            });
          }
        }
      });
    });

    return overdueActions;
  };

  const getUpcomingDeadlines = (days = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    const upcomingActions: (ActionItem & { meetingId: string })[] = [];

    summaries.forEach(summary => {
      summary.action_items.forEach(action => {
        if (action.status !== 'completed' && action.dueDate) {
          const dueDate = new Date(action.dueDate);
          if (dueDate >= today && dueDate <= futureDate) {
            upcomingActions.push({
              ...action,
              meetingId: summary.meeting_minutes_id,
            });
          }
        }
      });
    });

    return upcomingActions;
  };

  const getTopicTrends = () => {
    const topicCounts: Record<string, number> = {};
    
    summaries.forEach(summary => {
      summary.topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return {
    summaries,
    isLoading,
    isGenerating,
    fetchSummaries,
    generateSummary,
    getOverdueActions,
    getUpcomingDeadlines,
    getTopicTrends,
  };
};
