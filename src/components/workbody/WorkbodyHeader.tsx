
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WorkbodyHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export function WorkbodyHeader({
  searchQuery,
  onSearchChange,
  onAddClick
}: WorkbodyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workbodies..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="space-x-2">
        <Button onClick={onAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Workbody
        </Button>
      </div>
    </div>
  );
}
