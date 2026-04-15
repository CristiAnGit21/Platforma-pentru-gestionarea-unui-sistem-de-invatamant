import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useApi } from "../providers/AxiosProvider";

type UserStatus = "UNCONFIRMED" | "ACTIVE";

type Professor = {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    role: number | string;
    status: number | string;
};

type ApiEnvelope<T> = {
    data?: T;
};

function parseApiData<T>(payload: unknown): T {
    const maybeEnvelope = payload as ApiEnvelope<T>;
    if (maybeEnvelope?.data !== undefined) return maybeEnvelope.data;
    return payload as T;
}

function normalizeRole(role: number | string): "Student" | "Profesor" | "Admin" {
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

function normalizeStatus(status: number | string): UserStatus {
    if (typeof status === "number") return status === 1 ? "ACTIVE" : "UNCONFIRMED";
    const normalized = String(status).trim().toLowerCase();
    if (normalized === "1" || normalized === "active") return "ACTIVE";
    return "UNCONFIRMED";
}

export default function Professors() {
    const api = useApi();
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"Neconfirmați" | "Activi">(
        "Neconfirmați"
    );
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchProfessors = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/User");
            const allUsers = parseApiData<Professor[]>(response.data);
            const list = Array.isArray(allUsers) ? allUsers : [];
            console.log("Date primite de la server:", list);
            setProfessors(
                list
                    .filter((p) => normalizeRole(p.role) === "Profesor")
                    .map((p) => ({
                        ...p,
                        name: `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || p.email,
                    }))
            );
        } catch (error) {
            const errText =
                error instanceof AxiosError
                    ? error.response?.data?.message ?? error.message
                    : "Nu s-au putut încărca profesorii.";
            setMessage(errText);
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    useEffect(() => {
        void fetchProfessors();
    }, [fetchProfessors]);

    const unconfirmed = useMemo(
        () =>
            professors.filter(
                (p) =>
                    normalizeRole(p.role) === "Profesor" &&
                    normalizeStatus(p.status) === "UNCONFIRMED"
            ),
        [professors]
    );
    const active = useMemo(
        // Tab-ul Profesori: role === 1 și status === 1 (ACTIVE)
        () =>
            professors.filter(
                (p) =>
                    normalizeRole(p.role) === "Profesor" &&
                    normalizeStatus(p.status) === "ACTIVE"
            ),
        [professors]
    );

    const currentList = activeTab === "Neconfirmați" ? unconfirmed : active;

    const q = query.trim().toLowerCase();
    const filtered =
        q === ""
            ? currentList
            : currentList.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.email.toLowerCase().includes(q)
            );

    const setStatus = async (professor: Professor, status: 0 | 1) => {
        try {
            await api.put(`/User/${professor.id}`, {
                id: professor.id,
                firstName: professor.firstName,
                lastName: professor.lastName,
                email: professor.email,
                role: 1,
                status,
            });
            await fetchProfessors();
        } catch (error) {
            const errText =
                error instanceof AxiosError
                    ? error.response?.data?.message ?? error.message
                    : "Nu s-a putut actualiza profesorul.";
            setMessage(errText);
        }
    };

    const handleConfirm = (professor: Professor) => {
        void setStatus(professor, 1);
    };

    const handleDeactivate = (professor: Professor) => {
        void setStatus(professor, 0);
    };

    const emptyListMessage =
        activeTab === "Neconfirmați"
            ? "Nu există profesori neconfirmați."
            : "Nu există profesori activi.";

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                        Profesori
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Gestionare profesori și conturi
                    </p>
                </div>
                {message && (
                    <div className="mb-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg p-3">
                        {message}
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex gap-2 border-b border-gray-100">
                            <button
                                type="button"
                                onClick={() => setActiveTab("Neconfirmați")}
                                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === "Neconfirmați"
                                    ? "bg-violet-100 text-violet-700 border-b-2 border-violet-600 -mb-px"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Neconfirmați
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("Activi")}
                                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === "Activi"
                                    ? "bg-violet-100 text-violet-700 border-b-2 border-violet-600 -mb-px"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Activi
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <input
                                type="search"
                                placeholder="Caută după nume sau email"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none placeholder:text-gray-400"
                            />

                            <button
                                type="button"
                                onClick={() => void fetchProfessors()}
                                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                            >
                                Reîncarcă din server
                            </button>
                        </div>

                        <div className="text-xs text-gray-400">
                            Total: {professors.length} | Neconfirmați: {unconfirmed.length} |
                            Activi: {active.length}
                        </div>
                    </div>

                    {currentList.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">{emptyListMessage}</p>
                    ) : isLoading ? (
                        <p className="text-gray-500 text-center py-8">Se încarcă profesorii...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Nu am găsit rezultate pentru &quot;{query}&quot;.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="pb-3 pr-4 font-semibold text-gray-800">
                                            Nume
                                        </th>
                                        <th className="pb-3 pr-4 font-semibold text-gray-800">
                                            Email
                                        </th>
                                        <th className="pb-3 pr-4 font-semibold text-gray-800">
                                            Status
                                        </th>
                                        <th className="pb-3 font-semibold text-gray-800">Acțiuni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-gray-100 last:border-b-0"
                                        >
                                            <td className="py-3 pr-4 font-medium text-gray-800">
                                                {p.name}
                                            </td>
                                            <td className="py-3 pr-4 text-gray-600">{p.email}</td>
                                            <td className="py-3 pr-4 text-gray-600">{normalizeStatus(p.status)}</td>
                                            <td className="py-3 flex flex-wrap gap-2">
                                                {activeTab === "Neconfirmați" ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleConfirm(p)}
                                                        className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
                                                    >
                                                        Confirmă
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeactivate(p)}
                                                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                                                    >
                                                        Dezactivează
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
