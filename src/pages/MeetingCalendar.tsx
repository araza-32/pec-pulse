
import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { ScheduledMeeting } from '@/types';
import { Plus, Calendar, ExternalLink, RefreshCw, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gapi } from 'gapi-script';

export default function MeetingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [isLoadingGoogleEvents, setIsLoadingGoogleEvents] = useState(false);
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  
  const { meetings, isLoading: meetingsLoading, addMeeting, updateMeeting, deleteMeeting } = useScheduledMeetings();
  const { workbodies, isLoading: workbodiesLoading } = useWorkbodies();
  const { user } = useAuth();
  const { toast } = useToast();

  const canAddMeeting = user?.role === 'admin' || user?.role === 'coordination' || user?.role === 'secretary';

  // Initialize Google API
  useEffect(() => {
    const initializeGapi = async () => {
      try {
        await gapi.load('auth2', async () => {
          // You need to replace this with your actual OAuth Client ID from Google Cloud Console
          const CLIENT_ID = 'YOUR_OAUTH_CLIENT_ID_HERE'; // Replace with your real OAuth Client ID
          
          await gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
          });

          const authInstance = gapi.auth2.getAuthInstance();
          setIsGoogleSignedIn(authInstance.isSignedIn.get());
          
          if (authInstance.isSignedIn.get()) {
            const user = authInstance.currentUser.get();
            const accessToken = user.getAuthResponse().access_token;
            setGoogleAccessToken(accessToken);
          }
        });
      } catch (error) {
        console.error('Error initializing Google API:', error);
      }
    };

    initializeGapi();
  }, []);

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      const accessToken = user.getAuthResponse().access_token;
      
      setIsGoogleSignedIn(true);
      setGoogleAccessToken(accessToken);
      
      toast({
        title: "Success",
        description: "Successfully signed in to Google Calendar",
      });
      
      // Auto-fetch events after signing in
      fetchGoogleCalendarEvents(accessToken);
    } catch (error) {
      console.error('Google Sign In error:', error);
      toast({
        title: "Error",
        description: "Failed to sign in to Google Calendar",
        variant: "destructive",
      });
    }
  };

  // Google Sign Out
  const handleGoogleSignOut = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      
      setIsGoogleSignedIn(false);
      setGoogleAccessToken(null);
      setGoogleEvents([]);
      
      toast({
        title: "Success",
        description: "Successfully signed out from Google Calendar",
      });
    } catch (error) {
      console.error('Google Sign Out error:', error);
    }
  };

  // Fetch Google Calendar events with OAuth
  const fetchGoogleCalendarEvents = async (accessToken?: string) => {
    const token = accessToken || googleAccessToken;
    
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to Google Calendar first",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingGoogleEvents(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-google-calendar', {
        body: {
          calendarId: 'c_811e0f51fc4619f9685f4ebd0d487e9ae57f4e7d35e77e5ed8e68c44bb76b11a@group.calendar.google.com',
          timeMin: new Date().toISOString(),
          timeMax: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          accessToken: token
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Google Calendar API response:', data);
      setGoogleEvents(data.events || []);
      toast({
        title: "Success",
        description: `Loaded ${data.events?.length || 0} events from Google Calendar`,
      });
    } catch (error: any) {
      console.error('Failed to fetch Google Calendar events:', error);
      
      let errorMessage = "Failed to fetch Google Calendar events";
      if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingGoogleEvents(false);
    }
  };

  // Load Google Calendar events on component mount if already signed in
  useEffect(() => {
    if (isGoogleSignedIn && googleAccessToken) {
      fetchGoogleCalendarEvents();
    }
  }, [isGoogleSignedIn, googleAccessToken]);

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
          <div className="flex gap-2">
            {!isGoogleSignedIn ? (
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign in to Google Calendar
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => fetchGoogleCalendarEvents()}
                  disabled={isLoadingGoogleEvents}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingGoogleEvents ? 'animate-spin' : ''}`} />
                  Refresh Events
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoogleSignOut}
                  className="flex items-center gap-2"
                >
                  Sign Out
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/month/2025/7/1", "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
        </div>

        {/* Google Calendar Events List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar Events ({googleEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingGoogleEvents ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pec-green mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : googleEvents.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {googleEvents.map((event, index) => (
                  <div key={event.id || index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString()}
                        </p>
                        {event.location && (
                          <p className="text-sm text-muted-foreground">📍 {event.location}</p>
                        )}
                        {event.description && (
                          <p className="text-sm mt-1">{event.description}</p>
                        )}
                      </div>
                      {event.isAllDay && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">All Day</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No events found in your calendar</p>
            )}
          </CardContent>
        </Card>
        
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
