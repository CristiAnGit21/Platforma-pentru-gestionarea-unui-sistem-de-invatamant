import { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Bell, CheckCircle, AlertTriangle, Calendar, FileText,
    BookOpen, X, Check, CheckCheck, Filter, Inbox, UserX, Loader2
} from 'lucide-react';
import { useApi } from '../providers/AxiosProvider';

type NotifType = 'nota' | 'alerta' | 'orar' | 'financiar' | 'absenta' | 'general';

interface Notification {
    id: string;
    type: NotifType;
    title: string;
    message: string;
    createdAt: string; // ISO from server
    read: boolean;     // local only
}

interface ApiNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
}

const TYPE_CFG: Record<NotifType, { label: string; icon: typeof Bell; color: string; bg: string; dot: string }> = {
    nota:      { label: 'Note',      icon: CheckCircle,    color: 'text-green-600',  bg: 'bg-green-50',  dot: 'bg-green-500' },
    alerta:    { label: 'Alerte',    icon: AlertTriangle,  color: 'text-amber-600',  bg: 'bg-amber-50',  dot: 'bg-amber-500' },
    orar:      { label: 'Orar',      icon: Calendar,       color: 'text-blue-600',   bg: 'bg-blue-50',   dot: 'bg-blue-500' },
    financiar: { label: 'Financiar', icon: FileText,       color: 'text-violet-600', bg: 'bg-violet-50', dot: 'bg-violet-500' },
    absenta:   { label: 'Absențe',   icon: UserX,          color: 'text-red-600',    bg: 'bg-red-50',    dot: 'bg-red-500' },
    general:   { label: 'General',   icon: BookOpen,       color: 'text-gray-600',   bg: 'bg-gray-100',  dot: 'bg-gray-500' },
};

const VALID_TYPES: NotifType[] = ['nota', 'alerta', 'orar', 'financiar', 'absenta', 'general'];
const toNotifType = (t: string): NotifType =>
    VALID_TYPES.includes(t as NotifType) ? (t as NotifType) : 'general';

const now = new Date();

const timeAgo = (iso: string) => {
    const diff = now.getTime() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Acum';
    if (mins < 60) return `Acum ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Acum ${hours} ${hours === 1 ? 'oră' : 'ore'}`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Ieri';
    if (days < 7) return `Acum ${days} zile`;
    const weeks = Math.floor(days / 7);
    return `Acum ${weeks} ${weeks === 1 ? 'săptămână' : 'săptămâni'}`;
};

type DateGroup = 'Astăzi' | 'Ieri' | 'Săptămâna trecută' | 'Mai vechi';

const getDateGroup = (iso: string): DateGroup => {
    const diff = now.getTime() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'Astăzi';
    if (days < 2) return 'Ieri';
    if (days < 7) return 'Săptămâna trecută';
    return 'Mai vechi';
};

const STORAGE_KEY = 'notif_read_ids';

const getReadIds = (): Set<string> => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
        return new Set();
    }
};

