
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FilePlus, Upload, FileText, ChevronRight } from "lucide-react";
import { MeetingMinutes } from "@/types";
import { format, parseISO } from "date-fns";
import { WorkbodyMinutesUpload } from "./WorkbodyMinutesUpload";

interface WorkbodyMeetingsProps {
  minutes: MeetingMinutes[];
  isLoadingMinutes: boolean;
  workbodyId: string;
}

export function WorkbodyMeetings({ 
  minutes, 
  isLoadingMinutes,
  workbodyId 
}: WorkbodyMeetingsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayMinutes = showAll ? minutes : minutes.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-blue-800">Meetings & Minutes</h2>
        
        <div className="flex gap-2">
          <Link to={`/calendar?workbody=${workbodyId}`}>
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </Link>
          
          <WorkbodyMinutesUpload workbodyId={workbodyId} />
        </div>
      </div>
      
      <Card className="border border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4 border-b border-blue-100">
          <CardTitle className="text-blue-800">Meeting Minutes</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoadingMinutes ? (
            <div className="p-6 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-blue-600">Loading meeting minutes...</p>
            </div>
          ) : minutes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-blue-300 mb-3" />
              <p className="text-lg font-medium text-blue-800">No meeting minutes available</p>
              <p className="text-blue-600 mt-1">Minutes will appear here once uploaded</p>
              <Link to={`/upload-minutes?workbody=${workbodyId}`}>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Minutes
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-blue-100">
              {displayMinutes.map((minute) => (
                <div key={minute.id} className="p-4 hover:bg-blue-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-blue-800">
                        Meeting on {format(parseISO(minute.date), "MMMM d, yyyy")}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {minute.venue || minute.location}
                      </p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {minute.agendaItems && minute.agendaItems.slice(0, 2).map((item, i) => (
                          <span key={i} className="text-xs bg-blue-50 border border-blue-200 rounded px-2 py-0.5 text-blue-700">
                            {item}
                          </span>
                        ))}
                        {minute.agendaItems && minute.agendaItems.length > 2 && (
                          <span className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-gray-600">
                            +{minute.agendaItems.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Link to={`/minutes/${minute.id}`}>
                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300">
                          View
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {minutes.length > 5 && (
                <div className="p-4 text-center">
                  <Button 
                    variant="ghost" 
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Show less" : `Show all ${minutes.length} minutes`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
