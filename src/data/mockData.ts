
import { Workbody, MeetingMinutes, User, WorkbodyType, ScheduledMeeting } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@pec.org.pk',
    role: 'admin',
  },
  {
    id: 'sec-1',
    name: 'Committee Secretary',
    email: 'committee1@pec.org.pk',
    role: 'secretary',
    workbodyId: 'committee-1',
  },
  {
    id: 'sec-2',
    name: 'Task Force Secretary',
    email: 'taskforce1@pec.org.pk',
    role: 'secretary',
    workbodyId: 'taskforce-1',
  },
  {
    id: 'chairman-1',
    name: 'Chairman PEC',
    email: 'chairman@pec.org.pk',
    role: 'chairman',
  },
];

// Mock Workbodies
export const workbodies: Workbody[] = [
  {
    id: 'committee-1',
    name: 'Education Committee',
    type: 'committee',
    totalMeetings: 24,
    meetingsThisYear: 4,
    actionsAgreed: 18,
    actionsCompleted: 12,
    members: [
      { id: 'mem-1', name: 'Dr. Ahmed Khan', role: 'Chairperson', hasCV: true },
      { id: 'mem-2', name: 'Eng. Sara Malik', role: 'Member', hasCV: true },
      { id: 'mem-3', name: 'Prof. Jawad Ali', role: 'Member', hasCV: false },
    ],
    description: 'Responsible for educational standards and accreditation policies.',
    createdDate: '2022-01-15',
    termsOfReference: 'To review and recommend policies regarding engineering education standards and accreditation processes in Pakistan.'
  },
  {
    id: 'committee-2',
    name: 'Registration Committee',
    type: 'committee',
    totalMeetings: 32,
    meetingsThisYear: 5,
    actionsAgreed: 24,
    actionsCompleted: 20,
    members: [
      { id: 'mem-4', name: 'Dr. Fatima Hussein', role: 'Chairperson', hasCV: true },
      { id: 'mem-5', name: 'Eng. Omar Sheikh', role: 'Member', hasCV: true },
      { id: 'mem-6', name: 'Prof. Asma Iqbal', role: 'Member', hasCV: true },
    ],
    description: 'Oversees engineer registration and licensing procedures.',
    createdDate: '2021-09-22',
    termsOfReference: 'To establish and maintain standards for registration of professional engineers in Pakistan and ensure compliance with international best practices.'
  },
  {
    id: 'workgroup-1',
    name: 'Digital Transformation Working Group',
    type: 'working-group',
    totalMeetings: 16,
    meetingsThisYear: 6,
    actionsAgreed: 22,
    actionsCompleted: 14,
    members: [
      { id: 'mem-7', name: 'Eng. Haris Mahmood', role: 'Coordinator', hasCV: true },
      { id: 'mem-8', name: 'Dr. Nadia Chaudhry', role: 'Member', hasCV: false },
    ],
    description: 'Focuses on implementing digital systems across PEC operations.',
    createdDate: '2023-02-18',
    termsOfReference: 'To develop and implement a comprehensive digital transformation strategy for all PEC operations and services.'
  },
  {
    id: 'taskforce-1',
    name: 'CPD Framework Task Force',
    type: 'task-force',
    totalMeetings: 8,
    meetingsThisYear: 3,
    actionsAgreed: 12,
    actionsCompleted: 5,
    members: [
      { id: 'mem-9', name: 'Prof. Kamran Ahmed', role: 'Lead', hasCV: true },
      { id: 'mem-10', name: 'Dr. Saira Khan', role: 'Member', hasCV: true },
    ],
    description: 'Developing the continuous professional development framework for engineers.',
    createdDate: '2023-06-10',
    endDate: '2025-06-10',
    termsOfReference: 'To develop a comprehensive Continuous Professional Development framework for registered engineers in Pakistan in line with international standards.'
  },
  {
    id: 'taskforce-2',
    name: 'Building Codes Review Task Force',
    type: 'task-force',
    totalMeetings: 5,
    meetingsThisYear: 3,
    actionsAgreed: 8,
    actionsCompleted: 3,
    members: [
      { id: 'mem-11', name: 'Eng. Khalid Mahmood', role: 'Lead', hasCV: true },
      { id: 'mem-12', name: 'Dr. Arif Khan', role: 'Member', hasCV: true },
    ],
    description: 'Reviewing and updating building codes for earthquake-prone areas.',
    createdDate: '2024-01-15',
    endDate: '2025-05-01',
    termsOfReference: 'To review and update building codes for earthquake-prone areas in Pakistan in light of recent seismic research and international standards.'
  }
];

