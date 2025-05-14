
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const useMeetingSubscription = (refetchCallback: () => void) => {
  useEffect(() => {
    // Enable realtime subscriptions for the table
    const enableRealtimeForTable = async () => {
      // Type assertion at the function level to avoid TypeScript error
      // This is needed because the rpc function doesn't have a type definition for this custom function
      const rpcCall = supabase.rpc as unknown as (fnName: string) => Promise<any>;
      await rpcCall('enable_scheduled_meetings_realtime');
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
