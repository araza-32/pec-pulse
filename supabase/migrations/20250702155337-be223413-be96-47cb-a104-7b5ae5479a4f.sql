
-- Add status column to profiles table and update role enum
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Add invite_token and invite_expires columns for invitation flow
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS invite_token TEXT,
ADD COLUMN IF NOT EXISTS invite_expires TIMESTAMP WITH TIME ZONE;

-- Add email column to profiles (we'll sync this with auth.users.email)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, role, email, name, status)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'member'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET 
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data ->> 'name', EXCLUDED.name);
  RETURN NEW;
END;
$function$;

-- Create RLS policies for user management (only admins can manage users)
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (id = auth.uid());

-- Allow users to update their own profile (limited fields)
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() AND 
  role = (SELECT role FROM public.profiles WHERE id = auth.uid()) -- prevent role escalation
);
