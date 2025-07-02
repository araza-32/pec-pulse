
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { useMinutesSummaries } from '@/hooks/useMinutesSummaries';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { useScheduledMeetings } from '@/hooks/useScheduledMeetings';

export function SummaryGenerator() {
  const [selectedWorkbodyId, setSelectedWorkbodyId] = useState<string>('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const { workbodies } = useWorkbodies();
  const { meetings } = useScheduledMeetings();
  const { summaries, isGenerating, generateSummary, fetchSummaries } = useMinutesSummaries();

  const handleGenerateSummary = async () => {
    if (!selectedMeetingId) return;
    
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

  // Filter meetings for selected workbody
  const filteredMeetings = selectedWorkbodyId 
    ? meetings.filter(meeting => meeting.workbodyId === selectedWorkbodyId)
    : [];

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
                {filteredMeetings.map((meeting) => {
                  const existingSummary = getExistingSummary(meeting.id);
                  return (
                    <SelectItem key={meeting.id} value={meeting.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{meeting.date} - {meeting.location}</span>
                        {existingSummary && (
                          <Badge variant="outline" className="text-xs ml-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Summarized
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleGenerateSummary}
            disabled={!selectedMeetingId || isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
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

        {selectedMeetingId && getExistingSummary(selectedMeetingId) && (
          <div className="p-3 bg-blue-50 rounded-lg border">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Summary already exists</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              This will update the existing summary with fresh AI insights.
            </p>
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
