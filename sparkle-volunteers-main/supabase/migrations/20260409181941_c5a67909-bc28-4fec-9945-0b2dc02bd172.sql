
CREATE TABLE public.task_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  volunteer_id UUID NOT NULL,
  volunteer_name TEXT NOT NULL,
  task_name TEXT NOT NULL,
  satisfaction INTEGER NOT NULL CHECK (satisfaction >= 1 AND satisfaction <= 5),
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  support_needed TEXT NOT NULL DEFAULT '',
  improvements TEXT NOT NULL DEFAULT '',
  would_do_again BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.task_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all feedback"
  ON public.task_feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert feedback"
  ON public.task_feedback FOR INSERT
  TO authenticated
  WITH CHECK (true);
