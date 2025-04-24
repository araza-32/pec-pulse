
import { supabase } from "@/integrations/supabase/client";

type AuthHandlerProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  toast: any;
  setError: (error: string) => void;
};

export const useAuthHandlers = ({ onLogin, toast, setError }: AuthHandlerProps) => {
  
  const handleUserLogin = async (email: string, password: string) => {
    try {
      await onLogin(email, password);
    } catch (err) {
      console.error("Login error:", err);
      setError('An unexpected error occurred');
      throw err;
    }
  };

  const handleAdminLogin = async () => {
    try {
      const adminEmail = "admin@pec.org.pk";
      const adminPassword = "Coord@pec!@#123";
      
      await onLogin(adminEmail, adminPassword);
    } catch (err) {
      console.error('Unexpected error during admin login:', err);
      setError('An unexpected error occurred');
      throw err;
    }
  };

  const handleCoordinationLogin = async () => {
    try {
      const coordEmail = "coordination@pec.org.pk";
      const coordPassword = "Coord@123!@#@";
      
      await onLogin(coordEmail, coordPassword);
    } catch (err) {
      console.error('Unexpected error during coordination login:', err);
      setError('An unexpected error occurred');
      throw err;
    }
  };

  return {
    handleUserLogin,
    handleAdminLogin,
    handleCoordinationLogin
  };
};
