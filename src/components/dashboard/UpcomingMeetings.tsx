
import { CalendarClock, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const UpcomingMeetings = () => {
  const navigate = useNavigate();
  const { meetings } = useScheduledMeetings();
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMMM d, yyyy');
  };

  const upcomingMeetings = meetings.slice(0, 5);

  const handleViewAgenda = (meeting: ScheduledMeeting) => {
    setSelectedMeeting(meeting);
  };

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
                  <div className="mt-2 flex space-x-2">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => navigate('/calendar')}
                    >
                      View Details <ChevronRight className="h-4 w-4 inline" />
                    </Button>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-green-600 hover:text-green-800"
                      onClick={() => handleViewAgenda(meeting)}
                    >
                      View Agenda <FileText className="h-4 w-4 inline" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No upcoming meetings in the next two weeks.</p>
            <Button 
              variant="link" 
              onClick={() => navigate('/calendar')}
              className="mt-2"
            >
              Go to Calendar <ChevronRight className="h-4 w-4 inline" />
            </Button>
          </div>
        )}
      </CardContent>

      {selectedMeeting && (
        <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Meeting Agenda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Workbody: {selectedMeeting.workbodyName}</h3>
                <p className="text-muted-foreground">
                  {formatDate(selectedMeeting.date)} at {selectedMeeting.time}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Agenda Items:</h4>
                <ul className="list-disc pl-5">
                  {selectedMeeting.agendaItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              {selectedMeeting.notificationFile && (
                <div>
                  <h4 className="font-medium mb-2">Notification:</h4>
                  <p className="text-sm">{selectedMeeting.notificationFile}</p>
                  {/* TODO: Add file download functionality */}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
