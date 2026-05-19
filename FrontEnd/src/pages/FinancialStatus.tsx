import { CircleDollarSign } from "lucide-react";

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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20">
        <CircleDollarSign size={40} className="text-gray-200 mb-3" />
        <p className="font-bold text-gray-400 text-sm">Date indisponibile</p>
        <p className="text-xs text-gray-300 mt-1">Informațiile financiare nu sunt încă conectate.</p>
      </div>
    </div>
  );
}

export default FinancialStatus;
