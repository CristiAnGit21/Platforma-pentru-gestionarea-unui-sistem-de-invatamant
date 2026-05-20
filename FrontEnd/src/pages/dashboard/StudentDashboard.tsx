import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthSession } from "../../auth/storage";
import { useApi } from "../../providers/AxiosProvider";
import type { NotificationTag } from "../../components/student-dashboard/types";
import AcademicSummaryCard from "../../components/student-dashboard/AcademicSummaryCard";
import DeadlinesCard from "../../components/student-dashboard/DeadlinesCard";
import NotificationsPreviewCard from "../../components/student-dashboard/NotificationsPreviewCard";
import RecentGradesCard from "../../components/student-dashboard/RecentGradesCard";
import StatsGrid from "../../components/student-dashboard/StatsGrid";
import TodayScheduleCard from "../../components/student-dashboard/TodayScheduleCard";
import WelcomeCard from "../../components/student-dashboard/WelcomeCard";
import type { StudentDashboardData } from "../../components/student-dashboard/types";

const EMPTY_DATA: StudentDashboardData = {
    summary: {
        group: "—",
        year: 0,
        semester: 1,
        progressPercent: 0,
        progressLabel: "—",
        attendancePercent: 0,
        creditsEarned: 0,
        creditsTotal: 60,
        absenceRisk: "—",
    },
    stats: { average: 0, todayCourses: 0, unreadNotifications: 0, absences: 0 },
    today: [],
    recentGrades: [],
    deadlines: [],
    notifications: [],
};

const StudentDashboard = () => {
    const navigate = useNavigate();
    const api = useApi();
    const session = getAuthSession();
    const studentName = session?.user.name ?? "Student";
    const userId = session?.user.id;

    const [data, setData] = useState<StudentDashboardData>(EMPTY_DATA);

    useEffect(() => {
        if (!userId) return;
        void (async () => {
            try {
                const [gradesRes, attendanceRes, subjectsRes, userRes, eventsRes, notifRes] = await Promise.all([
                    api.get(`/grade/student/${userId}`),
                    api.get(`/attendance/student/${userId}`),
                    api.get('/subject'),
                    api.get(`/user/${userId}`),
                    api.get('/event'),
                    api.get('/notification'),
                ]);

                const grades: { id: string; value: number; date: string; subjectId: string }[] =
                    gradesRes.data?.data ?? gradesRes.data ?? [];
                const attendance: { date: string; present: boolean }[] =
                    attendanceRes.data?.data ?? attendanceRes.data ?? [];
                const subjects: { id: string; name: string }[] =
                    subjectsRes.data?.data ?? subjectsRes.data ?? [];
                const userInfo: { groupId?: string } =
                    userRes.data?.data ?? userRes.data ?? {};
                const events: { id: string; title: string; date: string; startTime: string; location: string; type: string }[] =
                    eventsRes.data?.data ?? eventsRes.data ?? [];
                const rawNotifs: { id: string; title: string; message: string; type: string; createdAt: string }[] =
                    notifRes.data?.data ?? notifRes.data ?? [];

                const readIds: Set<string> = (() => {
                    try {
                        const raw = localStorage.getItem('notif_read_ids');
                        return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
                    } catch { return new Set<string>(); }
                })();

                const typeToTag = (t: string): NotificationTag => {
                    const map: Record<string, NotificationTag> = {
                        nota: 'Note', alerta: 'Alerte', orar: 'Orar',
                        financiar: 'Financiar', absenta: 'Absente',
                    };
                    return map[t] ?? 'Note';
                };

                const notifTimeAgo = (iso: string) => {
                    const diff = Date.now() - new Date(iso).getTime();
                    const mins = Math.floor(diff / 60000);
                    if (mins < 1) return 'Acum';
                    if (mins < 60) return `Acum ${mins} min`;
                    const hours = Math.floor(mins / 60);
                    if (hours < 24) return `Acum ${hours}h`;
                    return `Acum ${Math.floor(hours / 24)} zile`;
                };

                const unreadCount = rawNotifs.filter(n => !readIds.has(n.id)).length;

                const previewNotifs = rawNotifs
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map(n => ({
                        title: n.title,
                        description: n.message,
                        tag: typeToTag(n.type),
                        time: notifTimeAgo(n.createdAt),
                        unread: !readIds.has(n.id),
                    }));

                const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s.name]));

                const totalGrades = grades.length;
                const average = totalGrades > 0
                    ? Math.round((grades.reduce((sum, g) => sum + g.value, 0) / totalGrades) * 100) / 100
                    : 0;

                const totalAtt = attendance.length;
                const presentCount = attendance.filter(a => a.present).length;
                const attendancePercent = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0;

                const todayStr = new Date().toISOString().split('T')[0];
                const todayEvents = events
                    .filter(e => e.date.split('T')[0] === todayStr)
                    .map(e => ({
                        time: e.startTime,
                        subject: e.title,
                        room: e.location,
                        type: "Curs" as const,
                        status: "upcoming" as const,
                    }));

                const recentGrades = grades
                    .slice()
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map(g => ({
                        subject: subjectMap[g.subjectId] ?? 'Disciplina',
                        value: g.value,
                        date: new Date(g.date).toLocaleDateString('ro-RO'),
                    }));

                let groupName = '—';
                let studyYear = 0;
                if (userInfo.groupId) {
                    try {
                        const groupRes = await api.get(`/group/${userInfo.groupId}`);
                        const g = groupRes.data?.data ?? groupRes.data;
                        if (g) { groupName = g.name; studyYear = g.year as number; }
                    } catch { /* no group */ }
                }

                setData({
                    summary: {
                        group: groupName,
                        year: studyYear,
                        semester: 1,
                        progressPercent: 0,
                        progressLabel: '—',
                        attendancePercent,
                        creditsEarned: 0,
                        creditsTotal: 60,
                        absenceRisk: attendancePercent >= 75 ? 'Scazut' : 'Ridicat',
                    },
                    stats: { average, todayCourses: todayEvents.length, unreadNotifications: unreadCount, absences: attendance.filter(a => !a.present).length },
                    today: todayEvents,
                    recentGrades,
                    deadlines: [],
                    notifications: previewNotifs,
                });
            } catch (err) {
                console.error(err);
            }
        })();
    }, [userId]);

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <WelcomeCard
                            studentName={studentName}
                            summary={data.summary}
                            stats={data.stats}
                            actions={[
                                { label: "Vezi orarul", onClick: () => navigate("/student/orar"), primary: true },
                                { label: "Catalog note", onClick: () => navigate("/student/catalog") },
                                { label: "Situatie financiara", onClick: () => navigate("/student/situatia-financiara") },
                                { label: "Notificari", onClick: () => navigate("/student/notificari") },
                            ]}
                        />
                    </div>
                    <StatsGrid stats={data.stats} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <TodayScheduleCard courses={data.today} onOpenSchedule={() => navigate("/student/orar")} />
                    </div>
                    <NotificationsPreviewCard
                        notifications={data.notifications}
                        onOpenAll={() => navigate("/student/notificari")}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentGradesCard grades={data.recentGrades} onOpenCatalog={() => navigate("/student/catalog")} />
                    <DeadlinesCard deadlines={data.deadlines} onOpenCalendar={() => navigate("/student/orar")} />
                </div>

                <AcademicSummaryCard summary={data.summary} />
            </div>
        </div>
    );
};

export default StudentDashboard;
