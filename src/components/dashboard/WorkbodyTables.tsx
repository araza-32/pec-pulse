
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workbody, WorkbodyMember } from "@/types";

interface WorkbodyTablesProps {
  workbodies: Workbody[];
}

export const WorkbodyTables = ({ workbodies }: WorkbodyTablesProps) => {
  // Sort workbodies by member count and meeting count
  const sortedByMembers = [...workbodies]
    .sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0))
    .slice(0, 5);
    
  const sortedByMeetings = [...workbodies]
    .sort((a, b) => b.totalMeetings - a.totalMeetings)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <Card>
        <CardHeader className="pb-2 text-left">
          <CardTitle>Workbodies with Most Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 pl-0 pt-0 font-medium">Workbody Name</th>
                  <th className="pb-2 pt-0 font-medium">Type</th>
                  <th className="pb-2 pr-0 pt-0 font-medium text-right">Members</th>
                </tr>
              </thead>
              <tbody>
                {sortedByMembers.map((workbody) => (
                  <tr key={workbody.id} className="border-b last:border-0">
                    <td className="py-3 pl-0">{workbody.name}</td>
                    <td className="py-3">
                      {workbody.type === 'committee'
                        ? 'Committee'
                        : workbody.type === 'working-group'
                        ? 'Working Group'
                        : 'Task Force'}
                    </td>
                    <td className="py-3 pr-0 text-right">{workbody.members?.length || 0}</td>
                  </tr>
                ))}
                
                {sortedByMembers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted-foreground">
                      No workbodies available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 text-left">
          <CardTitle>Workbodies with Most Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 pl-0 pt-0 font-medium">Workbody Name</th>
                  <th className="pb-2 pt-0 font-medium">Type</th>
                  <th className="pb-2 pr-0 pt-0 font-medium text-right">
                    Total Meetings
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedByMeetings.map((workbody) => (
                  <tr key={workbody.id} className="border-b last:border-0">
                    <td className="py-3 pl-0">{workbody.name}</td>
                    <td className="py-3">
                      {workbody.type === 'committee'
                        ? 'Committee'
                        : workbody.type === 'working-group'
                        ? 'Working Group'
                        : 'Task Force'}
                    </td>
                    <td className="py-3 pr-0 text-right">{workbody.totalMeetings}</td>
                  </tr>
                ))}
                
                {sortedByMeetings.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted-foreground">
                      No workbodies available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
