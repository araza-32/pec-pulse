
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { AddMeetingDialog } from '@/components/calendar/AddMeetingDialog';
import { ViewMeetingDialog } from '@/components/calendar/ViewMeetingDialog';
import { useScheduledMeetings } from '@/hooks/useScheduledMeetings';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { useAuth } from '@/contexts/AuthContext';
import { ScheduledMeeting } from '@/types';
import { Plus } from 'lucide-react';

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

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-left">
            <CalendarHeader 
              currentDate={currentDate} 
              onDateChange={setCurrentDate} 
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CalendarGrid
            currentDate={currentDate}
            meetings={meetings}
            onDateClick={handleDateClick}
            onMeetingClick={handleMeetingClick}
          />
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pec-green">
                {meetings.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Meetings
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {meetings.filter(m => new Date(m.date) >= new Date()).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Upcoming Meetings
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(meetings.map(m => m.workbodyId)).size}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Workbodies
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
