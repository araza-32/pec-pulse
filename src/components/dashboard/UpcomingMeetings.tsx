
import { useState, useEffect, useCallback } from "react";
import { CalendarClock, ChevronRight, FileText, Eye, Calendar, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns";
import { ScheduledMeeting } from "@/types";
import { ViewMeetingDialog } from "@/components/calendar/ViewMeetingDialog";
import { Badge } from "@/components/ui/badge";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export const UpcomingMeetings = () => {
  const navigate = useNavigate();
  const { meetings, isLoading, updateMeeting, deleteMeeting, refetchMeetings } = useScheduledMeetings();
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Handle manual refresh with visual feedback
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchMeetings();
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Refreshed",
        description: "Meeting data has been updated",
      });
    }, 800);
  }, [refetchMeetings]);

  // Refresh meetings on component mount and every 60 seconds
  useEffect(() => {
    refetchMeetings();
    
    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      refetchMeetings();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, [refetchMeetings]);

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (date < addDays(new Date(), 7)) {
      return format(date, 'EEEE'); // Day of week
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  // Get upcoming meetings (next two weeks)
  const upcomingMeetings = meetings.filter(m => 
    new Date(m.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const displayedMeetings = showAll ? upcomingMeetings : upcomingMeetings.slice(0, 5);

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
      toast({
        title: "Meeting Updated",
        description: "Meeting details have been updated successfully",
      });
    } catch (error) {
      console.error("Failed to update meeting:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update meeting details",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id);
      await refetchMeetings(); // Force refresh after deletion
      setIsViewDialogOpen(false);
      setSelectedMeeting(null);
      toast({
        title: "Meeting Deleted", 
        description: "Meeting has been deleted successfully"
      });
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete meeting", 
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 text-center">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Upcoming Meetings
        </CardTitle>
        <div className="space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className={cn("text-slate-600", refreshing && "animate-spin")}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
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
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start space-x-4 border-b pb-4">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedMeetings.length > 0 ? (
          <div className="space-y-4">
            {displayedMeetings.map((meeting, index) => {
              const meetingDate = parseISO(meeting.date);
              const isImportant = index === 0 || isToday(meetingDate);
              
              return (
                <div 
                  key={meeting.id} 
                  className={cn(
                    "flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50/80 p-2 rounded-lg transition-colors animate-fade-in",
                    isImportant && "bg-blue-50/50"
                  )}
                  onClick={() => handleViewDetails(meeting)}
                >
                  <div className={cn(
                    "rounded-full p-2 flex-shrink-0",
                    isImportant ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"
                  )}>
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div className="flex-grow text-left">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{meeting.workbodyName || "Unnamed Meeting"}</div>
                      {isToday(meetingDate) && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 ml-2">
                          Today
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <span className="font-medium">{formatDate(meeting.date)}</span>
                      <span>•</span>
                      <span>{meeting.time.substring(0, 5)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Location: {meeting.location}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 px-2 text-xs bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(meeting);
                        }}
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
              );
            })}
            
            {upcomingMeetings.length > 5 && !showAll && (
              <Button 
                variant="link" 
                onClick={() => setShowAll(true)}
                className="w-full mt-2"
              >
                View all {upcomingMeetings.length} upcoming meetings <ChevronRight className="h-4 w-4 ml-1" />
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
            {selectedMeeting?.notificationFilePath ? (
              <iframe 
                src={selectedMeeting.notificationFilePath} 
                className="w-full h-full border-0"
                title="Meeting Notification"
                onError={() => toast({
                  title: "Error",
                  description: "Failed to load notification document",
                  variant: "destructive"
                })}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No notification document available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
