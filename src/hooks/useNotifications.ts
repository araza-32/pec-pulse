
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScheduledMeeting } from '@/types';
import { addDays, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  // Check for new meetings this week
  const checkWeeklyMeetings = async (meetings: ScheduledMeeting[]) => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    const thisWeekMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return isWithinInterval(meetingDate, { start: weekStart, end: weekEnd });
    });

    // Check for meetings needing minutes follow-up
    const meetingsNeedingMinutes = thisWeekMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      const daysPassed = Math.floor((now.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysPassed >= 1 && daysPassed <= 7; // Meeting was 1-7 days ago
    });

    if (meetingsNeedingMinutes.length > 0) {
      toast({
        title: `${meetingsNeedingMinutes.length} meetings need minutes`,
        description: "Some meetings from this week may need minutes uploaded",
        variant: "default",
      });
    }

    return { thisWeekMeetings, meetingsNeedingMinutes };
  };

  // Create notification for secretary
  const createSecretaryAlert = async (meeting: ScheduledMeeting) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          type: 'minutes_reminder',
          title: `Minutes needed for ${meeting.workbodyName}`,
          message: `Please upload minutes for the ${meeting.workbodyName} meeting held on ${meeting.date}`,
          meeting_id: meeting.id,
          workbody_id: meeting.workbodyId,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating secretary alert:', error);
    }
  };

  return {
    notifications,
    checkWeeklyMeetings,
    createSecretaryAlert
  };
};
