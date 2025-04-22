
import { Button } from "@/components/ui/button";

interface TaskforceNavigationProps {
  activeTab: string;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  isLastTab?: boolean;
  isFirstTab?: boolean;
}

export const TaskforceNavigation = ({
  activeTab,
  onPrevious,
  onNext,
  onCancel,
  isLastTab = false,
  isFirstTab = false,
}: TaskforceNavigationProps) => {
  // Ensure that we don't have conditional returns before any hooks
  // This component doesn't use hooks, but let's make it more robust

  return (
    <div className="flex justify-between">
      <div>
        {isFirstTab ? (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        ) : (
          <Button type="button" variant="outline" onClick={onPrevious}>Previous</Button>
        )}
      </div>
      <Button type="button" onClick={onNext}>
        {isLastTab ? "Submit" : "Next"}
      </Button>
    </div>
  );
};
