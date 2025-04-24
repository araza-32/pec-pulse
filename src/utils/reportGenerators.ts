
export const generateCSV = (data: any[], headers: string[]) => {
  const headerRow = headers.join(',');
  const dataRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
};

export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateReportData = (reportType: string, targetWorkbodies: any[]) => {
  switch (reportType) {
    case "all":
      return targetWorkbodies.map(wb => ({
        Name: wb.name,
        Type: wb.type,
        'Created Date': new Date(wb.createdDate).toLocaleDateString(),
        'End Date': wb.endDate ? new Date(wb.endDate).toLocaleDateString() : 'N/A',
        'Total Meetings': wb.totalMeetings,
        'Meetings This Year': wb.meetingsThisYear,
        'Actions Agreed': wb.actionsAgreed,
        'Actions Completed': wb.actionsCompleted,
        'Completion Rate': wb.actionsAgreed ? `${Math.round((wb.actionsCompleted / wb.actionsAgreed) * 100)}%` : '0%'
      }));
      
    case "meetings":
      return targetWorkbodies.map(wb => ({
        'Workbody': wb.name,
        'Type': wb.type,
        'Total Meetings': wb.totalMeetings,
        'Meetings This Year': wb.meetingsThisYear
      }));
      
    case "actions":
      return targetWorkbodies.map(wb => ({
        'Workbody': wb.name,
        'Type': wb.type,
        'Actions Agreed': wb.actionsAgreed,
        'Actions Completed': wb.actionsCompleted,
        'Completion Rate': wb.actionsAgreed ? `${Math.round((wb.actionsCompleted / wb.actionsAgreed) * 100)}%` : '0%'
      }));
      
    case "composition":
      return targetWorkbodies.flatMap(wb => 
        wb.members?.map(member => ({
          'Workbody': wb.name,
          'Type': wb.type,
          'Member Name': member.name,
          'Role': member.role,
          'Email': member.email || 'N/A',
          'Phone': member.phone || 'N/A',
          'Has CV': member.hasCV ? 'Yes' : 'No'
        })) || []
      );
      
    default:
      return [];
  }
};

