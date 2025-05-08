
import { useState, useEffect } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { ScheduledMeeting } from "@/types";
import { ViewMeetingDialog } from "@/components/calendar/ViewMeetingDialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus, X, Search, CalendarDays, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddMeetingDialog } from "@/components/calendar/AddMeetingDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { format, parseISO, isAfter, isFuture, isPast } from "date-fns";

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
      // Validate that all required fields are filled
      const updatedMeeting = { ...selectedMeeting, ...updates };
      if (!updatedMeeting.date || !updatedMeeting.time || !updatedMeeting.workbodyId || !updatedMeeting.location) {
        toast({
          title: "Missing Information",
          description: "Please fill all required fields",
          variant: "destructive"
        });
        return;
      }
      
      // Check for duplicate meetings (excluding this one)
      const potentialDuplicates = meetings.filter(meeting => 
        meeting.id !== selectedMeeting.id &&
        meeting.date === updatedMeeting.date && 
        meeting.time === updatedMeeting.time && 
        meeting.workbodyId === updatedMeeting.workbodyId
      );
      
      if (potentialDuplicates.length > 0) {
        toast({
          title: "Duplicate Meeting",
          description: "A meeting for this workbody at this time already exists.",
          variant: "destructive"
        });
        return;
      }
      
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

  const viewMeeting = (meeting: ScheduledMeeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };

  const viewNotification = (meeting: ScheduledMeeting) => {
    if (meeting.notificationFilePath) {
      setSelectedMeeting(meeting);
      setIsNotificationOpen(true);
    } else {
      toast({
        title: "No Notification",
        description: "There is no notification file available for this meeting.",
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Meeting Calendar</h1>
        <p className="text-muted-foreground">
          View and manage scheduled workbody meetings
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Scheduled Meetings</CardTitle>
              <CardDescription>Manage upcoming and past workbody meetings</CardDescription>
            </div>
            
            {canEditMeetings && (
              <Button 
                onClick={() => setIsAddMeetingDialogOpen(true)}
                className="bg-pec-green hover:bg-pec-green/90"
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 space-y-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search meetings..."
                    className="w-[200px] md:w-[300px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="upcoming" className="mt-4 space-y-4">
                {isLoadingMeetings ? (
                  <p className="text-center py-8 text-muted-foreground">Loading meetings...</p>
                ) : filteredMeetings.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No upcoming meetings</h3>
                    <p className="text-muted-foreground mt-2">
                      {searchTerm ? "Try a different search term" : "No meetings scheduled for upcoming dates"}
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
                  <MeetingsList 
                    meetings={filteredMeetings} 
                    onViewMeeting={viewMeeting}
                    onViewNotification={viewNotification}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-4 space-y-4">
                {isLoadingMeetings ? (
                  <p className="text-center py-8 text-muted-foreground">Loading meetings...</p>
                ) : filteredMeetings.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No past meetings found</h3>
                    <p className="text-muted-foreground mt-2">
                      {searchTerm ? "Try a different search term" : "No past meetings are available"}
                    </p>
                  </div>
                ) : (
                  <MeetingsList 
                    meetings={filteredMeetings} 
                    onViewMeeting={viewMeeting}
                    onViewNotification={viewNotification}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="all" className="mt-4 space-y-4">
                {isLoadingMeetings ? (
                  <p className="text-center py-8 text-muted-foreground">Loading meetings...</p>
                ) : filteredMeetings.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No meetings found</h3>
                    <p className="text-muted-foreground mt-2">
                      {searchTerm ? "Try a different search term" : "No meetings are available"}
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
                  <MeetingsList 
                    meetings={filteredMeetings} 
                    onViewMeeting={viewMeeting}
                    onViewNotification={viewNotification}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
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
        onOpenChange={(open) => setIsNotificationOpen(open)}
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

interface MeetingsListProps {
  meetings: ScheduledMeeting[];
  onViewMeeting: (meeting: ScheduledMeeting) => void;
  onViewNotification: (meeting: ScheduledMeeting) => void;
}

const MeetingsList: React.FC<MeetingsListProps> = ({ meetings, onViewMeeting, onViewNotification }) => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-medium">Date & Time</th>
            <th className="px-4 py-3 font-medium">Workbody</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Agenda</th>
            <th className="px-4 py-3 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting) => {
            const isPastMeeting = isPast(parseISO(meeting.date));
            
            return (
              <tr 
                key={meeting.id} 
                className={`border-t hover:bg-muted/50 ${isPastMeeting ? 'text-muted-foreground' : ''}`}
                onClick={() => onViewMeeting(meeting)}
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{format(parseISO(meeting.date), 'MMM d, yyyy')}</div>
                  <div className="text-xs text-muted-foreground">{meeting.time.substring(0, 5)}</div>
                </td>
                <td className="px-4 py-3 max-w-[200px] truncate">{meeting.workbodyName}</td>
                <td className="px-4 py-3 max-w-[150px] truncate">{meeting.location}</td>
                <td className="px-4 py-3">
                  {meeting.agendaItems && meeting.agendaItems.length > 0 
                    ? <span className="max-w-[250px] truncate inline-block">{meeting.agendaItems.join(', ')}</span>
                    : <span className="text-muted-foreground text-xs">No agenda items</span>
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewMeeting(meeting);
                    }}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
