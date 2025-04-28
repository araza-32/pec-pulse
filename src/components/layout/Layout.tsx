
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, logout } = useAuth();
  
  const currentUser = session ? {
    name: session.name || 'User',
    role: session.role || 'user',
    workbodyId: session.workbodyId
  } : null;
  
  const handleLogout = () => {
    if (logout) {
      logout();
    }
    setSidebarOpen(false);
  };
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
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
          
          <footer className="border-t bg-white py-4 text-center text-sm text-gray-600">
            © 2025 Pakistan Engineering Council. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
