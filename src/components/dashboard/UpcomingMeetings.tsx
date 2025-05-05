
import { useState, useEffect } from "react";
import { CalendarClock, ChevronRight, FileText, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { format, parseISO } from "date-fns";
import { ScheduledMeeting } from "@/types";
import { ViewMeetingDialog } from "@/components/calendar/ViewMeetingDialog";
import { Badge } from "@/components/ui/badge";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

export const UpcomingMeetings = () => {
  const navigate = useNavigate();
  const { meetings, isLoading, updateMeeting, deleteMeeting, refetchMeetings } = useScheduledMeetings();
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Refresh meetings on component mount and every 30 seconds
  useEffect(() => {
    refetchMeetings();
    
    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      refetchMeetings();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, [refetchMeetings]);

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMMM d, yyyy');
  };

  // Always get the upcoming meetings (next two weeks)
  const displayedMeetings = showAll ? meetings : meetings.slice(0, 5);

  const handleViewDetails = (meeting: ScheduledMeeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };

  const handleViewNotification = (meeting: ScheduledMeeting, e: React.MouseEvent) => {
    e.stopPropagation();
    if (meeting.notificationFilePath) {
      setSelectedMeeting(meeting);
      setIsNotificationOpen(true);
    }
  };

  const handleUpdateMeeting = async (updates: Partial<ScheduledMeeting>) => {
    if (!selectedMeeting) return;
    try {
      await updateMeeting(selectedMeeting.id, updates);
      await refetchMeetings(); // Force refresh to ensure updates appear
      setIsViewDialogOpen(false);
      setSelectedMeeting(null);
    } catch (error) {
      console.error("Failed to update meeting:", error);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id);
      await refetchMeetings(); // Force refresh after deletion
      setIsViewDialogOpen(false);
      setSelectedMeeting(null);
    } catch (error) {
      console.error("Failed to delete meeting:", error);
    }
  };

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 text-center">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Meetings
        </CardTitle>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "Show All"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/calendar')}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Loading upcoming meetings...</p>
          </div>
        ) : displayedMeetings.length > 0 ? (
          <div className="space-y-4">
            {displayedMeetings.map(meeting => (
              <div 
                key={meeting.id} 
                className="flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors animate-fade-in"
              >
                <div className="bg-blue-100 rounded p-2 text-blue-700 flex-shrink-0">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="flex-grow text-left">
                  <div className="font-medium">{meeting.workbodyName || "Unnamed Meeting"}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(meeting.date)} at {meeting.time}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Location: {meeting.location}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleViewDetails(meeting)}
                    >
                      <Eye className="h-3 w-3 mr-1" /> View Details
                    </Button>
                    
                    {meeting.notificationFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        onClick={(e) => handleViewNotification(meeting, e)}
                      >
                        <FileText className="h-3 w-3 mr-1" /> View Notification
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {meetings.length > 5 && !showAll && (
              <Button 
                variant="link" 
                onClick={() => setShowAll(true)}
                className="w-full mt-2"
              >
                View all {meetings.length} upcoming meetings <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            <p>No upcoming meetings in the next two weeks.</p>
            <Button 
              variant="link" 
              onClick={() => navigate('/calendar')}
              className="mt-2"
            >
              Go to Calendar <ChevronRight className="h-4 w-4 inline" />
            </Button>
          </div>
        )}
      </CardContent>

      {selectedMeeting && (
        <ViewMeetingDialog
          meeting={selectedMeeting}
          isOpen={isViewDialogOpen}
          onClose={() => {
            setIsViewDialogOpen(false);
            setSelectedMeeting(null);
          }}
          onUpdate={handleUpdateMeeting}
          onDelete={handleDeleteMeeting}
          workbodies={workbodies}
          isLoadingWorkbodies={isLoadingWorkbodies}
        />
      )}

      {/* PDF Notification Viewer Dialog */}
      <Dialog 
        open={isNotificationOpen} 
        onOpenChange={(open) => setIsNotificationOpen(open)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] h-[90vh] flex flex-col p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              Meeting Notification: {selectedMeeting?.workbodyName}
            </h2>
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
    </Card>
  );
};
