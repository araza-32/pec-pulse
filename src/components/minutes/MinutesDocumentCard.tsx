
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MinutesDocumentCardProps {
  fileUrl: string;
  workbodyName: string;
  date: string;
}

export function MinutesDocumentCard({ fileUrl, workbodyName, date }: MinutesDocumentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minutes Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4 flex flex-col items-center justify-center">
          <iframe 
            src={`${fileUrl}#toolbar=0`} 
            className="w-full h-[500px] border-0"
            title={`Minutes for ${workbodyName} meeting on ${date}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
