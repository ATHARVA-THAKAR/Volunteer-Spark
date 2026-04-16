
-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS: replace public policies with authenticated ones

-- volunteers
DROP POLICY IF EXISTS "Allow public read volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Allow public insert volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Allow public update volunteers" ON public.volunteers;

CREATE POLICY "Authenticated read volunteers" ON public.volunteers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert volunteers" ON public.volunteers
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update volunteers" ON public.volunteers
  FOR UPDATE TO authenticated USING (true);

-- check_ins
DROP POLICY IF EXISTS "Allow public read check_ins" ON public.check_ins;
DROP POLICY IF EXISTS "Allow public insert check_ins" ON public.check_ins;

CREATE POLICY "Authenticated read check_ins" ON public.check_ins
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert check_ins" ON public.check_ins
  FOR INSERT TO authenticated WITH CHECK (true);

-- participation_data
DROP POLICY IF EXISTS "Allow public read participation_data" ON public.participation_data;

CREATE POLICY "Authenticated read participation_data" ON public.participation_data
  FOR SELECT TO authenticated USING (true);

-- weekly_morale
DROP POLICY IF EXISTS "Allow public read weekly_morale" ON public.weekly_morale;

CREATE POLICY "Authenticated read weekly_morale" ON public.weekly_morale
  FOR SELECT TO authenticated USING (true);
