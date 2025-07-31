
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: any;
  user: User | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    console.log("AuthProvider: Initializing auth");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        
        if (currentSession) {
          handleProfileFetch(currentSession);
        } else {
          setUser(null);
          localStorage.removeItem('user');
          setIsLoading(false);
        }
        
        // Mark auth as checked regardless of the result
        setIsAuthChecked(true);
      }
    );

    // Then check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession?.user?.email);
      
      if (initialSession) {
        setSession(initialSession);
        handleProfileFetch(initialSession);
      } else {
        setIsLoading(false);
        setIsAuthChecked(true);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleProfileFetch = async (currentSession: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentSession.user.id)
        .maybeSingle();

      const userRole = profile?.role === 'admin' || profile?.role === 'secretary' || profile?.role === 'chairman' 
        ? profile.role as 'admin' | 'secretary' | 'chairman'
        : 'member' as 'admin' | 'secretary' | 'chairman';

      const userObj = {
        id: currentSession.user.id,
        name: currentSession.user.email?.split('@')[0] || 'User',
        email: currentSession.user.email || '',
        role: userRole,
      };
      
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (e) {
      console.error("Error fetching user profile:", e);
    } finally {
      setIsLoading(false);
      setIsAuthChecked(true);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user...");
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      localStorage.removeItem('user');
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, isAuthChecked, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
