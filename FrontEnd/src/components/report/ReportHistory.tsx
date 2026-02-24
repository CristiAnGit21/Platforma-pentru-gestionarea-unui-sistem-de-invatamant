import { Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import type { Report } from './reportTypes';
import { CATEGORY_CFG, PRIORITY_CFG, STATUS_CFG } from './reportTypes';

interface ReportHistoryProps {
    reports: Report[];
    onSelect: (report: Report) => void;
    selectedId: string | null;
}

const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ore`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} zile`;
    const weeks = Math.floor(days / 7);
    return `${weeks} săpt.`;
};

const ReportHistory = ({ reports, onSelect, selectedId }: ReportHistoryProps) => {
    if (reports.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <Clock size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm font-medium text-gray-400">Nu ai trimis niciun raport.</p>
                <p className="text-xs text-gray-300 mt-1">Completează formularul pentru a raporta o problemă.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-lg">Rapoartele Mele</h2>
                <p className="text-xs text-gray-400 mt-0.5">{reports.length} rapoarte trimise</p>
            </div>
            <div className="divide-y divide-gray-50">
                {reports.map(r => {
                    const status = STATUS_CFG[r.status];
                    const cat = CATEGORY_CFG[r.category];
                    const prio = PRIORITY_CFG[r.priority];
                    const CatIcon = cat.icon;
                    const isSelected = selectedId === r.id;

                    return (
                        <button key={r.id} onClick={() => onSelect(r)}
                            className={`w-full text-left p-4 transition-all hover:bg-gray-50/50 group ${isSelected ? 'bg-purple-50/50' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`shrink-0 p-2 rounded-xl ${cat.color}`}>
                                    <CatIcon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-gray-300">{r.id}</span>
                                        {r.anonymous && <ShieldCheck size={11} className="text-gray-300" />}
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 truncate">{r.subject}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                            {status.label}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${prio.bg} ${prio.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
                                            {prio.label}
                                        </span>
                                        <span className="text-[10px] text-gray-300 font-medium flex items-center gap-0.5">
                                            <Clock size={10} /> {timeAgo(r.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-200 group-hover:text-gray-400 transition-colors shrink-0 mt-2" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ReportHistory;
