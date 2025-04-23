
import { UseFormReturn } from "react-hook-form";
import { TaskforceFormValues } from "@/types/taskforce";
import { format } from "date-fns";

// Show a summary for printing: all form values.
export const TaskforcePrintableSummary = ({ form }: { form: UseFormReturn<TaskforceFormValues> }) => {
  const values = form.getValues();

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Taskforce Submission Summary</h1>
      
      {/* Overview Section */}
      <section className="mb-8 border-b pb-6">
        <h2 className="text-xl font-bold mb-4">1. Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><strong>Taskforce Name:</strong> {values.name || "N/A"}</div>
          <div><strong>Proposed By:</strong> {values.proposedBy || "N/A"}</div>
        </div>
        <div className="mb-4">
          <strong>Purpose:</strong> 
          <p className="mt-1">{values.purpose || "N/A"}</p>
        </div>
      </section>

      {/* Scope & ToRs */}
      <section className="mb-8 border-b pb-6">
        <h2 className="text-xl font-bold mb-4">2. Scope & Terms of Reference</h2>
        <div className="mb-4">
          <strong>Alignment:</strong> 
          <p className="mt-1">{values.alignment || "N/A"}</p>
        </div>
        
        <div className="mb-4">
          <strong>Expected Outcomes:</strong>
          {values.expectedOutcomes?.length > 0 ? (
            <ul className="list-disc list-inside mt-1 ml-4">
              {values.expectedOutcomes.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1">None specified</p>
          )}
        </div>
        
        <div className="mb-4">
          <strong>Mandates:</strong>
          {values.mandates?.length > 0 ? (
            <ul className="list-disc list-inside mt-1 ml-4">
              {values.mandates.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1">None specified</p>
          )}
        </div>
        
        <div className="mb-4">
          <strong>Duration:</strong> {values.durationMonths || "N/A"} months
        </div>
      </section>

      {/* Composition */}
      <section className="mb-8 border-b pb-6">
        <h2 className="text-xl font-bold mb-4">3. Composition</h2>
        {values.members && values.members.length > 0 ? (
          <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Expertise</th>
                <th className="border p-2 text-left">Responsibilities</th>
                <th className="border p-2 text-left">Contact Information</th>
              </tr>
            </thead>
            <tbody>
              {values.members.map((member, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border p-2">{member.name || "N/A"}</td>
                  <td className="border p-2">{member.role || "N/A"}</td>
                  <td className="border p-2">{member.expertise || "N/A"}</td>
                  <td className="border p-2">{member.responsibilities || "N/A"}</td>
                  <td className="border p-2">
                    <div>Mobile: {member.mobile || "N/A"}</div>
                    <div>Email: {member.email || "N/A"}</div>
                    <div>Address: {member.address || "N/A"}</div>
                    {member.cvUrl && <div>CV: Available</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No members added.</p>
        )}
      </section>

      {/* Operating Procedures */}
      <section className="mb-8 border-b pb-6">
        <h2 className="text-xl font-bold mb-4">4. Operating Procedures</h2>
        {values.meetings && values.meetings.length > 0 ? (
          <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Meeting Required</th>
                <th className="border p-2 text-left">Date & Time</th>
                <th className="border p-2 text-left">Mode</th>
                <th className="border p-2 text-left">Venue</th>
              </tr>
            </thead>
            <tbody>
              {values.meetings.map((m, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border p-2">{m.meetingRequired || "N/A"}</td>
                  <td className="border p-2">{m.dateTime || "N/A"}</td>
                  <td className="border p-2">{m.mode || "N/A"}</td>
                  <td className="border p-2">{m.venue || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No meetings scheduled.</p>
        )}
      </section>

      {/* Deliverables */}
      <section className="mb-8 border-b pb-6">
        <h2 className="text-xl font-bold mb-4">5. Deliverables</h2>
        
        {/* Deliverables Table */}
        <h3 className="text-lg font-medium mb-2">Deliverables & Deadlines</h3>
        {values.deliverables && values.deliverables.length > 0 ? (
          <table className="w-full border-collapse border border-gray-400 text-sm mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Deadline</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {values.deliverables.map((d, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border p-2">{d.name || "N/A"}</td>
                  <td className="border p-2">{d.description || "N/A"}</td>
                  <td className="border p-2">
                    {d.deadline ? format(new Date(d.deadline), "PPP") : "N/A"}
                  </td>
                  <td className="border p-2">
                    <span className={`capitalize ${
                      d.status === "completed" ? "text-green-600" :
                      d.status === "in-progress" ? "text-blue-600" :
                      d.status === "delayed" ? "text-red-600" :
                      "text-gray-600"
                    }`}>
                      {d.status ? d.status.replace("-", " ") : "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mb-6">No deliverables specified.</p>
        )}
        
        {/* Milestones Table */}
        <h3 className="text-lg font-medium mb-2">Milestones</h3>
        {values.milestones && values.milestones.length > 0 ? (
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {values.milestones.map((m, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border p-2">{m.name || "N/A"}</td>
                  <td className="border p-2">{m.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No milestones specified.</p>
        )}
      </section>

      {/* Signatures */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">6. Signatures</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Proposer Signature Block */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Proposed by:</h3>
            <div className="mb-1"><strong>Name:</strong> {values.proposerName || "N/A"}</div>
            <div className="mb-1">
              <strong>Date:</strong> {values.proposerDate ? format(new Date(values.proposerDate), "PPP") : "N/A"}
            </div>
            <div className="mt-4 pt-4 border-t">
              <strong>Signature:</strong> {values.proposerSignature || "N/A"}
            </div>
          </div>
          
          {/* Reviewer Signature Block */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Reviewed and Recommended by:</h3>
            <div className="mb-1"><strong>Name:</strong> {values.reviewerName || "N/A"}</div>
            <div className="mb-1">
              <strong>Date:</strong> {values.reviewerDate ? format(new Date(values.reviewerDate), "PPP") : "N/A"}
            </div>
            <div className="mt-4 pt-4 border-t">
              <strong>Signature:</strong> {values.reviewerSignature || "N/A"}
            </div>
          </div>
          
          {/* Approver Signature Block */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Approved by:</h3>
            <div className="mb-1"><strong>Name:</strong> {values.approverName || "N/A"}</div>
            <div className="mb-1">
              <strong>Date:</strong> {values.approverDate ? format(new Date(values.approverDate), "PPP") : "N/A"}
            </div>
            <div className="mt-4 pt-4 border-t">
              <strong>Signature:</strong> {values.approverSignature || "N/A"}
            </div>
          </div>
        </div>
      </section>
      
      <div className="text-center text-sm text-gray-500 mt-10">
        <p>Printed on: {format(new Date(), "PPP")}</p>
      </div>
    </div>
  );
};
