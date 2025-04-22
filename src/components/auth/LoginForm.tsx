
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onLogin: (session: any) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();

        if (profileError) {
          setError('Error fetching user profile');
          setIsLoading(false);
          return;
        }

        onLogin({ ...data.session, role: profileData.role });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setIsAdminLoading(true);
    setError("");
    
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
        setIsAdminLoading(false);
        return;
      }

      if (!userData?.session) {
        console.error('No session created');
        setError("Failed to create session");
        setIsAdminLoading(false);
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
        setIsAdminLoading(false);
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
          setIsAdminLoading(false);
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
          setIsAdminLoading(false);
          return;
        }
      }
      
      console.log("Admin profile setup complete");
      
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
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
              alt="PEC Logo"
              className="h-24 w-auto mb-2" 
            />
          </div>
          <CardTitle className="text-2xl">PEC Workbodies Portal</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@pec.org.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button type="button" variant="link" size="sm" className="h-auto p-0">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-pec-green hover:bg-pec-green-600" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Development Options
                </span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAdminLogin}
              disabled={isAdminLoading}
            >
              {isAdminLoading ? "Signing in..." : "Login as Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
