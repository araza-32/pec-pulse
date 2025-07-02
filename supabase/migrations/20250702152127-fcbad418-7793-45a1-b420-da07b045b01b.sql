
-- Extend workbodies table with performance metrics fields
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS meetings_held integer DEFAULT 0;
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS attendance_rate numeric(5,2) DEFAULT 0.00;
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS member_turnover integer DEFAULT 0;
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS action_item_completion numeric(5,2) DEFAULT 0.00;
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS doc_submission_timeliness numeric(5,2) DEFAULT 0.00;
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS recommendations_issued integer DEFAULT 0;
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS deliverable_quality_score numeric(3,2) DEFAULT 0.00;
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS average_decision_turnaround integer DEFAULT 0;
ALTER TABLE public.workbodies ADD COLUMN IF NOT EXISTS cross_workbody_collaborations integer DEFAULT 0;

-- Create historical performance metrics table
CREATE TABLE IF NOT EXISTS public.workbody_performance_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workbody_id uuid REFERENCES public.workbodies(id) ON DELETE CASCADE,
  period_type text NOT NULL CHECK (period_type IN ('quarter', 'year')),
  period_start date NOT NULL,
  period_end date NOT NULL,
  meetings_held integer DEFAULT 0,
  attendance_rate numeric(5,2) DEFAULT 0.00,
  member_turnover integer DEFAULT 0,
  action_item_completion numeric(5,2) DEFAULT 0.00,
  doc_submission_timeliness numeric(5,2) DEFAULT 0.00,
  recommendations_issued integer DEFAULT 0,
  deliverable_quality_score numeric(3,2) DEFAULT 0.00,
  average_decision_turnaround integer DEFAULT 0,
  cross_workbody_collaborations integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create performance targets table
CREATE TABLE IF NOT EXISTS public.performance_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  target_value numeric(10,2) NOT NULL,
  warning_threshold numeric(10,2) NOT NULL,
  danger_threshold numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(metric_name)
);

-- Enable RLS on new tables
ALTER TABLE public.workbody_performance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_targets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for performance history
CREATE POLICY "Allow authenticated users to view performance history"
  ON public.workbody_performance_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert performance history"
  ON public.workbody_performance_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update performance history"
  ON public.workbody_performance_history
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create RLS policies for performance targets
CREATE POLICY "Allow authenticated users to view performance targets"
  ON public.performance_targets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage performance targets"
  ON public.performance_targets
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default performance targets
INSERT INTO public.performance_targets (metric_name, target_value, warning_threshold, danger_threshold)
VALUES 
  ('attendance_rate', 90.00, 80.00, 70.00),
  ('action_item_completion', 85.00, 75.00, 60.00),
  ('doc_submission_timeliness', 95.00, 85.00, 70.00),
  ('deliverable_quality_score', 4.00, 3.50, 3.00),
  ('average_decision_turnaround', 14, 21, 30)
ON CONFLICT (metric_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workbody_performance_history_workbody_id ON public.workbody_performance_history(workbody_id);
CREATE INDEX IF NOT EXISTS idx_workbody_performance_history_period ON public.workbody_performance_history(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_performance_targets_metric_name ON public.performance_targets(metric_name);
