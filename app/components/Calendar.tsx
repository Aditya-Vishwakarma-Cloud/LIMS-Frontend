"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

    const days = [];
    
    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === 2025 && month === 0 && day === 1; // Highlight Jan 1, 2025
      days.push({
        day,
        isCurrentMonth: true,
        isToday
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  // Sample events for demonstration
  const getEventForDay = (day: number) => {
    const events: { [key: number]: { type: string; label: string; color: string } } = {
      1: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      2: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      3: { type: 'giveaway', label: 'Giveaway', color: 'text-orange-600' },
      7: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      9: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      10: { type: 'giveaway', label: 'Giveaway', color: 'text-orange-600' },
      11: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      14: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      17: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      18: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      19: { type: 'giveaway', label: 'Giveaway', color: 'text-orange-600' },
      23: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      25: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      26: { type: 'giveaway', label: 'Giveaway', color: 'text-orange-600' },
      27: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' },
      31: { type: 'quotes', label: 'Quotes', color: 'text-blue-600' }
    };
    return events[day];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-xs font-medium text-gray-500 text-center p-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const event = day.isCurrentMonth ? getEventForDay(day.day) : null;

              return (
                <div key={index} className="h-16 p-1 relative border border-gray-50 rounded">
                  <div
                    className={`text-sm ${
                      day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    } ${day.isToday ? "font-bold" : ""}`}
                  >
                    {day.day}
                  </div>
                  {event && (
                    <div className={`text-xs ${event.color} mt-1 truncate`} title={event.label}>
                      {event.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
