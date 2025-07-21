
-- Create workbody_composition_history table
CREATE TABLE public.workbody_composition_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workbody_id UUID REFERENCES public.workbodies(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL CHECK (change_type IN ('member_added', 'member_removed', 'member_role_changed', 'composition_updated')),
  change_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_document TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workbody_composition_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to view composition history"
  ON public.workbody_composition_history
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert composition history"
  ON public.workbody_composition_history
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update composition history"
  ON public.workbody_composition_history
  FOR UPDATE
  USING (true);

-- Create index for better performance
CREATE INDEX idx_workbody_composition_history_workbody_id ON public.workbody_composition_history(workbody_id);
CREATE INDEX idx_workbody_composition_history_changed_at ON public.workbody_composition_history(changed_at DESC);
