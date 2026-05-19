import { Clock } from 'lucide-react';

const UpcomingEvents = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full lg:w-[350px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <Clock size={20} className="text-blue-500" />
                <h3 className="font-bold text-slate-800 text-lg">Urmează</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-gray-300">
                <Clock size={32} className="mb-2" />
                <p className="text-sm font-medium">Nu există evenimente</p>
            </div>
        </div>
    );
};

export default UpcomingEvents;
