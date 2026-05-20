import { useEffect, useState } from "react";
import { CircleDollarSign, FileText, Download, Eye, Loader2, AlertCircle } from "lucide-react";
import { useApi } from "../providers/AxiosProvider";
import { getAuthSession } from "../auth/storage";

interface ContractInfo {
    id: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("ro-RO", {
        year: "numeric", month: "long", day: "numeric",
    });
}

function FinancialStatus() {
    const api = useApi();
    const session = getAuthSession();
    const userId = session?.user.id;

    const [contract, setContract] = useState<ContractInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) { setLoading(false); return; }
        api.get(`/contract/student/${userId}`)
            .then(res => {
                const data = res.data?.data ?? res.data;
                setContract(data ?? null);
            })
            .catch(() => setContract(null))
            .finally(() => setLoading(false));
    }, [userId]);

    const handleView = async () => {
        if (!contract) return;
        setLoadingPdf(true);
        setPdfError(null);
        try {
            const res = await api.get(`/contract/${contract.id}/file`, { responseType: "blob" });
            const blob = new Blob([res.data as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch {
            setPdfError("Nu s-a putut încărca contractul. Încercați din nou.");
        } finally {
            setLoadingPdf(false);
        }
    };

    const handleDownload = async () => {
        if (!contract) return;
        const res = await api.get(`/contract/${contract.id}/file`, { responseType: "blob" });
        const blob = new Blob([res.data as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = contract.fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            <header className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <CircleDollarSign size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Situația financiară</h1>
                        <p className="text-gray-500 font-medium text-sm">Contractul de studii și taxele asociate.</p>
                    </div>
                </div>
            </header>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 md:p-5 mb-6">
                <p className="text-sm text-blue-900 leading-relaxed uppercase tracking-wide">
                    Această pagină conține date cu caracter personal, prelucrate în cadrul sistemului de evidență.
                    Prelucrarea ulterioară a acestor date poate fi efectuată doar în condițiile prevăzute de lege.
                </p>
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center py-20">
                    <Loader2 size={24} className="animate-spin text-blue-400" />
                </div>
            ) : !contract ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20">
                    <AlertCircle size={40} className="text-gray-200 mb-3" />
                    <p className="font-bold text-gray-400 text-sm">Contract nedisponibil</p>
                    <p className="text-xs text-gray-300 mt-1">Contactați secretariatul pentru a vă elibera contractul.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-red-50 text-red-500">
                                    <FileText size={28} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-base">{contract.fileName}</p>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        {formatBytes(contract.fileSize)} · Încărcat pe {formatDate(contract.uploadedAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => void handleView()}
                                    disabled={loadingPdf}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                                >
                                    {loadingPdf ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                                    Vizualizează
                                </button>
                                <button
                                    onClick={() => void handleDownload()}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    <Download size={14} />
                                    Descarcă
                                </button>
                            </div>
                        </div>
                    </div>

                    {pdfError && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                            <AlertCircle size={16} className="shrink-0" />
                            {pdfError}
                        </div>
                    )}

                    {pdfUrl && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                                <span className="text-sm font-semibold text-gray-700">{contract.fileName}</span>
                                <button
                                    onClick={() => { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }}
                                    className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                    Închide
                                </button>
                            </div>
                            <iframe
                                src={pdfUrl}
                                className="w-full"
                                style={{ height: "75vh" }}
                                title="Contract de studii"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FinancialStatus;
