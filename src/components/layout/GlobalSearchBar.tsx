
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, FileText, Users, X } from "lucide-react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchResult {
  id: string;
  title: string;
  type: 'workbody' | 'meeting' | 'minutes';
  description: string;
  path: string;
}

export function GlobalSearchBar() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { workbodies } = useWorkbodies();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const performSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search workbodies
      const filteredWorkbodies = workbodies.filter(wb => 
        wb.name.toLowerCase().includes(query.toLowerCase()) ||
        (wb.description && wb.description.toLowerCase().includes(query.toLowerCase()))
      );

      filteredWorkbodies.forEach(wb => {
        searchResults.push({
          id: wb.id,
          title: wb.name,
          type: 'workbody',
          description: `${wb.type} • ${wb.members?.length || 0} members`,
          path: `/workbody/${wb.id}`
        });
      });

      // Search scheduled meetings
      const { data: meetings } = await supabase
        .from('scheduled_meetings')
        .select('*')
        .or(`workbody_name.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(10);

      meetings?.forEach(meeting => {
        searchResults.push({
          id: meeting.id,
          title: `${meeting.workbody_name} Meeting`,
          type: 'meeting',
          description: `${meeting.date} at ${meeting.location}`,
          path: `/calendar?meeting=${meeting.id}`
        });
      });

      // Search meeting minutes
      const { data: minutes } = await supabase
        .from('meeting_minutes')
        .select('*, workbodies(name)')
        .or(`location.ilike.%${query}%`)
        .limit(10);

      minutes?.forEach(minute => {
        searchResults.push({
          id: minute.id,
          title: `${minute.workbodies?.name || 'Unknown'} Minutes`,
          type: 'minutes',
          description: `${minute.date} • ${minute.location}`,
          path: `/minutes/${minute.id}`
        });
      });

      setResults(searchResults.slice(0, 15)); // Limit to 15 results
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, workbodies]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    setOpen(false);
    setSearchTerm("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'workbody':
        return <Users className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'minutes':
        return <FileText className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search workbodies, meetings, minutes..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? "Searching..." : "No results found."}
          </CommandEmpty>
          
          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  value={result.title}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-2"
                >
                  {getIcon(result.type)}
                  <div className="flex flex-col">
                    <span className="font-medium">{result.title}</span>
                    <span className="text-xs text-muted-foreground">{result.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
