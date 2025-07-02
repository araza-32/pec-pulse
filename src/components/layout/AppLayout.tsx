
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Loading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children = <Outlet /> }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isPublicPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/auth/set-password";
    if (!isAuthenticated && !isPublicPage && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, isLoading, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
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
    
    if (window.innerWidth >= 1024) {
      localStorage.setItem('sidebarOpen', String(newState));
    }
  };
  
  if (isLoading) {
    return <Loading />;
  }
  
  const isPublicPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/auth/set-password";
  
  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-green-50/50">
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
        <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
          <AppSidebar />
        </div>
      )}
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <AppSidebar />
      </div>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        <AppHeader onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto app-main">
          <div className="app-container">
            {children}
          </div>
        </main>
          
        <footer className="app-footer">
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
