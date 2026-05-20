import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AxiosError } from "axios";
import { FileText, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
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

type Group = {
  id: string;
  name: string;
  year: number;
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
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Neconfirmați" | "Activi">(
    "Neconfirmați"
  );
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const session = getAuthSession();
  const role = session?.user.role;
  const isAdmin = role === "ADMIN";

  const [contractModal, setContractModal] = useState<{ studentId: string; studentName: string } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadMsg, setUploadMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    api.get("/group").then((res) => {
      const list = (res.data?.data ?? res.data ?? []) as Group[];
      setGroups(list);
    }).catch(() => {});
  }, [api]);

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

  const setStatus = async (student: Student, status: 0 | 1, groupId?: string) => {
    try {
      await api.put(`/User/${student.id}`, {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: 0,
        status,
        groupId: groupId ?? null,
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

  const openContractModal = (student: Student) => {
    setContractModal({ studentId: student.id, studentName: student.name });
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadMsg("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadMsg("Doar fișiere PDF sunt acceptate.");
      setUploadStatus("error");
      return;
    }
    setSelectedFile(file);
    setUploadStatus("idle");
    setUploadMsg("");
  };

  const handleUploadContract = async () => {
    if (!contractModal || !selectedFile) return;
    setUploadStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("studentId", contractModal.studentId);
      formData.append("file", selectedFile);
      await api.post("/contract", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadStatus("success");
      setUploadMsg("Contractul a fost încărcat cu succes.");
    } catch (error) {
      const msg = error instanceof AxiosError
        ? error.response?.data?.message ?? error.message
        : "Eroare la încărcarea contractului.";
      setUploadStatus("error");
      setUploadMsg(msg);
    }
  };

  const handleConfirm = (student: Student) => {
    const groupId = selectedGroupId[student.id];
    if (!groupId) {
      setMessage("Selectați o grupă înainte de a confirma studentul.");
      return;
    }
    void setStatus(student, 1, groupId);
  };
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
                    {isAdmin && activeTab === "Neconfirmați" && (
                      <th className="pb-3 pr-4 font-semibold text-gray-800">Grupă</th>
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
                      {isAdmin && activeTab === "Neconfirmați" && (
                        <td className="py-3 pr-4">
                          <select
                            value={selectedGroupId[s.id] ?? ""}
                            onChange={(e) =>
                              setSelectedGroupId((prev) => ({ ...prev, [s.id]: e.target.value }))
                            }
                            className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:ring-2 focus:ring-violet-300 outline-none"
                          >
                            <option value="">— selectează grupa —</option>
                            {groups.map((g) => (
                              <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                          </select>
                        </td>
                      )}
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
                            <>
                              <button
                                type="button"
                                onClick={() => openContractModal(s)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-100"
                              >
                                <FileText size={14} />
                                Contract
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeactivate(s)}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                              >
                                Dezactivează
                              </button>
                            </>
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

      {contractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Contract de studii</h3>
                <p className="text-sm text-gray-500 mt-0.5">{contractModal.studentName}</p>
              </div>
              <button onClick={() => setContractModal(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              >
                <Upload size={28} className="mx-auto text-gray-300 mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-semibold text-blue-700">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Click pentru a selecta PDF</p>
                    <p className="text-xs text-gray-400 mt-1">Doar fișiere .pdf, max 20 MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {uploadStatus === "success" && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
                  <CheckCircle2 size={16} /> {uploadMsg}
                </div>
              )}
              {uploadStatus === "error" && (
                <div className="px-4 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-semibold">
                  {uploadMsg}
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                type="button"
                onClick={() => setContractModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-white transition-all text-sm"
              >
                Închide
              </button>
              <button
                type="button"
                onClick={() => void handleUploadContract()}
                disabled={!selectedFile || uploadStatus === "uploading" || uploadStatus === "success"}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {uploadStatus === "uploading" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploadStatus === "uploading" ? "Se încarcă..." : "Încarcă contract"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}