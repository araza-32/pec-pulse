
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMeetingSubscription = (onMeetingChange: () => void) => {
  useEffect(() => {
    console.log("Setting up real-time subscription for scheduled_meetings");
    
    // Enable real-time for the scheduled_meetings table
    const enableRealtimeQuery = async () => {
      try {
        await supabase.rpc('supabase_realtime', { 
          table: 'scheduled_meetings',
          action: 'subscribe'
        });
        console.log("Realtime enabled for scheduled_meetings");
      } catch (error) {
        console.error("Failed to enable realtime:", error);
      }
    };
    
    enableRealtimeQuery();
    
    const channel = supabase
      .channel('scheduled_meetings_channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'scheduled_meetings'
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          // Force a refetch when any change happens
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
