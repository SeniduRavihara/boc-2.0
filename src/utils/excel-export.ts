import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Task, Meeting, TeamMember } from '@/types';

export const exportTasksToExcel = (tasks: Task[]) => {
  // Map tasks to a format suitable for Excel
  const excelData = tasks.map(task => ({
    'Task Name': task.title,
    'Assignees': task.assignees ? task.assignees.join(', ') : 'None',
    'Status': task.status,
    'Priority': task.priority,
    'Due Date': task.dueDate,
    'Created At': task.createdAt ? format(task.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss') : 'N/A'
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  // Define column widths
  const wscols = [
    { wch: 30 }, // Task Name
    { wch: 20 }, // Assignee
    { wch: 15 }, // Status
    { wch: 15 }, // Priority
    { wch: 15 }, // Due Date
    { wch: 20 }, // Created At
  ];
  worksheet['!cols'] = wscols;

  // Generate filename with timestamp
  const fileName = `BOC_Tasks_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;

  // Write file
  XLSX.writeFile(workbook, fileName);
};

export const exportAttendanceToExcel = (meetings: Meeting[], teamMembers: TeamMember[]) => {
  // Create a matrix: Rows = Team Members, Columns = Meetings
  interface AttendanceRow {
    [key: string]: string;
  }
  const excelData = teamMembers.map(member => {
    const row: AttendanceRow = {
      'Member Name': member.name,
    };

    // Add a column for each meeting
    meetings.forEach(meeting => {
      const isPresent = meeting.presentMemberIds.includes(member.id!);
      const header = `${meeting.title} (${meeting.date})`;
      row[header] = isPresent ? 'PRESENT' : 'ABSENT';
    });

    return row;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

  // Dynamic column widths
  const wscols = [{ wch: 25 }]; // Member Name
  meetings.forEach(() => {
    wscols.push({ wch: 25 });
  });
  worksheet['!cols'] = wscols;

  // Generate filename with timestamp
  const fileName = `BOC_Attendance_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;

  // Write file
  XLSX.writeFile(workbook, fileName);
};
