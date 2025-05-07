
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScheduledMeeting } from "@/types";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface MeetingDetailsProps {
  meeting: ScheduledMeeting;
  onViewNotification?: () => void;
}

export function MeetingDetails({ meeting, onViewNotification }: MeetingDetailsProps) {
  // Ensure agendaItems is an array
  const safeAgendaItems = Array.isArray(meeting.agendaItems) ? meeting.agendaItems : [];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{meeting.workbodyName}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="text-xs">Date:</span>
            <span>{format(new Date(meeting.date), 'MMM dd, yyyy')}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="text-xs">Time:</span>
            <span>{meeting.time || 'TBD'}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="text-xs">Location:</span>
            <span>{meeting.location || 'TBD'}</span>
          </Badge>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-semibold mb-2">Agenda Items</h4>
        {safeAgendaItems.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {safeAgendaItems.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No agenda items have been added yet.</p>
        )}
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-semibold mb-2">Documents</h4>
        {meeting.notificationFile ? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={onViewNotification}
          >
            <FileText className="h-4 w-4" />
            <span>Notification Letter</span>
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">No documents have been uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
