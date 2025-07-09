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

    console.log('Starting OCR extraction for:', fileUrl);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the PDF file
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);

    // For now, we'll use a simple text extraction approach
    // In production, you might want to use a more sophisticated OCR service
    let extractedText = '';
    
    try {
      // Convert PDF to text using a simple approach
      // This is a placeholder - in production you'd use a proper PDF parser
      const textDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
      const textContent = textDecoder.decode(uint8Array);
      
      // Basic text extraction from PDF (very simplified)
      // Extract readable text patterns
      const textMatches = textContent.match(/[A-Za-z0-9\s\.,;:!?\-\(\)]+/g);
      if (textMatches) {
        extractedText = textMatches
          .filter(text => text.length > 10) // Filter out very short fragments
          .join(' ')
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      }

      // If no text extracted, provide a fallback
      if (!extractedText || extractedText.length < 50) {
        extractedText = 'OCR extraction completed but text content was not readable. Please ensure the PDF contains text-based content.';
      }

    } catch (ocrError) {
      console.error('OCR processing error:', ocrError);
      extractedText = 'OCR extraction failed. The document may be image-based or corrupted.';
    }

    console.log('Extracted text length:', extractedText.length);

    // Update the meeting minutes with extracted text
    const { error: updateError } = await supabase
      .from('meeting_minutes')
      .update({ 
        ocr_text: extractedText,
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
        textLength: extractedText.length
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