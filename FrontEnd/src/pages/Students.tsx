import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { getAuthSession } from "../auth/storage";
import { useApi } from "../providers/AxiosProvider";

type StudentStatus = "UNCONFIRMED" | "ACTIVE";

type Student = {
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

function toStudentStatus(v: number | string): StudentStatus {
  if (typeof v === "number") return v === 1 ? "ACTIVE" : "UNCONFIRMED";
  const normalized = String(v).trim().toLowerCase();
  if (normalized === "1" || normalized === "active") return "ACTIVE";
  return "UNCONFIRMED";
}

export default function Students() {
  const api = useApi();
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Neconfirmați" | "Activi">(
    "Neconfirmați"
  );
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const session = getAuthSession();
  const role = session?.user.role;
  const isAdmin = role === "ADMIN";

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/User");
      const allUsers = parseApiData<Student[]>(response.data);
      const list = Array.isArray(allUsers) ? allUsers : [];
      console.log("Date primite de la server:", list);
      setStudents(
        list
          .filter((s) => normalizeRole(s.role) === "Student")
          .map((s) => ({
            ...s,
            name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.email,
          }))
      );
    } catch (error) {
      const errText =
        error instanceof AxiosError
          ? error.response?.data?.message ?? error.message
          : "Nu s-au putut încărca studenții.";
      setMessage(errText);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  const unconfirmed = useMemo(
    () =>
      students.filter(
        (s) =>
          normalizeRole(s.role) === "Student" &&
          toStudentStatus(s.status) === "UNCONFIRMED"
      ),
    [students]
  );
  const active = useMemo(
    // Tab-ul Studenți: role === 0 și status === 1 (ACTIVE)
    () =>
      students.filter(
        (s) =>
          normalizeRole(s.role) === "Student" &&
          toStudentStatus(s.status) === "ACTIVE"
      ),
    [students]
  );

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

  const setStatus = async (student: Student, status: 0 | 1) => {
    try {
      await api.put(`/User/${student.id}`, {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: 0,
        status,
      });
      await fetchStudents();
    } catch (error) {
      const errText =
        error instanceof AxiosError
          ? error.response?.data?.message ?? error.message
          : "Nu s-a putut actualiza studentul.";
      setMessage(errText);
    }
  };

  const handleConfirm = (student: Student) => void setStatus(student, 1);
  const handleDeactivate = (student: Student) => void setStatus(student, 0);

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
            {isAdmin ? "Gestionare studenți și conturi" : "Listă studenți activi"}
          </p>
        </div>
        {message && (
          <div className="mb-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg p-3">
            {message}
          </div>
        )}

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
                  onClick={() => void fetchStudents()}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                >
                  Reîncarcă din server
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
          ) : isLoading ? (
            <p className="text-gray-500 text-center py-8">Se încarcă studenții...</p>
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
                      {isAdmin && <td className="py-3 pr-4 text-gray-600">{toStudentStatus(s.status)}</td>}
                      {isAdmin && (
                        <td className="py-3 flex flex-wrap gap-2">
                          {activeTab === "Neconfirmați" ? (
                            <button
                              type="button"
                              onClick={() => handleConfirm(s)}
                              className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
                            >
                              Confirmă
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDeactivate(s)}
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