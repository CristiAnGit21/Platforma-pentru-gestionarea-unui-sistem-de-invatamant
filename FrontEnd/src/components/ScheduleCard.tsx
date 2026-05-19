import { Clock } from 'lucide-react';

const Schedule = () => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Orar pentru astăzi</h2>
            <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                <Clock size={32} className="mb-2" />
                <p className="text-sm font-medium">Niciun curs programat</p>
            </div>
        </div>
    );
};

export default Schedule;
