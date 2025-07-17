
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { minutesId } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch meeting minutes from database
    const { data: minutes, error: fetchError } = await supabase
      .from('meeting_minutes')
      .select(`
        *,
        workbodies:workbody_id (
          name
        )
      `)
      .eq('id', minutesId)
      .single();

    if (fetchError || !minutes) {
      throw new Error('Meeting minutes not found');
    }

    // Check if OCR text is available
    if (!minutes.ocr_text || minutes.ocr_text.trim() === '') {
      throw new Error('No OCR text available for summarization. Please wait for OCR processing to complete.');
    }

    // Enhanced prompt for structured summarization
    const prompt = `You are an expert meeting analyst. Analyze these meeting minutes and provide a structured summary.

Meeting Details:
- Workbody: ${minutes.workbodies?.name || 'Unknown'}
- Date: ${minutes.date}
- Location: ${minutes.location}
- Agenda Items: ${minutes.agenda_items?.join(', ') || 'None specified'}
- Actions Previously Agreed: ${minutes.actions_agreed?.join(', ') || 'None specified'}

Meeting Content (OCR Text):
${minutes.ocr_text}

Please provide a comprehensive analysis in JSON format with these exact fields:
{
  "summaryText": "A detailed 2-3 paragraph executive summary of the meeting",
  "decisions": ["List of key decisions made during the meeting"],
  "actionItems": [
    {
      "task": "Specific task description",
      "owner": "Person or department responsible",
      "dueDate": "YYYY-MM-DD or empty string if not specified",
      "status": "pending"
    }
  ],
  "sentiment": 0.7,
  "topics": ["List of main topics discussed"],
  "performanceAnalysis": {
    "progressHighlights": ["Key progress points mentioned"],
    "milestones": ["Milestones achieved or discussed"],
    "risks": ["Risks or challenges identified"]
  }
}

Focus on extracting concrete, actionable information and provide realistic sentiment analysis (scale -1 to 1).`;

    console.log('Sending request to OpenAI...');
    
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
            content: 'You are an expert at analyzing meeting minutes and extracting structured information. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('Raw AI response:', aiResponse);
    
    let parsedResponse: any;
    try {
      // Clean the response to extract JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      parsedResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid AI response format');
    }

    console.log('Parsed AI response:', parsedResponse);

    // Save summary to database with upsert logic
    const { data: savedSummary, error: saveError } = await supabase
      .from('meeting_minutes_summaries')
      .upsert({
        meeting_minutes_id: minutesId,
        summary_text: parsedResponse.summaryText,
        decisions: parsedResponse.decisions || [],
        action_items: parsedResponse.actionItems || [],
        sentiment_score: parsedResponse.sentiment || 0,
        topics: parsedResponse.topics || [],
        performance_analysis: parsedResponse.performanceAnalysis || {},
      }, { 
        onConflict: 'meeting_minutes_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving summary:', saveError);
      throw new Error('Failed to save summary to database');
    }

    console.log('Summary saved successfully:', savedSummary);

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
