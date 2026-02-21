import { useState } from 'react';
import { Send, Paperclip, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { ReportCategory, ReportPriority, Report } from './reportTypes';
import { CATEGORY_CFG, PRIORITY_CFG } from './reportTypes';

interface ReportFormProps {
    onSubmit: (report: Report) => void;
}

const ReportForm = ({ onSubmit }: ReportFormProps) => {
    const [category, setCategory] = useState<ReportCategory>('tehnic');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<ReportPriority>('medie');
    const [anonymous, setAnonymous] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const canSubmit = subject.trim().length > 0 && description.trim().length > 0;

    const handleSubmit = () => {
        if (!canSubmit) return;
        const newReport: Report = {
            id: `RPT-${String(Date.now()).slice(-4)}`,
            category,
            subject: subject.trim(),
            description: description.trim(),
            priority,
            status: 'trimis',
            anonymous,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        onSubmit(newReport);
        setSubmitted(true);
        setTimeout(() => {
            setSubject('');
            setDescription('');
            setPriority('medie');
            setCategory('tehnic');
            setAnonymous(false);
            setSubmitted(false);
        }, 2500);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-lg">Raport Nou</h2>
                <p className="text-xs text-gray-400 mt-0.5">Completează formularul pentru a trimite un raport.</p>
            </div>

            <div className="p-5 space-y-5">
                {/* Categorie */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categorie</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {(Object.entries(CATEGORY_CFG) as [ReportCategory, typeof CATEGORY_CFG.tehnic][]).map(([key, cfg]) => {
                            const Ic = cfg.icon;
                            const active = category === key;
                            return (
                                <button key={key} onClick={() => setCategory(key)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                        active
                                            ? `${cfg.color} border-current shadow-sm`
                                            : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <Ic size={14} />
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Subiect */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subiect</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="Descrie pe scurt problema..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 focus:bg-white outline-none transition-all"
                    />
                </div>

                {/* Descriere */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descriere detaliată</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Explică problema în detaliu: ce s-a întâmplat, când, și ce ai încercat..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 focus:bg-white outline-none transition-all resize-none"
                    />
                </div>

                {/* Prioritate */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prioritate</label>
                    <div className="flex gap-2">
                        {(Object.entries(PRIORITY_CFG) as [ReportPriority, typeof PRIORITY_CFG.medie][]).map(([key, cfg]) => {
                            const active = priority === key;
                            return (
                                <button key={key} onClick={() => setPriority(key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        active ? `${cfg.bg} ${cfg.text} ${cfg.border}` : 'bg-gray-50 text-gray-400 border-gray-100'
                                    }`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${active ? cfg.dot : 'bg-gray-300'}`} />
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Anonim toggle + Atașament */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`relative w-10 h-5 rounded-full transition-colors ${anonymous ? 'bg-purple-500' : 'bg-gray-200'}`}
                            onClick={() => setAnonymous(!anonymous)}
                        >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${anonymous ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <ShieldCheck size={13} /> Trimite anonim
                        </span>
                    </label>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-purple-500 transition-colors">
                        <Paperclip size={13} /> Atașează fișier
                    </button>
                </div>

                {/* Priority alert */}
                {priority === 'ridicata' && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                        <AlertTriangle size={16} className="text-red-500 shrink-0" />
                        <p className="text-xs text-red-600 font-medium">Raporturile cu prioritate ridicată sunt analizate imediat de echipa de suport.</p>
                    </div>
                )}

                {/* Submit */}
                <button onClick={handleSubmit} disabled={!canSubmit || submitted}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                        submitted
                            ? 'bg-green-500 text-white'
                            : canSubmit
                                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100 active:scale-[0.98]'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                >
                    {submitted ? (
                        <>✓ Raport trimis cu succes!</>
                    ) : (
                        <><Send size={16} /> Trimite Raportul</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReportForm;
