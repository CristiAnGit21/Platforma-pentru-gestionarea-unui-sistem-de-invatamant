import { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import type { CatalogStudent, Grade } from './catalogTypes';
import { getAverage, STATUS_CFG } from './catalogTypes';

interface GradesTabProps {
    students: CatalogStudent[];
    onAddGrade: (studentId: string, grade: Omit<Grade, 'id'>) => void;
    onDeleteGrade: (studentId: string, gradeId: string) => void;
}

const GradesTab = ({ students, onAddGrade, onDeleteGrade }: GradesTabProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [addingFor, setAddingFor] = useState<string | null>(null);
    const [newGradeValue, setNewGradeValue] = useState('');
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    const filtered = students.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddGrade = (studentId: string) => {
        const val = parseInt(newGradeValue);
        if (val < 1 || val > 10 || isNaN(val)) return;
        onAddGrade(studentId, {
            value: val,
            date: new Date().toISOString().split('T')[0],
            subject: 'Programare Web',
        });
        setNewGradeValue('');
        setAddingFor(null);
    };

    return (
        <div>
            {/* Search */}
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Caută student..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Nr</th>
                            <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Student</th>
                            <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                            <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Note</th>
                            <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Media</th>
                            <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((s, idx) => {
                            const avg = getAverage(s.grades);
                            const statusCfg = STATUS_CFG[s.status];
                            const isExpanded = expandedStudent === s.id;

                            return (
                                <tr key={s.id}
                                    className={`border-b border-gray-50 transition-colors ${isExpanded ? 'bg-purple-50/30' : 'hover:bg-gray-50/50'}`}
                                >
                                    <td className="px-4 py-3 text-xs text-gray-400 font-bold">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => setExpandedStudent(isExpanded ? null : s.id)} className="text-left">
                                            <p className="text-sm font-bold text-gray-800">{s.lastName} {s.firstName}</p>
                                            <p className="text-[10px] text-gray-400">{s.email}</p>
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                            {statusCfg.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap items-center gap-1">
                                            {s.grades.length === 0 ? (
                                                <span className="text-xs text-gray-300">—</span>
                                            ) : (
                                                s.grades.map(g => (
                                                    <span key={g.id} className="group relative inline-flex items-center gap-0.5">
                                                        <span className={`inline-block px-1.5 py-0.5 rounded-md text-xs font-bold ${
                                                            g.value >= 9 ? 'bg-green-50 text-green-700'
                                                                : g.value >= 7 ? 'bg-blue-50 text-blue-700'
                                                                    : g.value >= 5 ? 'bg-amber-50 text-amber-700'
                                                                        : 'bg-red-50 text-red-700'
                                                        }`}>
                                                            {g.value}
                                                        </span>
                                                        <button onClick={() => onDeleteGrade(s.id, g.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-0.5 text-red-300 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 size={10} />
                                                        </button>
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-sm font-bold ${
                                            avg === null ? 'text-gray-300'
                                                : avg >= 9 ? 'text-green-600'
                                                    : avg >= 7 ? 'text-blue-600'
                                                        : avg >= 5 ? 'text-amber-600'
                                                            : 'text-red-600'
                                        }`}>
                                            {avg !== null ? avg.toFixed(2) : '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {addingFor === s.id ? (
                                            <div className="flex items-center gap-1 justify-center">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={newGradeValue}
                                                    onChange={e => setNewGradeValue(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleAddGrade(s.id)}
                                                    className="w-14 px-2 py-1 rounded-lg border border-purple-200 text-sm text-center focus:ring-2 focus:ring-purple-300 outline-none"
                                                    autoFocus
                                                    placeholder="1-10"
                                                />
                                                <button onClick={() => handleAddGrade(s.id)}
                                                    className="px-2 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
                                                >OK</button>
                                                <button onClick={() => { setAddingFor(null); setNewGradeValue(''); }}
                                                    className="px-2 py-1 rounded-lg border border-gray-200 text-gray-400 text-xs font-bold hover:bg-gray-50 transition-colors"
                                                >✕</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setAddingFor(s.id)}
                                                className="p-1.5 rounded-lg text-gray-300 hover:text-purple-500 hover:bg-purple-50 transition-all"
                                                title="Adaugă notă"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <div className="flex flex-col items-center py-12 text-gray-400">
                    <Search size={32} className="mb-2 text-gray-200" />
                    <p className="text-sm font-medium">Niciun student găsit.</p>
                </div>
            )}
        </div>
    );
};

export default GradesTab;
