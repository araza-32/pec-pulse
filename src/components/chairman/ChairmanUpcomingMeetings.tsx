
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { ScheduledMeeting } from "@/types";
import { useNavigate } from "react-router-dom";

interface ChairmanUpcomingMeetingsProps {
  upcomingMeetings: ScheduledMeeting[];
}

export function ChairmanUpcomingMeetings({ upcomingMeetings }: ChairmanUpcomingMeetingsProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };
  
  const handleViewAllMeetings = () => {
    navigate('/calendar');
  };

  if (upcomingMeetings.length === 0) {
    return (
      <div className="text-left py-6">
        <p className="text-muted-foreground">No upcoming meetings scheduled in the next 30 days.</p>
        <Button 
          variant="outline" 
          onClick={handleViewAllMeetings}
          className="mt-4"
        >
          View Calendar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingMeetings.map((meeting) => (
        <div 
          key={meeting.id} 
          className="flex flex-col border rounded-lg p-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="font-medium">{meeting.workbodyName || "Unnamed Meeting"}</h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(meeting.date)} at {meeting.time.substring(0, 5)}
              </p>
            </div>
            <div className="flex shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 mr-2"
                onClick={() => navigate(`/calendar`)}
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Details
              </Button>
              
              {meeting.notificationFilePath && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Notification
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-sm font-medium">Location: <span className="font-normal">{meeting.location}</span></p>
          </div>
          
          {meeting.agendaItems && meeting.agendaItems.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Agenda:</p>
              <ul className="list-disc list-inside text-sm ml-2 text-muted-foreground">
                {meeting.agendaItems.slice(0, 3).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
                {meeting.agendaItems.length > 3 && (
                  <li className="list-none text-sm font-medium">
                    +{meeting.agendaItems.length - 3} more items
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
