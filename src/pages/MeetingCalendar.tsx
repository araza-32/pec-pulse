
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { AddMeetingDialog } from '@/components/calendar/AddMeetingDialog';
import { ViewMeetingDialog } from '@/components/calendar/ViewMeetingDialog';
import { MeetingImport } from '@/components/calendar/MeetingImport';
import { MeetingNotifications } from '@/components/calendar/MeetingNotifications';
import { useScheduledMeetings } from '@/hooks/useScheduledMeetings';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { ScheduledMeeting } from '@/types';
import { Plus, Calendar, Import, Bell, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MeetingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  
  const { meetings, isLoading: meetingsLoading, addMeeting, updateMeeting, deleteMeeting } = useScheduledMeetings();
  const { workbodies, isLoading: workbodiesLoading } = useWorkbodies();
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkWeeklyMeetings } = useNotifications();

  const canAddMeeting = user?.role === 'admin' || user?.role === 'coordination' || user?.role === 'secretary';

  // Check for weekly meetings and notifications
  useEffect(() => {
    if (meetings.length > 0) {
      checkWeeklyMeetings(meetings);
    }
  }, [meetings, checkWeeklyMeetings]);

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
      toast({
        title: "Meeting Added",
        description: "Meeting has been successfully scheduled",
      });
    } catch (error) {
      console.error('Failed to add meeting:', error);
      throw error;
    }
  };

  const handleImportMeeting = async (meetingData: any) => {
    try {
      await addMeeting(meetingData);
      toast({
        title: "Meeting Imported",
        description: "Meeting has been successfully imported to your calendar",
      });
    } catch (error) {
      console.error('Failed to import meeting:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMeeting = async (updates: Partial<ScheduledMeeting>) => {
    if (!selectedMeeting) return;
    
    try {
      await updateMeeting(selectedMeeting.id, updates);
      setSelectedMeeting(null);
      setIsViewDialogOpen(false);
      toast({
        title: "Meeting Updated",
        description: "Meeting has been successfully updated",
      });
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
      toast({
        title: "Meeting Deleted",
        description: "Meeting has been successfully deleted",
      });
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Import className="h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="external" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            External
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CalendarHeader
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
            </CardHeader>
            <CardContent>
              <CalendarGrid
                currentDate={currentDate}
                meetings={meetings}
                onDateClick={handleDateClick}
                onMeetingClick={handleMeetingClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <MeetingNotifications meetings={meetings} />
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <MeetingImport onImportMeeting={handleImportMeeting} />
          </div>
        </TabsContent>

        <TabsContent value="external" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                External Calendar Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Access your external calendar without OAuth authentication
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Google Calendar (Public View)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    View the public PEC calendar without signing in
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://calendar.google.com/calendar/embed?src=c_811e0f51fc4619f9685f4ebd0d487e9ae57f4e7d35e77e5ed8e68c44bb76b11a%40group.calendar.google.com&ctz=Asia%2FKarachi", "_blank")}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Public Calendar
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Manual Sync Instructions</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>1. Export your calendar as .ics file from your calendar app</p>
                    <p>2. Use the Import tab to upload the .ics file</p>
                    <p>3. Or manually add meetings using the Import → Manual Entry option</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
