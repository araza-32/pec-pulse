
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Menu, 
  User,
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
}

export function Header({ toggleSidebar, user, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
            alt="PEC Logo" 
            className="h-8 w-auto hidden md:block" 
          />
          <h1 className="text-xl font-semibold text-pec-green">
            PEC Pulse
          </h1>
        </div>
      </div>
      
      {user && (
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pec-green text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </Button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg z-50">
              <div className="p-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              <div className="border-t">
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-2 rounded-none p-3 text-red-600 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
