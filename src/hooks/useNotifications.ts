
import { useState, useEffect } from 'react';
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

  // Create notification for secretary (now using local state and toast)
  const createSecretaryAlert = async (meeting: ScheduledMeeting) => {
    const alertMessage = `Minutes needed for ${meeting.workbodyName} meeting held on ${meeting.date}`;
    
    // Add to local notifications state
    const newNotification = {
      id: Date.now().toString(),
      type: 'minutes_reminder',
      title: `Minutes needed for ${meeting.workbodyName}`,
      message: alertMessage,
      meeting_id: meeting.id,
      workbody_id: meeting.workbodyId,
      created_at: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    toast({
      title: "Secretary Alert",
      description: alertMessage,
      variant: "default",
    });

    console.log('Secretary alert created:', newNotification);
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    checkWeeklyMeetings,
    createSecretaryAlert,
    markAsRead,
    clearNotifications
  };
};
