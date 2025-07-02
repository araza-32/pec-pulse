
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

interface SummaryResponse {
  summary: string;
  decisions: string[];
  actionItems: Array<{
    task: string;
    owner: string;
    dueDate: string;
    status: string;
  }>;
  sentiment: number;
  topics: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { minutesId } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch meeting minutes from database
    const { data: minutes, error: fetchError } = await supabase
      .from('meeting_minutes')
      .select('*')
      .eq('id', minutesId)
      .single();

    if (fetchError || !minutes) {
      throw new Error('Meeting minutes not found');
    }

    // Create a comprehensive prompt for OpenAI
    const prompt = `
    Please analyze the following meeting minutes and provide a structured response:

    Meeting Date: ${minutes.date}
    Location: ${minutes.location}
    Agenda Items: ${minutes.agenda_items.join(', ')}
    Actions Agreed: ${minutes.actions_agreed.join(', ')}

    Please provide:
    1. A concise summary (2-3 sentences)
    2. Key decisions made (list format)
    3. Action items with owner and due date if mentioned
    4. Sentiment analysis (-1 to +1 scale)
    5. Main topics discussed (keywords)

    Format your response as JSON with these fields:
    {
      "summary": "string",
      "decisions": ["string"],
      "actionItems": [{"task": "string", "owner": "string", "dueDate": "string", "status": "pending"}],
      "sentiment": number,
      "topics": ["string"]
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
            content: 'You are an expert at analyzing meeting minutes and extracting key information. Always respond with valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    let parsedResponse: SummaryResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid AI response format');
    }

    // Save summary to database
    const { data: savedSummary, error: saveError } = await supabase
      .from('meeting_minutes_summaries')
      .upsert({
        meeting_minutes_id: minutesId,
        summary_text: parsedResponse.summary,
        decisions: parsedResponse.decisions,
        action_items: parsedResponse.actionItems,
        sentiment_score: parsedResponse.sentiment,
        topics: parsedResponse.topics,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving summary:', saveError);
      throw new Error('Failed to save summary');
    }

    return new Response(JSON.stringify(savedSummary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in summarize-minutes function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
