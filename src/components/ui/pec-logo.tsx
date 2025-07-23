import { cn } from "@/lib/utils";

interface PECLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function PECLogo({ className, size = "md", showText = true }: PECLogoProps) {
  const logoSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10"
  };

  // Try to use the uploaded logo first, fallback to custom SVG
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "bg-primary rounded-md flex items-center justify-center relative overflow-hidden",
        logoSizes[size]
      )}>
        {/* Fallback logo design inspired by the uploaded image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">
            {size === "sm" ? "P" : "PEC"}
          </span>
          <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></div>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg text-foreground">PEC Pulse</span>
          <span className="text-xs text-muted-foreground">Management Portal</span>
        </div>
      )}
    </div>
  );
}