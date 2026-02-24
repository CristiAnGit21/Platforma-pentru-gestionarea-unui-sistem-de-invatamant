import { CalendarDays, Clock, MapPin, User, Star, StarOff, Download } from 'lucide-react';
import type { CalendarEvent } from './calendarTypes';
import { EVENT_CFG, exportEvent } from './calendarTypes';

interface DayViewProps {
    selectedDate: string;
    events: CalendarEvent[];
    savedEvents: Set<string>;
    onToggleSave: (id: string) => void;
}

const DayView = ({ selectedDate, events, savedEvents, onToggleSave }: DayViewProps) => {
    const sorted = [...events].sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="p-5">
            <div className="flex items-center gap-2 mb-5">
                <CalendarDays size={18} className="text-purple-500" />
                <h3 className="font-bold text-gray-800">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
            </div>

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <CalendarDays size={48} className="mb-3 text-gray-200" />
                    <p className="font-medium text-sm">Niciun eveniment în această zi</p>
                    <p className="text-xs mt-1">Selectează altă zi din calendar.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sorted.map(ev => {
                        const c = EVENT_CFG[ev.type];
                        const Ic = c.icon;
                        const sav = savedEvents.has(ev.id);
                        return (
                            <div key={ev.id} className={`flex items-start gap-4 p-4 rounded-2xl border ${c.border} ${c.bg} transition-all hover:shadow-sm`}>
                                <div className={`shrink-0 p-2.5 rounded-xl ${c.bg} ${c.text}`}><Ic size={20} /></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className={`font-bold text-sm ${c.text}`}>{ev.title}</h4>
                                            {ev.description && <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>}
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={() => onToggleSave(ev.id)}
                                                className={`p-1.5 rounded-lg transition-colors ${sav ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'}`}
                                                title={sav ? 'Elimină din calendar' : 'Adaugă în calendarul meu'}
                                            >{sav ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}</button>
                                            <button onClick={() => exportEvent(ev)}
                                                className="p-1.5 rounded-lg text-gray-300 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                                                title="Exportă ca fișier ICS"
                                            ><Download size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium"><Clock size={12} /> {ev.startTime} – {ev.endTime}</span>
                                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium"><MapPin size={12} /> {ev.location}</span>
                                        {ev.professor && <span className="flex items-center gap-1 text-xs text-gray-500 font-medium"><User size={12} /> {ev.professor}</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DayView;
