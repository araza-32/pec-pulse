
import React from "react";
import { CalendarIcon, FileText, Clock } from "lucide-react";
import { formatDistance } from "date-fns";

interface Meeting {
  id: string;
  date: string;
  workbodyName: string;
  agendaExcerpt?: string;
}

interface MeetingsListProps {
  meetings: Meeting[];
}

export function MeetingsList({ meetings }: MeetingsListProps) {
  if (!meetings || meetings.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No meetings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => {
        // Parse the date string
        const meetingDate = new Date(meeting.date);
        const isUpcoming = meetingDate > new Date();
        
        // Format the relative time
        const relativeTime = formatDistance(
          meetingDate,
          new Date(),
          { addSuffix: true }
        );

        return (
          <div 
            key={meeting.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between">
              <h3 className="font-medium text-lg">{meeting.workbodyName}</h3>
              <div className="px-2 py-1 text-xs rounded-full bg-muted">
                {isUpcoming ? "Upcoming" : "Past"}
              </div>
            </div>
            
            <div className="flex items-center mt-2 text-muted-foreground text-sm">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>
                {new Date(meeting.date).toLocaleDateString()} ({relativeTime})
              </span>
            </div>
            
            {meeting.agendaExcerpt && (
              <div className="mt-2 text-sm flex items-start">
                <FileText className="w-4 h-4 mr-1 mt-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{meeting.agendaExcerpt}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
