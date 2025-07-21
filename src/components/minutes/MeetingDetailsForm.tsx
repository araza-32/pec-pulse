
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceTracker } from "./AttendanceTracker";
import { ActionItemsTracker } from "./ActionItemsTracker";
import { Calendar, MapPin, FileText, Users, CheckSquare, Upload, Plus, X } from "lucide-react";
import { WorkbodyMember } from "@/types/workbody";
import { ActionItem } from "@/types/index";

interface AttendanceRecord {
  memberId: string;
  memberName: string;
  attended: boolean;
  role: string;
}

interface MeetingDetailsFormProps {
  selectedFile: File | null;
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  meetingDate: string;
  setMeetingDate: (date: string) => void;
  meetingLocation: string;
  setMeetingLocation: (location: string) => void;
  meetingNumber: string;
  setMeetingNumber: (number: string) => void;
  agendaItems: string[];
  setAgendaItems: (items: string[]) => void;
  actionsAgreed: string[];
  setActionsAgreed: (actions: string[]) => void;
  workbodyId: string;
  workbodyMembers: WorkbodyMember[];
  onAttendanceChange: (memberId: string, attended: boolean) => void;
  onActionItemsChange: (items: ActionItem[]) => void;
  previousActions: ActionItem[];
}

export function MeetingDetailsForm({
  selectedFile,
  isUploading,
  onFileChange,
  meetingDate,
  setMeetingDate,
  meetingLocation,
  setMeetingLocation,
  meetingNumber,
  setMeetingNumber,
  agendaItems,
  setAgendaItems,
  actionsAgreed,
  setActionsAgreed,
  workbodyId,
  workbodyMembers,
  onAttendanceChange,
  onActionItemsChange,
  previousActions
}: MeetingDetailsFormProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, ""]);
  };

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index: number, value: string) => {
    const updated = [...agendaItems];
    updated[index] = value;
    setAgendaItems(updated);
  };

  const addActionItem = () => {
    setActionsAgreed([...actionsAgreed, ""]);
  };

  const removeActionItem = (index: number) => {
    setActionsAgreed(actionsAgreed.filter((_, i) => i !== index));
  };

  const updateActionItem = (index: number, value: string) => {
    const updated = [...actionsAgreed];
    updated[index] = value;
    setActionsAgreed(updated);
  };

  const handleAttendanceUpdate = (records: AttendanceRecord[]) => {
    setAttendance(records);
  };

  const handleActionItemsUpdate = (items: ActionItem[]) => {
    setActionItems(items);
    onActionItemsChange(items);
  };

  return (
    <div className="space-y-6">
      {/* Basic Meeting Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meetingDate">Meeting Date *</Label>
              <Input
                id="meetingDate"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="meetingNumber">Meeting Number</Label>
              <Input
                id="meetingNumber"
                type="text"
                value={meetingNumber}
                onChange={(e) => setMeetingNumber(e.target.value)}
                placeholder="e.g., 2024-01"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="meetingLocation">Meeting Location *</Label>
            <Input
              id="meetingLocation"
              type="text"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              placeholder="e.g., PEC Conference Room"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Agenda Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Agenda Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {agendaItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateAgendaItem(index, e.target.value)}
                placeholder={`Agenda item ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeAgendaItem(index)}
                disabled={agendaItems.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addAgendaItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Agenda Item
          </Button>
        </CardContent>
      </Card>

      {/* Attendance Tracking */}
      {workbodyMembers.length > 0 && (
        <AttendanceTracker
          members={workbodyMembers}
          onAttendanceChange={handleAttendanceUpdate}
        />
      )}

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Actions Agreed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionsAgreed.map((action, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={action}
                onChange={(e) => updateActionItem(index, e.target.value)}
                placeholder={`Action item ${index + 1}`}
                className="flex-1"
                rows={2}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeActionItem(index)}
                disabled={actionsAgreed.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addActionItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action Item
          </Button>
        </CardContent>
      </Card>

      {/* Action Items Tracker */}
      <ActionItemsTracker
        workbodyId={workbodyId}
        onActionItemsChange={handleActionItemsUpdate}
        previousActions={previousActions}
      />

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Minutes Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="minutesFile">Minutes File *</Label>
              <Input
                id="minutesFile"
                type="file"
                onChange={onFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
            {selectedFile && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Selected file: {selectedFile.name}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="bg-green-600 hover:bg-green-700"
        >
          {isUploading ? "Uploading..." : "Upload Minutes"}
        </Button>
      </div>
    </div>
  );
}
