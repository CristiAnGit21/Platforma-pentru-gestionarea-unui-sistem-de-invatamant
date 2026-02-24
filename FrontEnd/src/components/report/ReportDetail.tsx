import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import type { Report } from './reportTypes';
import { CATEGORY_CFG, PRIORITY_CFG, STATUS_CFG } from './reportTypes';

interface ReportDetailProps {
    report: Report;
    onBack: () => void;
}

const fmtDate = (d: string) => new Date(d).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const ReportDetail = ({ report, onBack }: ReportDetailProps) => {
    const cat = CATEGORY_CFG[report.category];
    const prio = PRIORITY_CFG[report.priority];
    const status = STATUS_CFG[report.status];
    const CatIcon = cat.icon;

    // Simulated timeline based on status
    const timeline = [
        { label: 'Raport creat', date: report.createdAt, done: true },
        ...(report.status !== 'trimis' ? [{ label: 'În curs de analiză', date: report.updatedAt, done: true }] : []),
        ...(report.status === 'rezolvat' ? [{ label: 'Problemă rezolvată', date: report.updatedAt, done: true }] : []),
        ...(report.status === 'respins' ? [{ label: 'Raport respins', date: report.updatedAt, done: true }] : []),
        ...(report.status === 'trimis' || report.status === 'in_lucru' ? [{ label: 'Așteptare rezolvare', date: '', done: false }] : []),
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
                <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-purple-500 transition-colors mb-3">
                    <ArrowLeft size={14} /> Înapoi la lista de rapoarte
                </button>
                <div className="flex items-start gap-3">
                    <div className={`shrink-0 p-2.5 rounded-xl ${cat.color}`}>
                        <CatIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-300">{report.id}</span>
                            {report.anonymous && (
                                <span className="flex items-center gap-1 text-[10px] text-gray-300"><ShieldCheck size={11} /> Anonim</span>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">{report.subject}</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                                {status.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${prio.bg} ${prio.text}`}>
                                <span className={`w-2 h-2 rounded-full ${prio.dot}`} />
                                {prio.label}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Description */}
                <div className="lg:col-span-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descriere</h3>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                        {report.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Clock size={12} /> Creat: {fmtDate(report.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Clock size={12} /> Actualizat: {fmtDate(report.updatedAt)}
                        </span>
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Progres</h3>
                    <div className="space-y-0">
                        {timeline.map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full border-2 ${
                                        step.done ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'
                                    }`} />
                                    {i < timeline.length - 1 && (
                                        <div className={`w-0.5 h-8 ${step.done ? 'bg-purple-200' : 'bg-gray-100'}`} />
                                    )}
                                </div>
                                <div className="pb-6">
                                    <p className={`text-xs font-bold ${step.done ? 'text-gray-700' : 'text-gray-300'}`}>{step.label}</p>
                                    {step.date && <p className="text-[10px] text-gray-400 mt-0.5">{fmtDate(step.date)}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetail;
