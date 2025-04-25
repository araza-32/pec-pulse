
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin } from "lucide-react";
import { WorkbodySelection } from "@/components/minutes/WorkbodySelection";
import { ScheduledMeeting, Workbody } from "@/types";
import { format, parseISO } from "date-fns";

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
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState(() => {
    const workbody = workbodies.find(w => w.id === meeting.workbodyId);
    return workbody?.type || '';
  });
  
  const [formData, setFormData] = useState({
    workbodyId: meeting.workbodyId,
    workbodyName: meeting.workbodyName,
    date: meeting.date,
    time: meeting.time,
    location: meeting.location,
    agendaItems: meeting.agendaItems.join('\n'),
  });

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
          <WorkbodySelection
            selectedWorkbodyType={selectedWorkbodyType}
            selectedWorkbody={formData.workbodyId}
            onWorkbodyTypeChange={setSelectedWorkbodyType}
            onWorkbodyChange={(id) => {
              const workbody = workbodies.find(w => w.id === id);
              setFormData(prev => ({
                ...prev,
                workbodyId: id,
                workbodyName: workbody?.name || prev.workbodyName,
              }));
            }}
            availableWorkbodies={workbodies}
            isLoading={isLoadingWorkbodies}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="pl-10"
                placeholder="Meeting location"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agendaItems">Agenda Items (one per line)</Label>
            <Textarea
              id="agendaItems"
              value={formData.agendaItems}
              onChange={(e) => setFormData({ ...formData, agendaItems: e.target.value })}
              placeholder="Enter agenda items..."
              rows={4}
              required
            />
          </div>

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
