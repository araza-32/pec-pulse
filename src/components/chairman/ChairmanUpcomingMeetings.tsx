
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, MapPin } from "lucide-react";
import { ScheduledMeeting } from "@/types";
import { format, parseISO } from "date-fns";

interface ChairmanUpcomingMeetingsProps {
  upcomingMeetings: ScheduledMeeting[] | undefined;
}

export function ChairmanUpcomingMeetings({ upcomingMeetings }: ChairmanUpcomingMeetingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Upcoming Meetings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingMeetings && upcomingMeetings.length > 0 ? (
          <div className="space-y-4">
            {upcomingMeetings.slice(0, 5).map(meeting => (
              <div key={meeting.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                <div className="bg-blue-100 rounded p-2 text-blue-700">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{meeting.workbodyName}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(parseISO(meeting.date), "EEEE, MMM d")} at {meeting.time}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="inline-flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {meeting.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {upcomingMeetings.length > 5 && (
              <Button variant="link" className="mt-2">
                View all {upcomingMeetings.length} upcoming meetings
              </Button>
            )}
          </div>
        ) : (
          <p>No upcoming meetings scheduled in the next 30 days.</p>
        )}
      </CardContent>
    </Card>
  );
}
