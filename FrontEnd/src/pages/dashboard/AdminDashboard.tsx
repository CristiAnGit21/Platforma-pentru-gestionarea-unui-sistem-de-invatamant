import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useApi } from "../../providers/AxiosProvider";

type PendingUser = { id: string; name: string; email: string; requestedRole: Role };

type Role = "Student" | "Profesor";

type Group = {
    id: string;
    name: string;
    year: number;
    specialization: string;
    professorId?: string;
    studentIds: string[];
};

type Professor = { id: string; name: string; status: string; email: string };

type BackendUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: number | string;
    status: number | string;
};

type BackendGroup = {
    id: string;
    name: string;
    year: number;
};

type ApiEnvelope<T> = {
    isSuccess?: boolean;
    message?: string;
    data?: T;
};

function parseApiData<T>(payload: unknown): T {
    const maybeEnvelope = payload as ApiEnvelope<T>;
    if (maybeEnvelope?.data !== undefined) {
        return maybeEnvelope.data;
    }

    return payload as T;
}

function normalizeBackendRole(role: number | string): Role | "Admin" {
    if (typeof role === "number") {
        if (role === 0) return "Student";
        if (role === 1) return "Profesor";
        return "Admin";
    }

    const value = String(role).toLowerCase();
    if (value === "student") return "Student";
    if (value === "professor" || value === "profesor") return "Profesor";
    return "Admin";
}

function toBackendRole(role: Role): "Student" | "Professor" {
    return role === "Student" ? "Student" : "Professor";
}

function normalizeBackendStatus(status: number | string): "Pending" | "Active" | "Unknown" {
    if (typeof status === "number") {
        if (status === 0) return "Pending";
        if (status === 1) return "Active";
        return "Unknown";
    }

    const value = String(status).toLowerCase();
    if (value === "pending") return "Pending";
    if (value === "active") return "Active";
    return "Unknown";
}

function splitName(fullName: string): { firstName: string; lastName: string } {
    const trimmed = fullName.trim();
    if (!trimmed) return { firstName: "User", lastName: "Updated" };

    const [firstName, ...lastNameParts] = trimmed.split(/\s+/);
    return {
        firstName,
        lastName: lastNameParts.join(" ") || "Updated",
    };
}

