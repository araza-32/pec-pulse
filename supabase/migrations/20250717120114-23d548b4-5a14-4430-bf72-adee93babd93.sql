
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Create a security definer function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recreate the admin policy using the security definer function
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  public.get_current_user_role() = 'admin'
);

-- Also update the user profile update policy to prevent role escalation more safely
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() AND 
  role = public.get_current_user_role() -- prevent role escalation using the function
);
