
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { useMinutesSummaries } from '@/hooks/useMinutesSummaries';
import { useMinutesManagement } from '@/hooks/useMinutesManagement';

export function SummaryGenerator() {
  const [selectedMinutesId, setSelectedMinutesId] = useState<string>('');
  const { meetingMinutes } = useMinutesManagement();
  const { summaries, isGenerating, generateSummary, fetchSummaries } = useMinutesSummaries();

  const handleGenerateSummary = async () => {
    if (!selectedMinutesId) return;
    
    try {
      await generateSummary(selectedMinutesId);
      setSelectedMinutesId('');
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  };

  const getExistingSummary = (minutesId: string) => {
    return summaries.find(s => s.meeting_minutes_id === minutesId);
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
          <label className="text-sm font-medium">Select Meeting Minutes</label>
          <Select value={selectedMinutesId} onValueChange={setSelectedMinutesId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose meeting minutes to summarize" />
            </SelectTrigger>
            <SelectContent>
              {meetingMinutes.map((minutes) => {
                const existingSummary = getExistingSummary(minutes.id);
                return (
                  <SelectItem key={minutes.id} value={minutes.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{minutes.workbodyName} - {minutes.date}</span>
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

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleGenerateSummary}
            disabled={!selectedMinutesId || isGenerating}
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
                Generate Summary
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

        {selectedMinutesId && getExistingSummary(selectedMinutesId) && (
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
          <div>• Sentiment analysis will be performed</div>
          <div>• Topics will be automatically tagged</div>
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
