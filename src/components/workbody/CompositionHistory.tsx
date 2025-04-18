
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CompositionHistoryProps {
  workbodyId: string;
}

export function CompositionHistory({ workbodyId }: CompositionHistoryProps) {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, [workbodyId]);

  const loadHistory = async () => {
    const { data, error } = await supabase
      .from('workbody_composition_history')
      .select('*')
      .eq('workbody_id', workbodyId)
      .order('changed_at', { ascending: false });

    if (!error && data) {
      setHistory(data);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Composition History</h3>
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
