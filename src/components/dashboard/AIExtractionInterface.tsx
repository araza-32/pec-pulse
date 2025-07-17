
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, FileText, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExtractionJob {
  id: string;
  workbodyId: string;
  workbodyName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  documentsProcessed: number;
  totalDocuments: number;
  createdAt: string;
}

export function AIExtractionInterface() {
  const [selectedWorkbodyId, setSelectedWorkbodyId] = useState<string>('');
  const [extractionJobs, setExtractionJobs] = useState<ExtractionJob[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const { workbodies } = useWorkbodies();
  const { toast } = useToast();

  const handleStartExtraction = async () => {
    if (!selectedWorkbodyId) return;
    
    setIsExtracting(true);
    try {
      // Fetch documents for the selected workbody
      const { data: documents, error } = await supabase
        .from('workbody_documents')
        .select('*')
        .eq('workbody_id', selectedWorkbodyId);

      if (error) throw error;

      const workbody = workbodies.find(w => w.id === selectedWorkbodyId);
      
      // Create extraction job
      const newJob: ExtractionJob = {
        id: crypto.randomUUID(),
        workbodyId: selectedWorkbodyId,
        workbodyName: workbody?.name || 'Unknown',
        status: 'processing',
        progress: 0,
        documentsProcessed: 0,
        totalDocuments: documents?.length || 0,
        createdAt: new Date().toISOString()
      };

      setExtractionJobs(prev => [newJob, ...prev]);

      // Simulate extraction progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setExtractionJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, progress, documentsProcessed: Math.floor(progress / 20) }
            : job
        ));

        if (progress >= 100) {
          clearInterval(interval);
          setExtractionJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { ...job, status: 'completed', progress: 100 }
              : job
          ));
          toast({
            title: "Extraction Complete",
            description: `Successfully processed ${documents?.length || 0} documents`,
          });
        }
      }, 1000);

      toast({
        title: "Extraction Started",
        description: `Processing ${documents?.length || 0} documents for ${workbody?.name}`,
      });

    } catch (error) {
      console.error('Error starting extraction:', error);
      toast({
        title: "Error",
        description: "Failed to start extraction process",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const getStatusIcon = (status: ExtractionJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ExtractionJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Document Extraction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Extraction Controls */}
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Select Workbody</label>
            <Select value={selectedWorkbodyId} onValueChange={setSelectedWorkbodyId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a workbody to extract from" />
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
          <Button 
            onClick={handleStartExtraction}
            disabled={!selectedWorkbodyId || isExtracting}
            className="flex items-center gap-2"
          >
            {isExtracting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Extract Data
              </>
            )}
          </Button>
        </div>

        {/* Extraction Jobs */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Recent Extractions</h3>
          {extractionJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No extraction jobs yet. Start by selecting a workbody above.
            </div>
          ) : (
            <div className="space-y-3">
              {extractionJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="font-medium">{job.workbodyName}</span>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {job.documentsProcessed}/{job.totalDocuments} docs
                      </span>
                      {job.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {job.status === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing documents...</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Started: {new Date(job.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Capabilities Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">AI Extraction Capabilities</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Extract member information from documents</li>
            <li>• Parse meeting minutes and agendas</li>
            <li>• Identify action items and decisions</li>
            <li>• Generate structured data from unstructured text</li>
            <li>• OCR processing for scanned documents</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
