
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { AttendanceRecord, WorkbodyMember } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, UserCheck, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      const initialAttendance = members.map(member => ({
        memberId: member.id || '',
        memberName: member.name,
        present: false,
        attendanceStatus: 'absent' as const
      }));
      
      console.log("Initializing attendance for members:", initialAttendance);
      setAttendance(initialAttendance);
      
      // Combine with non-members and notify parent
      const combinedAttendance = [
        ...initialAttendance,
        ...nonMembers.map(nm => ({
          memberName: nm.name,
          organization: nm.organization,
          present: true,
          attendanceStatus: 'present-physical' as const
        }))
      ];
      
      onChange(combinedAttendance);
    }
  }, [workbodyId, members]);

  const updateCombinedAttendance = (updatedAttendance: AttendanceRecord[], updatedNonMembers: {name: string, organization: string}[]) => {
    const combinedAttendance = [
      ...updatedAttendance,
      ...updatedNonMembers.map(nm => ({
        memberName: nm.name,
        organization: nm.organization,
        present: true,
        attendanceStatus: 'present-physical' as const
      }))
    ];
    
    console.log("Combined attendance updated:", combinedAttendance);
    onChange(combinedAttendance);
  };

  const handleAttendanceChange = (index: number, status: 'present-physical' | 'present-virtual' | 'absent') => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = {
      ...updatedAttendance[index],
      present: status !== 'absent',
      attendanceStatus: status
    };
    
    console.log(`Updated attendance for ${updatedAttendance[index].memberName}:`, status);
    setAttendance(updatedAttendance);
    updateCombinedAttendance(updatedAttendance, nonMembers);
  };

  const addNonMember = () => {
    if (newAttendee.name.trim() === "") return;
    
    const updatedNonMembers = [...nonMembers, { ...newAttendee }];
    setNonMembers(updatedNonMembers);
    setNewAttendee({ name: "", organization: "" });
    
    console.log("Added non-member:", newAttendee);
    updateCombinedAttendance(attendance, updatedNonMembers);
  };

  const removeNonMember = (index: number) => {
    const updatedNonMembers = [...nonMembers];
    updatedNonMembers.splice(index, 1);
    setNonMembers(updatedNonMembers);
    
    console.log("Removed non-member at index:", index);
    updateCombinedAttendance(attendance, updatedNonMembers);
  };

  if (!workbodyId || members.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        <UserCheck className="mx-auto h-12 w-12 mb-3 text-gray-300" />
        <p className="text-lg">Please select a workbody to mark attendance.</p>
        <p className="text-sm">Member attendance will appear here once a workbody is selected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-medium">Workbody Members Attendance</h3>
          <span className="text-sm text-muted-foreground">({members.length} members)</span>
        </div>
        
        {attendance.map((record, index) => (
          <Card key={`member-${index}-${record.memberId}`} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">{record.memberName}</Label>
                <p className="text-sm text-muted-foreground">
                  Member ID: {record.memberId || 'N/A'}
                </p>
              </div>
              
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
          </Card>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Additional Attendees</h3>
          <span className="text-sm text-muted-foreground">(Non-members)</span>
        </div>
        
        {nonMembers.map((nonMember, index) => (
          <Card key={`non-member-${index}`} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{nonMember.name}</p>
                <p className="text-sm text-muted-foreground">{nonMember.organization}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Present (Physical)
                </span>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => removeNonMember(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        
        <Card className="p-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add External Attendee</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Full Name *"
                value={newAttendee.name}
                onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})}
              />
              <Input
                placeholder="Organization"
                value={newAttendee.organization}
                onChange={(e) => setNewAttendee({...newAttendee, organization: e.target.value})}
              />
            </div>
            
            <Button
              type="button"
              onClick={addNonMember}
              disabled={!newAttendee.name.trim()}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add External Attendee
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
