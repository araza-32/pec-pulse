
import { CalendarClock, ChevronRight, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScheduledMeeting } from "@/types";
import { Badge } from "@/components/ui/badge";

export const UpcomingMeetings = () => {
  const navigate = useNavigate();
  const { meetings, isLoading } = useScheduledMeetings();
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMMM d, yyyy');
  };

  // Always get the upcoming meetings (next two weeks)
  const upcomingMeetings = meetings.slice(0, 5);

  const handleViewAgenda = (meeting: ScheduledMeeting) => {
    setSelectedMeeting(meeting);
  };

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Upcoming Meetings</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/calendar')}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          View Calendar
        </Button>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Loading upcoming meetings...</p>
          </div>
        ) : upcomingMeetings.length > 0 ? (
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
                  <div className="text-sm text-muted-foreground mt-1">
                    Location: {meeting.location}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleViewAgenda(meeting)}
                    >
                      <Eye className="h-3 w-3 mr-1" /> View Details
                    </Button>
                    {meeting.notificationFile && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <FileText className="h-3 w-3 mr-1 inline" /> Notification Available
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {meetings.length > 5 && (
              <Button 
                variant="link" 
                onClick={() => navigate('/calendar')}
                className="w-full mt-2"
              >
                View all {meetings.length} upcoming meetings <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-6">
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Meeting Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{selectedMeeting.workbodyName}</h3>
                <p className="text-muted-foreground">
                  {formatDate(selectedMeeting.date)} at {selectedMeeting.time}
                </p>
                <p className="text-muted-foreground">
                  Location: {selectedMeeting.location}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Agenda Items:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedMeeting.agendaItems.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
              
              {selectedMeeting.notificationFile && (
                <div>
                  <h4 className="font-medium mb-2">Meeting Notification:</h4>
                  <div className="flex items-center space-x-2 bg-green-50 p-2 rounded border border-green-200">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{selectedMeeting.notificationFile}</span>
                  </div>
                  {selectedMeeting.notificationFilePath && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.open(selectedMeeting.notificationFilePath, '_blank')}
                    >
                      View Notification
                    </Button>
                  )}
                </div>
              )}
              
              <div className="pt-4 flex justify-end">
                <Button onClick={() => setSelectedMeeting(null)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
