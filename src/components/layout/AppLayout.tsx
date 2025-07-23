
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { PECSidebar } from "./PECSidebar";
import { PECHeader } from "./PECHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { session } = useAuth();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <PECSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <PECHeader 
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          user={session}
        />
        
        {/* Main Content */}
        <main className="p-6 bg-muted/30 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t bg-background py-4 text-center text-sm text-muted-foreground">
          © 2025 Pakistan Engineering Council. All rights reserved.
        </footer>
      </div>
      
      <Toaster />
    </div>
  );
}
