
import { CalendarClock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Meeting {
  id: string;
  workbodyId: string;
  workbodyName: string;
  date: string;
  time: string;
  location: string;
  agendaItems: string[];
}

interface UpcomingMeetingsProps {
  meetings: Meeting[];
}

export const UpcomingMeetings = ({ meetings }: UpcomingMeetingsProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        {meetings && meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map(meeting => (
              <div 
                key={meeting.id} 
                className="flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="bg-blue-100 rounded p-2 text-blue-700 flex-shrink-0">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{meeting.workbodyName}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(meeting.date)} at {meeting.time}
                  </div>
                  <div className="mt-2">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => {/* Add view agenda handler */}}
                    >
                      View Agenda <ChevronRight className="h-4 w-4 inline" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming meetings scheduled.</p>
        )}
      </CardContent>
    </Card>
  );
};
