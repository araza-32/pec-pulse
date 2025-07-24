-- Add audit_logs table for tracking all changes
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id UUID NOT NULL,
  before_data JSONB,
  after_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address INET
);

-- Add parent_id to workbodies for nesting task forces
ALTER TABLE public.workbodies 
ADD COLUMN parent_id UUID REFERENCES public.workbodies(id) ON DELETE SET NULL;

-- Create enhanced composition table (rename existing workbody_members)
CREATE TABLE public.workbody_composition (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workbody_id UUID REFERENCES public.workbodies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('Convener', 'Chair', 'Co-Chair', 'Member', 'Secretary')),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(workbody_id, user_id, role)
);

-- Add meetings table for scheduling
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workbody_id UUID REFERENCES public.workbodies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  agenda_items TEXT[],
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add minute_summaries table for AI insights
CREATE TABLE public.minute_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  minute_id UUID REFERENCES public.meeting_minutes(id) ON DELETE CASCADE,
  summary TEXT,
  decisions JSONB DEFAULT '[]'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb,
  ai_model TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workbody_composition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minute_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to view audit logs"
  ON public.audit_logs FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations on workbody composition"
  ON public.workbody_composition FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on meetings"
  ON public.meetings FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on minute summaries"
  ON public.minute_summaries FOR ALL
  USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_changed_at ON public.audit_logs(changed_at DESC);
CREATE INDEX idx_workbodies_parent_id ON public.workbodies(parent_id);
CREATE INDEX idx_meetings_workbody_id ON public.meetings(workbody_id);
CREATE INDEX idx_meetings_datetime ON public.meetings(datetime);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      table_name, operation, record_id, before_data, changed_by
    ) VALUES (
      TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD), auth.uid()
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      table_name, operation, record_id, before_data, after_data, changed_by
    ) VALUES (
      TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW), auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      table_name, operation, record_id, after_data, changed_by
    ) VALUES (
      TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW), auth.uid()
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers
CREATE TRIGGER workbodies_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.workbodies
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER workbody_composition_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.workbody_composition
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();