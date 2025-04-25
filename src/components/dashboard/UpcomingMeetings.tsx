
import { CalendarClock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";

export const UpcomingMeetings = () => {
  const navigate = useNavigate();
  const { meetings } = useScheduledMeetings();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const sortedMeetings = [...meetings].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const futureMeetings = sortedMeetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return meetingDate >= today;
  });

  const upcomingMeetings = futureMeetings.slice(0, 5);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        {upcomingMeetings.length > 0 ? (
          <div className="space-y-4">
            {upcomingMeetings.map(meeting => (
              <div 
                key={meeting.id} 
                className="flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors animate-fade-in"
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
                      onClick={() => navigate('/meeting-calendar')}
                    >
                      View Details <ChevronRight className="h-4 w-4 inline" />
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
