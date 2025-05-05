
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Menu, 
  User,
  HelpCircle,
  Settings,
  Bell
} from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
}

export function Header({ toggleSidebar, user, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };
  
  // Mock notifications for demonstration purposes
  const notifications = [
    { id: 1, text: "New meeting scheduled for ECO Committee", time: "2 hours ago" },
    { id: 2, text: "Minutes uploaded for Legal Affairs review", time: "Yesterday" },
  ];
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
            alt="PEC Logo" 
            className="h-8 w-auto hidden md:block" 
          />
          <h1 className="text-xl font-semibold text-pec-green">
            PEC Pulse
          </h1>
        </Link>
      </div>
      
      {user ? (
        <div className="flex items-center gap-2">
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                        <span className="text-xs">{notifications.length}</span>
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border bg-white shadow-lg z-50 animate-fade-in">
                <div className="p-3 border-b">
                  <p className="font-medium">Notifications</p>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3 border-b hover:bg-gray-50">
                          <p className="text-sm">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" className="text-xs w-full text-pec-green">
                    Mark all as read
                  </Button>
                </div>
              </div>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Support</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/settings">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2 ml-2 rounded-full"
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
              <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white shadow-lg z-50 animate-fade-in">
                <div className="p-4 border-b">
                  <p className="font-medium text-lg">{user.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pakistan Engineering Council</p>
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-2 rounded-md p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-2 rounded-md p-2 text-gray-600 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                  </Link>
                </div>
                <div className="border-t p-1">
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-2 rounded-md p-2 text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
