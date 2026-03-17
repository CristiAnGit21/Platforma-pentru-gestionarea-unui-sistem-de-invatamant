import { useNavigate } from "react-router-dom";
import { getAuthSession } from "../../auth/storage";
import AcademicSummaryCard from "../../components/elev-dashboard/AcademicSummaryCard";
import DeadlinesCard from "../../components/elev-dashboard/DeadlinesCard";
import { elevDashboardData } from "../../components/elev-dashboard/mockData";
import NotificationsPreviewCard from "../../components/elev-dashboard/NotificationsPreviewCard";
import RecentGradesCard from "../../components/elev-dashboard/RecentGradesCard";
import StatsGrid from "../../components/elev-dashboard/StatsGrid";
import TodayScheduleCard from "../../components/elev-dashboard/TodayScheduleCard";
import WelcomeCard from "../../components/elev-dashboard/WelcomeCard";

const ElevDashboard = () => {
    const navigate = useNavigate();
    const session = getAuthSession();
    const studentName = session?.user.name ?? "Elev";
    const data = elevDashboardData;

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
                                { label: "Vezi orarul", onClick: () => navigate("/elev/orar"), primary: true },
                                { label: "Catalog note", onClick: () => navigate("/elev/catalog") },
                                { label: "Situatie financiara", onClick: () => navigate("/elev/situatia-financiara") },
                                { label: "Notificari", onClick: () => navigate("/elev/notificari") },
                            ]}
                        />
                    </div>
                    <StatsGrid stats={data.stats} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <TodayScheduleCard courses={data.today} onOpenSchedule={() => navigate("/elev/orar")} />
                    </div>
                    <NotificationsPreviewCard
                        notifications={data.notifications}
                        onOpenAll={() => navigate("/elev/notificari")}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentGradesCard grades={data.recentGrades} onOpenCatalog={() => navigate("/elev/catalog")} />
                    <DeadlinesCard deadlines={data.deadlines} onOpenCalendar={() => navigate("/elev/orar")} />
                </div>

                <AcademicSummaryCard summary={data.summary} />
            </div>
        </div>
    );
};

export default ElevDashboard;
