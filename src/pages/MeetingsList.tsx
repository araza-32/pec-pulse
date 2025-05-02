
import { useState, useEffect } from "react";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isThisYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar, Calendar as CalendarIcon, Search, ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MeetingsList() {
  const { meetings, isLoading } = useScheduledMeetings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (!isLoading && meetings.length === 0) {
      toast({
        title: "No Meetings Found",
        description: "There are no meetings scheduled for the current year.",
        variant: "default"
      });
    }
  }, [isLoading, meetings, toast]);
  
  // Filter meetings for current year and by search query
  const currentYearMeetings = meetings
    .filter(meeting => {
      const meetingDate = parseISO(meeting.date);
      return isThisYear(meetingDate);
    })
    .filter(meeting => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        meeting.workbodyName.toLowerCase().includes(query) ||
        meeting.location.toLowerCase().includes(query) ||
        meeting.date.includes(query)
      );
    })
    .sort((a, b) => {
      // Sort by date (ascending)
      return parseISO(a.date).getTime() - parseISO(b.date).getTime();
    });
    
  const handleViewWorkbody = (workbodyId: string) => {
    navigate(`/workbodies/${workbodyId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Meetings This Year</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Viewing all meetings scheduled for {new Date().getFullYear()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[250px]"
          />
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <Separator />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <CalendarIcon className="h-10 w-10 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Loading meetings...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workbody Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentYearMeetings.length > 0 ? (
                currentYearMeetings.map((meeting) => {
                  const meetingDate = parseISO(meeting.date);
                  const isPast = meetingDate < new Date();
                  
                  return (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        {meeting.workbodyName}
                      </TableCell>
                      <TableCell>
                        {format(meetingDate, "MMMM d, yyyy")}
                      </TableCell>
                      <TableCell>{meeting.time}</TableCell>
                      <TableCell>{meeting.location}</TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            isPast 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isPast ? "Held" : "Scheduled"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewWorkbody(meeting.workbodyId)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No meetings found for the current year.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
