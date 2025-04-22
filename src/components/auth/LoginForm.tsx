
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import { useNavigate } from "react-router-dom";

export function LoginForm({ onLogin }: { onLogin: ((session: any) => void) | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSuccessfulLogin = (session: any) => {
    if (onLogin) {
      onLogin(session);
    } else {
      navigate('/dashboard');
    }
  };
  
  const { 
    handleUserLogin, 
    handleAdminLogin, 
    handleCoordinationLogin 
  } = useAuthHandlers({ 
    onLogin: handleSuccessfulLogin, 
    toast, 
    setError 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await handleUserLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminClick = async () => {
    setIsAdminLoading(true);
    try {
      await handleAdminLogin();
    } finally {
      setIsAdminLoading(false);
    }
  };
  
  const handleCoordinationClick = async () => {
    setIsAdminLoading(true);
    try {
      await handleCoordinationLogin();
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
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleAdminClick}
                disabled={isAdminLoading}
              >
                {isAdminLoading ? "Signing in..." : "Login as Admin"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCoordinationClick}
                disabled={isAdminLoading}
              >
                Login as Coordination
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
