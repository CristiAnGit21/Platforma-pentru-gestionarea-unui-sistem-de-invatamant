import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, List, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';

import type { CalendarEvent, EventType } from '../components/calendar/calendarTypes';
import { EVENT_CFG, MONTHS_RO, fmtDate } from '../components/calendar/calendarTypes';
import MonthGrid from '../components/calendar/MonthGrid';
import DayView from '../components/calendar/DayView';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import { useApi } from '../providers/AxiosProvider';
import { getAuthSession } from '../auth/storage';

const EMPTY_FORM = { title: '', type: 'curs' as EventType, date: '', startTime: '', endTime: '', location: '', description: '' };

const Orar = () => {
    const api = useApi();
    const today = new Date();
    const session = getAuthSession();
    const canCreate = session?.user.role === 'ADMIN' || session?.user.role === 'PROFESOR';

    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [cYear, setCYear] = useState(today.getFullYear());
    const [cMonth, setCMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [calView, setCalView] = useState<'month' | 'day'>('month');
    const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(['examen', 'curs', 'eveniment']));
    const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const todayStr = fmtDate(today.getFullYear(), today.getMonth(), today.getDate());

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const loadEvents = () => {
        api.get('/event').then(res => {
            const raw: Array<{
                id: string; title: string; type: EventType;
                date: string; startTime: string; endTime: string;
                location: string; professorName?: string; description?: string;
            }> = res.data?.data ?? res.data ?? [];
            const mapped: CalendarEvent[] = raw.map(e => ({
                ...e,
                date: e.date.split('T')[0],
                professor: e.professorName,
            }));
            setEvents(mapped);
        }).catch(err => console.error('Eroare la încărcarea evenimentelor:', err));
    };

    useEffect(() => { loadEvents(); }, [api]);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/event/${id}`);
            showToast('success', 'Evenimentul a fost șters.');
            loadEvents();
        } catch {
            showToast('error', 'Eroare la ștergerea evenimentului.');
        }
    };

    const handleCreate = async () => {
        if (!form.title.trim() || !form.date || !form.startTime || !form.endTime || !form.location.trim()) {
            showToast('error', 'Completați toate câmpurile obligatorii.');
            return;
        }
        setSaving(true);
        try {
            await api.post('/event', {
                title: form.title,
                type: form.type === 'examen' ? 0 : form.type === 'curs' ? 1 : 2,
                date: new Date(form.date).toISOString(),
                startTime: form.startTime,
                endTime: form.endTime,
                location: form.location,
                professorName: session?.user.name,
                description: form.description || undefined,
            });
            showToast('success', 'Evenimentul a fost adăugat cu succes.');
            setShowForm(false);
            setForm(EMPTY_FORM);
            loadEvents();
        } catch {
            showToast('error', 'Eroare la salvarea evenimentului. Încercați din nou.');
        } finally {
            setSaving(false);
        }
    };

    const goToPrev = () => { if (cMonth === 0) { setCMonth(11); setCYear(y => y - 1); } else setCMonth(m => m - 1); };
    const goToNext = () => { if (cMonth === 11) { setCMonth(0); setCYear(y => y + 1); } else setCMonth(m => m + 1); };
    const goToToday = () => { setCYear(today.getFullYear()); setCMonth(today.getMonth()); setSelectedDate(todayStr); };

    const toggleFilter = (t: EventType) => setActiveFilters(p => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; });
    const toggleSave = (id: string) => setSavedEvents(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const filtered = useMemo(() => events.filter(e => activeFilters.has(e.type)), [events, activeFilters]);
    const dayEvts = selectedDate ? filtered.filter(e => e.date === selectedDate) : [];
    const myEvents = events.filter(e => savedEvents.has(e.id));

    const handleSelectDay = (dateStr: string) => { setSelectedDate(dateStr); setCalView('day'); };
    const handleNavigateToEvent = (date: string) => { setSelectedDate(date); setCalView('day'); };

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
                    toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            {/* Create event modal */}
            {showForm && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-800">Adaugă eveniment</h2>
                            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Titlu *</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none"
                                    placeholder="ex. Curs Algoritmi" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tip *</label>
                                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-300 outline-none bg-white">
                                        <option value="curs">Curs</option>
                                        <option value="examen">Examen</option>
                                        <option value="eveniment">Eveniment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Data *</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Ora început *</label>
                                    <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Ora sfârșit *</label>
                                    <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Locație *</label>
                                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none"
                                    placeholder="ex. Sala A101" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Descriere</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none resize-none"
                                    placeholder="Opțional" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                                Anulează
                            </button>
                            <button onClick={handleCreate} disabled={saving}
                                className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors">
                                {saving ? 'Se salvează...' : 'Adaugă'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Calendar Universitar</h1>
                        <p className="text-gray-500 font-medium">Vizualizează examenele, cursurile și evenimentele universității.</p>
                    </div>
                    {canCreate && (
                        <button onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm">
                            <Plus size={16} /> Adaugă eveniment
                        </button>
                    )}
                </div>
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
                                onDelete={session?.user.role === 'ADMIN' ? handleDelete : undefined}
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