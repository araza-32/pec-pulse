import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMeetings } from "@/hooks/useMeetings";
import { useWorkbodyComposition } from "@/hooks/useWorkbodyComposition";
import { Calendar, Clock, MapPin, Users, FileText } from "lucide-react";
import { format } from "date-fns";

interface MeetingIntegrationProps {
  workbodyId: string;
  onScheduleMeeting?: () => void;
  onUploadMinutes?: () => void;
}

export function MeetingIntegration({ 
  workbodyId, 
  onScheduleMeeting,
  onUploadMinutes 
}: MeetingIntegrationProps) {
  const { meetings, isLoading } = useMeetings(workbodyId);
  const { composition } = useWorkbodyComposition(workbodyId);

  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.datetime) > new Date() && meeting.status === 'scheduled'
  );

  const recentMeetings = meetings.filter(meeting => 
    meeting.status === 'completed'
  ).slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Upcoming Meetings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-4">No upcoming meetings scheduled</p>
              {onScheduleMeeting && (
                <Button onClick={onScheduleMeeting} size="sm">
                  Schedule Meeting
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.slice(0, 2).map((meeting) => (
                <div key={meeting.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{meeting.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(meeting.datetime), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                    {meeting.location && (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{meeting.location}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={meeting.status === 'scheduled' ? 'default' : 'secondary'}>
                    {meeting.status}
                  </Badge>
                </div>
              ))}
              {upcomingMeetings.length > 2 && (
                <p className="text-xs text-center text-muted-foreground">
                  +{upcomingMeetings.length - 2} more meetings
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Members</span>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span className="font-medium">{composition.length}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Meetings</span>
              <span className="font-medium">{meetings.length}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">
                {meetings.filter(m => m.status === 'completed').length}
              </span>
            </div>

            {recentMeetings.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2">Latest Meeting</p>
                <div className="text-xs">
                  <p className="font-medium">{recentMeetings[0].title}</p>
                  <p className="text-muted-foreground">
                    {format(new Date(recentMeetings[0].datetime), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            )}

            {onUploadMinutes && (
              <Button onClick={onUploadMinutes} size="sm" variant="outline" className="w-full">
                Upload Minutes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}