
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { session, signIn } = useAuth();

  // Redirect to dashboard if already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Use signIn function from context or fallback to a function that does nothing
  const handleLogin = signIn || ((user) => {
    console.warn("No signIn function available in auth context");
  });

  return <LoginForm onLogin={handleLogin} />;
}
