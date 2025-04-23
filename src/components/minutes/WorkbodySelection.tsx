
import { Label } from "@/components/ui/label";

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
        <select
          id="workbody-type-select"
          className="w-full border rounded px-3 py-2 text-sm"
          value={selectedWorkbodyType}
          onChange={e => {
            onWorkbodyTypeChange(e.target.value);
            onWorkbodyChange(""); // Reset workbody if type changes
          }}
          required
          disabled={isLoading || disabled}
        >
          <option value="">Select type...</option>
          {WORKBODY_TYPES.map(wbt => (
            <option key={wbt.value} value={wbt.value}>
              {wbt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="workbody-select">Select Workbody</Label>
        <select
          id="workbody-select"
          className="w-full border rounded px-3 py-2 text-sm"
          value={selectedWorkbody}
          onChange={e => onWorkbodyChange(e.target.value)}
          required
          disabled={!selectedWorkbodyType || filteredWorkbodies.length === 0}
        >
          <option value="">Select...</option>
          {filteredWorkbodies.map(wb => (
            <option key={wb.id} value={wb.id}>{wb.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
