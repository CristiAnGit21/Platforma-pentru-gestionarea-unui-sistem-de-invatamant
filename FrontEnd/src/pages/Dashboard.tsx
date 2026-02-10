import StatCard from "../components/StatCard.tsx";
import Schedule from "../components/Schedule.tsx";
import Notifications from "../components/Notifications.tsx";
import PerformanceChart from "../components/PerformanceChart.tsx";
import UpcomingEvents from "../components/UpcomingEvents.tsx";
import ActiveProjects from "../components/ActiveProjects.tsx";

const Dashboard = () => {
    return (
        <div className="w-full flex flex-col space-y-8">
            <div className="flex justify-between items-center">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Bun venit, Cristian 👋
                    </h1>
                    <p className="text-slate-500 font-medium text-left">
                        Student · Anul II · TI
                    </p>
                </div>

                <div className="flex items-center gap-6 text-slate-600 bg-white p-3 px-5 rounded-xl shadow-sm border border-slate-100">
                    <span className="font-medium">📅 Luni, 12 Februarie</span>
                    <button className="relative p-1 hover:bg-slate-50 rounded-full transition-colors">
                        <span className="text-xl">🔔</span>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                            3
                        </span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Media generală" value="8.42" />
                <StatCard title="Absențe" value="6" />
                <StatCard title="Ore azi" value="5" />
                <StatCard title="Evaluări" value="2" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <Schedule />
                    <ActiveProjects />
                    <PerformanceChart />
                </div>

                <div className="w-full flex flex-col gap-8">
                    <Notifications />
                    <UpcomingEvents />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;