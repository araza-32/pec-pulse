
-- Add performance_analysis column to meeting_minutes_summaries table
ALTER TABLE public.meeting_minutes_summaries 
ADD COLUMN IF NOT EXISTS performance_analysis JSONB DEFAULT '{}'::jsonb;
