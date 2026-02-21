import { useState } from "react";

const pendingUsers = [
    { id: "1", name: "Ion Popescu", email: "ion@test.com" },
    { id: "2", name: "Maria Ionescu", email: "maria@test.com" },
];

const AdminDashboard = () => {
    const [roleByUserId, setRoleByUserId] = useState<Record<string, string>>({
        "1": "Profesor",
        "2": "Student",
    });

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Dashboard Admin</h1>
                    <p className="text-gray-500 mt-2">
                        Administrare platformă, utilizatori și rapoarte.
                    </p>
                </div>

                <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Utilizatori în așteptare</h2>
                    <div className="space-y-4">
                        {pendingUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-wrap items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                            >
                                <span className="w-40 font-medium text-gray-800">{user.name}</span>
                                <span className="w-48 text-gray-600 text-sm">{user.email}</span>
                                <select
                                    value={roleByUserId[user.id] ?? "Profesor"}
                                    onChange={(e) =>
                                        setRoleByUserId((prev) => ({ ...prev, [user.id]: e.target.value }))
                                    }
                                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none"
                                >
                                    <option value="Profesor">Profesor</option>
                                    <option value="Student">Student</option>
                                </select>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                                >
                                    Setează rol
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
