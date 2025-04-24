
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { MeetingMinutes } from "@/types";

interface WorkbodyMeetingsProps {
  minutes: MeetingMinutes[];
  isLoadingMinutes: boolean;
}

export function WorkbodyMeetings({ minutes, isLoadingMinutes }: WorkbodyMeetingsProps) {
  const sortedMinutes = [...minutes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (isLoadingMinutes) {
    return (
      <Card>
        <CardHeader>
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
      <CardHeader>
        <CardTitle>Meeting Minutes</CardTitle>
      </CardHeader>
      <CardContent>
        {minutes.length > 0 ? (
          <div className="space-y-4">
            {sortedMinutes.map((meeting) => (
              <Card key={meeting.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold">
                        Meeting on{" "}
                        {new Date(meeting.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="text-sm text-muted-foreground">{meeting.location}</p>
                    </div>
                    <Link to={`/minutes/${meeting.id}`}>
                      <Button variant="outline" size="sm">
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
          <p>No meeting minutes available</p>
        )}
      </CardContent>
    </Card>
  );
}
