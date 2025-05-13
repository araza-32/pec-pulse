
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";
import { SortOption } from "@/hooks/useWorkBodiesQuery";

interface SearchSortBarProps {
  onSearch: (query: string) => void;
  onSort: (option: SortOption) => void;
  defaultSort?: SortOption;
}

export function SearchSortBar({ onSearch, onSort, defaultSort = "progress" }: SearchSortBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(defaultSort);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Custom debounce implementation without using lodash
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      onSearch(query);
    }, 300);
    
    setSearchTimeout(timeout as any);
  };

  const handleSortChange = (value: string) => {
    const sortOption = value as SortOption;
    setSortOption(sortOption);
    onSort(sortOption);
  };

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="flex items-center space-x-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search workbodies..."
          className="pl-9"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <Select value={sortOption} onValueChange={(value) => handleSortChange(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="progress">Progress ↓</SelectItem>
          <SelectItem value="meetings">Meetings YTD ↓</SelectItem>
          <SelectItem value="alphabetical">Alphabetic A→Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
