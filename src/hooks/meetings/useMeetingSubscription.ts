
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMeetingSubscription = (onMeetingChange: () => void) => {
  useEffect(() => {
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
          onMeetingChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onMeetingChange]);
};
