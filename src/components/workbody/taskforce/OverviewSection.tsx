import { UseFormReturn } from "react-hook-form";
import { TaskforceFormValues } from "@/types/taskforce";

interface OverviewSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const OverviewSection = ({ form }: OverviewSectionProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taskforce Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter taskforce name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="proposedBy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Proposed by</FormLabel>
            <FormControl>
              <Input placeholder="Enter name of proposer" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purpose</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the purpose of this taskforce (max 300 words)" 
                wordLimit={300}
                className="min-h-[150px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide a clear description of the taskforce's purpose (limited to 300 words)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
