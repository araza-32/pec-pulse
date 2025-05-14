
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const useMeetingSubscription = (refetchCallback: () => void) => {
  useEffect(() => {
    // Enable realtime subscriptions for the table
    const enableRealtimeForTable = async () => {
      await supabase.rpc('enable_scheduled_meetings_realtime' as any);
    };

    // Set up subscription
    const channel = supabase
      .channel('scheduled_meetings_changes')
      .on(
        'postgres_changes' as any, // Using 'as any' to bypass type checking temporarily
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
