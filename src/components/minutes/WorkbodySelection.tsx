
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const WORKBODY_TYPES = [
  { value: "committee", label: "Committee" },
  { value: "working-group", label: "Working Group" },
  { value: "task-force", label: "Task Force" }
];

interface WorkbodySelectionProps {
  selectedWorkbodyType: string;
  selectedWorkbody: string;
  onWorkbodyTypeChange: (value: string) => void;
  onWorkbodyChange: (value: string) => void;
  availableWorkbodies: any[];
  isLoading: boolean;
  disabled?: boolean;
}

export function WorkbodySelection({
  selectedWorkbodyType,
  selectedWorkbody,
  onWorkbodyTypeChange,
  onWorkbodyChange,
  availableWorkbodies,
  isLoading,
  disabled
}: WorkbodySelectionProps) {
  const filteredWorkbodies = selectedWorkbodyType
    ? availableWorkbodies.filter(wb => wb.type === selectedWorkbodyType)
    : [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="workbody-type-select">Select Workbody Type</Label>
        <Select
          value={selectedWorkbodyType}
          onValueChange={(value) => {
            onWorkbodyTypeChange(value);
            onWorkbodyChange(""); // Reset workbody if type changes
          }}
          disabled={isLoading || disabled}
        >
          <SelectTrigger id="workbody-type-select">
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder-type" disabled>Select type...</SelectItem>
            {WORKBODY_TYPES.map(wbt => (
              <SelectItem key={wbt.value} value={wbt.value}>
                {wbt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="workbody-select">Select Workbody</Label>
        <Select
          value={selectedWorkbody}
          onValueChange={onWorkbodyChange}
          disabled={!selectedWorkbodyType || filteredWorkbodies.length === 0 || isLoading || disabled}
        >
          <SelectTrigger id="workbody-select">
            <SelectValue placeholder="Select workbody..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder-wb" disabled>Select workbody...</SelectItem>
            {filteredWorkbodies.map(wb => (
              <SelectItem key={wb.id} value={wb.id}>
                {wb.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
