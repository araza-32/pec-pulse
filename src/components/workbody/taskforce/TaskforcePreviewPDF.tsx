
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskforceFormValues } from "@/types/taskforce";
import { FileText } from "lucide-react";

interface TaskforcePreviewPDFProps {
  form: UseFormReturn<TaskforceFormValues>;
  userRole: "admin" | "coordination" | "secretary";
}

export function TaskforcePreviewPDF({ form, userRole }: TaskforcePreviewPDFProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-pec-green hover:bg-pec-green-600"
      >
        <FileText className="mr-2 h-4 w-4" />
        Preview as PDF
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Task Force Formation - Preview</h2>
              <Button 
                onClick={() => setIsOpen(false)} 
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
            
            <div className="w-full h-[calc(90vh-120px)]" style={{ backgroundColor: '#f9f9f9' }}>
              <iframe 
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Task Force Formation - ${form.getValues().name}</title>
                      <style>
                        body {
                          font-family: 'Arial', sans-serif;
                          font-size: 12pt;
                          color: #000;
                          background: #fff;
                          padding: 2cm;
                          margin: 0;
                        }
                        .page-break-before {
                          page-break-before: always;
                        }
                        table {
                          page-break-inside: avoid;
                          width: 100%;
                          border-collapse: collapse;
                          margin-bottom: 1rem;
                        }
                        th, td {
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        }
                        th {
                          background-color: #f2f2f2;
                        }
                        h1, h2, h3 {
                          page-break-after: avoid;
                        }
                        table thead {
                          display: table-header-group;
                        }
                        table tfoot {
                          display: table-row-group;
                        }
                        table tr {
                          page-break-inside: avoid;
                        }
                        .header {
                          text-align: center;
                          margin-bottom: 2cm;
                        }
                        .section {
                          margin-bottom: 1cm;
                        }
                      </style>
                    </head>
                    <body>
                      <div id="content">
                        ${document.getElementById('taskforce-printable-summary')?.innerHTML || 'Loading preview...'}
                      </div>
                      <script>
                        // For development only - ensures that styles are applied in the iframe
                        document.addEventListener('DOMContentLoaded', function() {
                          document.body.style.fontFamily = "'Arial', sans-serif";
                        });
                      </script>
                    </body>
                  </html>
                `}
                className="w-full h-full border-none"
                title="Task Force Formation Preview"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
