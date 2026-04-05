import { useEffect, useState } from 'react';
import { MessageCircleWarning } from 'lucide-react';
import type { Report } from '../components/report/reportTypes';
import ReportForm from '../components/report/ReportForm';
import ReportHistory from '../components/report/ReportHistory';
import ReportDetail from '../components/report/ReportDetail';
import { useApi } from '../providers/AxiosProvider';

const ReportPage = () => {
    const api = useApi();
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const res = await api.get('/report');
            const data = res.data?.data ?? res.data ?? [];
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Eroare la încărcarea rapoartelor:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchReports();
    }, []);

    const handleSubmit = async (report: Report) => {
        try {
            await api.post('/report', {
                category: report.category,
                subject: report.subject,
                description: report.description,
                priority: report.priority,
                anonymous: report.anonymous,
            });
            await fetchReports();
        } catch (err) {
            console.error('Eroare la trimiterea raportului:', err);
        }
    };

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
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

            {selectedReport ? (
                <ReportDetail
                    report={selectedReport}
                    onBack={() => setSelectedReport(null)}
                />
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <ReportForm onSubmit={handleSubmit} />
                    {loading ? (
                        <div className="flex items-center justify-center h-48 text-gray-400">Se încarcă rapoartele...</div>
                    ) : (
                        <ReportHistory
                            reports={reports}
                            onSelect={setSelectedReport}
                            selectedId={null}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportPage;