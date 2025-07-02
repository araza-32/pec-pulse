
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Users, Calendar, Brain } from 'lucide-react';
import { useMinutesSummaries } from '@/hooks/useMinutesSummaries';
import { useAuth } from '@/contexts/AuthContext';

export function MinutesInsightsPanel() {
  const { user } = useAuth();
  const {
    summaries,
    isLoading,
    getOverdueActions,
    getUpcomingDeadlines,
    getTopicTrends,
  } = useMinutesSummaries();

  // Check if user has permission to view summaries
  const hasPermission = user?.role && ['admin', 'registrar', 'coordination', 'secretary'].includes(user.role);

  if (!hasPermission) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="app-grid-2">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overdueActions = getOverdueActions();
  const upcomingDeadlines = getUpcomingDeadlines();
  const topicTrends = getTopicTrends();
  const recentSummary = summaries[0];

  return (
    <div className="space-y-6">
      <div className="app-flex-between">
        <h2 className="text-2xl font-bold text-green-800">AI Meeting Insights</h2>
        <Badge variant="outline" className="text-xs">
          {summaries.length} Summaries Available
        </Badge>
      </div>

      <div className="app-grid-2">
        {/* Recent Summary */}
        {recentSummary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                Latest Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {recentSummary.summary_text}
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Key Decisions</h4>
                  <ul className="space-y-1">
                    {recentSummary.decisions.slice(0, 3).map((decision, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        {decision}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Sentiment:</span>
                    <Badge 
                      variant={recentSummary.sentiment_score > 0 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {recentSummary.sentiment_score > 0 ? 'Positive' : 
                       recentSummary.sentiment_score < 0 ? 'Negative' : 'Neutral'}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(recentSummary.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compliance Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overdue Actions</span>
                <Badge variant="destructive" className="text-xs">
                  {overdueActions.length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Upcoming (30 days)</span>
                <Badge variant="secondary" className="text-xs">
                  {upcomingDeadlines.length}
                </Badge>
              </div>

              {overdueActions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-red-600">Urgent Actions</h4>
                  {overdueActions.slice(0, 3).map((action, index) => (
                    <div key={index} className="text-xs p-2 bg-red-50 rounded border-l-2 border-red-500">
                      <div className="font-medium">{action.task}</div>
                      <div className="text-gray-600">Owner: {action.owner}</div>
                      <div className="text-red-600">Due: {action.dueDate}</div>
                    </div>
                  ))}
                </div>
              )}

              <Button size="sm" className="w-full" variant="outline">
                Send Reminders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Trends */}
      {topicTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Topic Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topicTrends.map(({ topic, count }) => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items Overview */}
      {recentSummary && recentSummary.action_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Recent Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSummary.action_items.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.task}</div>
                    <div className="text-xs text-gray-600">Owner: {item.owner}</div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={item.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                    {item.dueDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
