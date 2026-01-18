import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import type { Event } from '@/types';
import { useAppStore } from '@/store';

interface EventCalendarProps {
  events: Event[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Conference': '#8b5cf6',
  'Exhibition': '#ec4899',
  'Training': '#14b8a6',
  'Workshop': '#f97316',
  'Networking': '#06b6d4',
  'Seminar': '#a855f7',
  'Other': '#6b7280',
};

function parseEventDate(dateMonth: string): Date | null {
  if (!dateMonth) return null;

  // Try to parse various date formats
  const monthMap: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, september: 8, sept: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  };

  const lower = dateMonth.toLowerCase().trim();

  // Try "Month YYYY" format
  for (const [key, monthIndex] of Object.entries(monthMap)) {
    if (lower.includes(key)) {
      const yearMatch = dateMonth.match(/20\d{2}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 2026;
      return new Date(year, monthIndex, 15); // Middle of the month
    }
  }

  // Try standard date format
  const date = new Date(dateMonth);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return null;
}

export function EventCalendar({ events }: EventCalendarProps) {
  const { openEventModal } = useAppStore();

  const calendarEvents = events
    .map((event) => {
      const date = parseEventDate(event.dateMonth);
      if (!date) return null;

      return {
        id: event.id,
        title: event.eventName,
        start: date,
        backgroundColor: CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Other'],
        borderColor: 'transparent',
        extendedProps: {
          event,
        },
      };
    })
    .filter(Boolean);

  const handleEventClick = (info: any) => {
    const event = info.event.extendedProps.event as Event;
    openEventModal(event);
  };

  return (
    <div className="glass rounded-xl p-4 sm:p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listMonth',
        }}
        events={calendarEvents as any[]}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={3}
        eventDisplay="block"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
      />
    </div>
  );
}
