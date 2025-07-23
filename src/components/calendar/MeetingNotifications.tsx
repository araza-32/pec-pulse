
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { ScheduledMeeting } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { format, isWithinInterval, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface MeetingNotificationsProps {
  meetings: ScheduledMeeting[];
}

export function MeetingNotifications({ meetings }: MeetingNotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const generateNotifications = () => {
      const now = new Date();
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      const tomorrow = addDays(now, 1);
      
      const newNotifications = [];

      // This week's meetings
      const thisWeekMeetings = meetings.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        return isWithinInterval(meetingDate, { start: weekStart, end: weekEnd });
      });

      // Tomorrow's meetings
      const tomorrowMeetings = meetings.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        return format(meetingDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
      });

      // Meetings that need minutes (1-7 days ago)
      const meetingsNeedingMinutes = meetings.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        const daysPassed = Math.floor((now.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysPassed >= 1 && daysPassed <= 7;
      });

      // Add notifications based on user role
      if (user?.role === 'secretary' || user?.role === 'admin') {
        meetingsNeedingMinutes.forEach(meeting => {
          newNotifications.push({
            id: `minutes-${meeting.id}`,
            type: 'minutes_reminder',
            title: 'Minutes Required',
            message: `Please upload minutes for ${meeting.workbodyName} meeting held on ${format(new Date(meeting.date), 'MMM dd, yyyy')}`,
            priority: 'high',
            meeting,
            action: 'upload_minutes'
          });
        });
      }

      // Tomorrow's meetings for all users
      tomorrowMeetings.forEach(meeting => {
        newNotifications.push({
          id: `tomorrow-${meeting.id}`,
          type: 'upcoming_meeting',
          title: 'Meeting Tomorrow',
          message: `${meeting.workbodyName} meeting at ${meeting.time} in ${meeting.location}`,
          priority: 'medium',
          meeting,
          action: 'view_meeting'
        });
      });

      // This week's meetings summary
      if (thisWeekMeetings.length > 0) {
        newNotifications.push({
          id: 'week-summary',
          type: 'week_summary',
          title: `${thisWeekMeetings.length} meetings this week`,
          message: `You have ${thisWeekMeetings.length} meetings scheduled for this week`,
          priority: 'low',
          meetings: thisWeekMeetings,
          action: 'view_calendar'
        });
      }

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [meetings, user]);

  const handleNotificationAction = (notification: any) => {
    switch (notification.action) {
      case 'upload_minutes':
        navigate('/upload-minutes');
        break;
      case 'view_meeting':
        navigate('/calendar');
        break;
      case 'view_calendar':
        navigate('/calendar');
        break;
      default:
        break;
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Bell className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            All Caught Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No pending notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Meeting Notifications ({notifications.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              {getPriorityIcon(notification.priority)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <Badge variant={getPriorityColor(notification.priority) as any}>
                    {notification.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                {notification.meeting && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(notification.meeting.date), 'MMM dd, yyyy')} at {notification.meeting.time}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleNotificationAction(notification)}
              >
                {notification.action === 'upload_minutes' && <FileText className="h-3 w-3 mr-1" />}
                {notification.action === 'view_meeting' && <Clock className="h-3 w-3 mr-1" />}
                {notification.action === 'view_calendar' && <Bell className="h-3 w-3 mr-1" />}
                Action
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dismissNotification(notification.id)}
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