// Mock Meeting Minutes
export const meetingMinutes: MeetingMinutes[] = [
  {
    id: 'minutes-1',
    workbodyId: 'committee-1',
    date: '2023-10-15',
    location: 'PEC Headquarters, Islamabad',
    agendaItems: [
      'Review of previous meeting minutes',
      'Updates on accreditation visits',
      'Discussion on new curriculum requirements'
    ],
    actionsAgreed: [
      'Complete accreditation visits to 5 universities by December',
      'Draft revised curriculum guidelines for civil engineering',
      'Prepare report on international benchmarking'
    ],
    documentUrl: '/mock-pdf/minutes1.pdf',
    uploadedAt: '2023-10-17',
    uploadedBy: 'sec-1'
  },
  {
    id: 'minutes-2',
    workbodyId: 'committee-1',
    date: '2023-12-05',
    location: 'Virtual Meeting',
    agendaItems: [
      'Status of ongoing accreditation visits',
      'Review of draft curriculum guidelines',
      'Planning for 2024 activities'
    ],
    actionsAgreed: [
      'Finalize curriculum guidelines by January 30',
      'Prepare schedule for 2024 accreditation visits',
      'Develop criteria for excellence awards'
    ],
    documentUrl: '/mock-pdf/minutes2.pdf',
    uploadedAt: '2023-12-08',
    uploadedBy: 'sec-1'
  },
  {
    id: 'minutes-3',
    workbodyId: 'workgroup-1',
    date: '2024-01-22',
    location: 'PEC Regional Office, Lahore',
    agendaItems: [
      'Status of online registration system',
      'Integration of payment gateway',
      'Mobile app development progress'
    ],
    actionsAgreed: [
      'Complete payment gateway testing by February 15',
      'Finalize mobile app design',
      'Prepare training plan for staff'
    ],
    documentUrl: '/mock-pdf/minutes3.pdf',
    uploadedAt: '2024-01-25',
    uploadedBy: 'admin-1'
  },
  {
    id: 'minutes-4',
    workbodyId: 'taskforce-1',
    date: '2024-03-18',
    location: 'PEC Headquarters, Islamabad',
    agendaItems: [
      'Review of CPD point allocation system',
      'Discussion on online CPD tracking platform',
      'International benchmarking results'
    ],
    actionsAgreed: [
      'Finalize CPD point allocation categories',
      'Prepare specifications for online tracking system',
      'Draft CPD handbook for engineers'
    ],
    documentUrl: '/mock-pdf/minutes4.pdf',
    uploadedAt: '2024-03-20',
    uploadedBy: 'sec-2'
  }
];

// Mock Scheduled Meetings
export const initialMeetings: ScheduledMeeting[] = [
  {
    id: "meeting-1",
    workbodyId: "committee-1",
    workbodyName: "Education Committee",
    date: "2025-05-10",
    time: "10:00",
    location: "PEC Headquarters, Islamabad",
    agendaItems: [
      "Review of Accreditation Process",
      "Curriculum Standardization",
      "New Engineering Programs Approval",
    ],
  },
  {
    id: "meeting-2",
    workbodyId: "workgroup-1",
    workbodyName: "Digital Transformation Working Group",
    date: "2025-04-22",
    time: "14:30",
    location: "Virtual Meeting",
    agendaItems: [
      "Online Portal Progress Update",
      "Mobile App Development Status",
      "Digital Verification System Implementation",
    ],
  },
  {
    id: "meeting-3",
    workbodyId: "taskforce-1",
    workbodyName: "CPD Framework Task Force",
    date: "2025-04-28",
    time: "11:00",
    location: "PEC Regional Office, Karachi",
    agendaItems: [
      "CPD Points Framework Review",
      "Online CPD Tracking System Demo",
      "CPD Requirements for Specialized Fields",
    ],
  }
];

// Helper function to get workbody statistics
export const getWorkbodyStats = () => {
  const committees = workbodies.filter(w => w.type === 'committee').length;
  const workingGroups = workbodies.filter(w => w.type === 'working-group').length;
  const taskForces = workbodies.filter(w => w.type === 'task-force').length;
  
  const totalMeetings = workbodies.reduce((sum, w) => sum + w.totalMeetings, 0);
  const meetingsThisYear = workbodies.reduce((sum, w) => sum + w.meetingsThisYear, 0);
  
  const totalActions = workbodies.reduce((sum, w) => sum + w.actionsAgreed, 0);
  const completedActions = workbodies.reduce((sum, w) => sum + w.actionsCompleted, 0);
  const completionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  return {
    committees,
    workingGroups,
    taskForces,
    totalWorkbodies: committees + workingGroups + taskForces,
    totalMeetings,
    meetingsThisYear,
    totalActions,
    completedActions,
    completionRate
  };
};
