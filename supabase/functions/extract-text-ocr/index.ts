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
    const { fileUrl, minutesId } = await req.json();
    
    if (!fileUrl || !minutesId) {
      return new Response(
        JSON.stringify({ error: 'File URL and minutes ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting enhanced OCR extraction for:', fileUrl);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the PDF file
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status}`);
    }

    let extractedText = '';
    
    try {
      if (openAIApiKey) {
        console.log('Using OpenAI vision for enhanced OCR...');
        
        // Convert PDF to base64 for OpenAI vision API
        const fileBuffer = await fileResponse.arrayBuffer();
        const base64File = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
        const mimeType = fileResponse.headers.get('content-type') || 'application/pdf';
        
        // Use OpenAI Vision API for text extraction
        const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                content: `You are an expert OCR system for meeting minutes. Extract all text from this document accurately, maintaining the structure and formatting. Focus on:
                - Meeting details (date, time, location, attendees)
                - Agenda items and discussions
                - Decisions made
                - Action items and assignments
                - Any voting results or resolutions
                
                Provide the extracted text in a clean, readable format while preserving the document structure.`
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Please extract all text from this meeting minutes document:'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${mimeType};base64,${base64File}`,
                      detail: 'high'
                    }
                  }
                ]
              }
            ],
            max_tokens: 4000,
            temperature: 0.1
          }),
        });

        if (visionResponse.ok) {
          const visionData = await visionResponse.json();
          extractedText = visionData.choices[0].message.content;
          console.log('OpenAI vision extraction successful, text length:', extractedText.length);
        } else {
          console.log('OpenAI vision failed, falling back to basic extraction');
          throw new Error('Vision API failed');
        }
      } else {
        throw new Error('No OpenAI API key available');
      }
    } catch (ocrError) {
      console.log('Enhanced OCR failed, using fallback method:', ocrError.message);
      
      // Fallback to basic text extraction
      const fileBuffer = await fileResponse.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      try {
        const textDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
        const textContent = textDecoder.decode(uint8Array);
        
        // Basic text extraction from PDF (simplified)
        const textMatches = textContent.match(/[A-Za-z0-9\s\.,;:!?\-\(\)]+/g);
        if (textMatches) {
          extractedText = textMatches
            .filter(text => text.length > 10)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        }

        if (!extractedText || extractedText.length < 50) {
          extractedText = 'Basic OCR extraction completed but limited text was readable. For better results, ensure the document is text-based and high quality.';
        }
      } catch (fallbackError) {
        console.error('Fallback OCR failed:', fallbackError);
        extractedText = 'OCR extraction failed. The document may be image-based, corrupted, or in an unsupported format.';
      }
    }

    console.log('Final extracted text length:', extractedText.length);

    // Update the meeting minutes with extracted text
    const { error: updateError } = await supabase
      .from('meeting_minutes')
      .update({ 
        ocr_text: extractedText,
        ocr_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', minutesId);

    if (updateError) {
      console.error('Error updating minutes with OCR text:', updateError);
      throw new Error('Failed to save extracted text');
    }

    console.log('Successfully saved OCR text to database');

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
        textLength: extractedText.length,
        method: openAIApiKey ? 'enhanced_vision' : 'basic_fallback'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in extract-text-ocr function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});