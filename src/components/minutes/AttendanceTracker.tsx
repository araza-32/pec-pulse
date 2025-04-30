
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { AttendanceRecord, WorkbodyMember } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, UserCheck, X } from "lucide-react";

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
      // Initialize attendance records for each member with the correct type for attendanceStatus
      const initialAttendance = members.map(member => ({
        memberId: member.id || '',
        memberName: member.name,
        present: false,
        attendanceStatus: 'absent' as 'absent' | 'present-physical' | 'present-virtual'
      }));
      setAttendance(initialAttendance);
      onChange(initialAttendance);
    }
  }, [workbodyId, members, onChange]);

  const handleAttendanceChange = (index: number, status: 'present-physical' | 'present-virtual' | 'absent') => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = {
      ...updatedAttendance[index],
      present: status !== 'absent', // Set present to true for both "present" options
      attendanceStatus: status
    };
    setAttendance(updatedAttendance);
    
    // Combine member attendance and non-member attendance
    const combinedAttendance = [
      ...updatedAttendance,
      ...nonMembers.map(nm => ({
        memberName: nm.name,
        organization: nm.organization,
        present: true,
        attendanceStatus: 'present-physical' as const
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
        attendanceStatus: 'present-physical' as const
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
        attendanceStatus: 'present-physical' as const
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
          <div key={index} className="flex items-center py-3 border-b last:border-0">
            <div className="flex flex-col space-y-2 w-full">
              <Label className="text-base font-medium">
                {record.memberName}
              </Label>
              
              <RadioGroup
                value={record.attendanceStatus}
                onValueChange={(value) => handleAttendanceChange(
                  index, 
                  value as 'present-physical' | 'present-virtual' | 'absent'
                )}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="present-physical" id={`physical-${index}`} />
                  <Label htmlFor={`physical-${index}`} className="text-sm flex items-center cursor-pointer">
                    <Check className="h-4 w-4 mr-1 text-green-600" />
                    Physical
                  </Label>
                </div>
                
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="present-virtual" id={`virtual-${index}`} />
                  <Label htmlFor={`virtual-${index}`} className="text-sm flex items-center cursor-pointer">
                    <UserCheck className="h-4 w-4 mr-1 text-blue-600" />
                    Virtual
                  </Label>
                </div>
                
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="absent" id={`absent-${index}`} />
                  <Label htmlFor={`absent-${index}`} className="text-sm flex items-center cursor-pointer">
                    <X className="h-4 w-4 mr-1 text-red-600" />
                    Absent
                  </Label>
                </div>
              </RadioGroup>
            </div>
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
