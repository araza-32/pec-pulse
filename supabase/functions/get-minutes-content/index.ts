
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meetingId } = await req.json();

    if (!meetingId) {
      return new Response(
        JSON.stringify({ error: 'Meeting ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch meeting minutes record
    const { data: minutes, error: dbError } = await supabase
      .from('meeting_minutes')
      .select('*')
      .eq('id', meetingId)
      .single();

    if (dbError || !minutes) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Meeting minutes not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch file content from the stored URL
    try {
      const fileResponse = await fetch(minutes.file_url);
      
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file: ${fileResponse.status}`);
      }

      // For PDF files, we'll need to extract text content
      const contentType = fileResponse.headers.get('content-type') || '';
      let fileContent = '';

      if (contentType.includes('application/pdf')) {
        // For PDF files, return metadata and let the frontend handle PDF parsing
        fileContent = 'PDF_FILE_CONTENT_PLACEHOLDER';
      } else {
        // For text files, read content directly
        fileContent = await fileResponse.text();
      }

      return new Response(
        JSON.stringify({
          meetingId,
          fileUrl: minutes.file_url,
          content: fileContent,
          contentType,
          agendaItems: minutes.agenda_items || [],
          actionsAgreed: minutes.actions_agreed || [],
          date: minutes.date,
          location: minutes.location
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (fileError) {
      console.error('File fetch error:', fileError);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve file content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in get-minutes-content function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
