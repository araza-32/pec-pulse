
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export function Layout({ user, onLogout, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, signOut } = useAuth();
  
  // Use authentication data from context if available
  const currentUser = session?.user ? {
    name: session.user.email || 'User',
    role: session.user.role || 'user'
  } : user;
  
  const handleLogout = () => {
    if (signOut) {
      signOut();
    }
    if (onLogout) {
      onLogout();
    }
    setSidebarOpen(false);
  };
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        toggleSidebar={toggleSidebar} 
        user={currentUser} 
        onLogout={handleLogout} 
      />
      
      <div className="flex flex-1">
        {currentUser && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar} 
            userRole={currentUser.role}
            userWorkbodyId={currentUser.workbodyId}
          />
        )}
        
        <main 
          className="flex-1 overflow-y-auto"
          onClick={closeSidebar}
        >
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
