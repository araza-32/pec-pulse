
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUp, Check, Calendar, MapPin, FileText } from "lucide-react";
import { AttendanceTracker } from "./AttendanceTracker";
import { ActionItemsTracker } from "./ActionItemsTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceRecord, ActionItem, WorkbodyMember } from "@/types";
import { useState } from "react";

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
  workbodyId: string | null;
  workbodyMembers: WorkbodyMember[];
  onAttendanceChange?: (attendance: AttendanceRecord[]) => void;
  onActionItemsChange?: (actionItems: ActionItem[]) => void;
  previousActions?: ActionItem[];
  meetingNumber: string;
  setMeetingNumber: (value: string) => void;
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
  setActionsAgreed,
  workbodyId,
  workbodyMembers,
  onAttendanceChange = () => {},
  onActionItemsChange = () => {},
  previousActions = [],
  meetingNumber,
  setMeetingNumber,
}: MeetingDetailsFormProps) {
  
  const [activeTab, setActiveTab] = useState<string>("basic");
  const agendaItemsArray = agendaItems.split('\n').filter(item => item.trim() !== '');
  const actionsAgreedArray = actionsAgreed.split('\n').filter(item => item.trim() !== '');
  
  const handleDateChange = (date: string) => {
    setMeetingDate(date);
    if (date && meetingLocation && meetingNumber) {
      setTimeout(() => setActiveTab("attendance"), 500);
    }
  };
  
  const handleLocationChange = (location: string) => {
    setMeetingLocation(location);
    if (meetingDate && location && meetingNumber) {
      setTimeout(() => setActiveTab("attendance"), 500);
    }
  };

  const handleMeetingNumberChange = (number: string) => {
    setMeetingNumber(number);
    if (meetingDate && meetingLocation && number) {
      setTimeout(() => setActiveTab("attendance"), 500);
    }
  };

  const handleAttendanceChange = (attendance: AttendanceRecord[]) => {
    console.log("Attendance change in form:", attendance);
    onAttendanceChange(attendance);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="basic" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Basic Details
        </TabsTrigger>
        <TabsTrigger value="attendance" className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Attendance
        </TabsTrigger>
        <TabsTrigger value="actions" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Action Items
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="meeting-number" className="flex items-center gap-2">
                <span className="text-red-500">*</span>
                Meeting Number
              </Label>
              <Input 
                id="meeting-number" 
                placeholder="e.g., 01/2024, 15th Meeting" 
                required 
                value={meetingNumber}
                onChange={(e) => handleMeetingNumberChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the sequential meeting number for this workbody
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meeting-date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-red-500">*</span>
                Meeting Date
              </Label>
              <Input 
                id="meeting-date" 
                type="date" 
                required 
                value={meetingDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meeting-location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-red-500">*</span>
                Meeting Location
              </Label>
              <Input 
                id="meeting-location" 
                placeholder="e.g., PEC Headquarters, Islamabad" 
                required
                value={meetingLocation}
                onChange={(e) => handleLocationChange(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda-items">
              <span className="text-red-500">*</span>
              Agenda Items (one per line)
            </Label>
            <Textarea
              id="agenda-items"
              placeholder="List the agenda items discussed in the meeting"
              rows={4}
              required
              value={agendaItems}
              onChange={(e) => setAgendaItems(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter each agenda item on a new line
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="actions-agreed">
              <span className="text-red-500">*</span>
              Actions Agreed (one per line)
            </Label>
            <Textarea
              id="actions-agreed"
              placeholder="List the actions agreed upon in the meeting"
              rows={4}
              required
              value={actionsAgreed}
              onChange={(e) => setActionsAgreed(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter each action item on a new line
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minutes-file">
              <span className="text-red-500">*</span>
              Upload Minutes PDF
            </Label>
            <div className="mt-1 flex items-center gap-4">
              <Input
                id="minutes-file"
                type="file"
                accept=".pdf"
                onChange={onFileChange}
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {selectedFile && (
                <div className="flex items-center rounded-md bg-green-50 border border-green-200 p-2 text-sm">
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                  <span className="text-green-800">{selectedFile.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload the official minutes in PDF format (max 10MB)
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setActiveTab("attendance")}
              className="bg-green-600 hover:bg-green-700"
              disabled={!meetingDate || !meetingLocation || !meetingNumber}
            >
              Next: Mark Attendance
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="attendance">
        <AttendanceTracker
          workbodyId={workbodyId}
          members={workbodyMembers}
          onChange={handleAttendanceChange}
        />
        
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveTab("basic")}
          >
            Back to Basic Details
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab("actions")}
            className="bg-green-600 hover:bg-green-700"
          >
            Next: Record Actions
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="actions">
        <ActionItemsTracker
          actionsAgreed={actionsAgreedArray}
          onChange={onActionItemsChange}
          previousActions={previousActions}
        />
        
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveTab("attendance")}
          >
            Back to Attendance
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isUploading || !selectedFile}
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
      </TabsContent>
    </Tabs>
  );
}
