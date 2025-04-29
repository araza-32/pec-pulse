
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// The direct Google Calendar URL for adding to calendar
const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/render?cid=c_811e0f51fc4619f9685f4ebd0d487e9ae57f4e7d35e77e5ed8e68c44bb76b11a@group.calendar.google.com";

export const GoogleCalendarIntegration = () => {
  const { toast } = useToast();

  const handleAddToCalendar = () => {
    window.open(GOOGLE_CALENDAR_URL, '_blank');
    toast({
      title: "Calendar Sync Initiated",
      description: "Google Calendar will open in a new tab. Follow the prompts to add the meetings calendar to your Google Calendar.",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calendar className="mr-2 h-5 w-5" />
          Sync with Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Add all scheduled workbody meetings to your Google Calendar. 
          Once synced, all meetings will appear in your Google Calendar automatically.
        </p>
        <Button 
          onClick={handleAddToCalendar}
          className="w-full"
          variant="default"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add to My Google Calendar
        </Button>
      </CardContent>
    </Card>
  );
};
