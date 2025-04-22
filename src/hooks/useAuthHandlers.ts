
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AuthHandlerProps = {
  onLogin: (session: any) => void;
  toast: any;
  setError: (error: string) => void;
};

export const useAuthHandlers = ({ onLogin, toast, setError }: AuthHandlerProps) => {
  
  const handleUserLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.session) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setError('Error fetching user profile');
          return;
        }

        // Store user data in localStorage for use in components
        localStorage.setItem('user', JSON.stringify({
          id: data.session.user.id,
          email: data.session.user.email,
          role: profileData.role
        }));

        toast({
          title: "Login Successful",
          description: `Welcome ${data.session.user.email}`,
        });

        onLogin({ ...data.session, role: profileData.role });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An unexpected error occurred');
    }
  };

  const handleAdminLogin = async () => {
    try {
      const adminEmail = "admin@pec.org.pk";
      const adminPassword = "Coord@pec!@#123";
      
      console.log("Starting admin login process");
      
      // First check if the user exists in auth
      const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (userError) {
        console.error('Admin auth error:', userError);
        setError(`Admin login failed: ${userError.message}`);
        return;
      }

      if (!userData?.session) {
        console.error('No session created');
        setError("Failed to create session");
        return;
      }

      console.log("Admin authenticated successfully");

      // Check if profile exists in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.session.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('Error checking profile:', profileError);
        setError('Error checking admin profile');
        return;
      }

      console.log("Profile check result:", profileData);
      
      // If profile doesn't exist, create it
      if (!profileData) {
        console.log("Creating new admin profile");
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userData.session.user.id, 
            role: 'admin' 
          }]);
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
          setError('Failed to create admin profile');
          return;
        }
      } 
      // If role is not admin, update it
      else if (profileData.role !== 'admin') {
        console.log("Updating profile role to admin");
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userData.session.user.id);
          
        if (updateError) {
          console.error('Error updating role:', updateError);
          setError('Failed to update admin role');
          return;
        }
      }
      
      console.log("Admin profile setup complete");
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: userData.session.user.id,
        email: userData.session.user.email,
        role: 'admin'
      }));
      
      // Return complete session with role
      onLogin({ 
        ...userData.session, 
        role: 'admin'
      });
      
      toast({
        title: "Admin Login Successful",
        description: "You are now logged in as admin with full access.",
      });
    } catch (err) {
      console.error('Unexpected error during admin login:', err);
      setError('An unexpected error occurred');
    }
  };

  const handleCoordinationLogin = async () => {
    try {
      const coordEmail = "coordination@pec.org.pk";
      const coordPassword = "Coord@123!@#@";
      
      console.log("Starting coordination login process");
      
      const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
        email: coordEmail,
        password: coordPassword,
      });

      if (userError) {
        console.error('Coordination auth error:', userError);
        setError(`Coordination login failed: ${userError.message}`);
        return;
      }

      if (!userData?.session) {
        console.error('No session created');
        setError("Failed to create session");
        return;
      }

      console.log("Coordination authenticated successfully");

      // Check if profile exists 
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.session.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('Error checking profile:', profileError);
        setError('Error checking coordination profile');
        return;
      }

      console.log("Profile check result:", profileData);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: userData.session.user.id,
        email: userData.session.user.email,
        role: 'admin'
      }));
      
      // Return complete session with role
      onLogin({ 
        ...userData.session, 
        role: 'admin'
      });
      
      toast({
        title: "Coordination Login Successful",
        description: "You are now logged in as coordination with full access.",
      });
    } catch (err) {
      console.error('Unexpected error during coordination login:', err);
      setError('An unexpected error occurred');
    }
  };

  return {
    handleUserLogin,
    handleAdminLogin,
    handleCoordinationLogin
  };
};
