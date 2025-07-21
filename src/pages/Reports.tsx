
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useToast } from "@/hooks/use-toast";
import { useReportsHistory } from "@/hooks/useReportsHistory";
import { ReportOptions } from "@/components/reports/ReportOptions";
import { generateCSV, downloadFile, generateReportData } from "@/utils/reportGenerators";

export default function Reports() {
  const [workbodyType, setWorkbodyType] = useState("");
  const [selectedWorkbody, setSelectedWorkbody] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportFormat, setReportFormat] = useState("");
  
  const { workbodies = [] } = useWorkbodies();
  const { toast } = useToast();
  const { history, isLoading, addToHistory, clearHistory, removeFromHistory } = useReportsHistory();
  
  const handleGenerateReport = async () => {
    if (!workbodyType || !reportType || !reportFormat) {
      toast({
        title: "Missing Information",
        description: "Please select all required options to generate the report.",
        variant: "destructive"
      });
      return;
    }

    let targetWorkbodies = [];
    if (selectedWorkbody && selectedWorkbody !== "all-workbodies") {
      const workbody = workbodies.find(wb => wb.id === selectedWorkbody);
      if (workbody) targetWorkbodies = [workbody];
    } else {
      targetWorkbodies = workbodies.filter(wb => wb.type === workbodyType);
    }
    
    if (targetWorkbodies.length === 0) {
      toast({
        title: "No data available",
        description: "No workbodies match the selected criteria",
        variant: "destructive"
      });
      return;
    }

    const reportData = generateReportData(reportType, targetWorkbodies);
    const filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}`;
    let content = "";
    
    switch (reportFormat) {
      case "excel":
      case "csv":
        if (reportData.length > 0) {
          const headers = Object.keys(reportData[0]);
          content = generateCSV(reportData, headers);
          downloadFile(
            content, 
            `${filename}.${reportFormat === 'excel' ? 'csv' : 'csv'}`, 
            'text/csv;charset=utf-8;'
          );
        }
        break;
        
      case "pdf":
        toast({
          title: "PDF Export",
          description: "PDF generation is mocked in this demo. In a real application, this would generate a PDF document.",
        });
        return;
    }

    // Add to report history
    await addToHistory({
      name: `${reportType}-report-${new Date().toISOString().split('T')[0]}`,
      type: reportType,
      format: reportFormat,
      date: new Date(),
      workbodyType,
      workbodyName: selectedWorkbody && selectedWorkbody !== "all-workbodies" 
        ? workbodies.find(wb => wb.id === selectedWorkbody)?.name 
        : undefined,
      parameters: {
        workbodyType,
        selectedWorkbody,
        reportType,
        reportFormat
      },
      generatedBy: 'system' // In a real app, this would be the current user
    });
    
    toast({
      title: "Report Generated",
      description: `Report has been downloaded as ${filename}.${reportFormat}`,
    });
  };

  const handleResetOptions = () => {
    setSelectedWorkbody("");
    setReportType("");
    setReportFormat("");
  };

  const handleRegenerate = (reportItem: any) => {
    setWorkbodyType(reportItem.parameters.workbodyType);
    setSelectedWorkbody(reportItem.parameters.selectedWorkbody);
    setReportType(reportItem.parameters.reportType);
    setReportFormat(reportItem.parameters.reportFormat);
    
    // Switch to generate tab and generate report
    setTimeout(() => {
      handleGenerateReport();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download reports for PEC workbodies
        </p>
      </div>
      
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">
            Report History ({history.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ReportOptions 
                workbodyType={workbodyType}
                selectedWorkbody={selectedWorkbody}
                reportType={reportType}
                reportFormat={reportFormat}
                onWorkbodyTypeChange={(value) => {
                  setWorkbodyType(value);
                  handleResetOptions();
                }}
                onWorkbodyChange={setSelectedWorkbody}
                onReportTypeChange={setReportType}
                onReportFormatChange={setReportFormat}
              />
              
              <div className="flex justify-end">
                <Button 
                  className="gap-2 bg-pec-green hover:bg-pec-green-600"
                  onClick={handleGenerateReport}
                  disabled={!workbodyType || !reportType || !reportFormat}
                >
                  <Download className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Report History</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    disabled={history.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Loading report history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reports generated yet.</p>
                  <p className="text-sm mt-2">Generate your first report to see it here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{report.name}</h3>
                          <span className="text-sm text-gray-500">
                            ({report.format.toUpperCase()})
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {report.workbodyName || `All ${report.workbodyType}s`} • 
                          Generated on {report.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate(report)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromHistory(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
