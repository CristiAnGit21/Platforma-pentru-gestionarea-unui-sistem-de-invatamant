import type { CalendarEvent, EventType } from './calendarTypes';
import { DAYS_RO, EVENT_CFG, fmtDate, getDaysInMonth, getFirstDayOfWeek } from './calendarTypes';

interface MonthGridProps {
    cYear: number;
    cMonth: number;
    todayStr: string;
    selectedDate: string | null;
    filteredEvents: CalendarEvent[];
    onSelectDay: (dateStr: string) => void;
}

const MonthGrid = ({ cYear, cMonth, todayStr, selectedDate, filteredEvents, onSelectDay }: MonthGridProps) => {
    const daysInMonth = getDaysInMonth(cYear, cMonth);
    const firstDay = getFirstDayOfWeek(cYear, cMonth);
    const eventsFor = (d: string) => filteredEvents.filter(e => e.date === d);

    return (
        <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
                {DAYS_RO.map(d => (
                    <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="aspect-square" />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const ds = fmtDate(cYear, cMonth, day);
                    const evts = eventsFor(ds);
                    const isT = ds === todayStr;
                    const isS = ds === selectedDate;
                    return (
                        <button key={day} onClick={() => onSelectDay(ds)}
                            className={`aspect-square rounded-xl p-1.5 flex flex-col items-center justify-start transition-all border ${
                                isS ? 'bg-purple-50 border-purple-300 shadow-sm'
                                    : isT ? 'bg-purple-600 border-purple-600'
                                        : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                            }`}
                        >
                            <span className={`text-sm font-bold ${isT ? 'text-white' : isS ? 'text-purple-700' : 'text-gray-700'}`}>{day}</span>
                            {evts.length > 0 && (
                                <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                                    {evts.slice(0, 3).map(ev => (
                                        <span key={ev.id} className={`w-1.5 h-1.5 rounded-full ${isT ? 'bg-white/80' : EVENT_CFG[ev.type].dot}`} />
                                    ))}
                                    {evts.length > 3 && <span className={`text-[8px] font-bold ${isT ? 'text-white/70' : 'text-gray-400'}`}>+{evts.length - 3}</span>}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthGrid;
