import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { calendarId, timeMin, timeMax } = await req.json();
    
    console.log('Request received with:', { calendarId, timeMin, timeMax });
    
    // Use the provided API key - in production, this should be stored as a secret
    const API_KEY = "AIzaSyCGc51JFpQ5yXnVaT4xGMbNUfG9lPtyNJY";
    
    // Set default time range if not provided
    const defaultTimeMin = timeMin || new Date().toISOString();
    const defaultTimeMax = timeMax || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year from now
    
    console.log('Using time range:', { defaultTimeMin, defaultTimeMax });
    
    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events');
    url.searchParams.set('key', API_KEY);
    url.searchParams.set('timeMin', defaultTimeMin);
    url.searchParams.set('timeMax', defaultTimeMax);
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');
    url.searchParams.set('maxResults', '50');

    console.log('Fetching calendar events from:', url.toString());

    const response = await fetch(url.toString());
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Calendar API error:', response.status, errorText);
      
      // Parse error details if it's JSON
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
        console.error('Parsed error details:', errorJson);
      } catch (e) {
        console.error('Error text is not JSON:', errorText);
      }
      
      throw new Error(`Google Calendar API error: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();
    
    // Transform the events to a more usable format
    const events = data.items?.map((event: CalendarEvent) => ({
      id: event.id,
      title: event.summary || 'No Title',
      description: event.description || '',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      location: event.location || '',
      attendees: event.attendees || [],
      isAllDay: !event.start.dateTime, // If no dateTime, it's an all-day event
    })) || [];

    console.log(`Successfully fetched ${events.length} calendar events`);

    return new Response(JSON.stringify({ 
      events,
      totalCount: events.length,
      nextPageToken: data.nextPageToken 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in fetch-google-calendar function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to fetch calendar events' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);