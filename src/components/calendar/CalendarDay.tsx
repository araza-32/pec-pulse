
import { format, isSameDay } from "date-fns";
import { ScheduledMeeting } from "@/types";

interface CalendarDayProps {
  day: { day: number; isCurrentMonth: boolean };
  currentDate: Date;
  meetings: ScheduledMeeting[];
  onViewMeeting: (meeting: ScheduledMeeting) => void;
}

export function CalendarDay({
  day,
  currentDate,
  meetings,
  onViewMeeting,
}: CalendarDayProps) {
  if (!day.isCurrentMonth) {
    return <div className="border rounded-md min-h-[100px] p-1 bg-gray-50" />;
  }

  const dateStr = format(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), day.day),
    "yyyy-MM-dd"
  );

  const isToday = isSameDay(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), day.day),
    new Date()
  );

  const dayMeetings = meetings.filter(meeting => meeting.date === dateStr);

  return (
    <div
      className={`border rounded-md min-h-[100px] p-1 ${
        isToday ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <span className={`text-xs font-semibold ${isToday ? "text-blue-600" : ""}`}>
          {day.day}
        </span>
      </div>
      <div className="mt-1 space-y-0.5">
        {dayMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-green-100 px-1.5 py-0.5 rounded text-[11px] cursor-pointer hover:bg-green-200 transition-colors"
            onClick={() => onViewMeeting(meeting)}
          >
            <div className="font-medium truncate">
              {meeting.time} - {meeting.workbodyName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
