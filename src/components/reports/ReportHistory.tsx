
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: string;
  format: string;
  date: Date;
  workbodyType: string;
  workbodyName?: string;
}

interface ReportHistoryProps {
  reports: Report[];
  onRedownload: (report: Report) => void;
}

export const ReportHistory = ({ reports, onRedownload }: ReportHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report History</CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">
                        {report.workbodyName || `All ${report.workbodyType}s`} - {report.type} Report
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Generated on {report.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRedownload(report)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Again
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No reports have been generated yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};

