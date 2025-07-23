
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText, Sparkles, AlertCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MeetingMinute {
  id: string;
  workbody_id: string;
  date: string;
  location: string;
  agenda_items: string[];
  actions_agreed: string[];
  file_url: string;
  agenda_document_url?: string;
  ocr_text?: string;
  ocr_status?: string;
  uploaded_at: string;
  uploaded_by?: string;
  workbodies?: {
    name: string;
  };
}

export const SummaryGenerator = () => {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [generatedSummary, setGeneratedSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Fetch meeting minutes with workbody names
  const { data: meetingMinutes, isLoading, refetch } = useQuery({
    queryKey: ['meeting-minutes-for-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select(`
          *,
          workbodies:workbody_id (
            name
          )
        `)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching meeting minutes:', error);
        throw error;
      }
      
      return data as MeetingMinute[];
    },
  });

  const handleGenerateSummary = async () => {
    if (!selectedDocument) {
      toast({
        title: "No document selected",
        description: "Please select a document to generate summary from.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedSummary('');

    try {
      // Generate summary using the summarize function
      const { data: summaryData, error: summaryError } = await supabase.functions.invoke('summarize-minutes', {
        body: { 
          minutesId: selectedDocument
        }
      });

      if (summaryError) {
        console.error('Summary generation error:', summaryError);
        throw summaryError;
      }

      console.log('Summary response:', summaryData);

      if (summaryData?.summary_text) {
        setGeneratedSummary(summaryData.summary_text);
        toast({
          title: "Summary generated successfully",
          description: "The AI has generated a comprehensive summary of the meeting minutes.",
        });
      } else {
        throw new Error('No summary generated');
      }

    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error generating summary",
        description: error instanceof Error ? error.message : "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Meeting Summaries
          </CardTitle>
          <CardDescription>
            AI-powered summarization of meeting minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Meeting Summaries
        </CardTitle>
        <CardDescription>
          AI-powered summarization of meeting minutes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!meetingMinutes || meetingMinutes.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No meeting minutes found. Please upload some documents first to generate summaries.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="document-select" className="text-sm font-medium">
                Select Document for Summary
              </label>
              <select
                id="document-select"
                className="w-full p-2 border rounded-md"
                value={selectedDocument}
                onChange={(e) => setSelectedDocument(e.target.value)}
              >
                <option value="">Choose a document...</option>
                {meetingMinutes.map((minute) => (
                  <option key={minute.id} value={minute.id}>
                    {minute.workbodies?.name || 'Unknown Workbody'} - {new Date(minute.date).toLocaleDateString()} ({minute.location})
                  </option>
                ))}
              </select>
            </div>

            <Button 
              onClick={handleGenerateSummary}
              disabled={isGenerating || !selectedDocument}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>

            {generatedSummary && (
              <div className="space-y-2">
                <label htmlFor="summary-output" className="text-sm font-medium">
                  Generated Summary
                </label>
                <Textarea
                  id="summary-output"
                  value={generatedSummary}
                  readOnly
                  className="min-h-[200px] resize-none"
                  placeholder="Generated summary will appear here..."
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
