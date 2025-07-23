
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useMinutesSummaries } from '@/hooks/useMinutesSummaries';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MeetingMinute {
  id: string;
  workbody_id: string;
  date: string;
  location: string;
  ocr_status: string;
  ocr_text: string | null;
  workbodies: {
    name: string;
  };
}

export function SummaryGenerator() {
  const [selectedWorkbodyId, setSelectedWorkbodyId] = useState<string>('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [meetings, setMeetings] = useState<MeetingMinute[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const { workbodies } = useWorkbodies();
  const { summaries, isGenerating, generateSummary, fetchSummaries } = useMinutesSummaries();
  const { toast } = useToast();

  // Fetch meetings when workbody is selected
  useEffect(() => {
    if (selectedWorkbodyId) {
      fetchMeetings();
    }
  }, [selectedWorkbodyId]);

  const fetchMeetings = async () => {
    if (!selectedWorkbodyId) return;
    
    setIsLoadingMeetings(true);
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select(`
          *,
          workbodies:workbody_id (
            name
          )
        `)
        .eq('workbody_id', selectedWorkbodyId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching meetings:', error);
        throw error;
      }

      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch meetings",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMeetings(false);
    }
  };

  const processOCR = async (meetingId: string) => {
    setIsProcessingOCR(true);
    try {
      const meeting = meetings.find(m => m.id === meetingId);
      if (!meeting) return;

      // Call OCR processing function
      const { data, error } = await supabase.functions.invoke('extract-text-ocr', {
        body: { 
          fileUrl: meeting.file_url || '', 
          minutesId: meetingId 
        },
      });

      if (error) {
        console.error('OCR processing error:', error);
        throw error;
      }

      toast({
        title: "OCR Processing Complete",
        description: "Text extraction completed successfully",
      });

      // Refresh meetings to get updated OCR status
      await fetchMeetings();
    } catch (error) {
      console.error('Error processing OCR:', error);
      toast({
        title: "Error",
        description: "Failed to process OCR for this meeting",
        variant: "destructive",
      });
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedMeetingId) return;
    
    const meeting = meetings.find(m => m.id === selectedMeetingId);
    if (!meeting) return;

    // Check if OCR processing is needed
    if (!meeting.ocr_text || meeting.ocr_status === 'pending') {
      toast({
        title: "OCR Processing Required",
        description: "Processing document text first...",
      });
      await processOCR(selectedMeetingId);
      return;
    }
    
    try {
      await generateSummary(selectedMeetingId);
      setSelectedMeetingId('');
      setSelectedWorkbodyId('');
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  };

  const getExistingSummary = (meetingId: string) => {
    return summaries.find(s => s.meeting_minutes_id === meetingId);
  };

  const getOCRStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getOCRStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          AI Summary Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Workbody</label>
          <Select value={selectedWorkbodyId} onValueChange={(value) => {
            setSelectedWorkbodyId(value);
            setSelectedMeetingId(''); // Reset meeting selection
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a workbody" />
            </SelectTrigger>
            <SelectContent>
              {workbodies.map((workbody) => (
                <SelectItem key={workbody.id} value={workbody.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{workbody.name}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {workbody.type}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedWorkbodyId && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Meeting</label>
            <Select value={selectedMeetingId} onValueChange={setSelectedMeetingId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a meeting" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingMeetings ? (
                  <SelectItem value="loading" disabled>Loading meetings...</SelectItem>
                ) : meetings.length === 0 ? (
                  <SelectItem value="no-meetings" disabled>No meetings found</SelectItem>
                ) : (
                  meetings.map((meeting) => {
                    const existingSummary = getExistingSummary(meeting.id);
                    return (
                      <SelectItem key={meeting.id} value={meeting.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{meeting.date} - {meeting.location}</span>
                          <div className="flex items-center gap-1 ml-2">
                            {getOCRStatusIcon(meeting.ocr_status)}
                            <Badge variant="outline" className={`text-xs ${getOCRStatusColor(meeting.ocr_status)}`}>
                              {meeting.ocr_status}
                            </Badge>
                            {existingSummary && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Summarized
                              </Badge>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleGenerateSummary}
            disabled={!selectedMeetingId || isGenerating || isProcessingOCR}
            className="flex items-center gap-2"
          >
            {isGenerating || isProcessingOCR ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isProcessingOCR ? 'Processing OCR...' : 'Generating...'}
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Summarize Minutes
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={fetchSummaries}
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {selectedMeetingId && (
          <div className="space-y-2">
            {(() => {
              const meeting = meetings.find(m => m.id === selectedMeetingId);
              const existingSummary = getExistingSummary(selectedMeetingId);
              
              if (!meeting) return null;
              
              if (meeting.ocr_status === 'pending' || !meeting.ocr_text) {
                return (
                  <div className="p-3 bg-yellow-50 rounded-lg border">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">OCR Processing Required</span>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">
                      Document text needs to be extracted before summarization can proceed.
                    </p>
                  </div>
                );
              }
              
              if (existingSummary) {
                return (
                  <div className="p-3 bg-blue-50 rounded-lg border">
                    <div className="flex items-center gap-2 text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Summary already exists</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      This will update the existing summary with fresh AI insights.
                    </p>
                  </div>
                );
              }
              
              return (
                <div className="p-3 bg-green-50 rounded-lg border">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Ready for summarization</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Document text is available and ready for AI processing.
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div>• AI will extract key decisions and action items</div>
          <div>• Performance insights will be analyzed</div>
          <div>• Sentiment analysis will be performed</div>
          <div className="flex items-center gap-1 pt-2">
            <span>Last refresh:</span>
            <Badge variant="outline" className="text-xs">
              {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
