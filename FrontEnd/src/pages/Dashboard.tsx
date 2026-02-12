import StatCard from "../components/StatCard.tsx";
import Schedule from "../components/Schedule.tsx";
import Notifications from "../components/Notifications.tsx";
import PerformanceChart from "../components/PerformanceChart.tsx";
import UpcomingEvents from "../components/UpcomingEvents.tsx";
import ActiveProjects from "../components/ActiveProjects.tsx";

const Dashboard = () => {
    return (
        <div className="w-full min-h-screen p-4 md:p-8 lg:p-10">
            <div className="max-w-[1600px] mx-auto flex flex-col space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Bun venit, Cristian 👋
                        </h1>
                        <p className="text-slate-500 font-medium text-left">
                            Student · Anul II · TI
                        </p>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 text-slate-600 bg-white p-3 px-5 rounded-xl shadow-sm border border-slate-100 w-full md:w-auto justify-between md:justify-start">
                        <span className="font-medium text-sm md:text-base">📅 Luni, 12 Februarie</span>
                        <button className="relative p-1 hover:bg-slate-50 rounded-full transition-colors">
                            <span className="text-xl">🔔</span>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                                3
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard title="Media generală" value="8.42" />
                    <StatCard title="Absențe" value="6" />
                    <StatCard title="Ore azi" value="5" />
                    <StatCard title="Evaluări" value="2" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                    <div className="xl:col-span-2 flex flex-col gap-6 md:gap-8">
                        <Schedule />
                        <ActiveProjects />
                        <PerformanceChart />
                    </div>

                    <div className="w-full flex flex-col gap-6 md:gap-8">
                        <Notifications />
                        <UpcomingEvents />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;