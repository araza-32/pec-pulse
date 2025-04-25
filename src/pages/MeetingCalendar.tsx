
import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { ScheduledMeeting } from "@/types";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { AddMeetingDialog } from "@/components/calendar/AddMeetingDialog";
import { ViewMeetingDialog } from "@/components/calendar/ViewMeetingDialog";

export default function MeetingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { meetings, isLoading: isLoadingMeetings, addMeeting } = useScheduledMeetings();
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);

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

  const meetingsByDate: { [key: string]: ScheduledMeeting[] } = {};
  meetings.forEach((meeting) => {
    if (!meetingsByDate[meeting.date]) {
      meetingsByDate[meeting.date] = [];
    }
    meetingsByDate[meeting.date].push(meeting);
  });

  const handleAddMeeting = async (meetingData: Omit<ScheduledMeeting, 'id'>) => {
    await addMeeting(meetingData);
    setIsAddDialogOpen(false);
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

      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
        onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
        onAddMeeting={() => setIsAddDialogOpen(true)}
      />

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
            meetings={day.isCurrentMonth ? getMeetingsForDate(day.day, meetingsByDate) : []}
            onViewMeeting={viewMeeting}
          />
        ))}
      </div>

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
      />
    </div>
  );
}

function getMeetingsForDate(day: number, meetingsByDate: { [key: string]: ScheduledMeeting[] }): ScheduledMeeting[] {
  const dateStr = format(
    new Date(),
    `yyyy-MM-${day.toString().padStart(2, '0')}`
  );
  return meetingsByDate[dateStr] || [];
}
