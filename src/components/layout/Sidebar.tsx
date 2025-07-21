
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Crown,
  Upload,
  Brain
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { 
    name: 'Workbodies', 
    icon: Users, 
    children: [
      { name: 'Overview', href: '/workbodies' },
      { name: 'Management', href: '/workbodies/manage' },
      { name: 'List View', href: '/workbodies/list' }
    ]
  },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { 
    name: 'Meeting Minutes', 
    icon: FileText, 
    children: [
      { name: 'View Minutes', href: '/minutes' },
      { name: 'Upload Minutes', href: '/upload-minutes' }
    ]
  },
  { name: 'Documents', href: '/documents', icon: Brain },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Chairman Dashboard', href: '/chairman', icon: Crown },
  { name: 'Chairman Executive', href: '/chairman/executive', icon: Crown },
];

export function Sidebar() {
  const location = useLocation();
  const { session } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const userRole = session?.role || 'member';
  const canAccessAdmin = ['admin', 'chairman', 'coordination'].includes(userRole);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: any[]) => 
    children.some(child => location.pathname === child.href);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="text-lg font-bold text-gray-900">PEC Pulse</span>
        </div>
        
        <nav className="space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isParentActive(item.children)
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </div>
                    {expandedItems.includes(item.name) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.name) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md transition-colors",
                            isActive(child.href)
                              ? "bg-green-100 text-green-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          {child.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </NavLink>
              )}
            </div>
          ))}
          
          {canAccessAdmin && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Admin
              </div>
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
