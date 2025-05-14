
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

type ActivityType = 'meeting' | 'document' | 'member' | 'action' | 'progress';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  workbody?: string;
}

const getActivityTypeIcon = (type: ActivityType) => {
  switch (type) {
    case 'meeting':
      return "📅";
    case 'document':
      return "📄";
    case 'member':
      return "👤";
    case 'action':
      return "✓";
    case 'progress':
      return "📈";
    default:
      return "🔔";
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case 'meeting':
      return "bg-blue-100 text-blue-800";
    case 'document':
      return "bg-green-100 text-green-800";
    case 'member':
      return "bg-purple-100 text-purple-800";
    case 'action':
      return "bg-amber-100 text-amber-800";
    case 'progress':
      return "bg-cyan-100 text-cyan-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface ActivityFeedProps {
  activities?: Activity[];
  onViewAllClick?: () => void;
}

export function ActivityFeed({ onViewAllClick }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch real activities from various tables
    const fetchActivities = async () => {
      setIsLoading(true);
      
      try {
        // Fetch recent meetings (consider them as activities)
        const { data: meetingsData, error: meetingsError } = await supabase
          .from('scheduled_meetings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (meetingsError) throw meetingsError;
        
        // Fetch recent workbody documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('workbody_documents')
          .select('*')
          .order('uploaded_at', { ascending: false })
          .limit(3);
          
        if (documentsError) throw documentsError;
        
        // Combine and transform all activities
        const combinedActivities: Activity[] = [
          // Map meetings to activities
          ...(meetingsData || []).map(meeting => ({
            id: `meeting-${meeting.id}`,
            type: 'meeting' as ActivityType,
            title: 'Meeting Scheduled',
            description: `${meeting.workbody_name} meeting has been scheduled for ${meeting.date}`,
            timestamp: new Date(meeting.created_at),
            user: 'System',
            workbody: meeting.workbody_name
          })),
          
          // Map documents to activities
          ...(documentsData || []).map(doc => ({
            id: `doc-${doc.id}`,
            type: 'document' as ActivityType,
            title: 'Document Uploaded',
            description: `A new ${doc.document_type} has been uploaded`,
            timestamp: new Date(doc.uploaded_at),
            user: 'Admin User',
            workbody: 'Workbody' // Would need a join to get the actual workbody name
          }))
        ];
        
        // Sort by timestamp, newest first
        combinedActivities.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        );
        
        setActivities(combinedActivities);
      } catch (error) {
        console.error("Failed to load activity data:", error);
        // Fallback to empty state
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        {onViewAllClick && (
          <Button variant="ghost" onClick={onViewAllClick}>View All</Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5 max-h-96 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", getActivityColor(activity.type))}>
                {getActivityTypeIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                {activity.workbody && (
                  <Badge variant="outline" className="mt-1">{activity.workbody}</Badge>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">No recent activity found.</p>
        )}
      </CardContent>
    </Card>
  );
}
