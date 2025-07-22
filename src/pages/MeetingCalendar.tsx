
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { AddMeetingDialog } from '@/components/calendar/AddMeetingDialog';
import { ViewMeetingDialog } from '@/components/calendar/ViewMeetingDialog';
import { useScheduledMeetings } from '@/hooks/useScheduledMeetings';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { useAuth } from '@/contexts/AuthContext';
import { ScheduledMeeting } from '@/types';
import { Plus, Calendar, ExternalLink } from 'lucide-react';

export default function MeetingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { meetings, isLoading: meetingsLoading, addMeeting, updateMeeting, deleteMeeting } = useScheduledMeetings();
  const { workbodies, isLoading: workbodiesLoading } = useWorkbodies();
  const { user } = useAuth();

  const canAddMeeting = user?.role === 'admin' || user?.role === 'coordination' || user?.role === 'secretary';

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    // Future: Could open a day view or quick add dialog
  };

  const handleMeetingClick = (meeting: ScheduledMeeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };

  const handleAddMeeting = async (meetingData: any) => {
    try {
      await addMeeting(meetingData);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add meeting:', error);
      throw error;
    }
  };

  const handleUpdateMeeting = async (updates: Partial<ScheduledMeeting>) => {
    if (!selectedMeeting) return;
    
    try {
      await updateMeeting(selectedMeeting.id, updates);
      setSelectedMeeting(null);
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Failed to update meeting:', error);
      throw error;
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id);
      setSelectedMeeting(null);
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      throw error;
    }
  };

  if (meetingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pec-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-left">Meeting Calendar</h1>
          <p className="text-muted-foreground text-left">
            View and manage scheduled workbody meetings
          </p>
        </div>
        {canAddMeeting && (
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-pec-green hover:bg-pec-green/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Google Calendar</h2>
            <p className="text-muted-foreground">View your complete Google Calendar with all scheduled meetings</p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/month/2025/7/1", "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full h-[700px]">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=c_811e0f51fc4619f9685f4ebd0d487e9ae57f4e7d35e77e5ed8e68c44bb76b11a%40group.calendar.google.com&ctz=Asia%2FKarachi"
                className="w-full h-full border-0 rounded-lg"
                title="Google Calendar"
                style={{ minHeight: '700px' }}
              />
              
              {/* Fallback content if iframe is blocked */}
              <div className="absolute inset-4 flex items-center justify-center bg-muted/80 rounded-lg backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <div className="text-center p-6 bg-background/95 rounded-lg border shadow-lg pointer-events-auto">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Calendar Integration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If the calendar doesn't load, it may be due to browser security restrictions.
                  </p>
                  <Button
                    onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/month/2025/7/1", "_blank")}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Full Calendar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddMeetingDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddMeeting={handleAddMeeting}
        workbodies={workbodies}
        isLoadingWorkbodies={workbodiesLoading}
      />

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
        isLoadingWorkbodies={workbodiesLoading}
        userRole={user?.role}
      />
    </div>
  );
}
