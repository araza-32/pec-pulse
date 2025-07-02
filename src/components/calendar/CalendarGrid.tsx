
import React from 'react';
import { CalendarDay } from './CalendarDay';
import { ScheduledMeeting } from '@/types';

interface CalendarGridProps {
  currentDate: Date;
  meetings: ScheduledMeeting[];
  onDateClick: (date: Date) => void;
  onMeetingClick: (meeting: ScheduledMeeting) => void;
}

export function CalendarGrid({ 
  currentDate, 
  meetings, 
  onDateClick, 
  onMeetingClick 
}: CalendarGridProps) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and calculate calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    
    // Find meetings for this date
    const dayMeetings = meetings.filter(meeting => meeting.date === dateString);
    
    calendarDays.push({
      date,
      dateString,
      day,
      meetings: dayMeetings,
      isToday: date.toDateString() === today.toDateString(),
      isCurrentMonth: true
    });
  }

  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {/* Day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {calendarDays.map((dayData, index) => (
        <CalendarDay
          key={index}
          dayData={dayData}
          onDateClick={onDateClick}
          onMeetingClick={onMeetingClick}
        />
      ))}
    </div>
  );
}
