
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AttendanceRecord, WorkbodyMember } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface AttendanceTrackerProps {
  workbodyId: string | null;
  members: WorkbodyMember[];
  onChange: (attendance: AttendanceRecord[]) => void;
}

export function AttendanceTracker({
  workbodyId,
  members,
  onChange
}: AttendanceTrackerProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [nonMembers, setNonMembers] = useState<{name: string, organization: string}[]>([]);
  const [newAttendee, setNewAttendee] = useState({ name: "", organization: "" });

  useEffect(() => {
    if (workbodyId && members.length > 0) {
      // Initialize attendance records for each member
      const initialAttendance = members.map(member => ({
        memberId: member.id || '',
        memberName: member.name,
        present: false,
        remarks: ''
      }));
      setAttendance(initialAttendance);
      onChange(initialAttendance);
    }
  }, [workbodyId, members, onChange]);

  const handleAttendanceChange = (index: number, present: boolean) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = {
      ...updatedAttendance[index],
      present
    };
    setAttendance(updatedAttendance);
    
    // Combine member attendance and non-member attendance
    const combinedAttendance = [
      ...updatedAttendance,
      ...nonMembers.map(nm => ({
        memberName: nm.name,
        organization: nm.organization,
        present: true,
        remarks: ''
      }))
    ];
    
    onChange(combinedAttendance);
  };

  const handleRemarksChange = (index: number, remarks: string) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = {
      ...updatedAttendance[index],
      remarks
    };
    setAttendance(updatedAttendance);
    
    // Combine member attendance and non-member attendance
    const combinedAttendance = [
      ...updatedAttendance,
      ...nonMembers.map(nm => ({
        memberName: nm.name,
        organization: nm.organization,
        present: true,
        remarks: ''
      }))
    ];
    
    onChange(combinedAttendance);
  };

  const addNonMember = () => {
    if (newAttendee.name.trim() === "") return;
    
    const updatedNonMembers = [...nonMembers, newAttendee];
    setNonMembers(updatedNonMembers);
    setNewAttendee({ name: "", organization: "" });
    
    // Combine member attendance and non-member attendance
    const combinedAttendance = [
      ...attendance,
      ...updatedNonMembers.map(nm => ({
        memberName: nm.name,
        organization: nm.organization,
        present: true,
        remarks: ''
      }))
    ];
    
    onChange(combinedAttendance);
  };

  const removeNonMember = (index: number) => {
    const updatedNonMembers = [...nonMembers];
    updatedNonMembers.splice(index, 1);
    setNonMembers(updatedNonMembers);
    
    // Combine member attendance and non-member attendance
    const combinedAttendance = [
      ...attendance,
      ...updatedNonMembers.map(nm => ({
        memberName: nm.name,
        organization: nm.organization,
        present: true,
        remarks: ''
      }))
    ];
    
    onChange(combinedAttendance);
  };

  if (!workbodyId || members.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        <p>Please select a workbody to mark attendance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Workbody Members Attendance</h3>
        
        {attendance.map((record, index) => (
          <div key={index} className="flex items-start space-x-4 py-3 border-b last:border-0">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`member-${index}`}
                checked={record.present}
                onCheckedChange={(checked) => handleAttendanceChange(index, checked as boolean)}
              />
              <Label htmlFor={`member-${index}`} className="text-base font-medium">
                {record.memberName}
              </Label>
            </div>
            
            {record.present && (
              <Textarea
                placeholder="Any remarks about this member's attendance or participation"
                value={record.remarks}
                onChange={(e) => handleRemarksChange(index, e.target.value)}
                className="ml-auto w-2/3"
                rows={1}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Attendees</h3>
        
        {nonMembers.map((nonMember, index) => (
          <Card key={index} className="mb-2">
            <CardContent className="pt-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{nonMember.name}</p>
                <p className="text-sm text-muted-foreground">{nonMember.organization}</p>
              </div>
              <button 
                onClick={() => removeNonMember(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </CardContent>
          </Card>
        ))}
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Attendee Name"
            value={newAttendee.name}
            onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})}
          />
          <Input
            placeholder="Organization"
            value={newAttendee.organization}
            onChange={(e) => setNewAttendee({...newAttendee, organization: e.target.value})}
          />
        </div>
        
        <button
          type="button"
          onClick={addNonMember}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          disabled={!newAttendee.name.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
          Add External Attendee
        </button>
      </div>
    </div>
  );
}
