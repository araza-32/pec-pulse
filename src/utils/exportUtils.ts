
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
// Fix the import to use the correct typing
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportData {
  workbodies: any[];
  meetings: any[];
  stats: {
    totalWorkbodies: number;
    activeMeetings: number;
    completionRate: number;
    upcomingDeadlines: number;
  };
}

export const exportToExcel = (data: ExportData, fileName: string) => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheets for each data type
  const statsArray = [
    { Metric: 'Total Workbodies', Value: data.stats.totalWorkbodies },
    { Metric: 'Active Meetings', Value: data.stats.activeMeetings },
    { Metric: 'Completion Rate', Value: `${data.stats.completionRate}%` },
    { Metric: 'Upcoming Deadlines', Value: data.stats.upcomingDeadlines }
  ];
  
  const statsSheet = XLSX.utils.json_to_sheet(statsArray);
  const workbodiesSheet = XLSX.utils.json_to_sheet(data.workbodies);
  const meetingsSheet = XLSX.utils.json_to_sheet(data.meetings);
  
  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, statsSheet, 'Dashboard Stats');
  XLSX.utils.book_append_sheet(wb, workbodiesSheet, 'Workbodies');
  XLSX.utils.book_append_sheet(wb, meetingsSheet, 'Meetings');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const excelBlob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
  
  // Save file
  saveAs(excelBlob, `${fileName}.xlsx`);
};

export const exportToPDF = (data: ExportData, fileName: string) => {
  const doc = new jsPDF();
  
  // Add title with PEC branding
  doc.setFillColor(0, 122, 51); // PEC Green
  doc.rect(0, 0, 210, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('PEC Pulse - Chairman\'s Executive Dashboard', 105, 10, { align: 'center' });
  
  // Add date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 20, { align: 'center' });
  
  // Add summary stats
  doc.setFontSize(12);
  doc.text('Dashboard Summary', 14, 30);
  
  (doc as any).autoTable({
    startY: 35,
    head: [['Metric', 'Value']],
    body: [
      ['Total Workbodies', data.stats.totalWorkbodies.toString()],
      ['Active Meetings', data.stats.activeMeetings.toString()],
      ['Completion Rate', `${data.stats.completionRate}%`],
      ['Upcoming Deadlines', data.stats.upcomingDeadlines.toString()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 122, 51] }
  });
  
  // Add workbodies table (top 10)
  doc.setFontSize(12);
  doc.text('Top Workbodies', 14, (doc as any).lastAutoTable.finalY + 15);
  
  const workbodyData = data.workbodies
    .slice(0, 10)
    .map(wb => [
      wb.name, 
      wb.type, 
      wb.totalMeetings?.toString() || '0',
      `${wb.actionsCompleted || 0}/${wb.actionsAgreed || 0}`
    ]);
  
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Name', 'Type', 'Meetings', 'Actions (Done/Total)']],
    body: workbodyData,
    theme: 'grid',
    headStyles: { fillColor: [0, 122, 51] }
  });
  
  // Add meetings table (upcoming 10)
  doc.setFontSize(12);
  doc.text('Upcoming Meetings', 14, (doc as any).lastAutoTable.finalY + 15);
  
  const meetingData = data.meetings
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10)
    .map(m => [
      new Date(m.date).toLocaleDateString(), 
      m.workbodyName,
      m.time,
      m.location
    ]);
  
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Date', 'Workbody', 'Time', 'Location']],
    body: meetingData,
    theme: 'grid',
    headStyles: { fillColor: [0, 122, 51] }
  });
  
  // Save file
  doc.save(`${fileName}.pdf`);
};
