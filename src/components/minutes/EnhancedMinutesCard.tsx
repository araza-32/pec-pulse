import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, FileText, Sparkles, Download, Eye } from "lucide-react";
import { format } from "date-fns";

interface MinutesCardProps {
  minutes: {
    id: string;
    workbody_name: string;
    date: string;
    location: string;
    agenda_items: string[];
    actions_agreed: string[];
    file_url: string;
    has_summary?: boolean;
    ocr_status?: string;
  };
  onViewSummary: (id: string) => void;
  onGenerateSummary: (id: string) => void;
  onViewDocument: (url: string) => void;
}

export function EnhancedMinutesCard({ 
  minutes, 
  onViewSummary, 
  onGenerateSummary, 
  onViewDocument 
}: MinutesCardProps) {
  const canGenerateSummary = minutes.ocr_status === 'completed';
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg text-gray-900">
              {minutes.workbody_name}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(minutes.date), 'PPP')}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {minutes.location}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {minutes.has_summary && (
              <Badge className="bg-green-100 text-green-800">
                Summarized
              </Badge>
            )}
            {minutes.ocr_status === 'completed' && (
              <Badge className="bg-blue-100 text-blue-800">
                OCR Ready
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Agenda Items Preview */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-2">Agenda Items</h4>
          <div className="space-y-1">
            {minutes.agenda_items.slice(0, 3).map((item, index) => (
              <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-600 font-medium">{index + 1}.</span>
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
            {minutes.agenda_items.length > 3 && (
              <div className="text-sm text-gray-500">
                +{minutes.agenda_items.length - 3} more items...
              </div>
            )}
          </div>
        </div>

        {/* Actions Agreed Preview */}
        {minutes.actions_agreed.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">Key Actions</h4>
            <div className="space-y-1">
              {minutes.actions_agreed.slice(0, 2).map((action, index) => (
                <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-orange-600 font-medium">•</span>
                  <span className="line-clamp-1">{action}</span>
                </div>
              ))}
              {minutes.actions_agreed.length > 2 && (
                <div className="text-sm text-gray-500">
                  +{minutes.actions_agreed.length - 2} more actions...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDocument(minutes.file_url)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(minutes.file_url, '_blank')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>

          {minutes.has_summary ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => onViewSummary(minutes.id)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <FileText className="h-4 w-4" />
              View Summary
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => onGenerateSummary(minutes.id)}
              disabled={!canGenerateSummary}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Sparkles className="h-4 w-4" />
              Generate Summary
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}