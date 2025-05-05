
import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { ScheduledMeeting } from "@/types";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { ViewMeetingDialog } from "@/components/calendar/ViewMeetingDialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddMeetingDialog } from "@/components/calendar/AddMeetingDialog";

export default function MeetingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { meetings, isLoading: isLoadingMeetings, updateMeeting, deleteMeeting, addMeeting, refetchMeetings } = useScheduledMeetings();
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddMeetingDialogOpen, setIsAddMeetingDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const { toast } = useToast();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { session } = useAuth();
  
  // Determine if user has edit permissions
  const canEditMeetings = session?.role === 'admin' || session?.role === 'secretary';

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: 0, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }

  const handleUpdateMeeting = async (updates: Partial<ScheduledMeeting>) => {
    if (!selectedMeeting) return;
    try {
      // Validate that all required fields are filled
      const updatedMeeting = { ...selectedMeeting, ...updates };
      if (!updatedMeeting.date || !updatedMeeting.time || !updatedMeeting.workbodyId || !updatedMeeting.location) {
        toast({
          title: "Missing Information",
          description: "Please fill all required fields",
          variant: "destructive"
        });
        return;
      }
      
      // Check for duplicate meetings (excluding this one)
      const potentialDuplicates = meetings.filter(meeting => 
        meeting.id !== selectedMeeting.id &&
        meeting.date === updatedMeeting.date && 
        meeting.time === updatedMeeting.time && 
        meeting.workbodyId === updatedMeeting.workbodyId
      );
      
      if (potentialDuplicates.length > 0) {
        toast({
          title: "Duplicate Meeting",
          description: "A meeting for this workbody at this time already exists.",
          variant: "destructive"
        });
        return;
      }
      
      await updateMeeting(selectedMeeting.id, updates);
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
      setIsViewDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id);
      setIsViewDialogOpen(false);
      setSelectedMeeting(null);
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive"
      });
    }
  };

  const viewMeeting = (meeting: ScheduledMeeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };

  const viewNotification = () => {
    if (selectedMeeting?.notificationFilePath) {
      setIsNotificationOpen(true);
    } else {
      toast({
        title: "No Notification",
        description: "There is no notification file available for this meeting.",
        variant: "destructive"
      });
    }
  };

  // Handle adding a new meeting
  const handleAddMeeting = async (newMeeting: Omit<ScheduledMeeting, 'id'>) => {
    try {
      await addMeeting(newMeeting);
      await refetchMeetings(); // Force refresh to ensure new meeting appears
      setIsAddMeetingDialogOpen(false);
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meeting Calendar</h1>
        <p className="text-muted-foreground">
          View scheduled workbody meetings
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
          onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
        />
        
        {canEditMeetings && (
          <Button 
            onClick={() => setIsAddMeetingDialogOpen(true)}
            className="bg-pec-green hover:bg-pec-green/90"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 bg-white rounded-lg p-4 shadow-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center font-semibold text-xs"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, i) => (
          <CalendarDay
            key={i}
            day={day}
            currentDate={currentDate}
            meetings={day.isCurrentMonth ? getMeetingsForDay(day.day, currentDate, meetings) : []}
            onViewMeeting={viewMeeting}
          />
        ))}
      </div>

      {/* Dialogs */}
      <ViewMeetingDialog
        meeting={selectedMeeting}
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedMeeting(null);
        }}
        onUpdate={canEditMeetings ? handleUpdateMeeting : undefined}
        onDelete={canEditMeetings ? handleDeleteMeeting : undefined}
        workbodies={workbodies}
        isLoadingWorkbodies={isLoadingWorkbodies}
        userRole={session?.role}
      />

      {/* Add Meeting Dialog */}
      {canEditMeetings && (
        <AddMeetingDialog
          isOpen={isAddMeetingDialogOpen}
          onClose={() => setIsAddMeetingDialogOpen(false)}
          onAddMeeting={handleAddMeeting}
          workbodies={workbodies}
          isLoadingWorkbodies={isLoadingWorkbodies}
        />
      )}

      {/* PDF Viewer Dialog */}
      <Dialog 
        open={isNotificationOpen} 
        onOpenChange={(open) => setIsNotificationOpen(open)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] h-[90vh] flex flex-col p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Meeting Notification</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsNotificationOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {selectedMeeting?.notificationFilePath && (
              <iframe 
                src={selectedMeeting.notificationFilePath} 
                className="w-full h-full border-0"
                title="Meeting Notification"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getMeetingsForDay(day: number, currentDate: Date, meetings: ScheduledMeeting[]): ScheduledMeeting[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  return meetings.filter(meeting => meeting.date === dateStr);
}
