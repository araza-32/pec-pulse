
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMeetingSubscription = (onUpdate: () => Promise<void>) => {
  useEffect(() => {
    // Cast rpc to a function that accepts string parameters to fix the type error
    const rpcFunc = supabase.rpc as unknown as (fnName: string) => Promise<any>;
    
    // Set up real-time subscription
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
          console.log('Meeting change detected:', payload);
          onUpdate();
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};
