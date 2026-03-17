import type { StudentStats, StudentSummary } from "./types";

type ActionButton = {
    label: string;
    onClick: () => void;
    primary?: boolean;
};

type Props = {
    studentName: string;
    summary: StudentSummary;
    stats: StudentStats;
    actions: ActionButton[];
};

const chipStyle = "inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600";

const WelcomeCard = ({ studentName, summary, stats, actions }: Props) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500">Dashboard student</p>
                    <h1 className="mt-1 text-2xl md:text-3xl font-bold text-gray-800">
                        Bun venit, {studentName}
                    </h1>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className={chipStyle}>Grupa: {summary.group}</span>
                        <span className={chipStyle}>Anul: {summary.year}</span>
                        <span className={chipStyle}>Semestru: {summary.semester}</span>
                    </div>
                </div>

                <div className="rounded-2xl bg-gray-900 px-4 py-3 text-white">
                    <p className="text-xs opacity-80">Astazi</p>
                    <p className="text-lg font-bold">{stats.todayCourses} cursuri</p>
                    <p className="text-xs opacity-80">{stats.unreadNotifications} notificari noi</p>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progres semestru</span>
                    <span className="font-semibold text-gray-800">{summary.progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${summary.progressPercent}%` }} />
                </div>
                <p className="mt-2 text-xs text-gray-500">{summary.progressLabel}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={action.onClick}
                        className={action.primary
                            ? "rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                            : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WelcomeCard;
