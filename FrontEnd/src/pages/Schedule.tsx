import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, List } from 'lucide-react';

import type { EventType } from '../components/calendar/calendarTypes';
import { EVENT_CFG, MONTHS_RO, fmtDate } from '../components/calendar/calendarTypes';
import MOCK_EVENTS from '../components/calendar/calendarData';
import MonthGrid from '../components/calendar/MonthGrid';
import DayView from '../components/calendar/DayView';
import CalendarSidebar from '../components/calendar/CalendarSidebar';

const Orar = () => {
    const today = new Date();

    const [cYear, setCYear] = useState(today.getFullYear());
    const [cMonth, setCMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [calView, setCalView] = useState<'month' | 'day'>('month');
    const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(['examen', 'curs', 'eveniment']));
    const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());

    const todayStr = fmtDate(today.getFullYear(), today.getMonth(), today.getDate());

    const goToPrev = () => { if (cMonth === 0) { setCMonth(11); setCYear(y => y - 1); } else setCMonth(m => m - 1); };
    const goToNext = () => { if (cMonth === 11) { setCMonth(0); setCYear(y => y + 1); } else setCMonth(m => m + 1); };
    const goToToday = () => { setCYear(today.getFullYear()); setCMonth(today.getMonth()); setSelectedDate(todayStr); };

    const toggleFilter = (t: EventType) => setActiveFilters(p => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; });
    const toggleSave = (id: string) => setSavedEvents(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const filtered = useMemo(() => MOCK_EVENTS.filter(e => activeFilters.has(e.type)), [activeFilters]);
    const dayEvts = selectedDate ? filtered.filter(e => e.date === selectedDate) : [];
    const myEvents = MOCK_EVENTS.filter(e => savedEvents.has(e.id));

    const handleSelectDay = (dateStr: string) => { setSelectedDate(dateStr); setCalView('day'); };
    const handleNavigateToEvent = (date: string) => { setSelectedDate(date); setCalView('day'); };

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Calendar Universitar</h1>
                <p className="text-gray-500 font-medium">Vizualizează examenele, cursurile și evenimentele universității.</p>
            </header>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {(Object.entries(EVENT_CFG) as [EventType, typeof EVENT_CFG.examen][]).map(([type, cfg]) => {
                    const on = activeFilters.has(type);
                    return (
                        <button key={type} onClick={() => toggleFilter(type)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                                on ? `${cfg.bg} ${cfg.text} ${cfg.border}` : 'bg-gray-50 text-gray-400 border-gray-100'
                            }`}
                        >
                            <span className={`w-2.5 h-2.5 rounded-full ${on ? cfg.dot : 'bg-gray-300'}`} />
                            {cfg.label}
                        </button>
                    );
                })}
                <button onClick={goToToday} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm">
                    Astăzi
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Calendar Area */}
                <div className="xl:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Month navigation + view toggle */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <button onClick={goToPrev} className="p-2 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"><ChevronLeft size={20} /></button>
                                <h2 className="text-lg font-bold text-gray-800 min-w-[200px] text-center">{MONTHS_RO[cMonth]} {cYear}</h2>
                                <button onClick={goToNext} className="p-2 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"><ChevronRight size={20} /></button>
                            </div>
                            <div className="flex bg-gray-50 rounded-xl p-1">
                                <button onClick={() => { setCalView('month'); setSelectedDate(null); }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        calView === 'month' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                ><CalendarDays size={14} /> Lună</button>
                                <button onClick={() => { setCalView('day'); if (!selectedDate) setSelectedDate(todayStr); }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        calView === 'day' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                ><List size={14} /> Zi</button>
                            </div>
                        </div>

                        {/* Views */}
                        {calView === 'month' && (
                            <MonthGrid
                                cYear={cYear}
                                cMonth={cMonth}
                                todayStr={todayStr}
                                selectedDate={selectedDate}
                                filteredEvents={filtered}
                                onSelectDay={handleSelectDay}
                            />
                        )}
                        {calView === 'day' && selectedDate && (
                            <DayView
                                selectedDate={selectedDate}
                                events={dayEvts}
                                savedEvents={savedEvents}
                                onToggleSave={toggleSave}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-1">
                    <CalendarSidebar
                        myEvents={myEvents}
                        savedEvents={savedEvents}
                        onToggleSave={toggleSave}
                        onNavigateToEvent={handleNavigateToEvent}
                    />
                </div>
            </div>
        </div>
    );
};

export default Orar;