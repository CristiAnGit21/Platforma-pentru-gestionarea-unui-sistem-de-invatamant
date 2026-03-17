import SectionCard from "./SectionCard";
import type { DeadlineSeverity, StudentDeadline } from "./types";

type Props = {
    deadlines: StudentDeadline[];
    onOpenCalendar: () => void;
};

const severityColor: Record<DeadlineSeverity, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
};

const DeadlinesCard = ({ deadlines, onOpenCalendar }: Props) => {
    return (
        <SectionCard title="Termene si taskuri" actionLabel="Calendar ->" onAction={onOpenCalendar}>
            <div className="space-y-3">
                {deadlines.map((deadline) => (
                    <div key={`${deadline.title}-${deadline.due}`} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className={`inline-block h-2.5 w-2.5 rounded-full ${severityColor[deadline.severity]}`} />
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900">{deadline.title}</p>
                                <p className="text-sm text-gray-500">{deadline.due}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Detalii
                        </button>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

export default DeadlinesCard;
