
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkbodySelection } from "@/components/minutes/WorkbodySelection";
import { useToast } from "@/hooks/use-toast";
import { Workbody } from "@/types";

interface AddMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeeting: (meeting: any) => Promise<void>;
  workbodies: Workbody[];
  isLoadingWorkbodies: boolean;
}

export function AddMeetingDialog({
  isOpen,
  onClose,
  onAddMeeting,
  workbodies,
  isLoadingWorkbodies,
}: AddMeetingDialogProps) {
  const { toast } = useToast();
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState('');
  const [selectedWorkbodyId, setSelectedWorkbodyId] = useState('');
  const [notificationFile, setNotificationFile] = useState<File | null>(null);
  const [agendaFile, setAgendaFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "10:00",
    location: "",
    agendaItems: "",
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedWorkbodyType) {
      errors.workbodyType = 'Workbody type is required';
    }
    
    if (!selectedWorkbodyId) {
      errors.workbodyId = 'Workbody is required';
    }
    
    if (!newMeeting.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!newMeeting.agendaItems.trim()) {
      errors.agendaItems = 'At least one agenda item is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Failed",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedWorkbody = workbodies.find(wb => wb.id === selectedWorkbodyId);
    if (!selectedWorkbody) {
      toast({
        title: "Invalid Workbody",
        description: "Please select a valid workbody.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload files if they exist
      let notificationFilePath = null;
      let agendaFilePath = null;
      
      if (notificationFile) {
        const fileExt = notificationFile.name.split('.').pop();
        const fileName = `${Date.now()}-notification.${fileExt}`;
        const filePath = `meeting-notifications/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('workbody-documents')
          .upload(filePath, notificationFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('workbody-documents')
          .getPublicUrl(filePath);
          
        notificationFilePath = publicUrl;
      }
      
      if (agendaFile) {
        const fileExt = agendaFile.name.split('.').pop();
        const fileName = `${Date.now()}-agenda.${fileExt}`;
        const filePath = `meeting-agendas/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('workbody-documents')
          .upload(filePath, agendaFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('workbody-documents')
          .getPublicUrl(filePath);
          
        agendaFilePath = publicUrl;
      }
      
      await onAddMeeting({
        workbodyId: selectedWorkbodyId,
        workbodyName: selectedWorkbody.name,
        date: newMeeting.date,
        time: newMeeting.time,
        location: newMeeting.location,
        agendaItems: newMeeting.agendaItems.split('\n').filter(item => item.trim() !== ''),
        notificationFile: notificationFile ? notificationFile.name : null,
        notificationFilePath: notificationFilePath,
        agendaFile: agendaFile ? agendaFile.name : null,
        agendaFilePath: agendaFilePath
      });

      toast({
        title: "Success",
        description: "Meeting scheduled successfully.",
      });

      // Reset form
      setSelectedWorkbodyType('');
      setSelectedWorkbodyId('');
      setNewMeeting({
        date: new Date().toISOString().split('T')[0],
        time: "10:00",
        location: "",
        agendaItems: "",
      });
      setNotificationFile(null);
      setAgendaFile(null);
      setFormErrors({});
      onClose();
    } catch (error: any) {
      console.error("Failed to schedule meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule the meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Meeting</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a new workbody meeting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <WorkbodySelection
            selectedWorkbodyType={selectedWorkbodyType}
            selectedWorkbody={selectedWorkbodyId}
            onWorkbodyTypeChange={setSelectedWorkbodyType}
            onWorkbodyChange={setSelectedWorkbodyId}
            availableWorkbodies={workbodies}
            isLoading={isLoadingWorkbodies}
          />
          
          {formErrors.workbodyType && (
            <p className="text-sm font-medium text-destructive mt-1">{formErrors.workbodyType}</p>
          )}
          
          {formErrors.workbodyId && (
            <p className="text-sm font-medium text-destructive mt-1">{formErrors.workbodyId}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date <span className="text-destructive">*</span></Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time <span className="text-destructive">*</span></Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
            <Input
              id="location"
              name="location"
              placeholder="Meeting location"
              value={newMeeting.location}
              onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agendaItems">Agenda Items (one per line) <span className="text-destructive">*</span></Label>
            <Textarea
              id="agendaItems"
              name="agendaItems"
              placeholder="Enter agenda items (one per line)"
              rows={4}
              value={newMeeting.agendaItems}
              onChange={(e) => setNewMeeting({ ...newMeeting, agendaItems: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agendaFile">
              Upload Meeting Agenda (PDF)
            </Label>
            <Input 
              id="agendaFile" 
              type="file" 
              accept=".pdf"
              onChange={(e) => setAgendaFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">
              Upload the detailed agenda document in PDF format
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationFile">
              Upload Meeting Notification
            </Label>
            <Input 
              id="notificationFile" 
              type="file" 
              onChange={(e) => setNotificationFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
