
import { TaskforceFormValues } from "@/types/taskforce";
import { UseFormReturn } from "react-hook-form";

interface TaskforcePrintableSummaryProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const TaskforcePrintableSummary = ({ form }: TaskforcePrintableSummaryProps) => {
  const values = form.getValues();

  return (
    <div className="p-6 space-y-8 text-black print:text-black">
      {/* Title Section */}
      <div className="text-center border-b pb-4 mb-8">
        <h1 className="text-2xl font-bold">Task Force Formation Request Form</h1>
        <p className="text-lg">{values.name}</p>
      </div>

      {/* Overview Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">1. Overview</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Proposed By:</p>
            <p>{values.proposedBy || "Not specified"}</p>
          </div>
          <div>
            <p className="font-semibold">Purpose:</p>
            <p>{values.purpose || "Not specified"}</p>
          </div>
          <div>
            <p className="font-semibold">Created Date:</p>
            <p>
              {values.createdDate
                ? typeof values.createdDate === "string"
                  ? new Date(values.createdDate).toLocaleDateString()
                  : values.createdDate.toLocaleDateString()
                : "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Scope Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">2. Scope & Terms of Reference</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Alignment with PEC Strategic Objectives:</p>
            <p>{values.alignment || "Not specified"}</p>
          </div>
          <div>
            <p className="font-semibold">Duration:</p>
            <p>{values.durationMonths} months</p>
            {values.endDate && (
              <p className="text-sm">
                End Date: {typeof values.endDate === "string"
                  ? new Date(values.endDate).toLocaleDateString()
                  : values.endDate.toLocaleDateString()}
              </p>
            )}
          </div>
          <div>
            <p className="font-semibold">Expected Outcomes:</p>
            {values.expectedOutcomes && values.expectedOutcomes.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {values.expectedOutcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            ) : (
              <p>No outcomes specified</p>
            )}
          </div>
          <div>
            <p className="font-semibold">Mandates:</p>
            {values.mandates && values.mandates.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {values.mandates.map((mandate, index) => (
                  <li key={index}>{mandate}</li>
                ))}
              </ul>
            ) : (
              <p>No mandates specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Composition Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">3. Composition</h2>
        {values.members && values.members.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Role</th>
                  <th className="border p-2 text-left">Expertise</th>
                  <th className="border p-2 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {values.members.map((member, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border p-2">{member.name}</td>
                    <td className="border p-2">{member.role}</td>
                    <td className="border p-2">{member.expertise}</td>
                    <td className="border p-2">
                      <div>{member.email}</div>
                      <div>{member.mobile}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No members specified</p>
        )}
      </div>

      {/* Procedures Section */}
      <div className="space-y-4 page-break-before">
        <h2 className="text-xl font-bold border-b pb-2">4. Operating Procedures</h2>
        {values.meetings && values.meetings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Meeting</th>
                  <th className="border p-2 text-left">Date & Time</th>
                  <th className="border p-2 text-left">Mode</th>
                  <th className="border p-2 text-left">Venue</th>
                </tr>
              </thead>
              <tbody>
                {values.meetings.map((meeting, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border p-2">{meeting.meetingRequired}</td>
                    <td className="border p-2">{meeting.dateTime}</td>
                    <td className="border p-2">{meeting.mode}</td>
                    <td className="border p-2">{meeting.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No meetings specified</p>
        )}
      </div>

      {/* Deliverables Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">5. Deliverables</h2>
        
        <div>
          <p className="font-semibold">Deliverables:</p>
          {values.deliverables && values.deliverables.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Deadline</th>
                    <th className="border p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {values.deliverables.map((deliverable, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border p-2">{deliverable.name}</td>
                      <td className="border p-2">{deliverable.description}</td>
                      <td className="border p-2">{deliverable.deadline}</td>
                      <td className="border p-2">{deliverable.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No deliverables specified</p>
          )}
        </div>

        <div>
          <p className="font-semibold">Milestones:</p>
          {values.milestones && values.milestones.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {values.milestones.map((milestone, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border p-2">{milestone.name}</td>
                      <td className="border p-2">{milestone.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No milestones specified</p>
          )}
        </div>
      </div>

      {/* Signatures Section */}
      <div className="space-y-6 mt-8 page-break-before">
        <h2 className="text-xl font-bold border-b pb-2">6. Signatures</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">Proposed by:</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="font-semibold">Name:</p>
                <p>{values.proposerName || "___________________"}</p>
              </div>
              <div>
                <p className="font-semibold">Date:</p>
                <p>{values.proposerDate || "___________________"}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Signature:</p>
              <p>{values.proposerSignature || "___________________"}</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium text-lg">Reviewed and Recommended by:</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="font-semibold">Name:</p>
                <p>{values.reviewerName || "___________________"}</p>
              </div>
              <div>
                <p className="font-semibold">Date:</p>
                <p>{values.reviewerDate || "___________________"}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Signature:</p>
              <p>{values.reviewerSignature || "___________________"}</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium text-lg">Approved by:</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="font-semibold">Name:</p>
                <p>{values.approverName || "___________________"}</p>
              </div>
              <div>
                <p className="font-semibold">Date:</p>
                <p>{values.approverDate || "___________________"}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Signature:</p>
              <p>{values.approverSignature || "___________________"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styling */}
      <style>
        {`
        @media print {
          @page {
            margin: 2cm;
            size: portrait;
          }
          body {
            font-size: 12pt;
          }
          .page-break-before {
            page-break-before: always;
          }
          table {
            page-break-inside: avoid;
          }
          h2 {
            page-break-after: avoid;
          }
          table thead {
            display: table-header-group;
          }
          table tfoot {
            display: table-row-group;
          }
          table tr {
            page-break-inside: avoid;
          }
        }
        `}
      </style>
    </div>
  );
};
