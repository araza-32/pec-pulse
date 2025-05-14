import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  BarChart2,
  ChevronDown,
  ChevronRight,
  AreaChart,
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activePattern?: RegExp;
  requiredRole?: string[];
}

// Define the possible user roles as a string literal union type
// Add 'coordination' to the UserRole type
type UserRole = 'chairman' | 'admin' | 'coordination' | 'member' | 'secretary';

export const SidebarNavigation = () => {
  const { session } = useAuth();
  const location = useLocation();

  // Explicitly type userRole as UserRole to ensure TypeScript knows it can be 'coordination'
  const userRole = (session?.role || 'member') as UserRole;
  const isChairman = userRole === 'chairman';
  const isAdmin = userRole === 'admin';
  const isCoordination = userRole === 'coordination';

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <Home className="h-5 w-5" />, 
      activePattern: /^\/dashboard$/
    },
    { 
      label: "Chairman's Dashboard", 
      href: "/chairman-dashboard", 
      icon: <BarChart2 className="h-5 w-5" />, 
      activePattern: /^\/chairman-dashboard$/, 
      requiredRole: ['chairman', 'admin', 'coordination']
    },
    { 
      label: "Chairman's Executive", 
      href: "/chairman-executive", 
      icon: <AreaChart className="h-5 w-5" />, 
      activePattern: /^\/chairman-executive$/,
      requiredRole: ['chairman']
    },
    { 
      label: "Workbodies", 
      href: "/workbodies", 
      icon: <Users className="h-5 w-5" />, 
      activePattern: /^\/workbod(y|ies)/
    },
    { 
      label: "Meeting Calendar", 
      href: "/calendar", 
      icon: <Calendar className="h-5 w-5" />, 
      activePattern: /^\/calendar/
    },
    { 
      label: "Meeting Minutes", 
      href: "/meetings/list", 
      icon: <FileText className="h-5 w-5" />, 
      activePattern: /^\/meetings\/|^\/minutes\//
    },
    { 
      label: "Settings", 
      href: "/settings", 
      icon: <Settings className="h-5 w-5" />, 
      activePattern: /^\/settings/,
      requiredRole: ['admin', 'chairman', 'coordination']
    }
  ];

  const filteredNavItems = navigationItems.filter(item => {
    // If no required role is specified, show to everyone
    if (!item.requiredRole) return true;
    
    // Otherwise, check if user has one of the required roles
    return item.requiredRole.includes(userRole);
  });

  return (
    <div className="space-y-1">
      {filteredNavItems.map((item) => {
        const isActive = item.activePattern 
          ? item.activePattern.test(location.pathname) 
          : location.pathname === item.href;

        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => 
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        );
      })}
    </div>
  );
};
