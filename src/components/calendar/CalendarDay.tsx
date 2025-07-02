
import { format, isSameDay } from "date-fns";
import { ScheduledMeeting } from "@/types";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarDayProps {
  dayData: {
    date: Date;
    dateString: string;
    day: number;
    meetings: ScheduledMeeting[];
    isToday: boolean;
    isCurrentMonth: boolean;
  } | null;
  onDateClick: (date: Date) => void;
  onMeetingClick: (meeting: ScheduledMeeting) => void;
}

export function CalendarDay({
  dayData,
  onDateClick,
  onMeetingClick,
}: CalendarDayProps) {
  if (!dayData || !dayData.isCurrentMonth) {
    return <div className="border rounded-md min-h-[120px] p-1 bg-gray-50/40" />;
  }

  const { date, day, meetings, isToday } = dayData;

  return (
    <div
      className={cn(
        "border rounded-md min-h-[120px] p-2 transition-colors cursor-pointer",
        isToday ? "bg-blue-50 border-blue-300 shadow-sm" : "hover:bg-gray-50/70"
      )}
      onClick={() => onDateClick(date)}
    >
      <div className="flex justify-between items-center mb-1">
        <span 
          className={cn(
            "text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center",
            isToday ? "bg-blue-600 text-white" : "text-gray-700"
          )}
        >
          {day}
        </span>
      </div>
      <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <TooltipProvider key={meeting.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="bg-pec-green-50 border-l-2 border-pec-green-500 px-1.5 py-1 rounded text-xs cursor-pointer hover:bg-pec-green-100 transition-colors flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMeetingClick(meeting);
                    }}
                  >
                    <CalendarClock className="h-3 w-3 text-pec-green-600 flex-shrink-0" />
                    <div className="font-medium truncate flex-1">
                      <span className="text-pec-green-700">{meeting.time.substring(0, 5)}</span> - {meeting.workbodyName}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="text-sm">
                    <p className="font-medium">{meeting.workbodyName}</p>
                    <p className="text-xs text-muted-foreground">{meeting.time.substring(0, 5)} at {meeting.location}</p>
                    {meeting.agendaItems && meeting.agendaItems.length > 0 && (
                      <p className="text-xs mt-1 truncate">
                        <span className="font-medium">Agenda:</span> {meeting.agendaItems[0]}
                        {meeting.agendaItems.length > 1 && `... (+${meeting.agendaItems.length - 1} more)`}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        ) : (
          <div className="text-xs text-gray-400 italic py-1">No meetings</div>
        )}
      </div>
    </div>
  );
}
