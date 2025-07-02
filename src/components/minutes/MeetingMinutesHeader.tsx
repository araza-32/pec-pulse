
import { Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MeetingMinutesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onUploadClick: () => void;
}

export function MeetingMinutesHeader({ 
  searchTerm, 
  onSearchChange, 
  onUploadClick 
}: MeetingMinutesHeaderProps) {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Meeting Minutes</h1>
        <p className="mt-2 text-blue-100">
          Browse and review all workbody meeting minutes
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search minutes..."
            className="pl-8 w-[280px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Button
          onClick={onUploadClick}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Minutes
        </Button>
      </div>
    </>
  );
}
