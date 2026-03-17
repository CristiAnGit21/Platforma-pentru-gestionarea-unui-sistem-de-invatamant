import SectionCard from "./SectionCard";
import type { StudentGrade } from "./types";

type Props = {
    grades: StudentGrade[];
    onOpenCatalog: () => void;
};

const RecentGradesCard = ({ grades, onOpenCatalog }: Props) => {
    return (
        <SectionCard title="Note recente" actionLabel="Catalog ->" onAction={onOpenCatalog}>
            <div className="space-y-3">
                {grades.map((grade) => (
                    <div key={`${grade.subject}-${grade.date}`} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                        <div>
                            <p className="font-semibold text-gray-900">{grade.subject}</p>
                            <p className="text-sm text-gray-500">{grade.date}</p>
                        </div>
                        <span className="rounded-xl bg-gray-900 px-3 py-1.5 text-sm font-bold text-white">{grade.value}</span>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

export default RecentGradesCard;
