
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, FileText, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { usePdfMemberExtraction } from '@/hooks/usePdfMemberExtraction';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkbodyDocument {
  id: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
}

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
  const [documents, setDocuments] = useState<WorkbodyDocument[]>([]);
  const [extractionJobs, setExtractionJobs] = useState<ExtractionJob[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const { workbodies, isLoading, error } = useWorkbodies();
  const { extractMembersFromDocument } = usePdfMemberExtraction();
  const { toast } = useToast();

  // Fetch documents when workbody is selected
  useEffect(() => {
    if (selectedWorkbodyId) {
      fetchDocuments();
    }
  }, [selectedWorkbodyId]);

  const fetchDocuments = async () => {
    if (!selectedWorkbodyId) return;
    
    setIsLoadingDocuments(true);
    try {
      const { data, error } = await supabase
        .from('workbody_documents')
        .select('*')
        .eq('workbody_id', selectedWorkbodyId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleStartExtraction = async () => {
    if (!selectedWorkbodyId) {
      toast({
        title: "Selection Required",
        description: "Please select a workbody to extract from",
        variant: "destructive",
      });
      return;
    }

    if (documents.length === 0) {
      toast({
        title: "No Documents Found",
        description: "Please upload some documents first before running extraction",
        variant: "destructive",
      });
      return;
    }
    
    setIsExtracting(true);
    
    const workbody = workbodies.find(w => w.id === selectedWorkbodyId);
    
    // Create extraction job
    const newJob: ExtractionJob = {
      id: crypto.randomUUID(),
      workbodyId: selectedWorkbodyId,
      workbodyName: workbody?.name || 'Unknown',
      status: 'processing',
      progress: 0,
      documentsProcessed: 0,
      totalDocuments: documents.length,
      createdAt: new Date().toISOString()
    };

    setExtractionJobs(prev => [newJob, ...prev]);

    try {
      let processedCount = 0;
      
      // Process each document
      for (const document of documents) {
        try {
          console.log(`Processing document ${document.id} for workbody ${selectedWorkbodyId}`);
          await extractMembersFromDocument(document.id, selectedWorkbodyId);
          processedCount++;
          
          // Update progress
          const progress = Math.round((processedCount / documents.length) * 100);
          setExtractionJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { ...job, progress, documentsProcessed: processedCount }
              : job
          ));
        } catch (error) {
          console.error(`Error processing document ${document.id}:`, error);
          // Continue with other documents even if one fails
        }
      }

      // Mark as completed
      setExtractionJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'completed' as const, progress: 100 }
          : job
      ));

      toast({
        title: "Extraction Complete",
        description: `Successfully processed ${processedCount} documents`,
      });

    } catch (error) {
      console.error('Error during extraction:', error);
      setExtractionJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'error' as const }
          : job
      ));
      toast({
        title: "Error",
        description: "Failed to complete extraction process",
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load workbodies data</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            disabled={!selectedWorkbodyId || isExtracting || documents.length === 0}
            className="flex items-center gap-2"
          >
            {isExtracting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Extract Data
              </>
            )}
          </Button>
        </div>

        {/* Document Status */}
        {selectedWorkbodyId && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isLoadingDocuments ? 'Loading documents...' : `${documents.length} documents found`}
              </span>
            </div>
            {documents.length === 0 && !isLoadingDocuments && (
              <p className="text-xs text-blue-600 mt-1">
                Upload some documents first to enable extraction.
              </p>
            )}
          </div>
        )}

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
