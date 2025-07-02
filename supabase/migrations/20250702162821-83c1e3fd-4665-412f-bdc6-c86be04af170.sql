
-- Create table for storing AI-generated summaries of meeting minutes
CREATE TABLE public.meeting_minutes_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_minutes_id UUID NOT NULL REFERENCES public.meeting_minutes(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  decisions JSONB DEFAULT '[]'::jsonb,
  action_items JSONB DEFAULT '[]'::jsonb,
  sentiment_score DECIMAL(3,2) DEFAULT 0.00,
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the summaries table
ALTER TABLE public.meeting_minutes_summaries ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view summaries
CREATE POLICY "Allow authenticated users to view summaries" 
  ON public.meeting_minutes_summaries 
  FOR SELECT 
  USING (true);

-- Create policy for authenticated users to insert/update summaries
CREATE POLICY "Allow authenticated users to manage summaries" 
  ON public.meeting_minutes_summaries 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_meeting_minutes_summaries_minutes_id ON public.meeting_minutes_summaries(meeting_minutes_id);
CREATE INDEX idx_meeting_minutes_summaries_created_at ON public.meeting_minutes_summaries(created_at);

-- Add trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_meeting_minutes_summaries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meeting_minutes_summaries_updated_at
  BEFORE UPDATE ON public.meeting_minutes_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_meeting_minutes_summaries_updated_at();
