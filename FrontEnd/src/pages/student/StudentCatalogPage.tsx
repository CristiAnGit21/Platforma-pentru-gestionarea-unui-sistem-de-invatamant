import { type ReactElement, useMemo, useState } from "react";
import {
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    Search,
    User,
    X,
} from "lucide-react";
import { getAuthSession } from "../../auth/storage";
import { MOCK_GROUPS, type AttendanceRecord, type CatalogStudent } from "../../components/catalog/catalogTypes";

type TabView = "note" | "prezenta";
type AttendanceStatus = "Prezent" | "Absent" | "Nemotivat";
type AttendanceType = "Curs" | "Laborator" | "Seminar";
type AttendanceFilter = "Toate" | "Risc" | "OK";

type AttendanceEvent = {
    date: string;
    type: AttendanceType;
    status: AttendanceStatus;
};

type SubjectEntry = {
    id: string;
    name: string;
    professor: string;
    grades: number[];
    attendance: AttendanceEvent[];
};

type StudentCatalogData = {
    studentName: string;
    studentEmail: string;
    groupName: string;
    studyYear: string;
    subjects: SubjectEntry[];
};

const EVENT_TYPES: AttendanceType[] = ["Curs", "Laborator", "Seminar"];

const PROFESSOR_BY_SUBJECT: Record<string, string> = {
    "Programare Web": "Dr. Popescu",
    "Baze de Date": "Dr. Raducu",
    "Inteligenta Artificiala": "Dr. Cojocaru",
};

