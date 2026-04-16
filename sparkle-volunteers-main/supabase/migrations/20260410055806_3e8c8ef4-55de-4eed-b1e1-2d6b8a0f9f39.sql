-- Allow reading all user_roles for volunteer lookup
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Authenticated users can read all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- Allow reading all profiles for volunteer name display
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Authenticated users can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);