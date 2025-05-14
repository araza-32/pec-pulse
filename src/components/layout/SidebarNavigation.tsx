
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  File,
  FileText,
  Home,
  LucideIcon,
  BarChart3,
  Users,
  Settings,
  CalendarCheck,
  FolderOpen,
  Briefcase,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

// This type ensures UserRole can include "coordination" without conflicts
export function SidebarNavigation() {
  const { session } = useAuth();
  const location = useLocation();

  // Explicitly type userRole as UserRole to ensure TypeScript knows it can be 'coordination'
  const userRole = (session?.role || 'member') as UserRole;
  const isChairman = userRole === 'chairman';
  const isAdmin = userRole === 'admin';
  const isCoordination = userRole === 'coordination';

  // Navigation items configuration
  const navigationItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination", "member"]
    },
    {
      label: "Chairman Dashboard",
      icon: BarChart3,
      href: "/chairman-dashboard",
      roles: ["chairman", "admin"]
    },
    {
      label: "Executive Dashboard",
      icon: BarChart3,
      href: "/chairman-executive",
      roles: ["chairman", "admin"]
    },
    {
      label: "Workbodies",
      icon: Briefcase,
      href: "/workbodies",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination", "member"]
    },
    {
      label: "Calendar",
      icon: CalendarDays,
      href: "/calendar",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination", "member"]
    },
    {
      label: "Meetings",
      icon: CalendarCheck,
      href: "/meetings/list",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination", "member"]
    },
    {
      label: "Minutes",
      icon: FileText,
      href: "/minutes",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination", "member"]
    },
    {
      label: "Upload Minutes",
      icon: File,
      href: "/upload-minutes",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination"]
    },
    {
      label: "Reports",
      icon: FolderOpen,
      href: "/reports",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination"]
    },
    {
      label: "Members",
      icon: Users,
      href: "/members",
      roles: ["admin", "chairman", "registrar", "coordination"]
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination", "member"]
    }
  ];

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item =>
    item.roles.includes(userRole as string)
  );

  const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
    return (
      <NavLink to={href} className="w-full">
        {({ isActive }) => (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-x-3 text-base font-normal",
              (isActive || active) && "bg-muted font-medium"
            )}
          >
            <Icon className="h-5 w-5" /> {label}
          </Button>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex w-full flex-col space-y-1 px-2">
      {filteredItems.map((item, index) => (
        <SidebarItem
          key={index}
          icon={item.icon}
          label={item.label}
          href={item.href}
          active={location.pathname === item.href}
        />
      ))}
    </div>
  );
}
