import type { StudentSummary } from "./types";

type Props = {
    summary: StudentSummary;
};

const chipStyle = "inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600";

const AcademicSummaryCard = ({ summary }: Props) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-800">Situatie academica</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Rezumat rapid pentru prezenta, credite si risc absente.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className={chipStyle}>Prezenta: {summary.attendancePercent}%</span>
                    <span className={chipStyle}>Credite: {summary.creditsEarned} / {summary.creditsTotal}</span>
                    <span className={chipStyle}>Risc absente: {summary.absenceRisk}</span>
                </div>
            </div>
        </div>
    );
};

export default AcademicSummaryCard;
