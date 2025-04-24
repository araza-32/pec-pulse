
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { session, login } = useAuth();

  // Redirect to dashboard if already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Use login function from context or fallback
  const handleLogin = login;

  return <LoginForm onLogin={handleLogin} />;
}
