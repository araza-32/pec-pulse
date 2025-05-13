
import { useState, useEffect } from "react";
import { useWorkBodiesQuery, SortOption } from "@/hooks/useWorkBodiesQuery";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { CategoryFilter } from "@/components/workbody/CategoryFilter";
import { GridShell } from "@/components/workbody/GridShell";
import { WorkBodyDrawer } from "@/components/workbody/WorkBodyDrawer";
import { SearchSortBar } from "@/components/workbody/SearchSortBar";
import { BulkActionBar } from "@/components/workbody/BulkActionBar";
import { toast } from "@/hooks/use-toast";

export default function WorkbodiesOverview() {
  const { 
    filteredWorkbodies, 
    isLoading, 
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    setSortOption,
    counts,
    getWorkbodyById
  } = useWorkBodiesQuery();
  
  const [selectedWorkbodyId, setSelectedWorkbodyId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const {
    selectedIds,
    toggleSelection,
    clearSelection,
    selectedCount
  } = useBulkSelection({
    items: filteredWorkbodies
  });
  
  // Handle workbody card click
  const handleWorkbodyClick = (id: string) => {
    setSelectedWorkbodyId(id);
    setIsDrawerOpen(true);
  };
  
  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedWorkbodyId(null);
  };
  
  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (selectedCount > 0) {
      clearSelection();
    }
  };
  
  // Handle sort option change
  const handleSort = (option: SortOption) => {
    setSortOption(option);
  };
  
  // Handle bulk actions
  const handleExport = () => {
    toast({
      title: "Export started",
      description: `Exporting ${selectedCount} workbodies to CSV`,
    });
  };
  
  const handleChangeStatus = () => {
    toast({
      title: "Change status",
      description: `Update status for ${selectedCount} workbodies`,
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Delete workbodies",
      description: `About to delete ${selectedCount} workbodies`,
      variant: "destructive",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Work-bodies Overview</h1>
      
      <CategoryFilter
        committees={counts.committees}
        workingGroups={counts.workingGroups}
        taskForces={counts.taskForces}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="py-4">
        <SearchSortBar
          onSearch={handleSearch}
          onSort={handleSort}
        />
      </div>
      
      <GridShell
        workbodies={filteredWorkbodies}
        onWorkbodyClick={handleWorkbodyClick}
        selectedCategory={selectedCategory}
        loading={isLoading}
      />
      
      <WorkBodyDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        workbody={selectedWorkbodyId ? getWorkbodyById(selectedWorkbodyId) : null}
        userRole="admin" // This would come from your auth context
      />
      
      <BulkActionBar
        selectedCount={selectedCount}
        onExport={handleExport}
        onChangeStatus={handleChangeStatus}
        onDelete={handleDelete}
        onClose={clearSelection}
      />
    </div>
  );
}