const AdminDashboard = () => {
    const api = useApi();
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [groups, setGroups] = useState<Group[]>([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groupForm, setGroupForm] = useState({ name: "", year: 1, specialization: "", professorId: "" });

    const [activeProfessors, setActiveProfessors] = useState<Professor[]>([]);
    const [allActiveStudents, setAllActiveStudents] = useState<PendingUser[]>([]);
    const [allBackendUsers, setAllBackendUsers] = useState<BackendUser[]>([]);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [groupStudentMap, setGroupStudentMap] = useState<Record<string, string[]>>({});

    const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
    const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'general' });
    const [sendingNotif, setSendingNotif] = useState(false);

    const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [addingSubject, setAddingSubject] = useState(false);

    const showTemporaryMessage = (text: string) => {
        setMessage(text);
        window.setTimeout(() => setMessage(null), 3000);
    };

    const fetchSubjects = useCallback(async () => {
        try {
            const res = await api.get('/subject');
            const list: { id: string; name: string }[] = res.data?.data ?? res.data ?? [];
            setSubjects(Array.isArray(list) ? list : []);
        } catch {
            setSubjects([]);
        }
    }, [api]);

    useEffect(() => { void fetchSubjects(); }, [fetchSubjects]);

    const handleAddSubject = async () => {
        if (!newSubjectName.trim()) return;
        setAddingSubject(true);
        try {
            await api.post('/subject', { name: newSubjectName.trim() });
            setNewSubjectName('');
            await fetchSubjects();
            showTemporaryMessage(`Materia "${newSubjectName.trim()}" a fost adăugată.`);
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message ?? error.message : 'Eroare la adăugarea materiei.';
            showTemporaryMessage(msg);
        } finally {
            setAddingSubject(false);
        }
    };

    const handleDeleteSubject = async (id: string, name: string) => {
        try {
            await api.delete(`/subject/${id}`);
            await fetchSubjects();
            showTemporaryMessage(`Materia "${name}" a fost ștearsă.`);
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message ?? error.message : 'Eroare la ștergerea materiei.';
            showTemporaryMessage(msg);
        }
    };

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [usersResponse, groupsResponse] = await Promise.all([
                api.get("/User"),
                api.get("/Group"),
            ]);

            const users = parseApiData<BackendUser[]>(usersResponse.data);
            const fetchedGroups = parseApiData<BackendGroup[]>(groupsResponse.data);
            const safeUsers = Array.isArray(users) ? users : [];
            const safeGroups = Array.isArray(fetchedGroups) ? fetchedGroups : [];

            const nextPendingUsers: PendingUser[] = [];
            const nextActiveProfessors: Professor[] = [];
            const nextActiveStudents: PendingUser[] = [];

            for (const user of safeUsers) {
                const normalizedRole = normalizeBackendRole(user.role);
                const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
                const mappedUser: PendingUser = {
                    id: user.id,
                    name: fullName || user.email,
                    email: user.email,
                    requestedRole: normalizedRole === "Admin" ? "Student" : normalizedRole,
                };
                const normalizedStatus = normalizeBackendStatus(user.status);

                if (normalizedStatus === "Pending" && (normalizedRole === "Student" || normalizedRole === "Profesor")) {
                    nextPendingUsers.push(mappedUser);
                } else if (normalizedRole === "Student" && normalizedStatus === "Active") {
                    nextActiveStudents.push(mappedUser);
                } else if (normalizedRole === "Profesor" && normalizedStatus === "Active") {
                    nextActiveProfessors.push({ ...mappedUser, status: "ACTIVE" });
                }
            }

            setPendingUsers(nextPendingUsers);
            setActiveProfessors(nextActiveProfessors);
            setAllActiveStudents(nextActiveStudents);
            setAllBackendUsers(safeUsers);
            setGroups(
                safeGroups.map((group) => ({
                    id: group.id,
                    name: group.name,
                    year: group.year,
                    specialization: "",
                    professorId: undefined,
                    studentIds: groupStudentMap[group.id] ?? [],
                }))
            );
        } catch (error) {
            const messageText =
                error instanceof AxiosError
                    ? error.response?.data?.message ?? error.message
                    : "Nu s-au putut încărca datele dashboard-ului.";
            showTemporaryMessage(messageText);
        } finally {
            setIsLoading(false);
        }
    }, [api, groupStudentMap]);

    useEffect(() => {
        void fetchDashboardData();
    }, [fetchDashboardData]);

    const handleSetRole = async (user: PendingUser) => {
        try {
            const { firstName, lastName } = splitName(user.name);
            await api.put(`/User/${user.id}`, {
                id: user.id,
                firstName,
                lastName,
                email: user.email,
                role: toBackendRole(user.requestedRole),
                status: 1,
            });

            await fetchDashboardData();
            showTemporaryMessage(`Utilizatorul ${user.name} a fost confirmat.`);
        } catch (error) {
            const messageText =
                error instanceof AxiosError
                    ? error.response?.data?.message ?? error.message
                    : "Nu s-a putut actualiza rolul utilizatorului.";
            showTemporaryMessage(messageText);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupForm.name.trim()) return;

        try {
            await api.post("/Group", {
                name: groupForm.name.trim(),
                year: groupForm.year,
            });

            await fetchDashboardData();
            setIsGroupModalOpen(false);
            setGroupForm({ name: "", year: 1, specialization: "", professorId: "" });
            showTemporaryMessage(`Grupa "${groupForm.name}" a fost creată cu succes.`);
        } catch (error) {
            const messageText =
                error instanceof AxiosError
                    ? error.response?.data?.message ?? error.message
                    : "Nu s-a putut crea grupa.";
            showTemporaryMessage(messageText);
        }
    };

    const handleOpenAssignModal = async (group: Group) => {
        setEditingGroup(group);
        try {
            const res = await api.get(`/user/group/${group.id}`);
            const members = parseApiData<BackendUser[]>(res.data) ?? [];
            setSelectedStudentIds(Array.isArray(members) ? members.map(m => m.id) : []);
        } catch {
            setSelectedStudentIds([]);
        }
        setIsAssignModalOpen(true);
    };

    const handleSaveAssignment = async () => {
        if (!editingGroup) return;

        try {
            // Membrii actuali din server
            const currentRes = await api.get(`/user/group/${editingGroup.id}`);
            const currentMembers = parseApiData<BackendUser[]>(currentRes.data) ?? [];
            const safeCurrentMembers = Array.isArray(currentMembers) ? currentMembers : [];
            const currentIds = safeCurrentMembers.map(m => m.id);

            const toAdd = selectedStudentIds.filter(id => !currentIds.includes(id));
            const toRemove = currentIds.filter(id => !selectedStudentIds.includes(id));

            await Promise.all([
                ...toAdd.map(async (studentId) => {
                    const student = allBackendUsers.find(u => u.id === studentId);
                    if (!student) return;
                    await api.put(`/User/${studentId}`, {
                        id: studentId,
                        firstName: student.firstName,
                        lastName: student.lastName,
                        email: student.email,
                        role: 0,
                        status: 1,
                        groupId: editingGroup.id,
                    });
                }),
                ...toRemove.map(async (studentId) => {
                    const member = safeCurrentMembers.find(m => m.id === studentId);
                    if (!member) return;
                    await api.put(`/User/${studentId}`, {
                        id: studentId,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        email: member.email,
                        role: 0,
                        status: 1,
                        groupId: null,
                    });
                }),
            ]);

            await fetchDashboardData();
            setIsAssignModalOpen(false);
            setEditingGroup(null);
            setSelectedStudentIds([]);
            showTemporaryMessage(`Studenții au fost asignați grupei "${editingGroup.name}".`);
        } catch (error) {
            const messageText =
                error instanceof AxiosError
                    ? error.response?.data?.message ?? error.message
                    : "Nu s-au putut salva asignările studenților.";
            showTemporaryMessage(messageText);
        }
    };

    const handleSendNotification = async () => {
        if (!notifForm.title.trim() || !notifForm.message.trim()) return;
        setSendingNotif(true);
        try {
            await api.post('/notification', {
                title: notifForm.title.trim(),
                message: notifForm.message.trim(),
                type: notifForm.type,
            });
            setIsNotifModalOpen(false);
            setNotifForm({ title: '', message: '', type: 'general' });
            showTemporaryMessage('Notificarea a fost trimisă tuturor utilizatorilor.');
        } catch (error) {
            const msg = error instanceof AxiosError
                ? error.response?.data?.message ?? error.message
                : 'Eroare la trimiterea notificării.';
            showTemporaryMessage(msg);
        } finally {
            setSendingNotif(false);
        }
    };

    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudentIds((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Administrare platformă, utilizatori și rapoarte.
                    </p>
                </div>

                {message && (
                    <div className="mb-4 bg-green-50 text-green-700 border border-green-200 rounded-lg p-3">
                        {message}
                    </div>
                )}
                {isLoading && (
                    <div className="mb-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg p-3">
                        Se încarcă datele din server...
                    </div>
                )}

                <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Utilizatori în așteptare
                        </h2>
                        <button
                            type="button"
                            onClick={() => void fetchDashboardData()}
                            className="text-sm bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-1"
                        >
                            Reîncarcă date
                        </button>
                    </div>

                    {pendingUsers.length === 0 ? (
                        <p className="text-gray-500">Nu există utilizatori în așteptare.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingUsers.map((user) => {
                                return (
                                    <div
                                        key={user.id}
                                        className="flex flex-wrap items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                                    >
                                        <span className="w-40 font-medium text-gray-800">
                                            {user.name}
                                        </span>
                                        <span className="w-48 text-gray-600 text-sm">
                                            {user.email}
                                        </span>

                                        <span className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm">
                                            Rol solicitat: {user.requestedRole}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleSetRole(user)}
                                            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                                        >
                                            Confirmă utilizator
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Secțiunea Grupe */}
                <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Grupe</h2>
                        <button
                            type="button"
                            onClick={() => setIsGroupModalOpen(true)}
                            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors flex items-center gap-2"
                        >
                            <span>+</span>
                            Creează grupă
                        </button>
                    </div>

                    {groups.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-gray-400">Nu există grupe încă.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 font-semibold text-gray-700">Nume grupă</th>
                                        <th className="pb-3 font-semibold text-gray-700">An</th>
                                        <th className="pb-3 font-semibold text-gray-700">Specialitate</th>
                                        <th className="pb-3 font-semibold text-gray-700">Profesor</th>
                                        <th className="pb-3 font-semibold text-gray-700 text-right">Acțiuni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((g) => {
                                        const prof = activeProfessors.find(p => p.id === g.professorId);
                                        return (
                                            <tr key={g.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 font-medium text-gray-800">{g.name}</td>
                                                <td className="py-4 text-gray-600">Anul {g.year}</td>
                                                <td className="py-4 text-gray-600">{g.specialization}</td>
                                                <td className="py-4 text-gray-600">
                                                    {prof ? (
                                                        <span className="flex items-center gap-2 text-violet-700">
                                                            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                                                            {prof.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Neatribuit</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenAssignModal(g)}
                                                        className="text-sm font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1 ml-auto"
                                                    >
                                                        <span>Adaugă studenți</span>
                                                        <span className="text-gray-400 font-normal">({g.studentIds?.length || 0})</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Secțiunea Materii */}
                <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Materii</h2>
                            <p className="text-gray-500 text-sm mt-1">Materiile sunt folosite de profesori pentru a adăuga note în catalog.</p>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Nume materie (ex: Matematică)"
                            value={newSubjectName}
                            onChange={e => setNewSubjectName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && void handleAddSubject()}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none transition-all text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => void handleAddSubject()}
                            disabled={addingSubject || !newSubjectName.trim()}
                            className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addingSubject ? 'Se adaugă...' : '+ Adaugă'}
                        </button>
                    </div>

                    {subjects.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4 border-2 border-dashed border-gray-100 rounded-xl">
                            Nu există materii. Adaugă prima materie mai sus.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {subjects.map(s => (
                                <span key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-sm font-medium">
                                    {s.name}
                                    <button
                                        type="button"
                                        onClick={() => void handleDeleteSubject(s.id, s.name)}
                                        className="text-violet-300 hover:text-red-500 transition-colors"
                                        title="Șterge materia"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Secțiunea Notificări */}
                <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Notificări</h2>
                            <p className="text-gray-500 text-sm mt-1">Trimite notificări vizibile tuturor utilizatorilor platformei.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsNotifModalOpen(true)}
                            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors flex items-center gap-2"
                        >
                            <span>+</span>
                            Trimite notificare
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Notificare */}
            {isNotifModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">Trimite notificare</h3>
                            <p className="text-gray-500 text-sm mt-1">Notificarea va fi vizibilă tuturor utilizatorilor.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Titlu</label>
                                <input
                                    type="text"
                                    placeholder="ex: Sesiune de examene"
                                    value={notifForm.title}
                                    onChange={e => setNotifForm({ ...notifForm, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mesaj</label>
                                <textarea
                                    rows={4}
                                    placeholder="Detalii despre notificare..."
                                    value={notifForm.message}
                                    onChange={e => setNotifForm({ ...notifForm, message: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none transition-all resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Tip</label>
                                <select
                                    value={notifForm.type}
                                    onChange={e => setNotifForm({ ...notifForm, type: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none bg-white transition-all"
                                >
                                    <option value="general">General</option>
                                    <option value="alerta">Alertă</option>
                                    <option value="orar">Orar</option>
                                    <option value="financiar">Financiar</option>
                                    <option value="nota">Notă</option>
                                    <option value="absenta">Absență</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsNotifModalOpen(false); setNotifForm({ title: '', message: '', type: 'general' }); }}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-white transition-all"
                            >
                                Anulează
                            </button>
                            <button
                                type="button"
                                onClick={handleSendNotification}
                                disabled={sendingNotif || !notifForm.title.trim() || !notifForm.message.trim()}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sendingNotif ? 'Se trimite...' : 'Trimite'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal pentru Creare Grupă */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">Creează grupă nouă</h3>
                            <p className="text-gray-500 text-sm mt-1">Introdu detaliile pentru noua grupă de studenți.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nume grupă</label>
                                <input
                                    type="text"
                                    placeholder="ex: TI-231"
                                    value={groupForm.name}
                                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">An de studiu</label>
                                    <select
                                        value={groupForm.year}
                                        onChange={(e) => setGroupForm({ ...groupForm, year: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none bg-white transition-all"
                                    >
                                        {[1, 2, 3, 4].map((y) => (
                                            <option key={y} value={y}>Anul {y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Specialitate</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Informatica"
                                        value={groupForm.specialization}
                                        onChange={(e) => setGroupForm({ ...groupForm, specialization: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Profesor (Opcional)</label>
                                <select
                                    value={groupForm.professorId}
                                    onChange={(e) => setGroupForm({ ...groupForm, professorId: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none bg-white transition-all"
                                >
                                    <option value="">-- Selectează profesor --</option>
                                    {activeProfessors.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsGroupModalOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-white transition-all"
                            >
                                Anulează
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateGroup}
                                disabled={!groupForm.name.trim()}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Creează
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal pentru Asignare Studenți */}
            {isAssignModalOpen && editingGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Asignează studenți — {editingGroup.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">Selectează studenții activi pentru această grupă.</p>
                            </div>
                        </div>

                        <div className="p-6 max-h-96 overflow-y-auto">
                            {allActiveStudents.length === 0 ? (
                                <p className="text-center py-4 text-gray-400">Nu există studenți activi confirmați.</p>
                            ) : (
                                <div className="space-y-2">
                                    {allActiveStudents.map((student) => (
                                        <label
                                            key={student.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedStudentIds.includes(student.id)
                                                ? "bg-violet-50 border-violet-200"
                                                : "border-gray-100 hover:bg-gray-50"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedStudentIds.includes(student.id)}
                                                onChange={() => toggleStudentSelection(student.id)}
                                                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800">{student.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{student.email}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAssignModalOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-white transition-all"
                            >
                                Anulează
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAssignment}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all shadow-md shadow-violet-200"
                            >
                                Salvează ({selectedStudentIds.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;