import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskforceFormValues } from "@/types/taskforce";
import { UseFormReturn } from "react-hook-form";

interface ScopeSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}
export const ScopeSection = ({ form }: ScopeSectionProps) => {
  return (
    <>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="alignment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alignment with Strategic Objectives</FormLabel>
              <FormControl>
                <Textarea placeholder="Explain how this task force aligns with the strategic objectives of the organization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expectedOutcomes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Outcomes</FormLabel>
              <FormControl>
                <Textarea placeholder="List the expected outcomes of the task force" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mandates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mandates</FormLabel>
              <FormControl>
                <Textarea placeholder="List the mandates of the task force" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="durationMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Months)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter duration in months" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
