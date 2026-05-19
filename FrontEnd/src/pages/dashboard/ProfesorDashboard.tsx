import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Bell, Users, MessageCircleWarning, ChevronRight,
    Clock, Calendar, Inbox
} from 'lucide-react';
import { getAuthSession } from '../../auth/storage';

const QUICK_CARDS = [
    {
        title: 'Catalog',
        path: '/profesor/catalog',
        icon: BookOpen,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
    },
    {
        title: 'Notificări',
        path: '/profesor/notificari',
        icon: Bell,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        title: 'Studenți',
        path: '/profesor/studenti',
        icon: Users,
        color: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        title: 'Raportează',
        path: '/profesor/raporteaza',
        icon: MessageCircleWarning,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    },
];

const ProfesorDashboard = () => {
    const navigate = useNavigate();
    const session = getAuthSession();
    const professorName = session?.user.name ?? 'Profesor';
    const today = new Date();
    const dateStr = today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {/* Header / Greeting */}
            <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Bună ziua, {professorName}!
                </h1>
                <p className="text-gray-500 font-medium text-sm mt-1 flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span className="capitalize">{dateStr}</span>
                </p>
            </header>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {QUICK_CARDS.map(card => {
                    const Ic = card.icon;
                    return (
                        <button key={card.title} onClick={() => navigate(card.path)}
                            className="bg-white rounded-2xl border border-gray-100 p-5 text-left transition-all hover:shadow-md hover:border-gray-200 active:scale-[0.98] group"
                        >
                            <div className={`inline-flex p-2.5 rounded-xl ${card.bg} ${card.color} mb-3`}>
                                <Ic size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm">{card.title}</h3>
                            <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Deschide <ChevronRight size={10} />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Activity — empty state */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-purple-500" />
                            <h2 className="font-bold text-gray-800 text-sm">Activitate Recentă</h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-14 text-gray-300">
                        <Inbox size={36} className="mb-2" />
                        <p className="text-sm font-medium">Nicio activitate recentă</p>
                    </div>
                </div>

                {/* Today's Schedule — empty state */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-purple-500" />
                            <h2 className="font-bold text-gray-800 text-sm">Orarul de Astăzi</h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-14 text-gray-300">
                        <Clock size={36} className="mb-2" />
                        <p className="text-sm font-medium">Niciun curs azi</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfesorDashboard;
