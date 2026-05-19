import { BarChart3 } from 'lucide-react';

const PerformanceChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Evoluția Performanței</h3>
            </div>
            <div className="h-[250px] w-full flex flex-col items-center justify-center text-gray-300">
                <BarChart3 size={40} className="mb-2" />
                <p className="text-sm font-medium">Date indisponibile</p>
            </div>
        </div>
    );
};

export default PerformanceChart;
