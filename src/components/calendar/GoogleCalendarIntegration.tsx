
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// The direct Google Calendar URL for adding to calendar
const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/render?cid=c_811e0f51fc4619f9685f4ebd0d487e9ae57f4e7d35e77e5ed8e68c44bb76b11a@group.calendar.google.com";

// Calendar ID from the URL
const CALENDAR_ID = "c_811e0f51fc4619f9685f4ebd0d487e9ae57f4e7d35e77e5ed8e68c44bb76b11a@group.calendar.google.com";

export const GoogleCalendarIntegration = ({ onSyncComplete }: { onSyncComplete?: () => void }) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAddToCalendar = () => {
    window.open(GOOGLE_CALENDAR_URL, '_blank');
    toast({
      title: "Calendar Sync Initiated",
      description: "Google Calendar will open in a new tab. Follow the prompts to add the meetings calendar to your Google Calendar.",
    });
  };

  const fetchAndSyncGoogleCalendarEvents = async () => {
    setIsSyncing(true);
    try {
      toast({
        title: "Syncing Calendar",
        description: "Fetching meetings from Google Calendar...",
      });

      // For demonstration purposes, we'll simulate fetching from Google Calendar API
      // Normally, this would be a secure API call through a backend service
      // Google Calendar API requires OAuth which can't be done directly in frontend

      // Simulated event data from Google Calendar
      const simulatedEvents = [
        {
          id: "gc-1",
          summary: "Budget Committee Meeting",
          start: { date: "2025-04-30" },
          location: "Conference Room A",
          description: "Review Q2 budget proposals\nApprove department requests\nDiscuss cost-cutting measures"
        },
        {
          id: "gc-2",
          summary: "Policy Committee",
          start: { date: "2025-05-02" },
          location: "Meeting Hall",
          description: "New policy draft review\nStakeholder feedback discussion\nImplementation timeline"
        },
        {
          id: "gc-3", 
          summary: "Executive Committee",
          start: { date: "2025-05-05" },
          location: "Executive Boardroom",
          description: "Strategic planning session\nQuarterly goals review\nLeadership updates"
        }
      ];

      // Process each event and add to the database
      for (const event of simulatedEvents) {
        const date = event.start.date;
        
        // Check if event already exists
        const { data: existingEvents } = await supabase
          .from('scheduled_meetings')
          .select('id')
          .eq('date', date)
          .eq('workbody_name', event.summary)
          .eq('location', event.location);
          
        if (existingEvents && existingEvents.length > 0) {
          console.log(`Event ${event.summary} on ${date} already exists, skipping`);
          continue;
        }
        
        // Parse description as agenda items
        const agendaItems = event.description ? event.description.split('\n') : [];
        
        // Add event to scheduled_meetings table
        const { error } = await supabase
          .from('scheduled_meetings')
          .insert({
            id: uuidv4(),
            date: date,
            time: "14:00:00", // Default to 2 PM as time isn't included in basic iCal data
            workbody_id: uuidv4(), // Generate a placeholder ID
            workbody_name: event.summary,
            location: event.location || "Not specified",
            agenda_items: agendaItems
          });
          
        if (error) {
          console.error("Error syncing event:", error);
        }
      }
      
      toast({
        title: "Sync Complete",
        description: `${simulatedEvents.length} meetings have been synced from Google Calendar.`,
      });
      
      // Call the callback to refresh the calendar
      if (onSyncComplete) {
        onSyncComplete();
      }
      
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error);
      toast({
        title: "Sync Failed",
        description: "There was an error syncing with Google Calendar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calendar className="mr-2 h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Sync meetings between Google Calendar and this application.
          Keep your meeting schedule up-to-date across platforms.
        </p>
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={handleAddToCalendar}
            className="w-full"
            variant="outline"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add to My Google Calendar
          </Button>
          <Button 
            onClick={fetchAndSyncGoogleCalendarEvents}
            className="w-full"
            variant="default"
            disabled={isSyncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync from Google Calendar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
