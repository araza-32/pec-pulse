
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMeetingSubscription = (onMeetingChange: () => void) => {
  useEffect(() => {
    console.log("Setting up real-time subscription for scheduled_meetings");
    
    const channel = supabase
      .channel('scheduled_meetings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_meetings'
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          onMeetingChange();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [onMeetingChange]);
};
