import { useState } from 'react';
import { CalendarDays, Check, X, Save } from 'lucide-react';
import type { CatalogStudent } from './catalogTypes';
import { STATUS_CFG } from './catalogTypes';

interface AttendanceTabProps {
    students: CatalogStudent[];
    onSaveAttendance: (date: string, records: Record<string, boolean>) => void;
}

const AttendanceTab = ({ students, onSaveAttendance }: AttendanceTabProps) => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [saved, setSaved] = useState(false);

    // Build initial state from existing records or default to false
    const buildInitial = () => {
        const m: Record<string, boolean> = {};
        students.forEach(s => {
            const rec = s.attendance.find(a => a.date === selectedDate);
            m[s.id] = rec ? rec.present : false;
        });
        return m;
    };

    const [attendance, setAttendance] = useState<Record<string, boolean>>(buildInitial);

    // Update attendance when date changes
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSaved(false);
        const m: Record<string, boolean> = {};
        students.forEach(s => {
            const rec = s.attendance.find(a => a.date === date);
            m[s.id] = rec ? rec.present : false;
        });
        setAttendance(m);
    };

    const toggle = (id: string) => {
        setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
        setSaved(false);
    };

    const markAll = (value: boolean) => {
        const m: Record<string, boolean> = {};
        students.forEach(s => { m[s.id] = value; });
        setAttendance(m);
        setSaved(false);
    };

    const handleSave = () => {
        onSaveAttendance(selectedDate, attendance);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = students.length - presentCount;

    const fmtDate = (d: string) =>
        new Date(d + 'T00:00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div>
            {/* Date picker + stats */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-50 text-purple-500">
                            <CalendarDays size={16} />
                        </div>
                        <div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => handleDateChange(e.target.value)}
                                className="text-sm font-bold text-gray-800 border border-gray-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-purple-300 outline-none"
                            />
                            <p className="text-[10px] text-gray-400 mt-0.5">{fmtDate(selectedDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-700 font-bold">
                            <Check size={12} /> {presentCount} prezenți
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-700 font-bold">
                            <X size={12} /> {absentCount} absenți
                        </span>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 mt-3">
                    <button onClick={() => markAll(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
                    >Toți prezenți</button>
                    <button onClick={() => markAll(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                    >Toți absenți</button>
                </div>
            </div>

            {/* Student checklist */}
            <div className="divide-y divide-gray-50">
                {students.map((s, idx) => {
                    const isPresent = attendance[s.id] ?? false;
                    const statusCfg = STATUS_CFG[s.status];

                    return (
                        <button key={s.id} onClick={() => toggle(s.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 transition-all text-left ${
                                isPresent ? 'bg-green-50/30' : 'hover:bg-gray-50/50'
                            }`}
                        >
                            <span className="text-xs text-gray-300 w-6 text-center font-bold">{idx + 1}</span>

                            {/* Checkbox */}
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                isPresent ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 bg-white'
                            }`}>
                                {isPresent && <Check size={14} strokeWidth={3} />}
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold ${isPresent ? 'text-gray-700' : 'text-gray-400'}`}>
                                    {s.lastName} {s.firstName}
                                </p>
                            </div>

                            {/* Status */}
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                {statusCfg.label}
                            </span>

                            {/* Present/Absent pill */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isPresent ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                            }`}>
                                {isPresent ? 'Prezent' : 'Absent'}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Save button */}
            <div className="p-4 border-t border-gray-100">
                <button onClick={handleSave}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                        saved
                            ? 'bg-green-500 text-white'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100 active:scale-[0.98]'
                    }`}
                >
                    {saved ? (
                        <><Check size={16} /> Prezența a fost salvată!</>
                    ) : (
                        <><Save size={16} /> Salvează Prezența</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AttendanceTab;
