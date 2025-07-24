import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Enhanced User roles with all 7 types
export type UserRole = 'admin' | 'secretary' | 'chairman' | 'registrar' | 'coordination' | 'member' | 'ChairmanPEC';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workbodyId?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  session: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

// Create the auth context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (isAuthenticated === 'true') {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole') as UserRole;
        const workbodyId = localStorage.getItem('workbodyId') || undefined;
        const userName = localStorage.getItem('userName') || '';
        const userEmail = localStorage.getItem('userEmail') || '';
        const userStatus = localStorage.getItem('userStatus') || 'active';
        
        // Reconstruct user from localStorage
        if (userId && userRole) {
          setUser({
            id: userId,
            name: userName,
            email: userEmail,
            role: userRole,
            workbodyId,
            status: userStatus
          });
        }
      }
    };
    
    checkExistingSession();
  }, []);

  // Update user profile data
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      // Update the user in localStorage
      if (data.name) localStorage.setItem('userName', data.name);
      if (data.email) localStorage.setItem('userEmail', data.email);
      if (data.role) localStorage.setItem('userRole', data.role);
      if (data.status) localStorage.setItem('userStatus', data.status);
      
      // Update the user state
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      // If integrated with Supabase, update the profile there as well
      if (user.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            name: data.name || user.name,
            role: data.role || user.role,
            status: data.status || user.status
          })
          .eq('id', user.id);
        
        if (error) throw error;
      }
      
      // Show success toast or notification
      console.log("Profile updated successfully");
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Login functionality
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // First, try to sign in with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        // If Supabase auth fails, fall back to mock login for development
        console.log('Supabase auth failed, using mock login:', authError);
        
        // Mock login - in a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data based on email - updated to use pec.org.pk
        let role: UserRole = 'admin';
        let id = '1';
        let name = 'Admin User';
        let workbodyId: string | undefined = undefined;
        let status = 'active';
        
        if (email.includes('admin@pec.org.pk')) {
          role = 'admin';
          id = '1';
          name = 'Admin User';
        } else if (email.includes('chairman@pec.org.pk')) {
          role = 'ChairmanPEC';
          id = '3';
          name = 'Chairman PEC';
        } else if (email.includes('secretary')) {
          role = 'secretary';
          id = '2';
          name = 'Secretary User';
          workbodyId = 'wb-1'; // Mock workbody ID for secretary
        } else if (email.includes('registrar')) {
          role = 'registrar';
          id = '4';
          name = 'Registrar PEC';
        } else if (email.includes('coordination')) {
          role = 'coordination';
          id = '5';
          name = 'Coordination User';
        } else {
          // Default to admin for any pec.org.pk email
          role = 'admin';
          id = '1';
          name = 'Admin User';
        }
        
        // Set the user with the proper typed role
        const userData = {
          id,
          name,
          email,
          role,
          workbodyId,
          status
        };
        
        setUser(userData);
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', id);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userStatus', status);
        if (workbodyId) {
          localStorage.setItem('workbodyId', workbodyId);
        }
      } else if (authData.user) {
        // Supabase auth successful, get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        const role = (profileData?.role || 'admin') as UserRole;
        const name = profileData?.name || authData.user.email?.split('@')[0] || 'User';
        const status = profileData?.status || 'active';
        
        // For secretary roles, we'll hardcode the workbody ID for now
        // In a real application, you would store this in a separate table
        let workbodyId: string | undefined;
        
        if (role === 'secretary') {
          // For now, just use a hardcoded value or something from the session
          // In the future, you can create a proper workbody_assignments table
          workbodyId = 'wb-1'; // Default workbody ID for secretaries
        }
        
        const userData = {
          id: authData.user.id,
          name: name,
          email: authData.user.email || '',
          role: role,
          workbodyId: workbodyId,
          status: status
        };
        
        setUser(userData);
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', authData.user.id);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', authData.user.email || '');
        localStorage.setItem('userStatus', status);
        if (workbodyId) {
          localStorage.setItem('workbodyId', workbodyId);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout functionality
  const logout = async () => {
    setIsLoading(true);
    try {
      // Try to sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('workbodyId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userStatus');
      
      // Use window.location for redirect since we don't have router context here
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const authValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    session: user,
    signIn: login,
    signOut: logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
