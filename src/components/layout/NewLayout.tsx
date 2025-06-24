
import { useState, useEffect } from "react";
import { NewHeader } from "./NewHeader";
import { NewSidebar } from "./NewSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Loading } from "@/components/ui/loading";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export function NewLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const { session, logout, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
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

  // Redirect to login if not authenticated and not on public pages
  useEffect(() => {
    const isPublicPage = location.pathname === "/" || location.pathname === "/login";
    if (!isAuthenticated && !isPublicPage && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, isLoading, navigate]);

  // Handle sidebar state and auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false); // Always closed on mobile
      } else {
        // On desktop, check localStorage
        const savedState = localStorage.getItem('sidebarOpen');
        setSidebarOpen(savedState !== null ? savedState === 'true' : true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    
    // Only save to localStorage on desktop
    if (window.innerWidth >= 1024) {
      localStorage.setItem('sidebarOpen', String(newState));
    }
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-green-50/50 text-foreground">
        {children}
        <div className="fixed bottom-4 right-4">
          <ThemeToggle />
        </div>
        <Toaster />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-green-50/30 w-full">
      {/* Desktop sidebar */}
      {sidebarOpen && (
        <div className="hidden lg:block">
          <NewSidebar />
        </div>
      )}
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 lg:hidden transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <NewSidebar />
      </div>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        <NewHeader onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-white to-green-50/30">
          <div className="container mx-auto max-w-7xl animate-fade-in pb-16">
            {children}
          </div>
        </main>
          
        <footer className="border-t bg-gradient-to-r from-green-50 to-green-100 py-4 text-center text-sm text-green-700 shadow-inner">
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
