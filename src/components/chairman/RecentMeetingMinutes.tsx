
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MapPin } from "lucide-react";
import { MeetingMinutes, Workbody } from "@/types";
import { format } from "date-fns";

interface RecentMeetingMinutesProps {
  recentMeetings: MeetingMinutes[];
  workbodies: Workbody[];
}

export function RecentMeetingMinutes({ recentMeetings, workbodies = [] }: RecentMeetingMinutesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Recent Meeting Minutes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentMeetings.length > 0 ? (
          <div className="space-y-4">
            {recentMeetings.slice(0, 5).map(minutes => {
              const workbody = workbodies.find(wb => wb.id === minutes.workbodyId);
              return (
                <div key={minutes.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                  <div className="bg-green-100 rounded p-2 text-green-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{workbody?.name || minutes.workbodyName}</div>
                    <div className="text-sm text-muted-foreground">
                      Meeting on {format(new Date(minutes.meetingDate || minutes.date), "MMMM d, yyyy")}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span className="inline-flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {minutes.venue || minutes.location}
                      </span>
                    </div>
                    <Button variant="link" className="h-auto p-0 text-sm mt-1">
                      View Minutes
                    </Button>
                  </div>
                </div>
              );
            })}
            {recentMeetings.length > 5 && (
              <Button variant="link" className="mt-2">
                View all {recentMeetings.length} recent meetings
              </Button>
            )}
          </div>
        ) : (
          <p>No meeting minutes uploaded in the last 30 days.</p>
        )}
      </CardContent>
    </Card>
  );
}
