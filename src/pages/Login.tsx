
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const { session, login } = useAuth();
  const { toast } = useToast();

  // Redirect to dashboard if already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Use login function from context with improved error handling
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-center">Login to PEC Pulse</h1>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
