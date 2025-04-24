
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUp, Check } from "lucide-react";

interface MeetingDetailsFormProps {
  selectedFile: File | null;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  meetingDate: string;
  setMeetingDate: (value: string) => void;
  meetingLocation: string;
  setMeetingLocation: (value: string) => void;
  agendaItems: string;
  setAgendaItems: (value: string) => void;
  actionsAgreed: string;
  setActionsAgreed: (value: string) => void;
}

export function MeetingDetailsForm({
  selectedFile,
  isUploading,
  onFileChange,
  meetingDate,
  setMeetingDate,
  meetingLocation,
  setMeetingLocation,
  agendaItems,
  setAgendaItems,
  actionsAgreed,
  setActionsAgreed
}: MeetingDetailsFormProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="meeting-date">Meeting Date</Label>
          <Input 
            id="meeting-date" 
            type="date" 
            required 
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-location">Meeting Location</Label>
          <Input 
            id="meeting-location" 
            placeholder="e.g., PEC Headquarters, Islamabad" 
            required
            value={meetingLocation}
            onChange={(e) => setMeetingLocation(e.target.value)} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agenda-items">Agenda Items (one per line)</Label>
        <Textarea
          id="agenda-items"
          placeholder="List the agenda items discussed in the meeting"
          rows={3}
          required
          value={agendaItems}
          onChange={(e) => setAgendaItems(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="actions-agreed">Actions Agreed (one per line)</Label>
        <Textarea
          id="actions-agreed"
          placeholder="List the actions agreed upon in the meeting"
          rows={4}
          required
          value={actionsAgreed}
          onChange={(e) => setActionsAgreed(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="minutes-file">Upload Minutes PDF</Label>
        <div className="mt-1 flex items-center gap-4">
          <Input
            id="minutes-file"
            type="file"
            accept=".pdf"
            onChange={onFileChange}
            required
          />
          {selectedFile && (
            <div className="flex items-center rounded-md bg-muted p-2 text-sm">
              <Check className="mr-2 h-4 w-4 text-pec-green" />
              {selectedFile.name}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Upload the official minutes in PDF format (max 10MB)
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-pec-green hover:bg-pec-green-600"
          disabled={isUploading}
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" />
              Upload Minutes
            </>
          )}
        </Button>
      </div>
    </>
  );
}
