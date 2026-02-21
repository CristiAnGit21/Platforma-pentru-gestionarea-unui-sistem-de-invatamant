import { Users, BarChart3, CheckCircle2 } from 'lucide-react';
import type { Group } from './catalogTypes';
import { getAverage, getAttendancePercent } from './catalogTypes';

interface GroupSidebarProps {
    groups: Group[];
    selectedGroupId: string;
    onSelectGroup: (id: string) => void;
}

const GroupSidebar = ({ groups, selectedGroupId, onSelectGroup }: GroupSidebarProps) => {
    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    // Stats for selected group
    const allGrades = selectedGroup?.students.flatMap(s => s.grades) ?? [];
    const allAttendance = selectedGroup?.students.flatMap(s => s.attendance) ?? [];
    const avgGrade = getAverage(allGrades);
    const avgAttendance = getAttendancePercent(allAttendance);
    const activeCount = selectedGroup?.students.filter(s => s.status === 'ACTIVE').length ?? 0;

    return (
        <div className="space-y-4">
            {/* Groups List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm">Grupele Mele</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">{groups.length} grupe asignate</p>
                </div>
                <div className="p-2">
                    {groups.map(g => {
                        const isSelected = g.id === selectedGroupId;
                        return (
                            <button key={g.id} onClick={() => onSelectGroup(g.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                                    isSelected ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50 border border-transparent'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <Users size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>{g.name}</p>
                                    <p className="text-[10px] text-gray-400">Anul {g.year} · {g.students.length} studenți</p>
                                </div>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stats */}
            {selectedGroup && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm">Statistici — {selectedGroup.name}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-50 text-violet-500"><Users size={14} /></div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Studenți</p>
                                <p className="text-sm font-bold text-gray-800">{selectedGroup.students.length} total · <span className="text-green-600">{activeCount} activi</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-500"><BarChart3 size={14} /></div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Media Generală</p>
                                <p className="text-sm font-bold text-gray-800">{avgGrade !== null ? avgGrade.toFixed(2) : '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-50 text-green-500"><CheckCircle2 size={14} /></div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Prezență Medie</p>
                                <p className="text-sm font-bold text-gray-800">{avgAttendance !== null ? `${avgAttendance}%` : '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupSidebar;