function avg(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatDate(date: string): string {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("ro-RO");
}

function toAttendance(records: AttendanceRecord[]): AttendanceEvent[] {
    return records.map((record, index) => {
        const status: AttendanceStatus = record.present
            ? "Prezent"
            : index % 2 === 0
                ? "Absent"
                : "Nemotivat";
        return {
            date: record.date,
            type: EVENT_TYPES[index % EVENT_TYPES.length],
            status,
        };
    });
}

function summarizeAttendance(events: AttendanceEvent[]) {
    const prezent = events.filter((event) => event.status === "Prezent").length;
    const absent = events.filter((event) => event.status === "Absent").length;
    const nemotivat = events.filter((event) => event.status === "Nemotivat").length;
    const total = events.length;
    const percent = total === 0 ? 0 : Math.round((prezent / total) * 100);
    return { prezent, absent, nemotivat, total, percent };
}

function statusPillClass(status: AttendanceStatus): string {
    if (status === "Prezent") return "bg-green-50 text-green-700 border border-green-200";
    if (status === "Nemotivat") return "bg-amber-50 text-amber-800 border border-amber-200";
    return "bg-red-50 text-red-700 border border-red-200";
}

function riskLabel(percent: number, nemotivat: number): "Risc" | "OK" {
    return percent < 75 || nemotivat > 0 ? "Risc" : "OK";
}

function getStudentData(): StudentCatalogData {
    const session = getAuthSession();
    const preferredEmail = session?.user.email ?? "";

    const allGroups = MOCK_GROUPS;
    const found = allGroups
        .flatMap((group) => group.students.map((student) => ({ group, student })))
        .find((entry) => entry.student.email.toLowerCase() === preferredEmail.toLowerCase());

    const fallbackGroup = allGroups[0];
    const fallbackStudent = fallbackGroup.students[0];
    const selectedGroup = found?.group ?? fallbackGroup;
    const selectedStudent: CatalogStudent = found?.student ?? fallbackStudent;

    const gradesBySubject = selectedStudent.grades.reduce<Record<string, number[]>>((acc, grade) => {
        const key = grade.subject || "Disciplina";
        acc[key] = acc[key] ? [...acc[key], grade.value] : [grade.value];
        return acc;
    }, {});

    const attendance = toAttendance(selectedStudent.attendance);
    const subjects = Object.entries(gradesBySubject).map(([name, grades], index) => ({
        id: `${name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        name,
        professor: PROFESSOR_BY_SUBJECT[name] ?? "Profesor titular",
        grades,
        attendance,
    }));

    const safeSubjects =
        subjects.length > 0
            ? subjects
            : [
                {
                    id: "disciplina-generala",
                    name: "Disciplina generala",
                    professor: "Profesor titular",
                    grades: [],
                    attendance,
                },
            ];

    return {
        studentName: session?.user.name ?? `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        studentEmail: preferredEmail || selectedStudent.email,
        groupName: selectedGroup.name,
        studyYear: `Anul ${selectedGroup.year}`,
        subjects: safeSubjects,
    };
}

type StatCardProps = {
    title: string;
    value: string;
    subtitle: string;
    icon: ReactElement;
    iconClassName: string;
};

const StatCard = ({ title, value, subtitle, icon, iconClassName }: StatCardProps) => (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
            <div className={`rounded-xl p-2.5 ${iconClassName}`}>{icon}</div>
            <div>
                <p className="text-sm font-semibold text-gray-700">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
        </div>
    </article>
);

const StudentCatalogPage = () => {
    const data = useMemo(() => getStudentData(), []);
    const [activeTab, setActiveTab] = useState<TabView>("note");
    const [semester, setSemester] = useState("2");

    const [gradesQuery, setGradesQuery] = useState("");
    const [attendanceQuery, setAttendanceQuery] = useState("");
    const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>("Toate");
    const [openSubjectId, setOpenSubjectId] = useState<string | null>(null);

    const openSubject = data.subjects.find((subject) => subject.id === openSubjectId) ?? null;

    const stats = useMemo(() => {
        const allGrades = data.subjects.flatMap((subject) => subject.grades);
        const allAttendance = data.subjects.flatMap((subject) => subject.attendance);
        const attendance = summarizeAttendance(allAttendance);
        return {
            avgGrade: avg(allGrades),
            attendancePercent: attendance.percent,
            absences: attendance.absent + attendance.nemotivat,
            unexcused: attendance.nemotivat,
        };
    }, [data.subjects]);

    const filteredGrades = useMemo(() => {
        const query = gradesQuery.trim().toLowerCase();
        if (!query) return data.subjects;
        return data.subjects.filter((subject) => subject.name.toLowerCase().includes(query));
    }, [data.subjects, gradesQuery]);

    const filteredAttendance = useMemo(() => {
        const query = attendanceQuery.trim().toLowerCase();
        return data.subjects
            .map((subject) => {
                const sum = summarizeAttendance(subject.attendance);
                return {
                    subject,
                    summary: sum,
                    risk: riskLabel(sum.percent, sum.nemotivat),
                };
            })
            .filter((entry) => (query ? entry.subject.name.toLowerCase().includes(query) : true))
            .filter((entry) => (attendanceFilter === "Toate" ? true : entry.risk === attendanceFilter));
    }, [data.subjects, attendanceFilter, attendanceQuery]);

    return (
        <div className="min-h-screen bg-gray-50/60 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Catalog</h1>
                            <p className="text-sm text-gray-500">
                                Notele si prezenta ta pentru semestrul curent.
                            </p>
                        </div>
                    </div>
                    <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {data.groupName} | {data.studyYear}
                    </span>
                </header>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <StatCard
                        title="Media generala"
                        value={stats.avgGrade.toFixed(2)}
                        subtitle="Actualizata"
                        icon={<BookOpen size={18} />}
                        iconClassName="bg-violet-50 text-violet-700"
                    />
                    <StatCard
                        title="Prezenta"
                        value={`${stats.attendancePercent}%`}
                        subtitle="Semestrul curent"
                        icon={<CheckCircle2 size={18} />}
                        iconClassName="bg-green-50 text-green-700"
                    />
                    <StatCard
                        title="Absente"
                        value={`${stats.absences} total`}
                        subtitle={`${stats.unexcused} nemotivate`}
                        icon={<X size={18} />}
                        iconClassName="bg-amber-50 text-amber-700"
                    />
                </section>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                    <aside className="space-y-4">
                        <article className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 p-4">
                                <h2 className="text-sm font-bold text-gray-800">Date student</h2>
                            </div>
                            <div className="space-y-3 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-gray-100 p-2.5 text-gray-500">
                                        <User size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-800">
                                            {data.studentName}
                                        </p>
                                        <p className="truncate text-xs text-gray-500">{data.studentEmail}</p>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                                    <p className="text-[11px] uppercase tracking-wide text-gray-400">Grupa</p>
                                    <p className="text-sm font-semibold text-gray-700">{data.groupName}</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                                    <p className="text-[11px] uppercase tracking-wide text-gray-400">An studiu</p>
                                    <p className="text-sm font-semibold text-gray-700">{data.studyYear}</p>
                                </div>
                            </div>
                        </article>

                        {stats.unexcused > 0 ? (
                            <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle size={16} className="mt-0.5 text-amber-700" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-900">
                                            {stats.unexcused} absente nemotivate
                                        </p>
                                        <p className="text-xs text-amber-800">
                                            Pot influenta situatia financiara sau bursa.
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ) : null}
                    </aside>

                    <article className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="space-y-4 p-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="inline-flex rounded-xl bg-gray-100 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("note")}
                                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                                            activeTab === "note"
                                                ? "bg-white text-violet-700 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        Note
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("prezenta")}
                                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                                            activeTab === "prezenta"
                                                ? "bg-white text-violet-700 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        Prezenta
                                    </button>
                                </div>

                                <select
                                    value={semester}
                                    onChange={(event) => setSemester(event.target.value)}
                                    className="h-10 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-600 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                                >
                                    <option value="1">Semestru 1</option>
                                    <option value="2">Semestru 2</option>
                                    <option value="all">Toate semestrele</option>
                                </select>
                            </div>

                            {activeTab === "note" ? (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Search
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            value={gradesQuery}
                                            onChange={(event) => setGradesQuery(event.target.value)}
                                            placeholder="Cauta disciplina..."
                                            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                                        />
                                    </div>

                                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[640px] text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
                                                        <th className="px-4 py-3">Disciplina</th>
                                                        <th className="px-4 py-3">Note</th>
                                                        <th className="px-4 py-3">Media</th>
                                                        <th className="px-4 py-3">Profesor</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredGrades.map((subject) => (
                                                        <tr key={subject.id} className="border-t border-gray-100">
                                                            <td className="px-4 py-3 font-semibold text-gray-700">
                                                                {subject.name}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {subject.grades.length > 0 ? (
                                                                        subject.grades.map((grade, index) => (
                                                                            <span
                                                                                key={`${subject.id}-grade-${index}`}
                                                                                className="rounded-lg bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-700"
                                                                            >
                                                                                {grade}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <span className="text-xs text-gray-400">Nu exista note</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-gray-700">
                                                                {subject.grades.length > 0 ? avg(subject.grades).toFixed(2) : "0.00"}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-500">{subject.professor}</td>
                                                        </tr>
                                                    ))}
                                                    {filteredGrades.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">
                                                                Nicio disciplina gasita.
                                                            </td>
                                                        </tr>
                                                    ) : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                        <div className="relative flex-1">
                                            <Search
                                                size={16}
                                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                value={attendanceQuery}
                                                onChange={(event) => setAttendanceQuery(event.target.value)}
                                                placeholder="Cauta disciplina..."
                                                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                                            />
                                        </div>

                                        <select
                                            value={attendanceFilter}
                                            onChange={(event) =>
                                                setAttendanceFilter(event.target.value as AttendanceFilter)
                                            }
                                            className="h-10 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-600 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                                        >
                                            <option value="Toate">Status: Toate</option>
                                            <option value="OK">Status: OK</option>
                                            <option value="Risc">Status: Risc</option>
                                        </select>
                                    </div>

                                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[760px] text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
                                                        <th className="px-4 py-3">Disciplina</th>
                                                        <th className="px-4 py-3">Prezent</th>
                                                        <th className="px-4 py-3">Absent</th>
                                                        <th className="px-4 py-3">Nemotivat</th>
                                                        <th className="px-4 py-3">Prezenta</th>
                                                        <th className="px-4 py-3">Status</th>
                                                        <th className="px-4 py-3 text-right">Detalii</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredAttendance.map((entry) => (
                                                        <tr key={entry.subject.id} className="border-t border-gray-100">
                                                            <td className="px-4 py-3 font-semibold text-gray-700">
                                                                {entry.subject.name}
                                                            </td>
                                                            <td className="px-4 py-3">{entry.summary.prezent}</td>
                                                            <td className="px-4 py-3">{entry.summary.absent}</td>
                                                            <td className="px-4 py-3">
                                                                {entry.summary.nemotivat > 0 ? (
                                                                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                                                                        {entry.summary.nemotivat}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-400">0</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-gray-700">
                                                                {entry.summary.percent}%
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span
                                                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                                        entry.risk === "Risc"
                                                                            ? "bg-amber-50 text-amber-800"
                                                                            : "bg-green-50 text-green-700"
                                                                    }`}
                                                                >
                                                                    {entry.risk}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setOpenSubjectId(entry.subject.id)}
                                                                    className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold text-violet-600 hover:bg-violet-50"
                                                                >
                                                                    Vezi
                                                                    <ChevronRight size={14} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {filteredAttendance.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-400">
                                                                Nu exista rezultate.
                                                            </td>
                                                        </tr>
                                                    ) : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                </section>
            </div>

            {openSubject ? (
                <div className="fixed inset-0 z-50">
                    <button
                        type="button"
                        aria-label="Inchide detalii prezenta"
                        onClick={() => setOpenSubjectId(null)}
                        className="absolute inset-0 bg-black/30"
                    />
                    <section className="absolute right-0 top-0 h-full w-full max-w-[440px] overflow-y-auto bg-white p-5 shadow-2xl">
                        <header className="mb-4 flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-800">
                                    Prezenta - {openSubject.name}
                                </h2>
                                <p className="text-xs text-gray-500">{openSubject.professor}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpenSubjectId(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X size={16} />
                            </button>
                        </header>

                        <div className="space-y-3">
                            {openSubject.attendance
                                .slice()
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((event, index) => (
                                    <article
                                        key={`${openSubject.id}-event-${index}`}
                                        className="rounded-xl border border-gray-100 p-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-gray-700">
                                                {formatDate(event.date)}
                                            </p>
                                            <span className="text-xs text-gray-400">{event.type}</span>
                                        </div>
                                        <span
                                            className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusPillClass(
                                                event.status
                                            )}`}
                                        >
                                            {event.status}
                                        </span>
                                    </article>
                                ))}
                        </div>
                    </section>
                </div>
            ) : null}
        </div>
    );
};

export default StudentCatalogPage;
