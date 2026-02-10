import { CheckCircle, AlertTriangle, Calendar, FileText, Bell } from 'lucide-react';

const notificationsData = [
    {
        id: 1,
        type: 'grade',
        title: 'Notă nouă adăugată',
        message: 'Ai primit nota 10 la Programare Web.',
        time: 'Acum 2 minute',
        read: false,
        icon: <CheckCircle size={20} />,
        color: 'text-green-600',
        bg: 'bg-green-100'
    },
    {
        id: 2,
        type: 'alert',
        title: 'Termen limită apropiat',
        message: 'Proiectul la Baze de Date expiră mâine.',
        time: 'Acum 1 oră',
        read: false,
        icon: <AlertTriangle size={20} />,
        color: 'text-amber-600',
        bg: 'bg-amber-100'
    },
    {
        id: 3,
        type: 'schedule',
        title: 'Modificare orar',
        message: 'Cursul de Fizică s-a mutat în sala 305.',
        time: 'Ieri, 14:30',
        read: true,
        icon: <Calendar size={20} />,
        color: 'text-blue-600',
        bg: 'bg-blue-100'
    },
    {
        id: 4,
        type: 'info',
        title: 'Taxă școlară',
        message: 'Factura pentru semestrul 2 a fost emisă.',
        time: '2 zile în urmă',
        read: true,
        icon: <FileText size={20} />,
        color: 'text-violet-600',
        bg: 'bg-violet-100'
    }
];

const Notifications = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            {/* Header-ul Cardului */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bell className="text-slate-400" size={20} />
                    <h3 className="font-bold text-slate-800 text-lg">Notificări</h3>
                </div>
                <button className="text-xs font-semibold text-violet-600 hover:text-violet-800 hover:underline">
                    Marchează tot ca citit
                </button>
            </div>

            {/* Lista de notificări */}
            <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[400px]">
                {notificationsData.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-200 cursor-pointer hover:bg-slate-50 ${!notification.read ? 'bg-violet-50/50' : 'bg-white'}`}
                    >
                        {/* Iconița colorată */}
                        <div className={`shrink-0 p-2.5 rounded-full ${notification.bg} ${notification.color}`}>
                            {notification.icon}
                        </div>

                        {/* Conținutul Text */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-bold ${!notification.read ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {notification.title}
                                </h4>
                                {!notification.read && (
                                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {notification.message}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                {notification.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Opțional */}
            <div className="p-4 border-t border-slate-100 mt-auto">
                <button className="w-full py-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
                    Vezi istoricul complet
                </button>
            </div>
        </div>
    );
};

export default Notifications;