
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus } from "lucide-react";

interface MeetingMinute {
  id: string;
  workbody_id: string;
  workbody_name: string;
  date: string;
  location: string;
  file_url: string;
  agenda_items: string[];
  actions_agreed: string[];
}

interface MeetingMinutesGridProps {
  minutes: MeetingMinute[];
  isLoading: boolean;
  searchTerm: string;
  onNavigate: (path: string) => void;
  onViewDetails: (id: string) => void;
}

export function MeetingMinutesGrid({ 
  minutes, 
  isLoading, 
  searchTerm,
  onNavigate,
  onViewDetails 
}: MeetingMinutesGridProps) {
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3 rounded-md border">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (minutes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No meeting minutes found</h3>
        <p className="text-muted-foreground mt-2">
          {searchTerm ? "Try a different search term" : "No meeting minutes have been uploaded yet"}
        </p>
        <Button
          onClick={() => onNavigate('/upload-minutes')}
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Your First Minutes
        </Button>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {minutes.map((minute) => (
        <div 
          key={minute.id}
          className="p-4 flex items-start space-x-4 hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => onViewDetails(minute.id)}
        >
          <div className="bg-blue-100 rounded-full p-3 text-blue-700">
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{minute.workbody_name}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(minute.date), "MMMM d, yyyy")} • {minute.location}
            </div>
            {minute.agenda_items.length > 0 && (
              <div className="text-sm text-muted-foreground mt-1 truncate">
                {minute.agenda_items.slice(0, 1).join(", ")}
                {minute.agenda_items.length > 1 && "..."}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(minute.id);
            }}
          >
            View Details
          </Button>
        </div>
      ))}
    </div>
  );
}
