
-- Add RLS policies for updating and deleting scheduled meetings
CREATE POLICY "Allow authenticated users to update scheduled meetings" 
  ON public.scheduled_meetings 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete scheduled meetings" 
  ON public.scheduled_meetings 
  FOR DELETE 
  USING (true);
