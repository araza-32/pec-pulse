import {
  Home,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  FolderOpen,
  Edit,
  Upload,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemProps {
  name: string;
  href: string;
  icon: any;
}

export function CleanSidebar() {
  const location = useLocation();
  const { session } = useAuth();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Workbodies', href: '/workbodies', icon: Users },
    { name: 'Minutes', href: '/minutes', icon: FileText },
    { name: 'Draft Minutes', href: '/draft-minutes', icon: Edit },
    { name: 'Upload Minutes', href: '/upload-minutes', icon: Upload },
    { name: 'Documents', href: '/documents', icon: FolderOpen },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r py-4">
      <div className="px-6 py-2">
        <img src="/logo.png" alt="Logo" className="h-8" />
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {navigation.map((item: NavItemProps) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-6 py-2 rounded-md transition-colors duration-200
                  ${isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {session && (
        <div className="border-t p-4">
          <p className="text-sm text-gray-500">
            Logged in as {session.email}
          </p>
        </div>
      )}
    </div>
  );
}
