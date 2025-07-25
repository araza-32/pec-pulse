
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Loading } from "@/components/ui/loading";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
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
        {currentUser && <Sidebar />}
        
        <main 
          className="flex-1 overflow-y-auto transition-all duration-300 w-full"
          onClick={closeSidebar}
        >
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in w-full">
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
