
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { users } from "@/data/mockData";
import { User } from "@/types";
import { 
  HelpCircle, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      
      if (user && password === "password") { // In a real app, you would use proper auth
        onLogin(user);
      } else {
        setError("Invalid email or password");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const demoCredentials = [
    { email: "admin@pec.org.pk", role: "Admin" },
    { email: "committee1@pec.org.pk", role: "Secretary" }
  ];

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
            
            <div className="text-center text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                      className="mx-auto"
                    >
                      {showDemoCredentials ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                      {showDemoCredentials ? "Hide" : "Show"} Demo Credentials
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to reveal demo login information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {showDemoCredentials && (
                <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200 text-blue-700">
                  {demoCredentials.map((cred, index) => (
                    <p key={index}>
                      {cred.role}: {cred.email} (Password: password)
                    </p>
                  ))}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
