
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin, FileText } from "lucide-react";
import { ScheduledMeeting } from "@/types";

interface ViewMeetingDialogProps {
  meeting: ScheduledMeeting | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewMeetingDialog({ meeting, isOpen, onClose }: ViewMeetingDialogProps) {
  if (!meeting) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Meeting Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
                    <p className="text-sm text-muted-foreground">{meeting.notificationFile}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
