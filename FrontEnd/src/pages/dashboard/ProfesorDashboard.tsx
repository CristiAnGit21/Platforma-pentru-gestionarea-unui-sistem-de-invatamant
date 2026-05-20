import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Bell, Users, MessageCircleWarning, ChevronRight,
    Clock, Calendar, Inbox, MapPin, Loader2
} from 'lucide-react';
import { getAuthSession } from '../../auth/storage';
import { useApi } from '../../providers/AxiosProvider';

type EventItem = {
    id: string;
    title: string;
    type: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
};

const EVENT_TYPE_LABEL: Record<string, string> = {
    examen: 'Examen',
    curs: 'Curs',
    eveniment: 'Eveniment',
};

const EVENT_TYPE_COLOR: Record<string, string> = {
    examen: 'bg-red-50 text-red-600',
    curs: 'bg-blue-50 text-blue-600',
    eveniment: 'bg-purple-50 text-purple-600',
};

const QUICK_CARDS = [
    { title: 'Catalog', path: '/profesor/catalog', icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Notificări', path: '/profesor/notificari', icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Studenți', path: '/profesor/studenti', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Raportează', path: '/profesor/raporteaza', icon: MessageCircleWarning, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const fmtDay = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' });

const ProfesorDashboard = () => {
    const navigate = useNavigate();
    const api = useApi();
    const session = getAuthSession();
    const professorName = session?.user.name ?? 'Profesor';
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dateStr = today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const [events, setEvents] = useState<EventItem[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        api.get('/event')
            .then(res => {
                const raw: EventItem[] = res.data?.data ?? res.data ?? [];
                setEvents(
                    Array.isArray(raw)
                        ? raw.map(e => ({ ...e, date: e.date.split('T')[0] }))
                        : []
                );
            })
            .catch(() => {})
            .finally(() => setLoadingEvents(false));
    }, [api]);

    const todayEvents = events
        .filter(e => e.date === todayStr)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const upcomingEvents = events
        .filter(e => e.date > todayStr)
        .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
        .slice(0, 5);

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Bună ziua, {professorName}!
                </h1>
                <p className="text-gray-500 font-medium text-sm mt-1 flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span className="capitalize">{dateStr}</span>
                </p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {QUICK_CARDS.map(card => {
                    const Ic = card.icon;
                    return (
                        <button key={card.title} onClick={() => navigate(card.path)}
                            className="bg-white rounded-2xl border border-gray-100 p-5 text-left transition-all hover:shadow-md hover:border-gray-200 active:scale-[0.98] group"
                        >
                            <div className={`inline-flex p-2.5 rounded-xl ${card.bg} ${card.color} mb-3`}>
                                <Ic size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm">{card.title}</h3>
                            <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Deschide <ChevronRight size={10} />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Activitate Recentă — upcoming events */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-purple-500" />
                            <h2 className="font-bold text-gray-800 text-sm">Evenimente Viitoare</h2>
                        </div>
                        <button onClick={() => navigate('/profesor/orar')}
                            className="text-xs font-bold text-purple-500 hover:text-purple-700 transition-colors flex items-center gap-1">
                            Vezi toate <ChevronRight size={12} />
                        </button>
                    </div>
                    {loadingEvents ? (
                        <div className="flex items-center justify-center py-14">
                            <Loader2 size={20} className="animate-spin text-purple-300" />
                        </div>
                    ) : upcomingEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 text-gray-300">
                            <Inbox size={36} className="mb-2" />
                            <p className="text-sm font-medium">Niciun eveniment viitor</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {upcomingEvents.map(e => (
                                <div key={e.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                                    <div className="shrink-0 text-center w-10">
                                        <p className="text-xs font-bold text-gray-400">
                                            {new Date(e.date).toLocaleDateString('ro-RO', { day: 'numeric' })}
                                        </p>
                                        <p className="text-[10px] text-gray-300 uppercase">
                                            {new Date(e.date).toLocaleDateString('ro-RO', { month: 'short' })}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{e.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                <Clock size={10} /> {e.startTime}–{e.endTime}
                                            </span>
                                            {e.location && (
                                                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                    <MapPin size={10} /> {e.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold ${EVENT_TYPE_COLOR[e.type] ?? 'bg-gray-100 text-gray-500'}`}>
                                        {EVENT_TYPE_LABEL[e.type] ?? e.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Orarul de Astăzi */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-purple-500" />
                            <h2 className="font-bold text-gray-800 text-sm">Orarul de Astăzi</h2>
                        </div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase">
                            {today.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                    {loadingEvents ? (
                        <div className="flex items-center justify-center py-14">
                            <Loader2 size={20} className="animate-spin text-purple-300" />
                        </div>
                    ) : todayEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 text-gray-300">
                            <Clock size={36} className="mb-2" />
                            <p className="text-sm font-medium">Niciun curs azi</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 p-2">
                            {todayEvents.map(e => (
                                <div key={e.id} className="flex items-start gap-3 px-3 py-3">
                                    <div className="shrink-0 mt-0.5">
                                        <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold ${EVENT_TYPE_COLOR[e.type] ?? 'bg-gray-100 text-gray-500'}`}>
                                            {EVENT_TYPE_LABEL[e.type] ?? e.type}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{e.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{e.startTime}–{e.endTime}</p>
                                        {e.location && (
                                            <p className="text-xs text-gray-300 mt-0.5 flex items-center gap-1">
                                                <MapPin size={9} /> {e.location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfesorDashboard;
