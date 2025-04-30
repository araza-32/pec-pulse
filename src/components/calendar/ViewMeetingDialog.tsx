
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin, FileText, Pencil, Trash } from "lucide-react";
import { ScheduledMeeting, Workbody } from "@/types";
import { useState } from "react";
import { EditMeetingDialog } from "./EditMeetingDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ViewMeetingDialogProps {
  meeting: ScheduledMeeting | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (meeting: Partial<ScheduledMeeting>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  workbodies?: Workbody[];
  isLoadingWorkbodies?: boolean;
  userRole?: string;
}

export function ViewMeetingDialog({ 
  meeting, 
  isOpen, 
  onClose,
  onUpdate,
  onDelete,
  workbodies = [],
  isLoadingWorkbodies = false,
  userRole = 'member'
}: ViewMeetingDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const canEditMeeting = userRole === 'admin' || userRole === 'coordination';

  if (!meeting) return null;

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (onDelete) {
      await onDelete(meeting.id);
      onClose();
    }
  };

  const handleViewNotification = () => {
    if (meeting.notificationFilePath) {
      window.open(meeting.notificationFilePath, '_blank');
    }
  };

  return (
    <>
      <Dialog open={isOpen && !isEditMode} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Meeting Details</span>
              {onUpdate && onDelete && canEditMeeting && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleEdit}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleDelete}
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </DialogTitle>
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
                      <p className="text-sm text-muted-foreground mb-2">{meeting.notificationFile}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2"
                        onClick={handleViewNotification}
                      >
                        <FileText className="h-4 w-4" /> View Notification
                      </Button>
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

      {onUpdate && onDelete && canEditMeeting && (
        <EditMeetingDialog
          meeting={meeting}
          isOpen={isEditMode}
          onClose={() => setIsEditMode(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          workbodies={workbodies}
          isLoadingWorkbodies={isLoadingWorkbodies}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this meeting? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
