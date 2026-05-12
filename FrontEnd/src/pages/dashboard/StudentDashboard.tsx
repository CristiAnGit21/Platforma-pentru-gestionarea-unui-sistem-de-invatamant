import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthSession } from "../../auth/storage";
import { useApi } from "../../providers/AxiosProvider";
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
    stats: { average: 0, todayCourses: 0, unreadNotifications: 0, debtsLei: 0 },
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
                const [gradesRes, attendanceRes, subjectsRes, userRes, eventsRes] = await Promise.all([
                    api.get(`/grade/student/${userId}`),
                    api.get(`/attendance/student/${userId}`),
                    api.get('/subject'),
                    api.get(`/user/${userId}`),
                    api.get('/event'),
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
                    stats: { average, todayCourses: todayEvents.length, unreadNotifications: 0, debtsLei: 0 },
                    today: todayEvents,
                    recentGrades,
                    deadlines: [],
                    notifications: [],
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
