
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AttendanceRecord, WorkbodyMember } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AttendanceTrackerProps {
  workbodyId: string | null;
  members: WorkbodyMember[];
  onChange: (attendance: AttendanceRecord[]) => void;
}

export function AttendanceTracker({ workbodyId, members, onChange }: AttendanceTrackerProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Initialize attendance records when members change
  useEffect(() => {
    if (workbodyId && members.length > 0) {
      const initialAttendance = members.map(member => ({
        memberId: member.id,
        memberName: member.name,
        present: false,
        attendanceType: undefined
      }));
      setAttendance(initialAttendance);
      onChange(initialAttendance);
    }
  }, [workbodyId, members, onChange]);

  const handlePresenceChange = (memberId: string, present: boolean) => {
    const updatedAttendance = attendance.map(record => {
      if (record.memberId === memberId) {
        return {
          ...record,
          present,
          // Reset attendance type if marked as absent
          attendanceType: present ? record.attendanceType : undefined
        };
      }
      return record;
    });
    
    setAttendance(updatedAttendance);
    onChange(updatedAttendance);
  };

  const handleAttendanceTypeChange = (memberId: string, type: 'physical' | 'virtual') => {
    const updatedAttendance = attendance.map(record => {
      if (record.memberId === memberId) {
        return {
          ...record,
          attendanceType: type
        };
      }
      return record;
    });
    
    setAttendance(updatedAttendance);
    onChange(updatedAttendance);
  };

  if (members.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No members found for this workbody.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Label className="mb-4 block text-lg font-medium">Meeting Attendance</Label>
        
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {attendance.map((record) => (
              <div key={record.memberId} className="border-b pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={`present-${record.memberId}`}
                      checked={record.present}
                      onCheckedChange={(checked) => handlePresenceChange(record.memberId, checked === true)}
                    />
                    <Label 
                      htmlFor={`present-${record.memberId}`}
                      className={record.present ? "font-medium" : "text-muted-foreground"}
                    >
                      {record.memberName}
                    </Label>
                  </div>
                </div>
                
                {record.present && (
                  <div className="mt-2 ml-6">
                    <RadioGroup 
                      value={record.attendanceType}
                      onValueChange={(value) => handleAttendanceTypeChange(record.memberId, value as 'physical' | 'virtual')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="physical" id={`physical-${record.memberId}`} />
                        <Label htmlFor={`physical-${record.memberId}`}>Physical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="virtual" id={`virtual-${record.memberId}`} />
                        <Label htmlFor={`virtual-${record.memberId}`}>Virtual</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Total Members: {members.length}</p>
          <p>Present: {attendance.filter(r => r.present).length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
