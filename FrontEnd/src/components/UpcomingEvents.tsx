const events = [
    { title: "Examen Matematică", time: "Examen • Mâine, 09:00", color: "bg-red-400" },
    { title: "Laborator Fizică", time: "Curs • Joi, 14:00", color: "bg-blue-500" },
    { title: "Proiect React", time: "Tema • 15 Feb, 23:59", color: "bg-red-400" },
];

const UpcomingEvents = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full lg:w-[350px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-blue-500 text-xl">🕒</span>
                <h3 className="font-bold text-slate-800 text-lg">Urmează</h3>
            </div>

            <div className="space-y-6 flex-1">
                {events.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${event.color}`} />
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{event.title}</h4>
                            <p className="text-xs text-slate-400">{event.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-8 text-blue-600 font-bold text-sm hover:underline w-full text-center">
                Vezi Tot Calendarul
            </button>
        </div>
    );
};

export default UpcomingEvents;