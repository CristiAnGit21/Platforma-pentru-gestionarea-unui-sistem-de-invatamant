import { useCallback, useEffect, useMemo, useState } from "react";
import { devGet, devSet } from "../utils/devStorage";
import { getAuthSession } from "../auth/storage";

const STUDENTS_KEY = "utm_students_v1";

type StudentStatus = "UNCONFIRMED" | "ACTIVE";

type Student = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: StudentStatus;
};

function toStudentStatus(v: unknown): StudentStatus {
  const s = String(v ?? "UNCONFIRMED").trim().toUpperCase();
  return s === "ACTIVE" ? "ACTIVE" : "UNCONFIRMED";
}

type RawStudent = {
  id?: unknown;
  name?: unknown;
  fullName?: unknown;
  email?: unknown;
  role?: unknown;
  status?: unknown;
};

function loadStudents(): Student[] {
  const raw = devGet<unknown[]>(STUDENTS_KEY, []);
  if (!Array.isArray(raw)) return [];

  return (raw as RawStudent[])
    .map(
      (s): Student => ({
        id: String(s.id ?? ""),
        name: String(s.name ?? s.fullName ?? ""),
        email: String(s.email ?? ""),
        role: String(s.role ?? "Student"),
        status: toStudentStatus(s.status),
      })
    )
    .filter((s) => Boolean(s.id) && Boolean(s.email));
}

/** Persist a student list and return it (for use in setState callbacks). */
function saveStudents(students: Student[]): Student[] {
  devSet(STUDENTS_KEY, students);
  return students;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<"Neconfirmați" | "Activi">(
    "Neconfirmați"
  );
  const [query, setQuery] = useState("");

  const session = getAuthSession();
  const role = session?.user.role;
  const isAdmin = role === "ADMIN";

  // IMPORTANT: funcție de sync pe care o putem apela oricând
  // NOTE: We do NOT write back after reading — that was the original bug.
  //       Writing is done explicitly only in mutation handlers below.
  const syncFromStorage = useCallback(() => {
    const loaded = loadStudents();
    setStudents(loaded);
  }, []);

  // 1) Load pe mount
  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  // 2) Re-sync când revii în tab (după ce ai setat rol din Dashboard)
  useEffect(() => {
    const onFocus = () => syncFromStorage();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [syncFromStorage]);

  // NOTE: There is intentionally NO useEffect that writes students back to
  // storage on every render. That pattern was causing the empty-array race:
  //   mount → Effect(load) schedules setStudents(loaded) [async]
  //         → Effect(persist) fires immediately with students=[] → overwrites storage
  // Instead, every mutation explicitly calls saveStudents() inside the updater.

  const unconfirmed = useMemo(
    () => students.filter((s) => s.status === "UNCONFIRMED"),
    [students]
  );
  const active = useMemo(
    () => students.filter((s) => s.status === "ACTIVE"),
    [students]
  );

  // Professors/Students only see active list; Admin sees based on tab
  const currentList = isAdmin
    ? (activeTab === "Neconfirmați" ? unconfirmed : active)
    : active;

  const q = query.trim().toLowerCase();
  const filtered =
    q === ""
      ? currentList
      : currentList.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );

  const handleConfirm = (id: string) => {
    setStudents((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, status: "ACTIVE" as StudentStatus } : s
      );
      return saveStudents(next);
    });
  };

  const handleReject = (id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      return saveStudents(next);
    });
  };

  const handleDeactivate = (id: string) => {
    setStudents((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, status: "UNCONFIRMED" as StudentStatus } : s
      );
      return saveStudents(next);
    });
  };

  const emptyListMessage = isAdmin
    ? (activeTab === "Neconfirmați" ? "Nu există studenți neconfirmați." : "Nu există studenți activi.")
    : "Nu există studenți activi.";

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Studenți
          </h1>
          <p className="text-gray-500 mt-2">
            {isAdmin ? "Gestionare studenți și conturi (front-only)" : "Listă studenți activi"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col gap-4 mb-4">
            {isAdmin && (
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
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                type="search"
                placeholder="Caută după nume sau email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none placeholder:text-gray-400"
              />

              {isAdmin && (
                <button
                  type="button"
                  onClick={syncFromStorage}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                >
                  Reîncarcă din storage
                </button>
              )}
            </div>

            {isAdmin && (
              <div className="text-xs text-gray-400">
                Total: {students.length} | Neconfirmați: {unconfirmed.length} |
                Activi: {active.length}
              </div>
            )}
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
                    {isAdmin && (
                      <th className="pb-3 pr-4 font-semibold text-gray-800">
                        Status
                      </th>
                    )}
                    {isAdmin && <th className="pb-3 font-semibold text-gray-800">Acțiuni</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="py-3 pr-4 font-medium text-gray-800">
                        {s.name}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{s.email}</td>
                      {isAdmin && <td className="py-3 pr-4 text-gray-600">{s.status}</td>}
                      {isAdmin && (
                        <td className="py-3 flex flex-wrap gap-2">
                          {activeTab === "Neconfirmați" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleConfirm(s.id)}
                                className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
                              >
                                Confirmă
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(s.id)}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                              >
                                Respinge
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDeactivate(s.id)}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                            >
                              Dezactivează
                            </button>
                          )}
                        </td>
                      )}
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