const saveReadIds = (ids: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

const Notifications = () => {
    const api = useApi();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<NotifType | 'all'>('all');

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/notification');
            const list: ApiNotification[] = res.data?.data ?? res.data ?? [];
            const readIds = getReadIds();
            setNotifications(
                (Array.isArray(list) ? list : []).map(n => ({
                    id: n.id,
                    type: toNotifType(n.type),
                    title: n.title,
                    message: n.message,
                    createdAt: n.createdAt,
                    read: readIds.has(n.id),
                }))
            );
        } catch {
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => { void fetchNotifications(); }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const filtered = useMemo(() => {
        const list = activeFilter === 'all' ? notifications : notifications.filter(n => n.type === activeFilter);
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [notifications, activeFilter]);

    const grouped = useMemo(() => {
        const groups: Record<DateGroup, Notification[]> = { 'Astăzi': [], 'Ieri': [], 'Săptămâna trecută': [], 'Mai vechi': [] };
        filtered.forEach(n => groups[getDateGroup(n.createdAt)].push(n));
        return Object.entries(groups).filter(([, items]) => items.length > 0) as [DateGroup, Notification[]][];
    }, [filtered]);

    const markRead = (id: string) => {
        const readIds = getReadIds();
        readIds.add(id);
        saveReadIds(readIds);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        const readIds = getReadIds();
        notifications.forEach(n => readIds.add(n.id));
        saveReadIds(readIds);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const dismiss = (id: string) => {
        const readIds = getReadIds();
        readIds.add(id);
        saveReadIds(readIds);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filterTypes: (NotifType | 'all')[] = ['all', 'nota', 'alerta', 'orar', 'financiar', 'absenta', 'general'];

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            <header className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="relative p-2 rounded-xl bg-purple-100 text-purple-600">
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Notificări</h1>
                        <p className="text-gray-500 font-medium text-sm">Rămâi la curent cu activitatea ta.</p>
                    </div>
                </div>
            </header>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                    {filterTypes.map(type => {
                        const isAll = type === 'all';
                        const cfg = isAll ? null : TYPE_CFG[type];
                        const active = activeFilter === type;
                        const unread = isAll ? unreadCount : notifications.filter(n => n.type === type && !n.read).length;
                        return (
                            <button key={type} onClick={() => setActiveFilter(type)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                    active
                                        ? isAll ? 'bg-purple-50 text-purple-600 border-purple-200' : `${cfg!.bg} ${cfg!.color} border-current`
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                {isAll ? <Filter size={12} /> : <span className={`w-2 h-2 rounded-full ${active ? cfg!.dot : 'bg-gray-300'}`} />}
                                {isAll ? 'Toate' : cfg!.label}
                                {unread > 0 && (
                                    <span className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[8px] font-bold">
                                        {unread}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors shrink-0"
                    >
                        <CheckCheck size={14} /> Marchează tot ca citit
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={24} className="animate-spin text-purple-400" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center py-20">
                    <Inbox size={48} className="text-gray-200 mb-3" />
                    <p className="font-bold text-gray-400 text-sm">Nicio notificare</p>
                    <p className="text-xs text-gray-300 mt-1">
                        {activeFilter === 'all' ? 'Nu există notificări momentan.' : `Nicio notificare de tip "${TYPE_CFG[activeFilter as NotifType].label}".`}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {grouped.map(([groupLabel, items]) => (
                        <div key={groupLabel}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{groupLabel}</span>
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-[10px] text-gray-300 font-medium">{items.length} notificări</span>
                            </div>
                            <div className="space-y-2">
                                {items.map(n => {
                                    const cfg = TYPE_CFG[n.type];
                                    const Ic = cfg.icon;
                                    return (
                                        <div key={n.id}
                                            onClick={() => markRead(n.id)}
                                            className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                                                !n.read
                                                    ? 'bg-white border-purple-100 shadow-sm hover:shadow-md'
                                                    : 'bg-white/60 border-gray-50 hover:bg-white hover:border-gray-100'
                                            }`}
                                        >
                                            <div className={`shrink-0 p-2.5 rounded-xl ${cfg.bg} ${cfg.color}`}>
                                                <Ic size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h4 className={`text-sm font-bold ${!n.read ? 'text-gray-800' : 'text-gray-500'}`}>{n.title}</h4>
                                                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                                                    </div>
                                                    {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0 mt-1 animate-pulse" />}
                                                </div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[10px] text-gray-300 font-medium">{timeAgo(n.createdAt)}</span>
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${cfg.bg} ${cfg.color}`}>
                                                        <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!n.read && (
                                                    <button onClick={e => { e.stopPropagation(); markRead(n.id); }}
                                                        className="p-1.5 rounded-lg text-gray-300 hover:text-green-500 hover:bg-green-50 transition-colors"
                                                        title="Marchează ca citit"
                                                    ><Check size={14} /></button>
                                                )}
                                                <button onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                                                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Ascunde"
                                                ><X size={14} /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
