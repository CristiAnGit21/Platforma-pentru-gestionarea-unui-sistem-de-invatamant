import { useCallback, useEffect, useMemo, useState } from "react";
import { devGet, devSet } from "../utils/devStorage";

const PROFESSORS_KEY = "utm_professors_v1";

type ProfessorStatus = "UNCONFIRMED" | "ACTIVE";

type Professor = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: ProfessorStatus;
};

function toProfessorStatus(v: unknown): ProfessorStatus {
    const s = String(v ?? "UNCONFIRMED").trim().toUpperCase();
    return s === "ACTIVE" ? "ACTIVE" : "UNCONFIRMED";
}

type RawProfessor = {
    id?: unknown;
    name?: unknown;
    fullName?: unknown;
    email?: unknown;
    role?: unknown;
    status?: unknown;
};

function loadProfessors(): Professor[] {
    const raw = devGet<unknown[]>(PROFESSORS_KEY, []);
    if (!Array.isArray(raw)) return [];

    return (raw as RawProfessor[])
        .map(
            (s): Professor => ({
                id: String(s.id ?? ""),
                name: String(s.name ?? s.fullName ?? ""),
                email: String(s.email ?? ""),
                role: String(s.role ?? "Profesor"),
                status: toProfessorStatus(s.status),
            })
        )
        .filter((s) => Boolean(s.id) && Boolean(s.email));
}

/** Persist a professor list and return it (for use in setState callbacks). */
function saveProfessors(professors: Professor[]): Professor[] {
    devSet(PROFESSORS_KEY, professors);
    return professors;
}

export default function Professors() {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [activeTab, setActiveTab] = useState<"Neconfirmați" | "Activi">(
        "Neconfirmați"
    );
    const [query, setQuery] = useState("");

    const syncFromStorage = useCallback(() => {
        const loaded = loadProfessors();
        setProfessors(loaded);
    }, []);

    useEffect(() => {
        syncFromStorage();
    }, [syncFromStorage]);

    useEffect(() => {
        const onFocus = () => syncFromStorage();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, [syncFromStorage]);

    const unconfirmed = useMemo(
        () => professors.filter((p) => p.status === "UNCONFIRMED"),
        [professors]
    );
    const active = useMemo(
        () => professors.filter((p) => p.status === "ACTIVE"),
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

    const handleConfirm = (id: string) => {
        setProfessors((prev) => {
            const next = prev.map((p) =>
                p.id === id ? { ...p, status: "ACTIVE" as ProfessorStatus } : p
            );
            return saveProfessors(next);
        });
    };

    const handleReject = (id: string) => {
        setProfessors((prev) => {
            const next = prev.filter((p) => p.id !== id);
            return saveProfessors(next);
        });
    };

    const handleDeactivate = (id: string) => {
        setProfessors((prev) => {
            const next = prev.map((p) =>
                p.id === id ? { ...p, status: "UNCONFIRMED" as ProfessorStatus } : p
            );
            return saveProfessors(next);
        });
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
                        Gestionare profesori și conturi (front-only)
                    </p>
                </div>

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
                                onClick={syncFromStorage}
                                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                            >
                                Reîncarcă din storage
                            </button>
                        </div>

                        <div className="text-xs text-gray-400">
                            Total: {professors.length} | Neconfirmați: {unconfirmed.length} |
                            Activi: {active.length}
                        </div>
                    </div>

                    {currentList.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">{emptyListMessage}</p>
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
                                            <td className="py-3 pr-4 text-gray-600">{p.status}</td>
                                            <td className="py-3 flex flex-wrap gap-2">
                                                {activeTab === "Neconfirmați" ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleConfirm(p.id)}
                                                            className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
                                                        >
                                                            Confirmă
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleReject(p.id)}
                                                            className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                                                        >
                                                            Respinge
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeactivate(p.id)}
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
