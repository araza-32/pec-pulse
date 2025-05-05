
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { ScheduledMeeting, Workbody } from "@/types";
import { useState } from "react";
import { EditMeetingDialog } from "./EditMeetingDialog";
import { MeetingDetails } from "./MeetingDetails";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

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
            <MeetingDetails 
              meeting={meeting} 
              onViewNotification={handleViewNotification} 
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
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
