
import { useState, useEffect } from "react";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isThisYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar, Calendar as CalendarIcon, Search, ArrowLeft, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MeetingsList() {
  const { meetings, isLoading } = useScheduledMeetings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [minutesData, setMinutesData] = useState<any[]>([]);
  const [isLoadingMinutes, setIsLoadingMinutes] = useState(true);
  const [filterValue, setFilterValue] = useState("all");
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'chairman' || user?.role === 'registrar' || user?.role === 'coordination';
  
  // Fetch minutes data on component mount
  useEffect(() => {
    const fetchMinutes = async () => {
      try {
        const { data, error } = await supabase
          .from('meeting_minutes')
          .select('*, workbodies(name)')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setMinutesData(data || []);
      } catch (err) {
        console.error("Error fetching minutes:", err);
        toast({
          title: "Error",
          description: "Failed to fetch meeting minutes data",
          variant: "destructive"
        });
      } finally {
        setIsLoadingMinutes(false);
      }
    };
    
    fetchMinutes();
  }, [toast]);
  
  // Filter scheduled meetings for current year and by search query
  const filteredScheduledMeetings = meetings
    .filter(meeting => {
      const meetingDate = parseISO(meeting.date);
      if (filterValue === "thisYear") {
        return isThisYear(meetingDate);
      }
      return true;
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
    
  // Filter minutes data
  const filteredMinutesData = minutesData
    .filter(minute => {
      if (filterValue === "thisYear") {
        return isThisYear(parseISO(minute.date));
      }
      return true;
    })
    .filter(minute => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const workbodyName = minute.workbodies?.name || '';
      return (
        workbodyName.toLowerCase().includes(query) ||
        minute.location.toLowerCase().includes(query) ||
        minute.date.includes(query)
      );
    })
    .sort((a, b) => {
      // Sort by date (descending - most recent first)
      return parseISO(b.date).getTime() - parseISO(a.date).getTime();
    });
  
  const handleViewWorkbody = (workbodyId: string) => {
    navigate(`/workbodies/${workbodyId}`);
  };

  const handleViewMinute = (minuteId: string) => {
    navigate(`/minutes/${minuteId}`);
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
            <h1 className="text-3xl font-bold">Meetings Registry</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            View all scheduled and completed meetings
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilterValue("all")}>
                All Meetings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterValue("thisYear")}>
                This Year Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled Meetings</TabsTrigger>
          <TabsTrigger value="completed">Completed Meetings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheduled">
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
                  {filteredScheduledMeetings.length > 0 ? (
                    filteredScheduledMeetings.map((meeting) => {
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
                        No scheduled meetings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {isLoadingMinutes ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-2">
                <CalendarIcon className="h-10 w-10 animate-pulse text-muted-foreground" />
                <p className="text-muted-foreground">Loading meeting minutes...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workbody Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Agenda Items</TableHead>
                    <TableHead>Actions Agreed</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMinutesData.length > 0 ? (
                    filteredMinutesData.map((minute) => (
                      <TableRow key={minute.id}>
                        <TableCell className="font-medium">
                          {minute.workbodies?.name || "Unknown Workbody"}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(minute.date), "MMMM d, yyyy")}
                        </TableCell>
                        <TableCell>{minute.location}</TableCell>
                        <TableCell>
                          {minute.agenda_items && minute.agenda_items.length > 0 
                            ? `${minute.agenda_items.length} items` 
                            : "None"}
                        </TableCell>
                        <TableCell>
                          {minute.actions_agreed && minute.actions_agreed.length > 0 
                            ? `${minute.actions_agreed.length} actions` 
                            : "None"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMinute(minute.id)}
                          >
                            View Minutes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No meeting minutes found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
