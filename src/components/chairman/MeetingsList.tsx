
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Meeting {
  id: string;
  date: string;
  workbodyName: string;
  agendaExcerpt?: string;
}

interface MeetingsListProps {
  meetings: Meeting[];
  isLoading?: boolean;
}

export function MeetingsList({ meetings, isLoading = false }: MeetingsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No meetings found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <Card key={meeting.id} className="p-4">
          <div className="mb-2 flex justify-between">
            <h3 className="font-medium">{meeting.workbodyName}</h3>
            <time className="text-sm text-muted-foreground">
              {format(new Date(meeting.date), 'MMM dd, yyyy')}
            </time>
          </div>
          {meeting.agendaExcerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {meeting.agendaExcerpt}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
