import type { StudentStats } from "./types";

type Props = {
    stats: StudentStats;
};

const statsConfig = (stats: StudentStats) => [
    { label: "Media generala", value: stats.average.toFixed(2) },
    { label: "Cursuri azi", value: String(stats.todayCourses) },
    { label: "Notificari noi", value: String(stats.unreadNotifications) },
    { label: "Datorii (lei)", value: String(stats.debtsLei) },
];

const StatsGrid = ({ stats }: Props) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {statsConfig(stats).map((item) => (
                <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-800">{item.value}</p>
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
