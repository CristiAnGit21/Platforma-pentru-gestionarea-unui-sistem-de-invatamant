import NavBar from "../components/NavBar.tsx";
import {useState} from "react";
import StatCard from "../components/StatCard.tsx";
import Schedule from "../components/Schedule.tsx";
import Notifications from "../components/Notifications.tsx";

const Dashboard = () => {
    const [selectedPage, setSelectedPage] = useState<string>("acasa");
    
    return (
        <div className="flex h-screen bg-violet-50">
            <NavBar
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
            />

            <main className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Bun venit, Cristian 👋</h1>
                        <p className="text-gray-500">
                            Student · Anul II · TI</p>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600">
                        <span>📅 
                            Luni, 12 Februarie</span>
                        <button className="relative">
                            🔔
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                      3
                            </span>
                        </button>
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Media generală" value="8.42" />
                    <StatCard title="Absențe" value="6" />
                    <StatCard title="Ore azi" value="5" />
                    <StatCard title="Evaluări" value="2" />
                </div>

                {/* ORAR + NOTIFICARI */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Schedule/>
                    </div>
                    <Notifications />
                </div>

                
            </main>
            
        </div>

    );
};

export default Dashboard;
