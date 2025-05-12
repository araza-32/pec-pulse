
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User,
  HelpCircle,
  Settings,
  Bell,
  Search,
  Menu
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
}

export function NewHeader({ user, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };
  
  // Handle keyboard shortcut (Shift + /)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Shift + /
      if (event.shiftKey && event.key === "?") {
        setIsSearchActive(true);
        // Focus the input after a small delay to ensure it's rendered
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 10);
      }
      
      // Escape to close search
      if (event.key === "Escape") {
        setIsSearchActive(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  // Mock notifications for demonstration purposes
  const notifications = [
    { id: 1, text: "Task force report due in 3 days", time: "2 hours ago", priority: "high" },
    { id: 2, text: "New committee member added to ECO Committee", time: "Yesterday", priority: "medium" },
    { id: 3, text: "Minutes uploaded for review", time: "2 days ago", priority: "low" },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu || showNotifications) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setShowUserMenu(false);
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showNotifications]);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white dark:bg-gray-800 dark:border-gray-700 px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        {/* Global Search */}
        <div className={cn(
          "relative",
          isSearchActive 
            ? "w-full md:w-96" 
            : "w-auto"
        )}>
          {isSearchActive ? (
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workbodies, meetings, documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-pec-green focus:border-pec-green
                           bg-white dark:bg-gray-700 dark:text-white"
                onBlur={() => {
                  if (searchQuery === "") {
                    setIsSearchActive(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsSearchActive(false);
                    setSearchQuery("");
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          ) : (
            <button
              onClick={() => setIsSearchActive(true)}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
              <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400">
                Search... <kbd className="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift + /</kbd>
              </span>
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative" data-dropdown="notifications">
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
            <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg z-50 animate-fade-in">
              <div className="p-3 border-b dark:border-gray-700">
                <p className="font-medium dark:text-white">Notifications</p>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className="p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-start">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-1.5 mr-2",
                            notification.priority === "high" ? "bg-red-500" : 
                            notification.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                          )}></div>
                          <div>
                            <p className="text-sm dark:text-white">{notification.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
              <div className="p-2 border-t dark:border-gray-700 text-center">
                <Button 
                  variant="ghost" 
                  className="text-xs w-full text-pec-green"
                  onClick={() => {
                    setShowNotifications(false);
                    toast({
                      title: "Notifications cleared",
                      description: "All notifications have been marked as read",
                    });
                  }}
                >
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

        <ThemeToggle />

        <div className="relative" data-dropdown="user-menu">
          <Button
            variant="ghost"
            className="flex items-center gap-2 ml-2 rounded-full"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pec-green text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium dark:text-white">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </Button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg z-50 animate-fade-in">
              <div className="p-4 border-b dark:border-gray-700">
                <p className="font-medium text-lg dark:text-white">{user?.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                <p className="text-xs text-muted-foreground mt-1">Pakistan Engineering Council</p>
              </div>
              <div className="p-1">
                <Link to="/settings/profile">
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-2 rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-2 rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                </Link>
              </div>
              <div className="border-t dark:border-gray-700 p-1">
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-2 rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
    </header>
  );
}
