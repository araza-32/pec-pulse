
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PerformanceAnalysis {
  progressHighlights: string[];
  milestones: string[];
  risks: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meetingId } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch meeting minutes from database
    const { data: minutes, error: fetchError } = await supabase
      .from('meeting_minutes')
      .select('*')
      .eq('id', meetingId)
      .single();

    if (fetchError || !minutes) {
      throw new Error('Meeting minutes not found');
    }

    // Create a specialized prompt for performance analysis
    const prompt = `
    Analyze the following meeting minutes for performance insights:

    Meeting Date: ${minutes.date}
    Location: ${minutes.location}
    Agenda Items: ${minutes.agenda_items.join(', ')}
    Actions Agreed: ${minutes.actions_agreed.join(', ')}

    Extract performance-related information:
    1. Progress Updates (quantified progress like "75% complete", "Phase 2 finished")
    2. Milestones Achieved (completed deliverables, approvals, launches)
    3. Risks & Blockers (challenges, delays, resource constraints)

    Format as JSON:
    {
      "progressHighlights": ["string"],
      "milestones": ["string"], 
      "risks": ["string"]
    }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert at analyzing meeting minutes for performance metrics, progress tracking, and risk assessment. Always respond with valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    let parsedResponse: PerformanceAnalysis;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid AI response format');
    }

    // Store performance analysis alongside summary
    const { data: existingSummary } = await supabase
      .from('meeting_minutes_summaries')
      .select('*')
      .eq('meeting_minutes_id', meetingId)
      .single();

    if (existingSummary) {
      // Update existing summary with performance data
      const { data: updatedSummary, error: updateError } = await supabase
        .from('meeting_minutes_summaries')
        .update({
          // Store performance data in a new JSONB field
          performance_analysis: parsedResponse,
          updated_at: new Date().toISOString()
        })
        .eq('meeting_minutes_id', meetingId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating summary with performance data:', updateError);
        throw new Error('Failed to save performance analysis');
      }

      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('No existing summary found for this meeting');
    }

  } catch (error) {
    console.error('Error in analyze-performance function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
