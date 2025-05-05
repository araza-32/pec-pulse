
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScheduledMeeting, Workbody } from "@/types";
import { MeetingForm } from "./MeetingForm";

interface EditMeetingDialogProps {
  meeting: ScheduledMeeting;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (meeting: Partial<ScheduledMeeting>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  workbodies: Workbody[];
  isLoadingWorkbodies: boolean;
}

export function EditMeetingDialog({
  meeting,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  workbodies,
  isLoadingWorkbodies,
}: EditMeetingDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    workbodyId: meeting.workbodyId,
    workbodyName: meeting.workbodyName,
    date: meeting.date,
    time: meeting.time,
    location: meeting.location,
    agendaItems: meeting.agendaItems.join('\n'),
  });

  const handleFormChange = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdate({
        ...formData,
        agendaItems: formData.agendaItems.split('\n').filter(item => item.trim() !== ''),
      });

      toast({
        title: "Meeting Updated",
        description: "The meeting has been successfully updated.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update the meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(meeting.id);
      toast({
        title: "Meeting Deleted",
        description: "The meeting has been successfully deleted.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
          <DialogDescription>
            Update the details of the scheduled meeting.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <MeetingForm
            formData={formData}
            onFormChange={handleFormChange}
            workbodies={workbodies}
            isLoadingWorkbodies={isLoadingWorkbodies}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete Meeting
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
