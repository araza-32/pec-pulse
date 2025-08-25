import { useState, useRef, useEffect } from "react";
import { Search, User, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWorkbodyMembersSearch, WorkbodyMemberWithWorkbody } from "@/hooks/useWorkbodyMembersSearch";
import { cn } from "@/lib/utils";

export function GlobalMemberSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: members = [], isLoading } = useWorkbodyMembersSearch(searchQuery);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleMemberClick = (member: WorkbodyMemberWithWorkbody) => {
    // Could navigate to member details or workbody page
    console.log("Member clicked:", member);
    setIsOpen(false);
    setSearchQuery("");
  };

  const getWorkbodyTypeColor = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "working-group":
        return "bg-green-50 text-green-700 border-green-200";
      case "task-force":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : members.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery.length < 2 
                ? "Type at least 2 characters to search" 
                : "No members found"}
            </div>
          ) : (
            <div className="py-2">
              {members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleMemberClick(member)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border/50 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">{member.name}</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        {member.role}
                      </div>

                      {(member.email || member.phone) && (
                        <div className="flex flex-col gap-1 mb-2">
                          {member.email && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{member.email}</span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs capitalize",
                            getWorkbodyTypeColor(member.workbody_type)
                          )}
                        >
                          {member.workbody_type.replace("-", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate">
                          {member.workbody_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}