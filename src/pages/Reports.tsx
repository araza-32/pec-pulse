
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useToast } from "@/hooks/use-toast";
import { ReportOptions } from "@/components/reports/ReportOptions";
import { ReportHistory } from "@/components/reports/ReportHistory";
import { generateCSV, downloadFile, generateReportData } from "@/utils/reportGenerators";

export default function Reports() {
  const [workbodyType, setWorkbodyType] = useState("");
  const [selectedWorkbody, setSelectedWorkbody] = useState(""); // This is fine since we check it later
  const [reportType, setReportType] = useState("");
  const [reportFormat, setReportFormat] = useState("");
  const [reportHistory, setReportHistory] = useState<Array<{
    id: string;
    name: string;
    type: string;
    format: string;
    date: Date;
    workbodyType: string;
    workbodyName?: string;
  }>>([]);
  
  const { workbodies = [] } = useWorkbodies();
  const { toast } = useToast();
  
  const handleGenerateReport = () => {
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
    const newReport = {
      id: crypto.randomUUID(),
      name: `${reportType}-report-${new Date().toISOString().split('T')[0]}`,
      type: reportType,
      format: reportFormat,
      date: new Date(),
      workbodyType,
      workbodyName: selectedWorkbody && selectedWorkbody !== "all-workbodies" 
        ? workbodies.find(wb => wb.id === selectedWorkbody)?.name 
        : undefined
    };
    
    setReportHistory(prev => [newReport, ...prev]);
    
    toast({
      title: "Report Generated",
      description: `Report has been downloaded as ${newReport.name}.${reportFormat}`,
    });
  };

  const handleResetOptions = () => {
    setSelectedWorkbody("");
    setReportType("");
    setReportFormat("");
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
          <TabsTrigger value="history">Report History</TabsTrigger>
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
          <ReportHistory 
            reports={reportHistory}
            onRedownload={handleGenerateReport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
