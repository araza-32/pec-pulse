
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { User } from "@/types";

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export function Layout({ user, onLogout, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        toggleSidebar={toggleSidebar} 
        user={user} 
        onLogout={onLogout} 
      />
      
      <div className="flex flex-1">
        {user && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar} 
            userRole={user.role}
            userWorkbodyId={user.workbodyId}
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
