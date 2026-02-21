import { Star, StarOff, Filter } from 'lucide-react';
import type { CalendarEvent, EventType } from './calendarTypes';
import { EVENT_CFG } from './calendarTypes';

interface CalendarSidebarProps {
    myEvents: CalendarEvent[];
    savedEvents: Set<string>;
    onToggleSave: (id: string) => void;
    onNavigateToEvent: (date: string) => void;
}

const CalendarSidebar = ({ myEvents, savedEvents, onToggleSave, onNavigateToEvent }: CalendarSidebarProps) => {
    const sorted = [...myEvents].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star size={16} className="text-amber-500" />
                    <h3 className="font-bold text-gray-800 text-sm">Calendarul Meu</h3>
                </div>
                <span className="text-xs font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{myEvents.length}</span>
            </div>

            {/* Events list */}
            <div className="p-4 max-h-[500px] overflow-y-auto">
                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-gray-400">
                        <StarOff size={32} className="mb-2 text-gray-200" />
                        <p className="text-xs font-medium text-center">Niciun eveniment salvat.<br />Apasă ★ pe un eveniment pentru a-l adăuga.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sorted.map(ev => {
                            const c = EVENT_CFG[ev.type];
                            return (
                                <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                                    onClick={() => onNavigateToEvent(ev.date)}
                                >
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-700 truncate">{ev.title}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            {new Date(ev.date + 'T00:00:00').toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })} · {ev.startTime}
                                        </p>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); onToggleSave(ev.id); }}
                                        className="text-amber-400 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    ><Star size={14} fill="currentColor" /></button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                    <Filter size={12} className="text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Legendă</p>
                </div>
                <div className="flex flex-col gap-1.5">
                    {(Object.entries(EVENT_CFG) as [EventType, typeof EVENT_CFG.examen][]).map(([, c]) => (
                        <div key={c.label} className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                            <span className="text-xs text-gray-500 font-medium">{c.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarSidebar;
