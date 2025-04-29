
import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { ScheduledMeeting } from "@/types";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { AddMeetingDialog } from "@/components/calendar/AddMeetingDialog";
import { ViewMeetingDialog } from "@/components/calendar/ViewMeetingDialog";
import { useToast } from "@/hooks/use-toast";
import { GoogleCalendarIntegration } from "@/components/calendar/GoogleCalendarIntegration";

export default function MeetingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { meetings, isLoading: isLoadingMeetings, addMeeting, updateMeeting, deleteMeeting } = useScheduledMeetings();
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const { toast } = useToast();

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

  const handleAddMeeting = async (meetingData: Omit<ScheduledMeeting, 'id'>) => {
    try {
      await addMeeting(meetingData);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateMeeting = async (updates: Partial<ScheduledMeeting>) => {
    if (!selectedMeeting) return;
    try {
      await updateMeeting(selectedMeeting.id, updates);
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
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
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    } catch (error) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meeting Calendar</h1>
        <p className="text-muted-foreground">
          View and manage scheduled workbody meetings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
            onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
            onAddMeeting={() => setIsAddDialogOpen(true)}
          />
        </div>
        <div className="md:col-span-1">
          <GoogleCalendarIntegration />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
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
      <AddMeetingDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddMeeting={handleAddMeeting}
        workbodies={workbodies}
        isLoadingWorkbodies={isLoadingWorkbodies}
      />

      <ViewMeetingDialog
        meeting={selectedMeeting}
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedMeeting(null);
        }}
        onUpdate={handleUpdateMeeting}
        onDelete={handleDeleteMeeting}
        workbodies={workbodies}
        isLoadingWorkbodies={isLoadingWorkbodies}
      />
    </div>
  );
}

function getMeetingsForDay(day: number, currentDate: Date, meetings: ScheduledMeeting[]): ScheduledMeeting[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  return meetings.filter(meeting => meeting.date === dateStr);
}
