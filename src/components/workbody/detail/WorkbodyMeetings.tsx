
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { MeetingMinutes } from "@/types";
import { WorkbodyMinutesUpload } from "./WorkbodyMinutesUpload";

interface WorkbodyMeetingsProps {
  minutes: MeetingMinutes[];
  isLoadingMinutes: boolean;
  workbodyId: string;
}

export function WorkbodyMeetings({ minutes, isLoadingMinutes, workbodyId }: WorkbodyMeetingsProps) {
  const sortedMinutes = [...minutes].sort((a, b) => {
    const dateA = new Date(a.meetingDate || a.date).getTime();
    const dateB = new Date(b.meetingDate || b.date).getTime();
    return dateB - dateA;
  });

  if (isLoadingMinutes) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Meeting Minutes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meeting Minutes</CardTitle>
        <WorkbodyMinutesUpload workbodyId={workbodyId} />
      </CardHeader>
      <CardContent>
        {minutes.length > 0 ? (
          <div className="space-y-4">
            {sortedMinutes.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="text-left">
                      <h3 className="font-semibold">
                        Meeting on{" "}
                        {new Date(meeting.meetingDate || meeting.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="text-sm text-muted-foreground">{meeting.venue || meeting.location}</p>
                    </div>
                    <Link to={`/minutes/${meeting.id}`}>
                      <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                        <FileText className="mr-2 h-4 w-4" />
                        View Minutes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No meeting minutes available</p>
            <WorkbodyMinutesUpload workbodyId={workbodyId} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
