import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns';
import { toPng } from 'html-to-image';
// Import events directly
import events from './events.json';

interface Event {
  date: string;
  department: string;
  event: string;
}

interface Department {
  [key: string]: string;
}

const CalendarWithBeautifiedStyles: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);

  // Department color gradient mapping
  const departments: Department = {
    IT: 'linear-gradient(135deg, #FFC1C1, #FFA3A3)',
    HR: 'linear-gradient(135deg, #FFDEA5, #FFD685)',
    Finance: 'linear-gradient(135deg, #D6D6F5, #BEBEE8)',
    Product: 'linear-gradient(135deg, #A2D9FF, #81C7F2)',
    Communications: 'linear-gradient(135deg, #FAF3DD, #F5E7A7)',
    CaseManagement: 'linear-gradient(135deg, #B8F5D3, #8FEFC1)',
    BDD: 'linear-gradient(135deg, #FFF6A3, #FDE780)',
    Networking: 'linear-gradient(135deg, #C9B6E4, #A889D3)',
    TAP: 'linear-gradient(135deg, #FFC9C7, #FFA9A8)',
    Hijri: 'linear-gradient(135deg, #F7DC6F, #EBC65E)',
    OperationsCoordination: 'linear-gradient(135deg, #DAF5FA, #AEE9F2)',
    TR_Website: 'linear-gradient(135deg, #EFD6EC, #D4A3D0)',
    PMO: 'linear-gradient(135deg, #D4F1F4, #B0E0E3)',
  };

  const weekdays = [
    'Sun يوم الأحد',
    'Mon يوم الإثنين',
    'Tue يوم الثلاثاء',
    'Wed يوم الأربعاء',
    'Thu يوم الخميس',
    'Fri يوم الجمعة',
    'Sat يوم السبت',
  ];

  useEffect(() => {
    // Filter out any empty events
    setCalendarEvents(events.filter((event: Event) => event.date));
  }, []);

  // Get all the days of the current month in the calendar
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 }),
  });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Get events for a specific day
  const getEventsForDay = (day: Date): Event[] => {
    const dayKey = format(day, 'yyyy-MM-dd');
    return calendarEvents.filter((event) => event.date === dayKey);
  };

  const exportToImage = () => {
    const calendarElement = document.getElementById('calendar');
    if (!calendarElement) return;

    toPng(calendarElement, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'calendar.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => console.error('Failed to export image:', error));
  };

  return (
    <div id="calendar">
      <div className="calendar-container">
        <header className="calendar-header">
          <button className="nav-btn" onClick={handlePrevMonth}>
            &lt;
          </button>
          <h2 className="month-title">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button className="nav-btn" onClick={handleNextMonth}>
            &gt;
          </button>
        </header>

        <div className="calendar-grid weekdays">
          {weekdays.map((weekday) => {
            const firstSpaceIndex = weekday.indexOf(' ');
            const english = weekday.substring(0, firstSpaceIndex);
            const arabic = weekday.substring(firstSpaceIndex + 1);
            return (
              <div key={weekday} className="weekday">
                <div className="arabic">{arabic}</div>
                <div className="english">{english}</div>
              </div>
            );
          })}
        </div>

        <div className="calendar-grid days">
          {daysInMonth.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isOutsideMonth =
              format(day, 'MM') !== format(currentMonth, 'MM');

            return (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className={`day ${isOutsideMonth ? 'outside' : ''} ${
                  isToday(day) ? 'today' : ''
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <span>{format(day, 'd')}</span>
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className={`event department ${event.department}`}
                  >
                    {event.event}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="selected-date-display">
            <h3>Selected Date: {format(selectedDate, 'MMMM dd, yyyy')}</h3>
          </div>
        )}

        <div className="department-legend">
          <h4>Department Legend:</h4>
          <ul className="department-list">
            {Object.entries(departments).map(([department, color]) => (
              <li key={department}>
                <span
                  className={`legend-dot ${department}`}
                  style={{ background: color }}
                ></span>
                {department}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="actions">
        <button className="nav-btn" onClick={exportToImage}>
          Export to Image
        </button>
      </div>
    </div>
  );
};

export default CalendarWithBeautifiedStyles;
