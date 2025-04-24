
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useMemo } from "react";

interface ReportOptionsProps {
  workbodyType: string;
  selectedWorkbody: string;
  reportType: string;
  reportFormat: string;
  onWorkbodyTypeChange: (value: string) => void;
  onWorkbodyChange: (value: string) => void;
  onReportTypeChange: (value: string) => void;
  onReportFormatChange: (value: string) => void;
}

export const ReportOptions = ({
  workbodyType,
  selectedWorkbody,
  reportType,
  reportFormat,
  onWorkbodyTypeChange,
  onWorkbodyChange,
  onReportTypeChange,
  onReportFormatChange,
}: ReportOptionsProps) => {
  const { workbodies = [] } = useWorkbodies();
  
  const filteredWorkbodies = useMemo(() => {
    if (!workbodyType) return [];
    return workbodies.filter(wb => wb.type === workbodyType);
  }, [workbodies, workbodyType]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="workbody-type">1. Select Workbody Type</Label>
        <Select value={workbodyType} onValueChange={(value) => {
          onWorkbodyTypeChange(value);
        }}>
          <SelectTrigger id="workbody-type">
            <SelectValue placeholder="Select workbody type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="committee">Committees</SelectItem>
            <SelectItem value="working-group">Working Groups</SelectItem>
            <SelectItem value="task-force">Task Forces</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {workbodyType && (
        <div className="space-y-2">
          <Label htmlFor="specific-workbody">2. Select Specific Workbody (Optional)</Label>
          <Select value={selectedWorkbody} onValueChange={onWorkbodyChange}>
            <SelectTrigger id="specific-workbody">
              <SelectValue placeholder="Select a workbody" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {workbodyType === 'working-group' ? 'Working Groups' : `${workbodyType}s`}</SelectItem>
              {filteredWorkbodies.map(wb => (
                <SelectItem key={wb.id} value={wb.id}>
                  {wb.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {workbodyType && (
        <div className="space-y-2">
          <Label htmlFor="report-type">3. Select Report Type</Label>
          <Select value={reportType} onValueChange={onReportTypeChange}>
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workbody Data</SelectItem>
              <SelectItem value="meetings">Meetings Summary</SelectItem>
              <SelectItem value="actions">Action Status</SelectItem>
              <SelectItem value="composition">Workbody Composition</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {reportType && (
        <div className="space-y-2">
          <Label htmlFor="report-format">4. Select Format</Label>
          <Select value={reportFormat} onValueChange={onReportFormatChange}>
            <SelectTrigger id="report-format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

