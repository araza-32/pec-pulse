
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface Meeting {
  id: string;
  date: string;
  workbodyName: string;
  agendaExcerpt?: string;
}

interface MeetingsListProps {
  meetings: Meeting[];
}

export function MeetingsList({ meetings }: MeetingsListProps) {
  if (meetings.length === 0) {
    return <p className="text-muted-foreground py-4">No meetings to display.</p>;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <Card key={meeting.id} className="p-4 hover:bg-slate-50 transition-colors">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{meeting.workbodyName}</h3>
              <span className="text-sm text-muted-foreground">{formatDate(meeting.date)}</span>
            </div>
            {meeting.agendaExcerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">{meeting.agendaExcerpt}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
