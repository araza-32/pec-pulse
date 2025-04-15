
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
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
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
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
            alt="PEC Logo" 
            className="h-10 w-auto" 
          />
          <h1 className="hidden text-xl font-semibold md:block">
            PEC Workbodies Administrator Dashboard
          </h1>
          <h1 className="text-xl font-semibold md:hidden">
            PEC Dashboard
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
            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-lg">
              <div className="p-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              <div className="border-t">
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-2 rounded-none p-3"
                  onClick={onLogout}
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
