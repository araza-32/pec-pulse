
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function MinimalHeader() {
  const { session, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-medium text-gray-900">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{session?.name || 'User'}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={logout}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

function getPageTitle() {
  const path = window.location.pathname;
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/chairman': 'Chairman Dashboard',
    '/chairman/executive': 'Chairman Executive Dashboard',
    '/workbodies': 'Workbodies',
    '/workbodies/overview': 'Workbodies Overview',
    '/workbodies/management': 'Workbody Management',
    '/calendar': 'Calendar',
    '/meetings': 'Meetings',
    '/minutes': 'Meeting Minutes',
    '/minutes/enhanced': 'Enhanced Minutes',
    '/minutes/draft': 'Draft Minutes',
    '/minutes/upload': 'Upload Minutes',
    '/documents': 'Documents',
    '/reports': 'Reports',
    '/settings': 'Settings'
  };
  
  // Handle dynamic routes
  if (path.startsWith('/workbodies/') && path.includes('/edit')) {
    return 'Edit Workbody';
  }
  if (path.startsWith('/workbodies/') && !path.includes('/overview') && !path.includes('/management')) {
    return 'Workbody Details';
  }
  if (path.startsWith('/minutes/') && path !== '/minutes/enhanced' && path !== '/minutes/draft' && path !== '/minutes/upload') {
    return 'Minutes Viewer';
  }
  
  return titles[path] || 'PEC Dashboard';
}
