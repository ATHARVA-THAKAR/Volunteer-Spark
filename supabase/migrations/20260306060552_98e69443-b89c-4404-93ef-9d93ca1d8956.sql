
-- Volunteers table
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '',
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  tasks_assigned INTEGER NOT NULL DEFAULT 0,
  participation_rate INTEGER NOT NULL DEFAULT 0,
  last_active DATE NOT NULL DEFAULT CURRENT_DATE,
  morale_score INTEGER NOT NULL DEFAULT 5,
  burnout_risk TEXT NOT NULL DEFAULT 'low' CHECK (burnout_risk IN ('low', 'medium', 'high')),
  weekly_hours INTEGER NOT NULL DEFAULT 0,
  check_in_streak INTEGER NOT NULL DEFAULT 0,
  feedback TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Check-ins table
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE NOT NULL,
  volunteer_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  workload TEXT NOT NULL CHECK (workload IN ('light', 'moderate', 'heavy', 'overwhelming')),
  comment TEXT NOT NULL DEFAULT '',
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weekly morale data for analytics
CREATE TABLE public.weekly_morale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week TEXT NOT NULL,
  average NUMERIC(3,1) NOT NULL
);

-- Participation data for analytics
CREATE TABLE public.participation_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  rate INTEGER NOT NULL
);

-- Enable RLS
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_morale ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participation_data ENABLE ROW LEVEL SECURITY;

-- Public read policies (no auth required for prototype)
CREATE POLICY "Allow public read volunteers" ON public.volunteers FOR SELECT USING (true);
CREATE POLICY "Allow public insert volunteers" ON public.volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update volunteers" ON public.volunteers FOR UPDATE USING (true);

CREATE POLICY "Allow public read check_ins" ON public.check_ins FOR SELECT USING (true);
CREATE POLICY "Allow public insert check_ins" ON public.check_ins FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read weekly_morale" ON public.weekly_morale FOR SELECT USING (true);
CREATE POLICY "Allow public read participation_data" ON public.participation_data FOR SELECT USING (true);
