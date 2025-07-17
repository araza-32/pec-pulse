import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  CheckCircle, 
  Target, 
  Calendar, 
  User, 
  TrendingUp,
  Download,
  Share2,
  Copy
} from "lucide-react";
import { format } from "date-fns";

interface SummaryData {
  summaryText: string;
  keyPoints: string[];
  decisions: Array<{
    decision: string;
    rationale?: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  actionItems: Array<{
    task: string;
    assignee?: string;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
  }>;
  followUpItems: string[];
  attendanceRate?: number;
  engagementScore?: number;
  meetingEfficiency?: number;
}

interface EnhancedSummaryDisplayProps {
  summary: SummaryData;
  meetingInfo: {
    workbodyName: string;
    date: string;
    location: string;
    duration?: string;
  };
  onExport?: () => void;
  onShare?: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function EnhancedSummaryDisplay({ 
  summary, 
  meetingInfo, 
  onExport, 
  onShare 
}: EnhancedSummaryDisplayProps) {
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You might want to add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6 text-blue-600" />
                Meeting Summary
              </CardTitle>
              <div className="mt-2 space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">{meetingInfo.workbodyName}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(meetingInfo.date), 'PPP')}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {meetingInfo.location}
                  </div>
                  {meetingInfo.duration && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {meetingInfo.duration}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(summary.summaryText)}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              )}
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Metrics */}
      {(summary.attendanceRate || summary.engagementScore || summary.meetingEfficiency) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meeting Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summary.attendanceRate && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{summary.attendanceRate}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
              )}
              {summary.engagementScore && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{summary.engagementScore}%</div>
                  <div className="text-sm text-gray-600">Engagement Score</div>
                </div>
              )}
              {summary.meetingEfficiency && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{summary.meetingEfficiency}%</div>
                  <div className="text-sm text-gray-600">Meeting Efficiency</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{summary.summaryText}</p>
        </CardContent>
      </Card>

      {/* Key Points */}
      {summary.keyPoints && summary.keyPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Key Discussion Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Decisions */}
      {summary.decisions && summary.decisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Decisions Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.decisions.map((decision, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{decision.decision}</h4>
                    <Badge className={getPriorityColor(decision.impact)}>
                      {decision.impact} impact
                    </Badge>
                  </div>
                  {decision.rationale && (
                    <p className="text-sm text-gray-600 mt-2">{decision.rationale}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {summary.actionItems && summary.actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.actionItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.task}</h4>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {item.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {item.assignee}
                      </div>
                    )}
                    {item.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {format(new Date(item.dueDate), 'PP')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Follow-up Items */}
      {summary.followUpItems && summary.followUpItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Follow-up Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.followUpItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}