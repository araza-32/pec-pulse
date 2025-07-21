
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkbodyHistory } from "@/hooks/useWorkbodyHistory";
import { History, User, UserMinus, UserPlus, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CompositionHistoryProps {
  workbodyId: string;
}

export function CompositionHistory({ workbodyId }: CompositionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { history, isLoading } = useWorkbodyHistory(workbodyId);

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'member_added':
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'member_removed':
        return <UserMinus className="h-4 w-4 text-red-600" />;
      case 'member_role_changed':
        return <Edit className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeDescription = (change: any) => {
    const { change_type, change_details } = change;
    
    switch (change_type) {
      case 'member_added':
        return `Added ${change_details.member_name} as ${change_details.member_role}`;
      case 'member_removed':
        return `Removed ${change_details.member_name} from ${change_details.previous_role}`;
      case 'member_role_changed':
        return `Changed ${change_details.member_name} from ${change_details.previous_role} to ${change_details.member_role}`;
      case 'composition_updated':
        return `Updated workbody composition`;
      default:
        return 'Unknown change';
    }
  };

  const getChangeVariant = (changeType: string) => {
    switch (changeType) {
      case 'member_added':
        return 'default';
      case 'member_removed':
        return 'destructive';
      case 'member_role_changed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Composition History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Composition History
            <Badge variant="secondary" className="ml-2">
              {history.length}
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No composition changes recorded yet.</p>
            <p className="text-sm mt-2">Changes will appear here when members are added, removed, or roles are updated.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(isExpanded ? history : history.slice(0, 5)).map((change) => (
              <div
                key={change.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50"
              >
                <div className="flex-shrink-0 mt-1">
                  {getChangeIcon(change.change_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {getChangeDescription(change)}
                    </p>
                    <Badge variant={getChangeVariant(change.change_type) as any} className="text-xs">
                      {change.change_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(change.changed_at), { addSuffix: true })}
                    </span>
                    {change.changed_by && (
                      <>
                        <span>•</span>
                        <span>by {change.changed_by}</span>
                      </>
                    )}
                    {change.source_document && (
                      <>
                        <span>•</span>
                        <span>via document upload</span>
                      </>
                    )}
                  </div>
                  {change.notes && (
                    <p className="text-xs text-gray-600 mt-1">{change.notes}</p>
                  )}
                </div>
              </div>
            ))}
            
            {!isExpanded && history.length > 5 && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                >
                  View {history.length - 5} more changes
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
