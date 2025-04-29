
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/render?cid=c_811e0f51fc4619f9685f4ebd0d487e9ae57f4e7d35e77e5ed8e68c44bb76b11a@group.calendar.google.com";

export const GoogleCalendarIntegration = () => {
  const handleAddToCalendar = () => {
    window.open(GOOGLE_CALENDAR_URL, '_blank');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Sync with Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Add all scheduled meetings to your Google Calendar to stay updated.
        </p>
        <Button 
          onClick={handleAddToCalendar}
          className="w-full sm:w-auto"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add to Google Calendar
        </Button>
      </CardContent>
    </Card>
  );
};
