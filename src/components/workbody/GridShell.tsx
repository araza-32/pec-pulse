
import { useState, useRef } from "react";
import { WorkBodyCard } from "@/components/workbody/WorkBodyCard";
import { cn } from "@/lib/utils";
import { FileQuestion } from "lucide-react";

interface Workbody {
  id: string;
  abbreviation: string;
  name: string;
  type: "committee" | "working-group" | "task-force";
  meetingsYtd: number;
  actionsClosed: number;
  progressPercent: number;
}

interface GridShellProps {
  workbodies: Workbody[];
  onWorkbodyClick: (id: string) => void;
  selectedCategory: string;
  loading?: boolean;
}

export function GridShell({
  workbodies,
  onWorkbodyClick,
  selectedCategory,
  loading = false
}: GridShellProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Loading workbodies...</p>
      </div>
    );
  }
  
  if (workbodies.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <FileQuestion size={48} className="text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-700 mb-1">No workbodies found</p>
        <p className="text-gray-500">No work-bodies found for this category.</p>
      </div>
    );
  }

  return (
    <div 
      ref={parentRef} 
      className={cn(
        "grid gap-6 py-6",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      )}
    >
      {workbodies.map((workbody) => (
        <WorkBodyCard
          key={workbody.id}
          id={workbody.id}
          abbreviation={workbody.abbreviation}
          name={workbody.name}
          meetingsYtd={workbody.meetingsYtd}
          actionsClosed={workbody.actionsClosed}
          progressPercent={workbody.progressPercent}
          onClick={() => onWorkbodyClick(workbody.id)}
          type={workbody.type}
        />
      ))}
    </div>
  );
}
