import { useState } from 'react';
import { BookOpen, GraduationCap, ClipboardCheck } from 'lucide-react';
import type { Grade, Group } from '../../components/catalog/catalogTypes';
import { MOCK_GROUPS } from '../../components/catalog/catalogTypes';
import GroupSidebar from '../../components/catalog/GroupSidebar';
import GradesTab from '../../components/catalog/GradesTab';
import AttendanceTab from '../../components/catalog/AttendanceTab';

type TabView = 'note' | 'prezenta';

const CatalogPage = () => {
    const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
    const [selectedGroupId, setSelectedGroupId] = useState(MOCK_GROUPS[0].id);
    const [activeTab, setActiveTab] = useState<TabView>('note');

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    // ── Handlers ──
    const handleAddGrade = (studentId: string, grade: Omit<Grade, 'id'>) => {
        setGroups(prev => prev.map(g => ({
            ...g,
            students: g.students.map(s =>
                s.id === studentId
                    ? { ...s, grades: [...s.grades, { ...grade, id: `gr_${Date.now()}` }] }
                    : s
            ),
        })));
    };

    const handleDeleteGrade = (studentId: string, gradeId: string) => {
        setGroups(prev => prev.map(g => ({
            ...g,
            students: g.students.map(s =>
                s.id === studentId
                    ? { ...s, grades: s.grades.filter(gr => gr.id !== gradeId) }
                    : s
            ),
        })));
    };

    const handleSaveAttendance = (date: string, records: Record<string, boolean>) => {
        setGroups(prev => prev.map(g => ({
            ...g,
            students: g.students.map(s => {
                if (!(s.id in records)) return s;
                const existing = s.attendance.findIndex(a => a.date === date);
                const updated = [...s.attendance];
                if (existing >= 0) {
                    updated[existing] = { date, present: records[s.id] };
                } else {
                    updated.push({ date, present: records[s.id] });
                }
                return { ...s, attendance: updated };
            }),
        })));
    };

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                        <BookOpen size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Catalog</h1>
                        <p className="text-gray-500 font-medium text-sm">Gestionați notele și prezența studenților din grupele dumneavoastră.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="xl:col-span-1">
                    <GroupSidebar
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        onSelectGroup={setSelectedGroupId}
                    />
                </div>

                {/* Main content */}
                <div className="xl:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Tab switcher */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
                                <button onClick={() => setActiveTab('note')}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === 'note' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <GraduationCap size={14} /> Catalog Note
                                </button>
                                <button onClick={() => setActiveTab('prezenta')}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === 'prezenta' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <ClipboardCheck size={14} /> Prezență
                                </button>
                            </div>
                            {selectedGroup && (
                                <span className="text-sm font-bold text-gray-800">
                                    {selectedGroup.name}
                                    <span className="text-gray-400 font-medium ml-2">· {selectedGroup.students.length} studenți</span>
                                </span>
                            )}
                        </div>

                        {/* Tab content */}
                        {selectedGroup && activeTab === 'note' && (
                            <GradesTab
                                students={selectedGroup.students}
                                onAddGrade={handleAddGrade}
                                onDeleteGrade={handleDeleteGrade}
                            />
                        )}
                        {selectedGroup && activeTab === 'prezenta' && (
                            <AttendanceTab
                                students={selectedGroup.students}
                                onSaveAttendance={handleSaveAttendance}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;
