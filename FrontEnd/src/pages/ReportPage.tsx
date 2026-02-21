import { useState } from 'react';
import { MessageCircleWarning } from 'lucide-react';
import type { Report } from '../components/report/reportTypes';
import { MOCK_REPORTS } from '../components/report/reportTypes';
import ReportForm from '../components/report/ReportForm';
import ReportHistory from '../components/report/ReportHistory';
import ReportDetail from '../components/report/ReportDetail';

const ReportPage = () => {
    const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const handleSubmit = (report: Report) => {
        setReports(prev => [report, ...prev]);
    };

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                        <MessageCircleWarning size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Raportează o Problemă</h1>
                        <p className="text-gray-500 font-medium text-sm">Descrie problema și echipa noastră va analiza raportul tău.</p>
                    </div>
                </div>
            </header>

            {/* Detail view */}
            {selectedReport ? (
                <ReportDetail
                    report={selectedReport}
                    onBack={() => setSelectedReport(null)}
                />
            ) : (
                /* Form + History */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <ReportForm onSubmit={handleSubmit} />
                    <ReportHistory
                        reports={reports}
                        onSelect={setSelectedReport}
                        selectedId={null}
                    />
                </div>
            )}
        </div>
    );
};

export default ReportPage;
