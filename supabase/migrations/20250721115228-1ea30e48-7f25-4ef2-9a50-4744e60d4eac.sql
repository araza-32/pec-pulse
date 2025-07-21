
-- Create report_history table to store generated reports
CREATE TABLE public.report_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  format TEXT NOT NULL,
  workbody_type TEXT NOT NULL,
  workbody_name TEXT,
  download_url TEXT,
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_by TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.report_history ENABLE ROW LEVEL SECURITY;

-- Create policies for report_history
CREATE POLICY "Allow authenticated users to view report history" 
  ON public.report_history 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to create report history" 
  ON public.report_history 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update report history" 
  ON public.report_history 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow authenticated users to delete report history" 
  ON public.report_history 
  FOR DELETE 
  USING (true);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_report_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_report_history_updated_at_trigger
  BEFORE UPDATE ON public.report_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_report_history_updated_at();
