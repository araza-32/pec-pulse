
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMeetingSubscription = (
  onUpdate: () => Promise<void>
) => {
  useEffect(() => {
    // Set up a real-time subscription to scheduled_meetings table
    const channel = supabase
      .channel('scheduled_meetings_changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'scheduled_meetings' 
        }, 
        () => {
          // When any change is detected, refetch meetings
          onUpdate();
        }
      )
      .subscribe();

    // Clean up the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};
