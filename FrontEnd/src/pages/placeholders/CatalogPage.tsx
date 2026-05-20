import { useEffect, useState, useCallback } from 'react';
import { BookOpen, GraduationCap, ClipboardCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { CatalogStudent, Grade } from '../../components/catalog/catalogTypes';
import GroupSidebar from '../../components/catalog/GroupSidebar';
import GradesTab from '../../components/catalog/GradesTab';
import AttendanceTab from '../../components/catalog/AttendanceTab';
import { useApi } from '../../providers/AxiosProvider';
import { getAuthSession } from '../../auth/storage';

type TabView = 'note' | 'prezenta';

interface GroupInfo { id: string; name: string; year: number; }
interface SubjectInfo { id: string; name: string; professorId?: string; }
interface UserInfo { id: string; firstName: string; lastName: string; email: string; status: string; groupId?: string; }
interface GradeDto { id: string; value: number; date: string; subjectId: string; studentId: string; }
interface AttendanceDto { id: string; date: string; present: boolean; studentId: string; subjectId: string; }

function mapStatus(status: string): 'ACTIVE' | 'UNCONFIRMED' {
    return status === 'active' ? 'ACTIVE' : 'UNCONFIRMED';
}

const CatalogPage = () => {
    const api = useApi();
    const professorId = getAuthSession()?.user.id;

    const [groups, setGroups] = useState<GroupInfo[]>([]);
    const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [students, setStudents] = useState<UserInfo[]>([]);
    const [gradesMap, setGradesMap] = useState<Record<string, GradeDto[]>>({});
    const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceDto[]>>({});
    const [loadingInit, setLoadingInit] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [activeTab, setActiveTab] = useState<TabView>('note');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        Promise.all([
            api.get('/group'),
            api.get('/subject'),
        ]).then(([grRes, subRes]) => {
            const groupList: GroupInfo[] = grRes.data?.data ?? grRes.data ?? [];
            const allSubjects: SubjectInfo[] = subRes.data?.data ?? subRes.data ?? [];
            const subjectList = allSubjects.filter(s => s.professorId === professorId);
            setGroups(groupList);
            setSubjects(subjectList);
            if (groupList.length > 0) setSelectedGroupId(groupList[0].id);
        }).catch(console.error)
          .finally(() => setLoadingInit(false));
    }, []);

    const loadStudentsForGroup = useCallback(async (groupId: string) => {
        if (!groupId) return;
        setLoadingStudents(true);
        try {
            const res = await api.get(`/user/group/${groupId}`);
            const studentList: UserInfo[] = res.data?.data ?? res.data ?? [];
            setStudents(studentList);

            const results = await Promise.all(
                studentList.map(s =>
                    Promise.all([
                        api.get(`/grade/student/${s.id}`),
                        api.get(`/attendance/student/${s.id}`),
                    ]).then(([gRes, aRes]) => ({
                        id: s.id,
                        grades: (gRes.data?.data ?? gRes.data ?? []) as GradeDto[],
                        attendance: (aRes.data?.data ?? aRes.data ?? []) as AttendanceDto[],
                    }))
                )
            );

            const gMap: Record<string, GradeDto[]> = {};
            const aMap: Record<string, AttendanceDto[]> = {};
            results.forEach(({ id, grades, attendance }) => {
                gMap[id] = grades;
                aMap[id] = attendance;
            });
            setGradesMap(gMap);
            setAttendanceMap(aMap);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStudents(false);
        }
    }, [api]);

    useEffect(() => {
        void loadStudentsForGroup(selectedGroupId);
    }, [selectedGroupId, loadStudentsForGroup]);

    const catalogStudents: CatalogStudent[] = students.map(s => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        status: mapStatus(s.status),
        grades: (gradesMap[s.id] ?? []).map(g => ({
            id: g.id,
            value: g.value,
            date: g.date.split('T')[0],
            subject: subjects.find(sub => sub.id === g.subjectId)?.name ?? 'Disciplina',
            subjectId: g.subjectId,
        })),
        attendance: (attendanceMap[s.id] ?? []).map(a => ({
            date: a.date.split('T')[0],
            present: a.present,
        })),
    }));

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddGrade = async (studentId: string, grade: Omit<Grade, 'id'>) => {
        const subjectId = grade.subjectId ?? subjects[0]?.id;
        if (!subjectId) {
            showToast('error', 'Nu există materii disponibile. Adăugați mai întâi o materie.');
            return;
        }
        try {
            await api.post('/grade', {
                value: grade.value,
                date: new Date(grade.date).toISOString(),
                studentId,
                subjectId,
            });
            showToast('success', 'Nota a fost adăugată cu succes.');
            await loadStudentsForGroup(selectedGroupId);
        } catch (err) {
            showToast('error', 'Eroare la salvarea notei. Încercați din nou.');
            console.error(err);
        }
    };

    const handleDeleteGrade = async (_studentId: string, gradeId: string) => {
        try {
            await api.delete(`/grade/${gradeId}`);
            await loadStudentsForGroup(selectedGroupId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveAttendance = async (date: string, records: Record<string, boolean>) => {
        try {
            const subjectId = subjects[0]?.id;
            if (!subjectId) return;
            await Promise.all(
                Object.entries(records).map(([studentId, present]) =>
                    api.post('/attendance', {
                        date: new Date(date).toISOString(),
                        present,
                        studentId,
                        subjectId,
                    })
                )
            );
            await loadStudentsForGroup(selectedGroupId);
        } catch (err) {
            console.error(err);
        }
    };

    if (loadingInit) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={24} className="animate-spin text-purple-500" />
            </div>
        );
    }

    if (subjects.length === 0) {
        return (
            <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 rounded-xl bg-purple-100 text-purple-600"><BookOpen size={22} /></div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Catalog</h1>
                            <p className="text-gray-500 font-medium text-sm">Gestionați notele și prezența studenților.</p>
                        </div>
                    </div>
                </header>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center py-20">
                    <BookOpen size={40} className="text-gray-200 mb-3" />
                    <p className="font-bold text-gray-400 text-sm">Nu aveți materii atribuite</p>
                    <p className="text-xs text-gray-300 mt-1">Contactați administratorul pentru a vi se atribui o materie.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
                    toast.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}
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
                <div className="xl:col-span-1">
                    <GroupSidebar
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        onSelectGroup={setSelectedGroupId}
                        selectedGroupStudents={catalogStudents}
                    />
                </div>

                <div className="xl:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
                                <button onClick={() => setActiveTab('note')}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'note' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <GraduationCap size={14} /> Catalog Note
                                </button>
                                <button onClick={() => setActiveTab('prezenta')}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'prezenta' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <ClipboardCheck size={14} /> Prezență
                                </button>
                            </div>
                            {selectedGroup && (
                                <span className="text-sm font-bold text-gray-800">
                                    {selectedGroup.name}
                                    <span className="text-gray-400 font-medium ml-2">
                                        {loadingStudents ? '· ...' : `· ${catalogStudents.length} studenți`}
                                    </span>
                                </span>
                            )}
                        </div>

                        {loadingStudents ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={20} className="animate-spin text-purple-400" />
                            </div>
                        ) : (
                            <>
                                {selectedGroup && activeTab === 'note' && (
                                    <GradesTab
                                        students={catalogStudents}
                                        subjects={subjects}
                                        onAddGrade={handleAddGrade}
                                        onDeleteGrade={handleDeleteGrade}
                                    />
                                )}
                                {selectedGroup && activeTab === 'prezenta' && (
                                    <AttendanceTab
                                        students={catalogStudents}
                                        onSaveAttendance={handleSaveAttendance}
                                    />
                                )}
                                {!selectedGroup && (
                                    <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                                        Selectați o grupă din lista din stânga.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;
