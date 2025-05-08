
import { format, parseISO } from "date-fns";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MeetingMinutes, Workbody } from "@/types";

interface RecentMeetingMinutesProps {
  recentMeetings: MeetingMinutes[];
  workbodies: Workbody[];
}

export function RecentMeetingMinutes({ recentMeetings, workbodies }: RecentMeetingMinutesProps) {
  const navigate = useNavigate();
  
  const formatDate = (date: string) => {
    try {
      return format(parseISO(date), 'MMMM d, yyyy');
    } catch (e) {
      return date;
    }
  };

  if (recentMeetings.length === 0) {
    return (
      <div className="text-left py-8">
        <p className="text-muted-foreground">No recent meeting minutes available.</p>
      </div>
    );
  }

  const handleViewMinutes = (meeting: MeetingMinutes) => {
    // Navigate to meeting minutes viewer
    navigate(`/minutes/${meeting.id}`);
  };

  return (
    <div className="space-y-4">
      {recentMeetings.map((meeting) => (
        <div 
          key={meeting.id}
          className="flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <div className="bg-green-100 rounded p-2 text-green-700 flex-shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-grow text-left">
            <div className="font-medium">
              {meeting.workbodyName || getWorkbodyName(meeting.workbodyId, workbodies)}
            </div>
            <div className="text-sm text-muted-foreground">
              Meeting on {formatDate(meeting.date)}
            </div>
            <div className="text-sm text-muted-foreground">
              {meeting.location}
            </div>
            <Button 
              variant="link" 
              className="px-0 h-8"
              onClick={() => handleViewMinutes(meeting)}
            >
              View Minutes
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function getWorkbodyName(workbodyId: string, workbodies: Workbody[]): string {
  const workbody = workbodies.find(w => w.id === workbodyId);
  return workbody?.name || "Unknown Workbody";
}
