
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompositionHistoryProps } from "@/types/workbody";

// Mock history data
const mockHistoryData = [
  {
    id: '1',
    workbody_id: 'wb-1',
    changed_at: new Date().toISOString(),
    changes: {
      added: ['John Doe as Chair', 'Jane Smith as Secretary'],
      removed: []
    },
    source_document_id: 'doc-1'
  },
  {
    id: '2',
    workbody_id: 'wb-1',
    changed_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    changes: {
      added: [],
      removed: ['Alice Johnson as Observer']
    },
    source_document_id: null
  }
];

export function CompositionHistory({ workbodyId, onClose }: CompositionHistoryProps) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load mock history for now
    setHistory(mockHistoryData.filter(item => item.workbody_id === workbodyId));
    
    // Later, when Supabase is properly configured, use this:
    // loadHistory();
  }, [workbodyId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Composition History</h3>
        <button 
          onClick={onClose} 
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Changes</TableHead>
            <TableHead>Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {new Date(record.changed_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(record.changes, null, 2)}
                </pre>
              </TableCell>
              <TableCell>
                {record.source_document_id ? 'Notification Upload' : 'Manual Update'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
