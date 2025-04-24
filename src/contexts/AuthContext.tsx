
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the User type with specific role types
type UserRole = 'admin' | 'secretary' | 'chairman';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workbodyId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  // Add these properties to match what's being used in other components
  session: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      let role: UserRole = 'admin';
      let id = '1';
      let name = 'Admin User';
      let workbodyId: string | undefined = undefined;
      
      if (email.includes('secretary')) {
        role = 'secretary';
        id = '2';
        name = 'Secretary User';
        workbodyId = 'wb-1'; // Mock workbody ID for secretary
      } else if (email.includes('chairman')) {
        role = 'chairman';
        id = '3';
        name = 'Chairman User';
      }
      
      // Set the user with the proper typed role
      const userData = {
        id,
        name,
        email,
        role,
        workbodyId
      };
      
      setUser(userData);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', id);
      if (workbodyId) {
        localStorage.setItem('workbodyId', workbodyId);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Mock logout - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('workbodyId');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        // Map existing functions to the new property names
        session: user,
        signIn: login,
        signOut: logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
