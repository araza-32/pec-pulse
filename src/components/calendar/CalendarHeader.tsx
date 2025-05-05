
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddMeeting?: () => void;
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onAddMeeting,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium text-lg">
          {format(currentDate, "MMMM yyyy")}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date();
            if (
              today.getMonth() !== currentDate.getMonth() ||
              today.getFullYear() !== currentDate.getFullYear()
            ) {
              // Only set to today if not already on current month
              const newDate = new Date();
              // Update the currentDate with today's date (just month and year)
              currentDate.setMonth(newDate.getMonth());
              currentDate.setFullYear(newDate.getFullYear());
            }
          }}
        >
          Today
        </Button>
      </div>
    </div>
  );
}
