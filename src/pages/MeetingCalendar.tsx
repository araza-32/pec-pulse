
import { useState, useEffect } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { ScheduledMeeting } from "@/types";
import { ViewMeetingDialog } from "@/components/calendar/ViewMeetingDialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus, X, Search, CalendarDays, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddMeetingDialog } from "@/components/calendar/AddMeetingDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { format, parseISO, isFuture, isPast } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeetingCalendar() {
  const { meetings, isLoading: isLoadingMeetings, updateMeeting, deleteMeeting, addMeeting, refetchMeetings } = useScheduledMeetings();
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddMeetingDialogOpen, setIsAddMeetingDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();
  
  // Determine if user has edit permissions
  const canEditMeetings = session?.role === 'admin' || session?.role === 'secretary';

  useEffect(() => {
    // Force refresh meetings when component mounts
    refetchMeetings();
  }, [refetchMeetings]);

  // Filter meetings by tab and search term
  const filteredMeetings = meetings
    .filter(meeting => {
      if (activeTab === "upcoming") return isFuture(parseISO(meeting.date));
      if (activeTab === "past") return isPast(parseISO(meeting.date));
      return true; // "all" tab
    })
    .filter(meeting => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        meeting.workbodyName?.toLowerCase().includes(searchLower) ||
        meeting.location?.toLowerCase().includes(searchLower) ||
        meeting.agendaItems?.some(item => item.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      // For upcoming meetings, sort by date ascending
      if (activeTab === "upcoming") {
        return parseISO(a.date).getTime() - parseISO(b.date).getTime();
      } 
      // For past and all meetings, sort by date descending (most recent first)
      return parseISO(b.date).getTime() - parseISO(a.date).getTime();
    });

  const handleUpdateMeeting = async (updates: Partial<ScheduledMeeting>) => {
    if (!selectedMeeting) return;
    try {
      await updateMeeting(selectedMeeting.id, updates);
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
      setIsViewDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id);
      setIsViewDialogOpen(false);
      setSelectedMeeting(null);
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive"
      });
    }
  };

  const handleViewMeeting = (meeting: ScheduledMeeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };

  const handleViewNotification = (meeting: ScheduledMeeting) => {
    if (meeting.notificationFilePath) {
      setSelectedMeeting(meeting);
      setIsNotificationOpen(true);
    } else {
      toast({
        title: "No Notification",
        description: "No notification file is available for this meeting",
        variant: "destructive"
      });
    }
  };

  // Handle adding a new meeting
  const handleAddMeeting = async (newMeeting: Omit<ScheduledMeeting, 'id'>) => {
    try {
      await addMeeting(newMeeting);
      await refetchMeetings(); // Force refresh to ensure new meeting appears
      setIsAddMeetingDialogOpen(false);
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold mb-2">Meeting Calendar</h1>
        <p className="text-blue-50">
          View, schedule and manage all workbody meetings
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              className="pl-8 w-[220px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {canEditMeetings && (
            <Button 
              onClick={() => setIsAddMeetingDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            {activeTab === "upcoming" ? "Upcoming Meetings" : 
             activeTab === "past" ? "Past Meetings" : "All Meetings"}
          </CardTitle>
          <CardDescription>
            {activeTab === "upcoming" ? "Scheduled upcoming meetings across all workbodies" : 
             activeTab === "past" ? "Historical record of past meetings" : 
             "Complete overview of all meetings"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoadingMeetings ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-md border">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <Skeleton className="h-9 w-[100px]" />
                </div>
              ))}
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No meetings found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? "Try a different search term" : 
                 activeTab === "upcoming" ? "No upcoming meetings scheduled" : 
                 activeTab === "past" ? "No past meetings recorded" : 
                 "No meetings available"}
              </p>
              {canEditMeetings && (
                <Button
                  variant="outline"
                  onClick={() => setIsAddMeetingDialogOpen(true)}
                  className="mt-4"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Workbody</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings.map(meeting => {
                    const isPastMeeting = isPast(parseISO(meeting.date));
                    const meetingDate = parseISO(meeting.date);
                    const today = new Date();
                    const isToday = meetingDate.toDateString() === today.toDateString();
                    
                    return (
                      <TableRow 
                        key={meeting.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewMeeting(meeting)}
                      >
                        <TableCell>
                          <div className="font-medium">
                            {format(parseISO(meeting.date), "d MMM yyyy")}
                            {isToday && <Badge className="ml-2 bg-green-500">Today</Badge>}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {meeting.time.substring(0, 5)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{meeting.workbodyName}</div>
                        </TableCell>
                        <TableCell>{meeting.location}</TableCell>
                        <TableCell>
                          {isPastMeeting ? (
                            <Badge variant="outline" className="bg-gray-100">Completed</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">Scheduled</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewMeeting(meeting);
                              }}
                            >
                              View Details
                            </Button>
                            
                            {meeting.notificationFilePath && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewNotification(meeting);
                                }}
                              >
                                Notification
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Meeting Dialogs */}
      <ViewMeetingDialog
        meeting={selectedMeeting}
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedMeeting(null);
        }}
        onUpdate={canEditMeetings ? handleUpdateMeeting : undefined}
        onDelete={canEditMeetings ? handleDeleteMeeting : undefined}
        workbodies={workbodies}
        isLoadingWorkbodies={isLoadingWorkbodies}
        userRole={session?.role}
      />

      {/* Add Meeting Dialog */}
      {canEditMeetings && (
        <AddMeetingDialog
          isOpen={isAddMeetingDialogOpen}
          onClose={() => setIsAddMeetingDialogOpen(false)}
          onAddMeeting={handleAddMeeting}
          workbodies={workbodies}
          isLoadingWorkbodies={isLoadingWorkbodies}
        />
      )}

      {/* PDF Viewer Dialog */}
      <Dialog 
        open={isNotificationOpen} 
        onOpenChange={setIsNotificationOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] h-[90vh] flex flex-col p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Meeting Notification</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsNotificationOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {selectedMeeting?.notificationFilePath && (
              <iframe 
                src={selectedMeeting.notificationFilePath} 
                className="w-full h-full border-0"
                title="Meeting Notification"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
