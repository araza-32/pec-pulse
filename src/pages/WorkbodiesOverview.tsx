
import { useState, useEffect } from "react";
import { useWorkBodiesQuery, SortOption } from "@/hooks/useWorkBodiesQuery";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { CategoryFilter } from "@/components/workbody/CategoryFilter";
import { WorkBodyDrawer } from "@/components/workbody/WorkBodyDrawer";
import { SearchSortBar } from "@/components/workbody/SearchSortBar";
import { BulkActionBar } from "@/components/workbody/BulkActionBar";
import { toast } from "@/hooks/use-toast";
import { WorkbodiesGridView } from "@/components/workbody/WorkbodiesGridView";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWorkbodies } from "@/hooks/useWorkbodies";

export default function WorkbodiesOverview() {
  const { 
    workbodies, 
    isLoading 
  } = useWorkbodies();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkbodyId, setSelectedWorkbodyId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filter workbodies based on category and search query
  const filteredWorkbodies = workbodies.filter(wb => {
    // Apply category filter
    if (selectedCategory !== 'all') {
      const categoryMap: Record<string, string> = {
        'committees': 'committee',
        'workingGroups': 'working-group',
        'taskForces': 'task-force'
      };
      
      if (wb.type !== categoryMap[selectedCategory]) {
        return false;
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return wb.name.toLowerCase().includes(query);
    }
    
    return true;
  });
  
  // Count workbodies by type
  const counts = {
    committees: workbodies.filter(wb => wb.type === 'committee').length,
    workingGroups: workbodies.filter(wb => wb.type === 'working-group').length,
    taskForces: workbodies.filter(wb => wb.type === 'task-force').length
  };
  
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
  };
  
  // Handle sort option change
  const handleSort = (option: SortOption) => {
    // Implementation for sorting
    console.log("Sort option:", option);
  };

  // Get selected workbody with enhanced data for the drawer
  const getWorkbodyById = (id: string) => {
    const workbody = workbodies.find(wb => wb.id === id);
    
    if (!workbody) return null;
    
    // Generate abbreviation from name
    let abbreviation = "";
    const match = workbody.name.match(/\(([^)]+)\)$/);
    
    if (match && match[1]) {
      // Use abbreviation found in parentheses
      abbreviation = match[1];
    } else {
      // Create abbreviation from first letters of words
      abbreviation = workbody.name.split(' ')
        .filter(word => word.length > 0)
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
    }
    
    // Generate mock meetings if needed
    const meetings = workbody.meetingsThisYear ? 
      Array.from({ length: workbody.meetingsThisYear }, (_, i) => ({
        id: `${workbody.id}-meeting-${i}`,
        date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        title: `Regular Meeting ${i + 1}`,
        hasMinutes: i < 2 // Only recent meetings have minutes
      })) : [];
    
    // Return enhanced workbody with required fields for the drawer
    return {
      id: workbody.id,
      name: workbody.name,
      abbreviation,
      mandate: workbody.description,
      termsOfReference: workbody.termsOfReference,
      members: workbody.members || [],
      meetings,
      lastProgressLog: workbody.meetingsThisYear > 0 ? {
        content: `The ${workbody.name} has made progress on several key initiatives this quarter.`,
        date: new Date().toLocaleDateString(),
        author: 'System'
      } : undefined
    };
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg shadow-md text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">Workbodies Overview</h1>
        <p className="opacity-90">
          Comprehensive view of all committees, working groups and task forces
        </p>
      </div>
      
      <CategoryFilter
        committees={counts.committees}
        workingGroups={counts.workingGroups}
        taskForces={counts.taskForces}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Workbodies {selectedCategory !== 'all' ? `(${selectedCategory})` : ''}</CardTitle>
              <CardDescription>
                {filteredWorkbodies.length} workbodies found
              </CardDescription>
            </div>
            <div className="w-full md:w-auto">
              <SearchSortBar
                onSearch={handleSearch}
                onSort={handleSort}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WorkbodiesGridView 
            workbodies={filteredWorkbodies}
            onWorkbodyClick={handleWorkbodyClick}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      
      <WorkBodyDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        workbody={selectedWorkbodyId ? getWorkbodyById(selectedWorkbodyId) : null}
        userRole="admin" // This would come from your auth context
      />
    </div>
  );
}
