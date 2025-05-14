
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMeetingSubscription = (refetchCallback: () => void) => {
  useEffect(() => {
    // Enable realtime subscriptions for the table
    const enableRealtimeForTable = async () => {
      await supabase.rpc('enable_scheduled_meetings_realtime');
    };

    // Set up subscription
    const channel = supabase
      .channel('scheduled_meetings_changes')
      .on(
        'postgres_changes', // Use 'postgres_changes' as a string literal instead of an event type
        {
          event: '*', // Using wildcard for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'scheduled_meetings'
        },
        () => {
          console.log('Meeting database change detected, refreshing data...');
          refetchCallback();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    enableRealtimeForTable();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchCallback]);
};
