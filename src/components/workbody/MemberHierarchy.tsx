
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hasCV?: boolean;
}

interface MemberHierarchyProps {
  members: Member[];
  showActions?: boolean;
}

export function MemberHierarchy({ members, showActions = false }: MemberHierarchyProps) {
  // Define role hierarchy order with proper seniority
  const roleOrder = {
    'convener': 1,
    'chairman': 1,
    'co-lead': 2,
    'deputy chair': 2,
    'deputy chairman': 2,
    'deputy convener': 2,
    'senior vice chairman': 3,
    'vice chairman sindh': 4,
    'vice chairman kp': 4,
    'vice chairman balochistan': 4,
    'vice chairman punjab': 4,
    'vice chairman': 5,
    'vice chair': 5,
    'member': 6,
    'secretary': 7
  };

  // Sort members by role hierarchy
  const sortedMembers = [...members].sort((a, b) => {
    const roleA = roleOrder[a.role.toLowerCase() as keyof typeof roleOrder] || 999;
    const roleB = roleOrder[b.role.toLowerCase() as keyof typeof roleOrder] || 999;
    
    if (roleA !== roleB) {
      return roleA - roleB;
    }
    
    // If same role, sort alphabetically by name
    return a.name.localeCompare(b.name);
  });

  const getRoleBadgeVariant = (role: string) => {
    const roleKey = role.toLowerCase();
    if (roleKey.includes('convener') || roleKey.includes('chairman')) {
      return 'default';
    }
    if (roleKey.includes('deputy') || roleKey.includes('co-lead')) {
      return 'secondary';
    }
    if (roleKey.includes('senior vice chairman')) {
      return 'default';
    }
    if (roleKey.includes('vice chairman')) {
      return 'outline';
    }
    return 'secondary';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (sortedMembers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No members found for this workbody.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedMembers.map((member, index) => (
        <Card key={member.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-green-100 text-green-800 font-semibold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {member.name}
                    </h3>
                    <Badge 
                      variant={getRoleBadgeVariant(member.role)}
                      className="text-xs"
                    >
                      {member.role}
                    </Badge>
                    {index === 0 && sortedMembers.length > 1 && (
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
                        Lead
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {member.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.hasCV && (
                      <Badge variant="outline" className="text-xs">
                        CV Available
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
