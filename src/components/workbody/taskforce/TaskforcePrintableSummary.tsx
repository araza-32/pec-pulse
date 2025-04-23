
import { UseFormReturn } from "react-hook-form";
import { TaskforceFormValues } from "@/types/taskforce";

// Show a summary for printing: all form values.
export const TaskforcePrintableSummary = ({ form }: { form: UseFormReturn<TaskforceFormValues> }) => {
  const values = form.getValues();

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-4">Taskforce Submission Summary</h1>
      
      {/* Overview Section */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Overview</h2>
        <div><b>Taskforce Name:</b> {values.name}</div>
        <div><b>Proposed By:</b> {values.proposedBy}</div>
        <div><b>Purpose:</b> {values.purpose}</div>
      </section>

      {/* Scope & ToRs */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Scope & ToRs</h2>
        <div><b>Alignment:</b> {values.alignment}</div>
        <div><b>Expected Outcomes:</b>
          <ul className="list-disc list-inside">
            {values.expectedOutcomes?.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
        <div><b>Mandates:</b>
          <ul className="list-disc list-inside">
            {values.mandates?.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
        <div><b>Duration (Months):</b> {values.durationMonths}</div>
      </section>

      {/* Composition */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Composition</h2>
        {values.members && values.members.length > 0 ? (
          <table className="w-full border border-gray-400 text-sm mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Role</th>
                <th className="border px-2 py-1">Expertise</th>
                <th className="border px-2 py-1">Responsibilities</th>
                <th className="border px-2 py-1">Mobile</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Address</th>
                <th className="border px-2 py-1">CV (PDF)</th>
              </tr>
            </thead>
            <tbody>
              {values.members.map((member, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{member.name}</td>
                  <td className="border px-2 py-1">{member.role}</td>
                  <td className="border px-2 py-1">{member.expertise}</td>
                  <td className="border px-2 py-1">{member.responsibilities}</td>
                  <td className="border px-2 py-1">{member.mobile}</td>
                  <td className="border px-2 py-1">{member.email}</td>
                  <td className="border px-2 py-1">{member.address}</td>
                  <td className="border px-2 py-1">
                    {member.cvUrl ? (
                      <a href={member.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">CV</a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span>No members added.</span>
        )}
      </section>

      {/* Procedures */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Operating Procedures</h2>
        {values.meetings && values.meetings.length > 0 ? (
          <table className="w-full border border-gray-400 text-sm mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">Meeting Required</th>
                <th className="border px-2 py-1">Date & Time</th>
                <th className="border px-2 py-1">Mode</th>
                <th className="border px-2 py-1">Venue</th>
              </tr>
            </thead>
            <tbody>
              {values.meetings.map((m, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{m.meetingRequired}</td>
                  <td className="border px-2 py-1">{m.dateTime}</td>
                  <td className="border px-2 py-1">{m.mode}</td>
                  <td className="border px-2 py-1">{m.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : "N/A"}
      </section>

      {/* Deliverables */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Deliverables</h2>
        {values.deliverables && values.deliverables.length > 0 ? (
          <table className="w-full border border-gray-400 text-sm mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Deadline</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {values.deliverables.map((d, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{d.name}</td>
                  <td className="border px-2 py-1">{d.description}</td>
                  <td className="border px-2 py-1">{d.deadline}</td>
                  <td className="border px-2 py-1">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : "N/A"}
      </section>

      {/* Signatures */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Signatures</h2>
        <div className="mb-2"><b>Proposer:</b> {values.proposerName}, Date: {values.proposerDate}, Signature: {values.proposerSignature}</div>
        <div className="mb-2"><b>Reviewer:</b> {values.reviewerName}, Date: {values.reviewerDate}, Signature: {values.reviewerSignature}</div>
        <div className="mb-2"><b>Approver:</b> {values.approverName}, Date: {values.approverDate}, Signature: {values.approverSignature}</div>
      </section>
    </div>
  );
};
