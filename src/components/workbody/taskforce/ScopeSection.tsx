
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskforceFormValues } from "@/types/taskforce";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ScopeSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const ScopeSection = ({ form }: ScopeSectionProps) => {
  const expectedOutcomes = form.watch("expectedOutcomes") || [];
  const mandates = form.watch("mandates") || [];
  
  const addOutcome = () => {
    if (expectedOutcomes.length < 10) {
      form.setValue("expectedOutcomes", [...expectedOutcomes, ""]);
    }
  };
  
  const removeOutcome = (index: number) => {
    const updated = [...expectedOutcomes];
    updated.splice(index, 1);
    form.setValue("expectedOutcomes", updated);
  };
  
  const addMandate = () => {
    if (mandates.length < 10) {
      form.setValue("mandates", [...mandates, ""]);
    }
  };
  
  const removeMandate = (index: number) => {
    const updated = [...mandates];
    updated.splice(index, 1);
    form.setValue("mandates", updated);
  };
  
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="alignment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alignment with Workbody Objectives</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe how this taskforce aligns with workbody objectives (max 300 words)" 
                wordLimit={300}
                className="min-h-[150px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Explain how this taskforce aligns with broader organizational objectives (limited to 300 words)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Expected Outcomes</FormLabel>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addOutcome}
            disabled={expectedOutcomes.length >= 10}
          >
            Add Outcome
          </Button>
        </div>
        <FormDescription>Add up to 10 expected outcomes</FormDescription>
        
        <div className="space-y-3">
          {expectedOutcomes.map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`expectedOutcomes.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder={`Outcome ${index + 1}`} {...field} />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeOutcome(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Mandate</FormLabel>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addMandate}
            disabled={mandates.length >= 10}
          >
            Add Mandate
          </Button>
        </div>
        <FormDescription>Add up to 10 mandate points</FormDescription>
        
        <div className="space-y-3">
          {mandates.map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`mandates.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder={`Mandate ${index + 1}`} {...field} />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMandate(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="durationMonths"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timeline (Duration in months)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1"
                placeholder="Enter duration in months" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
              />
            </FormControl>
            <FormDescription>
              Specify how many months this taskforce will be active
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
