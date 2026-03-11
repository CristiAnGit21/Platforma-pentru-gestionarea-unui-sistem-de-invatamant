import SectionCard from "./SectionCard";
import type { StudentCourse } from "./types";

type Props = {
    courses: StudentCourse[];
    onOpenSchedule: () => void;
};

const TodayScheduleCard = ({ courses, onOpenSchedule }: Props) => {
    const getContainerStyle = (status: StudentCourse["status"]) => {
        if (status === "now") {
            return "ring-2 ring-violet-500";
        }

        if (status === "done") {
            return "opacity-75";
        }

        return "";
    };

    const getBadgeStyle = (status: StudentCourse["status"]) => {
        if (status === "now") {
            return "bg-violet-50 text-violet-700 border-violet-200";
        }

        if (status === "done") {
            return "bg-gray-50 text-gray-600 border-gray-200";
        }

        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    };

    const getStatusText = (status: StudentCourse["status"]) => {
        if (status === "now") {
            return "Acum";
        }

        if (status === "done") {
            return "Trecut";
        }

        return "Urmeaza";
    };

    return (
        <SectionCard title="Orarul de azi" actionLabel="Vezi saptamana ->" onAction={onOpenSchedule}>
            <div className="space-y-3">
                {courses.map((course) => (
                    <div
                        key={`${course.time}-${course.subject}`}
                        className={`flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 ${getContainerStyle(course.status)}`}
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <p className="w-16 text-sm font-bold text-gray-900">{course.time}</p>
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900">{course.subject}</p>
                                <p className="text-sm text-gray-500">{course.room} - {course.type}</p>
                            </div>
                        </div>

                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getBadgeStyle(course.status)}`}>
                            {getStatusText(course.status)}
                        </span>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

export default TodayScheduleCard;
