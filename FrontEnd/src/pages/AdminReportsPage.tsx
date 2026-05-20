import { useCallback, useEffect, useState } from 'react';
import {
    MessageCircleWarning, Inbox, Loader2, Trash2,
    ChevronRight, ArrowLeft, Clock, ShieldCheck, CheckCircle2, AlertCircle
} from 'lucide-react';
import type { Report, ReportStatus } from '../components/report/reportTypes';
import { CATEGORY_CFG, PRIORITY_CFG, STATUS_CFG } from '../components/report/reportTypes';
import { useApi } from '../providers/AxiosProvider';

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('ro-RO', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}z`;
};

const STATUS_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
    trimis:   ['inLucru', 'respins'],
    inLucru:  ['rezolvat', 'respins'],
    rezolvat: [],
    respins:  [],
};

const ALL_STATUSES: (ReportStatus | 'all')[] = ['all', 'trimis', 'inLucru', 'rezolvat', 'respins'];

const AdminReportsPage = () => {
    const api = useApi();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Report | null>(null);
    const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/report');
            const data: Report[] = res.data?.data ?? res.data ?? [];
            setReports(Array.isArray(data) ? data : []);
        } catch {
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => { void fetchReports(); }, [fetchReports]);

    const handleUpdateStatus = async (report: Report, newStatus: ReportStatus) => {
        setUpdatingId(report.id);
        try {
            await api.put(`/report/${report.id}`, { ...report, status: newStatus });
            const updated = { ...report, status: newStatus, updatedAt: new Date().toISOString() };
            setReports(prev => prev.map(r => r.id === report.id ? updated : r));
            if (selected?.id === report.id) setSelected(updated);
            showToast('success', 'Statusul a fost actualizat.');
        } catch {
            showToast('error', 'Eroare la actualizarea statusului.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/report/${id}`);
            setReports(prev => prev.filter(r => r.id !== id));
            if (selected?.id === id) setSelected(null);
            showToast('success', 'Raportul a fost șters.');
        } catch {
            showToast('error', 'Eroare la ștergerea raportului.');
        }
    };

    const filtered = (filterStatus === 'all'
        ? reports
        : reports.filter(r => r.status === filterStatus)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pending = reports.filter(r => r.status === 'trimis').length;

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold border ${
                    toast.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.msg}
                </div>
            )}

            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                        <MessageCircleWarning size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Rapoarte</h1>
                        <p className="text-gray-500 font-medium text-sm">
                            {pending > 0
                                ? `${pending} raport${pending !== 1 ? 'e' : ''} necitit${pending !== 1 ? 'e' : ''} — necesită atenție`
                                : 'Toate rapoartele sunt procesate.'}
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex flex-wrap items-center gap-2 mb-5">
                {ALL_STATUSES.map(st => {
                    const active = filterStatus === st;
                    const count = st === 'all' ? reports.length : reports.filter(r => r.status === st).length;
                    const cfg = st !== 'all' ? STATUS_CFG[st as ReportStatus] : null;
                    return (
                        <button key={st} onClick={() => setFilterStatus(st)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                active
                                    ? cfg
                                        ? `${cfg.bg} ${cfg.text} border-current`
                                        : 'bg-purple-50 text-purple-600 border-purple-200'
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                            {st === 'all' ? 'Toate' : cfg!.label}
                            <span className="px-1.5 py-0.5 rounded-md bg-black/5 text-[9px] font-bold">{count}</span>
                        </button>
                    );
                })}
            </div>

            <div className={`grid gap-6 ${selected ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1'}`}>
                {/* List */}
                <div className={selected ? 'xl:col-span-2' : ''}>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={24} className="animate-spin text-amber-400" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center py-16">
                            <Inbox size={36} className="text-gray-200 mb-3" />
                            <p className="text-sm font-medium text-gray-400">Niciun raport de afișat.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filtered.map(r => {
                                const cat = CATEGORY_CFG[r.category];
                                const status = STATUS_CFG[r.status];
                                const prio = PRIORITY_CFG[r.priority];
                                const CatIcon = cat.icon;
                                const isSelected = selected?.id === r.id;
                                return (
                                    <button key={r.id}
                                        onClick={() => setSelected(isSelected ? null : r)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all hover:shadow-sm group ${
                                            isSelected
                                                ? 'bg-amber-50 border-amber-200'
                                                : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`shrink-0 p-2 rounded-xl ${cat.color}`}>
                                                <CatIcon size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{r.subject}</p>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {r.anonymous && <ShieldCheck size={12} className="text-gray-300" />}
                                                        <span className="text-[10px] text-gray-300 font-medium flex items-center gap-0.5">
                                                            <Clock size={10} /> {timeAgo(r.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 line-clamp-1">{r.description}</p>
                                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                        {status.label}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${prio.bg} ${prio.text}`}>
                                                        {prio.label}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.color}`}>
                                                        {cat.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className={`shrink-0 mt-2 transition-colors ${isSelected ? 'text-amber-400' : 'text-gray-200 group-hover:text-gray-400'}`} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit sticky top-4">
                        <div className="p-5 border-b border-gray-100">
                            <button onClick={() => setSelected(null)}
                                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-amber-500 transition-colors mb-3"
                            >
                                <ArrowLeft size={14} /> Închide
                            </button>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className={`shrink-0 p-2.5 rounded-xl ${CATEGORY_CFG[selected.category].color}`}>
                                        {(() => { const Icon = CATEGORY_CFG[selected.category].icon; return <Icon size={20} />; })()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {selected.anonymous && (
                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
                                                <ShieldCheck size={11} /> Raport anonim
                                            </div>
                                        )}
                                        <h2 className="text-base font-bold text-gray-800 leading-tight">{selected.subject}</h2>
                                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_CFG[selected.status].bg} ${STATUS_CFG[selected.status].text}`}>
                                                <span className={`w-2 h-2 rounded-full ${STATUS_CFG[selected.status].dot}`} />
                                                {STATUS_CFG[selected.status].label}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${PRIORITY_CFG[selected.priority].bg} ${PRIORITY_CFG[selected.priority].text}`}>
                                                {PRIORITY_CFG[selected.priority].label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => void handleDelete(selected.id)}
                                    className="shrink-0 p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Șterge raport"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-5 space-y-5">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descriere</h3>
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    {selected.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                                <span className="flex items-center gap-1.5"><Clock size={11} /> Creat: {fmtDate(selected.createdAt)}</span>
                                <span className="flex items-center gap-1.5"><Clock size={11} /> Actualizat: {fmtDate(selected.updatedAt)}</span>
                            </div>

                            {STATUS_TRANSITIONS[selected.status].length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Schimbă Status</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {STATUS_TRANSITIONS[selected.status].map(st => {
                                            const cfg = STATUS_CFG[st];
                                            const isUpdating = updatingId === selected.id;
                                            return (
                                                <button key={st}
                                                    onClick={() => void handleUpdateStatus(selected, st)}
                                                    disabled={isUpdating}
                                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-60 hover:opacity-80 ${cfg.bg} ${cfg.text} border-current`}
                                                >
                                                    {isUpdating
                                                        ? <Loader2 size={12} className="animate-spin" />
                                                        : <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
                                                    Marchează ca {cfg.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {STATUS_TRANSITIONS[selected.status].length === 0 && (
                                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                                    selected.status === 'rezolvat'
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    <CheckCircle2 size={15} />
                                    {selected.status === 'rezolvat' ? 'Raport rezolvat.' : 'Raport respins.'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReportsPage;
