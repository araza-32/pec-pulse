
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin } from "lucide-react";
import { WorkbodySelection } from "@/components/minutes/WorkbodySelection";
import { Workbody } from "@/types";

interface MeetingFormData {
  workbodyId: string;
  workbodyName: string;
  date: string;
  time: string;
  location: string;
  agendaItems: string;
}

interface MeetingFormProps {
  formData: MeetingFormData;
  onFormChange: (newData: Partial<MeetingFormData>) => void;
  workbodies: Workbody[];
  isLoadingWorkbodies: boolean;
}

export function MeetingForm({
  formData,
  onFormChange,
  workbodies,
  isLoadingWorkbodies,
}: MeetingFormProps) {
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState(() => {
    const workbody = workbodies.find(w => w.id === formData.workbodyId);
    return workbody?.type || '';
  });

  return (
    <div className="space-y-4">
      <WorkbodySelection
        selectedWorkbodyType={selectedWorkbodyType}
        selectedWorkbody={formData.workbodyId}
        onWorkbodyTypeChange={setSelectedWorkbodyType}
        onWorkbodyChange={(id) => {
          const workbody = workbodies.find(w => w.id === id);
          onFormChange({
            workbodyId: id,
            workbodyName: workbody?.name || formData.workbodyName,
          });
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
              onChange={(e) => onFormChange({ date: e.target.value })}
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
              onChange={(e) => onFormChange({ time: e.target.value })}
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
            onChange={(e) => onFormChange({ location: e.target.value })}
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
          onChange={(e) => onFormChange({ agendaItems: e.target.value })}
          placeholder="Enter agenda items..."
          rows={4}
          required
        />
      </div>
    </div>
  );
}
