
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Loading } from "@/components/ui/loading";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = session ? {
    name: session.name || 'User',
    role: session.role || 'user',
    workbodyId: session.workbodyId
  } : null;
  
  // Simulated loading effect for better user experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogout = () => {
    if (logout) {
      logout();
    }
    setSidebarOpen(false);
  };
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header 
        toggleSidebar={toggleSidebar} 
        user={currentUser} 
        onLogout={handleLogout} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {currentUser && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar} 
            userRole={currentUser.role}
            userWorkbodyId={currentUser.workbodyId}
          />
        )}
        
        <main 
          className="flex-1 overflow-y-auto transition-all duration-300 w-full"
          onClick={closeSidebar}
        >
          <div className="container py-6 animate-fade-in mx-auto max-w-full px-4 sm:px-6 text-center">
            {children}
          </div>
          
          <footer className="border-t bg-white py-4 text-center text-sm text-gray-600">
            © 2025 Pakistan Engineering Council. All rights reserved.
          </footer>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
