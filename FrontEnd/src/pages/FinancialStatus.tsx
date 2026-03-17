import { CircleDollarSign, Download, FileText } from "lucide-react";

type FinancialRow = {
  label: string;
  value: string;
};

const financialRows: FinancialRow[] = [
  { label: "Contract de studii", value: "FCIM-25-208 din 01.09.2025" },
  { label: "An studii", value: "2025/2026" },
  { label: "Tip finanțare", value: "De la bugetul de stat" },
  { label: "Taxa de studii", value: "0 lei" },
  { label: "Datorii taxa de studii", value: "0 lei" },
  { label: "Taxa suplimentara", value: "0 lei" },
  { label: "Datorii taxa suplimentara", value: "0 lei" },
];

function FinancialStatus() {
  return (
    <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <CircleDollarSign size={22} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Situația financiară</h1>
            <p className="text-gray-500 font-medium text-sm">Contractul de studii și taxele asociate.(doar front end-ul)</p>
          </div>
        </div>
      </header>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 md:p-5 mb-6">
        <p className="text-sm text-blue-900 leading-relaxed uppercase tracking-wide">
          Această pagină conține date cu caracter personal, prelucrate in cadrul sistemului de evidenta.
          Prelucrarea ulterioară a acestor date poate fi efectuată doar in condițiile prevăzute de lege.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-blue-600 text-white px-5 py-3 font-bold text-lg">Contract de studii</div>

        <div className="p-4 md:p-5 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-cyan-100 text-cyan-900 font-medium px-4 py-3">Vizualizare contract</div>
            <div className="bg-white px-4 py-3 font-semibold text-blue-600 flex items-center gap-2">
              <FileText size={16} />
              Fișierul contract
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-cyan-100 text-cyan-900 font-medium px-4 py-3">Stare contract</div>
            <div className="bg-white px-4 py-3 font-semibold text-gray-800">Semnat din 01.09.2025</div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
        <div className="space-y-2">
          {financialRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 sm:grid-cols-[260px_1fr] rounded-xl overflow-hidden border border-gray-100"
            >
              <div className="bg-gray-50 px-4 py-3 text-gray-700 font-medium">{row.label}</div>
              <div className="bg-white px-4 py-3 text-gray-800">{row.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Descarcă extras financiar
          </button>
        </div>
      </section>
    </div>
  );
}

export default FinancialStatus;
