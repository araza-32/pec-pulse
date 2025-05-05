
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { ScheduledMeeting } from "@/types";
import { format, parseISO } from "date-fns";

interface MeetingDetailsProps {
  meeting: ScheduledMeeting;
  onViewNotification?: () => void;
}

export function MeetingDetails({ meeting, onViewNotification }: MeetingDetailsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {meeting.workbodyName}
            </h3>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>
              {format(parseISO(meeting.date), "EEEE, MMMM d, yyyy")}
            </span>
            <Clock className="ml-3 mr-1 h-4 w-4" />
            <span>{meeting.time}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{meeting.location}</span>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <FileText className="mr-1 h-4 w-4" />
              Agenda Items
            </h4>
            <ul className="space-y-1 text-sm">
              {meeting.agendaItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {meeting.notificationFile && (
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <FileText className="mr-1 h-4 w-4" />
                Attached Notification
              </h4>
              <p className="text-sm text-muted-foreground mb-2">{meeting.notificationFile}</p>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2"
                onClick={onViewNotification}
              >
                <FileText className="h-4 w-4" /> View Notification
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
