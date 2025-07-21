
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileText, Upload, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { useMinutesSummaries } from '@/hooks/useMinutesSummaries';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  date: string;
  workbodyName: string;
  fileUrl: string;
  hasSummary: boolean;
}

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const { 
    summaries, 
    isGenerating, 
    generateSummary, 
    getOverdueActions, 
    getUpcomingDeadlines, 
    getTopicTrends 
  } = useMinutesSummaries();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select(`
          id,
          date,
          file_url,
          workbody_id,
          workbodies(name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedDocs = data.map(doc => ({
        id: doc.id,
        title: `Meeting Minutes - ${doc.workbodies?.name || 'Unknown'}`,
        type: 'Meeting Minutes',
        date: doc.date,
        workbodyName: doc.workbodies?.name || 'Unknown',
        fileUrl: doc.file_url,
        hasSummary: summaries.some(s => s.meeting_minutes_id === doc.id)
      }));

      setDocuments(formattedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch documents',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.workbodyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateSummary = async (documentId: string) => {
    try {
      await generateSummary(documentId);
      fetchDocuments(); // Refresh to update summary status
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const overdueActions = getOverdueActions();
  const upcomingDeadlines = getUpcomingDeadlines();
  const topicTrends = getTopicTrends();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Document Overview</h1>
          <p className="text-muted-foreground">
            AI-powered document analysis and insights
          </p>
        </div>
        <Button onClick={() => window.location.href = '/upload-minutes'}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                    <p className="text-2xl font-bold">{documents.length}</p>
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Summaries</p>
                    <p className="text-2xl font-bold">{summaries.length}</p>
                  </div>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overdue Actions</p>
                    <p className="text-2xl font-bold text-red-600">{overdueActions.length}</p>
                  </div>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
                    <p className="text-2xl font-bold text-yellow-600">{upcomingDeadlines.length}</p>
                  </div>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Topic Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topicTrends.slice(0, 10).map((trend) => (
                  <div key={trend.topic} className="flex items-center justify-between">
                    <span className="text-sm">{trend.topic}</span>
                    <Badge variant="secondary">{trend.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading documents...</p>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-600">Upload some meeting minutes to get started.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(doc.date).toLocaleDateString()} • {doc.workbodyName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.hasSummary ? (
                            <Badge variant="secondary">
                              <Brain className="h-3 w-3 mr-1" />
                              Summarized
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateSummary(doc.id)}
                              disabled={isGenerating}
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              Generate Summary
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summaries.slice(0, 5).map((summary) => (
                    <div key={summary.id} className="border-l-4 border-green-500 pl-4">
                      <p className="text-sm font-medium">
                        Summary #{summary.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(summary.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {summary.summary_text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summaries.slice(0, 5).map((summary) => (
                    <div key={summary.id} className="flex items-center justify-between">
                      <span className="text-sm">Meeting #{summary.id.slice(0, 8)}</span>
                      <Badge variant={summary.sentiment_score > 0.5 ? 'default' : 'secondary'}>
                        {summary.sentiment_score > 0.5 ? 'Positive' : 'Neutral'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Overdue Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueActions.slice(0, 5).map((action, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-4">
                      <p className="text-sm font-medium">{action.task}</p>
                      <p className="text-xs text-gray-500">
                        Assigned to: {action.owner} • Due: {action.dueDate}
                      </p>
                    </div>
                  ))}
                  {overdueActions.length === 0 && (
                    <p className="text-sm text-gray-500">No overdue actions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.slice(0, 5).map((action, index) => (
                    <div key={index} className="border-l-4 border-yellow-500 pl-4">
                      <p className="text-sm font-medium">{action.task}</p>
                      <p className="text-xs text-gray-500">
                        Assigned to: {action.owner} • Due: {action.dueDate}
                      </p>
                    </div>
                  ))}
                  {upcomingDeadlines.length === 0 && (
                    <p className="text-sm text-gray-500">No upcoming deadlines</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
