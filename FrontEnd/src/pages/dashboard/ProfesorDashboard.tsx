import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Bell, Users, MessageCircleWarning, ChevronRight,
    Clock, MapPin, GraduationCap, CheckCircle2, ClipboardCheck,
    TrendingUp, BarChart3, AlertTriangle, FileText, Calendar
} from 'lucide-react';

// ══════════════════  Mock Data  ══════════════════
const PROFESSOR_NAME = 'Dr. Popescu';

const QUICK_CARDS = [
    {
        title: 'Catalog',
        path: '/profesor/catalog',
        icon: BookOpen,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        stats: [
            { label: 'Grupe', value: '3' },
            { label: 'Studenți', value: '45' },
        ],
    },
    {
        title: 'Notificări',
        path: '/profesor/notificari',
        icon: Bell,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        stats: [
            { label: 'Necitite', value: '3' },
            { label: 'Total', value: '12' },
        ],
        badge: 3,
    },
    {
        title: 'Studenți',
        path: '/profesor/studenti',
        icon: Users,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        stats: [
            { label: 'Activi', value: '38' },
            { label: 'Neconfirmați', value: '7' },
        ],
    },
    {
        title: 'Raportează',
        path: '/profesor/raporteaza',
        icon: MessageCircleWarning,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        stats: [
            { label: 'Rapoarte', value: '4' },
            { label: 'În lucru', value: '1' },
        ],
    },
];

const RECENT_ACTIVITY = [
    { id: 'a1', icon: GraduationCap, color: 'text-green-500',  bg: 'bg-green-50',  text: 'Notă 10 adăugată pentru Ionescu Andrei — Programare Web',    time: 'Acum 5 min' },
    { id: 'a2', icon: ClipboardCheck, color: 'text-blue-500',   bg: 'bg-blue-50',   text: 'Prezență salvată pentru grupa TI-221 — 21 Feb',              time: 'Acum 30 min' },
    { id: 'a3', icon: GraduationCap, color: 'text-green-500',  bg: 'bg-green-50',  text: 'Notă 8 adăugată pentru Popescu Maria — Programare Web',      time: 'Acum 1 oră' },
    { id: 'a4', icon: AlertTriangle,  color: 'text-amber-500',  bg: 'bg-amber-50',  text: 'Raport #RPT-0041 marcat „În lucru"',                        time: 'Acum 3 ore' },
    { id: 'a5', icon: FileText,       color: 'text-violet-500', bg: 'bg-violet-50', text: 'Material nou încărcat: Curs 7 — Algoritmi Avansați',         time: 'Ieri' },
];

const TODAY_SCHEDULE = [
    { id: 't1', time: '08:00 – 09:30', title: 'Curs Algoritmi',              location: 'Sala 305',    group: 'TI-221', type: 'curs' as const },
    { id: 't2', time: '09:45 – 11:15', title: 'Laborator Programare Web',    location: 'Laborator A', group: 'TI-222', type: 'lab' as const },
    { id: 't3', time: '11:30 – 13:00', title: 'Laborator Sisteme de Operare', location: 'Laborator B', group: 'TI-221', type: 'lab' as const },
    { id: 't4', time: '14:00 – 15:30', title: 'Seminar Baze de Date',        location: 'Sala 110',    group: 'TI-311', type: 'seminar' as const },
];

const SCHEDULE_TYPE_CFG = {
    curs:    { bg: 'bg-violet-50', text: 'text-violet-600', label: 'Curs' },
    lab:     { bg: 'bg-blue-50',   text: 'text-blue-600',   label: 'Lab' },
    seminar: { bg: 'bg-amber-50',  text: 'text-amber-600',  label: 'Seminar' },
};

const STATS = [
    { label: 'Media Generală', value: 8.24, max: 10, color: 'bg-violet-500', icon: BarChart3 },
    { label: 'Prezență Medie', value: 88, max: 100, suffix: '%', color: 'bg-green-500', icon: CheckCircle2 },
    { label: 'Note Acordate', value: 127, max: 200, color: 'bg-blue-500', icon: TrendingUp },
];

// ══════════════════  Component  ══════════════════
const ProfesorDashboard = () => {
    const navigate = useNavigate();
    const today = new Date();
    const dateStr = today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {/* Header / Greeting */}
            <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Bună ziua, {PROFESSOR_NAME}! 👋
                </h1>
                <p className="text-gray-500 font-medium text-sm mt-1 flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span className="capitalize">{dateStr}</span>
                </p>
            </header>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {QUICK_CARDS.map(card => {
                    const Ic = card.icon;
                    return (
                        <button key={card.title} onClick={() => navigate(card.path)}
                            className={`relative bg-white rounded-2xl border border-gray-100 p-5 text-left transition-all hover:shadow-md hover:border-gray-200 active:scale-[0.98] group`}
                        >
                            {/* Badge */}
                            {'badge' in card && card.badge && (
                                <span className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                                    {card.badge}
                                </span>
                            )}

                            <div className={`inline-flex p-2.5 rounded-xl ${card.bg} ${card.color} mb-3`}>
                                <Ic size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm">{card.title}</h3>
                            <div className="flex gap-4 mt-2">
                                {card.stats.map(st => (
                                    <div key={st.label}>
                                        <p className="text-lg font-extrabold text-gray-800">{st.value}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{st.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Deschide <ChevronRight size={10} />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Recent Activity */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-purple-500" />
                            <h2 className="font-bold text-gray-800 text-sm">Activitate Recentă</h2>
                        </div>
                        <span className="text-[10px] text-gray-300 font-medium">Ultimele acțiuni</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {RECENT_ACTIVITY.map(a => {
                            const Ic = a.icon;
                            return (
                                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                                    <div className={`shrink-0 p-2 rounded-xl ${a.bg} ${a.color}`}><Ic size={14} /></div>
                                    <p className="flex-1 text-xs text-gray-600 font-medium">{a.text}</p>
                                    <span className="text-[10px] text-gray-300 font-medium shrink-0">{a.time}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-purple-500" />
                            <h2 className="font-bold text-gray-800 text-sm">Orarul de Astăzi</h2>
                        </div>
                        <span className="text-[10px] text-gray-300 font-medium">{TODAY_SCHEDULE.length} cursuri</span>
                    </div>
                    <div className="p-4 space-y-2">
                        {TODAY_SCHEDULE.map(s => {
                            const cfg = SCHEDULE_TYPE_CFG[s.type];
                            return (
                                <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="shrink-0 mt-0.5">
                                        <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-bold ${cfg.bg} ${cfg.text}`}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800">{s.title}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                                <Clock size={10} /> {s.time}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                                <MapPin size={10} /> {s.location}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-lg shrink-0">
                                        {s.group}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {STATS.map(s => {
                    const Ic = s.icon;
                    const pct = Math.round((s.value / s.max) * 100);
                    return (
                        <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-gray-50 text-gray-400"><Ic size={14} /></div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                                </div>
                                <p className="text-lg font-extrabold text-gray-800">
                                    {s.value}{s.suffix ?? ''}
                                </p>
                            </div>
                            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div className={`h-full rounded-full ${s.color} transition-all`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-gray-300 mt-1.5 text-right font-medium">{pct}% din {s.max}{s.suffix ?? ''}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfesorDashboard;
