
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";

interface WorkbodyHeaderProps {
  name: string;
  type: string;
  description?: string;
}

export function WorkbodyHeader({ name, type, description }: WorkbodyHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{name}</h1>
          <Badge variant="outline" className="capitalize">
            {type.replace("-", " ")}
          </Badge>
        </div>
        <p className="text-muted-foreground">{description || "No description available"}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export Data
        </Button>
        <Button className="gap-2 bg-pec-green hover:bg-pec-green-700">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
