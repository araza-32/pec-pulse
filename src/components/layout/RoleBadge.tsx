import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
}

const roleConfig = {
  admin: {
    label: 'Admin',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  ChairmanPEC: {
    label: 'Chairman PEC',
    className: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  secretary: {
    label: 'Secretary',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  member: {
    label: 'Member',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  registrar: {
    label: 'Registrar',
    className: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  coordination: {
    label: 'Coordination',
    className: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  chairman: {
    label: 'Chairman',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
};

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const config = roleConfig[role as keyof typeof roleConfig] || {
    label: role,
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sizeClass = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }[size];

  return (
    <Badge 
      variant="secondary" 
      className={`${config.className} ${sizeClass} font-medium border`}
    >
      {config.label}
    </Badge>
  );
}