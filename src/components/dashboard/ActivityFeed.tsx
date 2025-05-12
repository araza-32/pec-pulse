
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, FileText, User, Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  type: 'meeting' | 'document' | 'member' | 'action' | 'progress';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  workbody?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  onViewAllClick?: () => void;
}

export function ActivityFeed({ activities, onViewAllClick }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'member':
        return <User className="h-4 w-4" />;
      case 'action':
        return <Check className="h-4 w-4" />;
      case 'progress':
        return <RefreshCw className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500/10 text-blue-500';
      case 'document':
        return 'bg-amber-500/10 text-amber-500';
      case 'member':
        return 'bg-purple-500/10 text-purple-500';
      case 'action':
        return 'bg-green-500/10 text-green-500';
      case 'progress':
        return 'bg-pink-500/10 text-pink-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`${getActivityColor(activity.type)} p-2 rounded-full self-start`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                      <span>{activity.user}</span>
                      <span>{activity.timestamp.toLocaleString()}</span>
                    </div>
                    {activity.workbody && (
                      <div className="text-xs bg-muted py-1 px-2 rounded-md inline-block mt-1">
                        {activity.workbody}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground/40 mb-2" />
              <p>No recent activity</p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onViewAllClick}
          >
            View All Activity
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
