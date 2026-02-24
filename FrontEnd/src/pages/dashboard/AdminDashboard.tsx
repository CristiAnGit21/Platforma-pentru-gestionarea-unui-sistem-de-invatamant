import { useEffect, useState } from "react";
import { devGet, devRemove, devSet } from "../../utils/devStorage";

const STORAGE_KEY = "utm_pending_users_v1";
const STUDENTS_KEY = "utm_students_v1";
const PROFESSORS_KEY = "utm_professors_v1";

type PendingUser = { id: string; name: string; email: string };

type Role = "Student" | "Profesor";

type AssignedUser = PendingUser & { role: Role; status: "UNCONFIRMED" };

const initialPendingUsers: PendingUser[] = [
    { id: "1", name: "Ion Popescu", email: "ion@test.com" },
    { id: "2", name: "Maria Ionescu", email: "maria@test.com" },
];

function getInitialPendingUsers(): PendingUser[] {
    const stored = devGet<PendingUser[]>(STORAGE_KEY, initialPendingUsers);
    return Array.isArray(stored) ? stored : initialPendingUsers;
}

type Group = { id: string; name: string; year: number; specialization: string };

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(() =>
        getInitialPendingUsers()
    );
    const [message, setMessage] = useState<string | null>(null);

    // Grupe state
    const [groups, setGroups] = useState<Group[]>([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groupForm, setGroupForm] = useState({ name: "", year: 1, specialization: "" });

    const [roleByUserId, setRoleByUserId] = useState<Record<string, Role>>({
        "1": "Profesor",
        "2": "Student",
    });

    useEffect(() => {
        devSet(STORAGE_KEY, pendingUsers);
    }, [pendingUsers]);

    const pushToList = (key: string, user: AssignedUser) => {
        const existing = devGet<AssignedUser[]>(key, []);
        const list = Array.isArray(existing) ? existing : [];

        // Evităm duplicatele după reset/refresh
        const alreadyExists = list.some((u) => u.id === user.id);
        if (!alreadyExists) list.push(user);

        devSet(key, list);
    };

    // FIX IMPORTANT: selectedRole e primit ca argument, nu citit din state în interior
    const handleSetRole = (user: PendingUser, selectedRole: Role) => {
        const newUser: AssignedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: selectedRole,
            status: "UNCONFIRMED",
        };

        if (selectedRole === "Student") {
            pushToList(STUDENTS_KEY, newUser);
        } else {
            pushToList(PROFESSORS_KEY, newUser);
        }

        setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));
        setMessage(`Rolul pentru ${user.name} a fost setat ca ${selectedRole}`);
        window.setTimeout(() => setMessage(null), 3000);
    };

    const handleResetDemo = () => {
        devRemove(STORAGE_KEY);
        devRemove(STUDENTS_KEY);
        devRemove(PROFESSORS_KEY);

        setPendingUsers(initialPendingUsers);
        setRoleByUserId({
            "1": "Profesor",
            "2": "Student",
        });
        setGroups([]);
        setMessage(null);
    };

    const handleCreateGroup = () => {
        if (!groupForm.name.trim()) return;

        const newGroup: Group = {
            id: Date.now().toString(),
            name: groupForm.name,
            year: groupForm.year,
            specialization: groupForm.specialization,
        };

        setGroups((prev) => [...prev, newGroup]);
        setIsGroupModalOpen(false);
        setGroupForm({ name: "", year: 1, specialization: "" });
        setMessage(`Grupa "${newGroup.name}" a fost creată cu succes.`);
        window.setTimeout(() => setMessage(null), 3000);
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

                <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Utilizatori în așteptare
                        </h2>
                        <button
                            type="button"
                            onClick={handleResetDemo}
                            className="text-sm bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-1"
                        >
                            Reset date demo
                        </button>
                    </div>

                    {pendingUsers.length === 0 ? (
                        <p className="text-gray-500">Nu există utilizatori în așteptare.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingUsers.map((user) => {
                                const currentRole = roleByUserId[user.id] ?? "Profesor";

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

                                        <select
                                            value={currentRole}
                                            onChange={(e) =>
                                                setRoleByUserId((prev) => ({
                                                    ...prev,
                                                    [user.id]: e.target.value as Role,
                                                }))
                                            }
                                            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none"
                                        >
                                            <option value="Profesor">Profesor</option>
                                            <option value="Student">Student</option>
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() => handleSetRole(user, currentRole)}
                                            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                                        >
                                            Setează rol
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((g) => (
                                        <tr key={g.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 font-medium text-gray-800">{g.name}</td>
                                            <td className="py-4 text-gray-600">Anul {g.year}</td>
                                            <td className="py-4 text-gray-600">{g.specialization}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

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
        </div>
    );
};

export default AdminDashboard;