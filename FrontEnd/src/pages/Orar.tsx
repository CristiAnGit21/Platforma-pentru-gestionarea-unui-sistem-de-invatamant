import { Clock, MapPin, User } from 'lucide-react';

const Orar = () => {
    const zile = ["Luni", "Marți", "Miercuri", "Joi", "Vineri"];
    const ore = ["08:00 - 09:30", "09:45 - 11:15", "11:30 - 13:00", "13:30 - 15:00"];

    const program = [
        { zi: "Luni", ora: "08:00 - 09:30", materie: "Programare Web", sala: "Sala 101", prof: "Dr. Popescu" },
        { zi: "Miercuri", ora: "11:30 - 13:00", materie: "Baze de Date", sala: "Sala 202", prof: "Conf. Ionescu" },
        { zi: "Vineri", ora: "09:45 - 11:15", materie: "Algoritmi", sala: "Laborator B", prof: "Lect. Radu" },
    ];

    return (
        <div className="p-8 w-full min-h-screen bg-gray-50/50">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Orar Semestrul II</h1>
                <p className="text-gray-500 italic">Vizualizarea cursurilor și laboratoarelor săptămânale</p>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed border-collapse">
                        <thead>
                        <tr className="bg-violet-50/50">
                            <th className="w-48 p-5 border-b border-gray-100 text-center text-violet-700 font-bold uppercase text-xs tracking-wider">
                                Interval Orar
                            </th>
                            {zile.map(zi => (
                                <th key={zi} className="p-5 border-b border-gray-100 text-center text-violet-700 font-bold uppercase text-xs tracking-wider">
                                    {zi}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {ore.map((interval) => (
                            <tr key={interval} className="h-32">
                                <td className="border-b border-r border-gray-50 p-4">
                                    <div className="flex items-center justify-center gap-2 text-gray-500 font-semibold text-sm bg-gray-50/50 rounded-xl py-3 px-2">
                                        <Clock size={16} className="text-violet-400" />
                                        {interval}
                                    </div>
                                </td>
                                {zile.map(zi => {
                                    const curs = program.find(p => p.zi === zi && p.ora === interval);
                                    return (
                                        <td key={zi} className="border-b border-r border-gray-50 p-2 align-middle">
                                            {curs ? (
                                                <div className="h-full w-full bg-violet-100/40 p-3 rounded-2xl border border-violet-200/50 flex flex-col justify-center shadow-sm">
                                                    <h4 className="font-bold text-violet-900 text-sm leading-tight mb-2 line-clamp-2">{curs.materie}</h4>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-violet-700/80">
                                                            <MapPin size={10} strokeWidth={2.5} /> {curs.sala}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-violet-700/80">
                                                            <User size={10} strokeWidth={2.5} /> {curs.prof}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full w-full rounded-2xl border border-transparent" />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orar;