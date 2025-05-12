
import { useState, useEffect } from "react";
import { NewHeader } from "./NewHeader";
import { NewSidebar } from "./NewSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Loading } from "@/components/ui/loading";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export function NewLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Handle sidebar state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
  };
  
  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };
  
  if (isLoading) {
    return <Loading />;
  }
  
  // Public pages like landing, login, etc. don't need the dashboard layout
  const isPublicPage = location.pathname === "/" || location.pathname === "/login";
  
  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
        <div className="fixed bottom-4 right-4">
          <ThemeToggle />
        </div>
        <Toaster />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <NewSidebar 
        userRole={currentUser?.role}
        isOpen={sidebarOpen} 
        toggle={toggleSidebar} 
      />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16"
      )}>
        <NewHeader 
          user={currentUser}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
          
        <footer className="border-t bg-card py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pakistan Engineering Council. All rights reserved.
          <div className="inline-flex ml-4">
            <ThemeToggle />
          </div>
        </footer>
      </div>
      
      <Toaster />
    </div>
  );
}
