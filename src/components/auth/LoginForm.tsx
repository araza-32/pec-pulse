
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await onLogin(email, password);
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminClick = async () => {
    setIsAdminLoading(true);
    try {
      await onLogin("admin@pec.org.pk", "Coord@pec!@#123");
      toast({
        title: "Admin Login Successful",
        description: "You are now logged in as admin with full access.",
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Failed to login as admin');
    } finally {
      setIsAdminLoading(false);
    }
  };
  
  const handleCoordinationClick = async () => {
    setIsAdminLoading(true);
    try {
      await onLogin("coordination@pec.org.pk", "Coord@123!@#@");
      toast({
        title: "Coordination Login Successful",
        description: "You are now logged in as coordination with full access.",
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Coordination login error:', err);
      setError('Failed to login as coordination');
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="w-full max-w-md px-4">
        <Card className="w-full shadow-lg border-0 animate-fade-in">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
                alt="PEC Logo"
                className="h-24 w-auto mb-2" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to PEC Pulse Portal</h1>
              <p className="text-sm text-gray-600 mt-2">
                Managing Committees, Working Groups, and Taskforces efficiently
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@pec.org.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button 
                    type="button" 
                    variant="link" 
                    size="sm" 
                    className="px-0 font-normal text-pec-green hover:text-pec-green-600"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-lg"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-pec-green hover:bg-pec-green-600 transition-colors duration-300 rounded-lg h-11"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Trouble logging in? <a href="mailto:support@pec.org.pk" className="text-pec-green hover:text-pec-green-600">Contact PEC IT Support</a>
              </p>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Development Options
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAdminClick}
                  disabled={isAdminLoading}
                  className="transition-all duration-300 rounded-lg"
                >
                  Login as Admin
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCoordinationClick}
                  disabled={isAdminLoading}
                  className="transition-all duration-300 rounded-lg"
                >
                  Login as Coordination
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <footer className="text-center mt-8 text-sm text-gray-600">
          © 2025 Pakistan Engineering Council. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
