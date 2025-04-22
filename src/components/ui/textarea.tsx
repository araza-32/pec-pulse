
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  wordLimit?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, wordLimit, onChange, ...props }, ref) => {
    const [wordCount, setWordCount] = React.useState(0);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (wordLimit) {
        const words = e.target.value.trim().split(/\s+/);
        const count = e.target.value === '' ? 0 : words.length;
        setWordCount(count);
        
        // If word count exceeds limit, truncate the text
        if (count > wordLimit) {
          const words = e.target.value.trim().split(/\s+/);
          e.target.value = words.slice(0, wordLimit).join(' ');
        }
      }
      
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        {wordLimit && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {wordCount}/{wordLimit} words
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
