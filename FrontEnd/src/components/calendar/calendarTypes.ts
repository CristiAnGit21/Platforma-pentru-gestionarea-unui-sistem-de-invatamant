import { BookOpen, GraduationCap, PartyPopper } from 'lucide-react';

// ══════════════════  Types  ══════════════════
export type EventType = 'examen' | 'curs' | 'eveniment';

export interface CalendarEvent {
    id: string;
    title: string;
    type: EventType;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    professor?: string;
    description?: string;
}

// ══════════════════  Config  ══════════════════
export const EVENT_CFG: Record<EventType, { label: string; dot: string; bg: string; text: string; border: string; icon: typeof BookOpen }> = {
    examen:    { label: 'Examene',    dot: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    icon: GraduationCap },
    curs:      { label: 'Cursuri',    dot: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: BookOpen },
    eveniment: { label: 'Evenimente', dot: 'bg-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  icon: PartyPopper },
};

export const DAYS_RO = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];
export const MONTHS_RO = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
];

// ══════════════════  Helpers  ══════════════════
export const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
export const getFirstDayOfWeek = (y: number, m: number) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };
export const fmtDate = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export const toICS = (ds: string, t: string) => ds.replace(/-/g, '') + 'T' + t.replace(/:/g, '') + '00';

export const exportEvent = (ev: CalendarEvent) => {
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
        `DTSTART:${toICS(ev.date,ev.startTime)}`,`DTEND:${toICS(ev.date,ev.endTime)}`,
        `SUMMARY:${ev.title}`,`LOCATION:${ev.location}`,
        ev.description ? `DESCRIPTION:${ev.description}` : '',
        'END:VEVENT','END:VCALENDAR'].filter(Boolean).join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `${ev.title.replace(/\s+/g, '_')}.ics`; a.click();
};
