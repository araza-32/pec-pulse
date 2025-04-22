
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
  return (
    <div className="flex justify-between">
      {!isFirstTab ? (
        <Button type="button" variant="outline" onClick={onPrevious}>Previous</Button>
      ) : (
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      )}
      <Button type="button" onClick={onNext}>
        {isLastTab ? "Submit" : "Next"}
      </Button>
    </div>
  );
};
