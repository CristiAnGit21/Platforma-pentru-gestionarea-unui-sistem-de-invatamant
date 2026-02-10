import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Iun', val: 8.5 },
    { name: 'Iul', val: 8.7 },
    { name: 'Aug', val: 8.8 },
    { name: 'Sep', val: 8.6 },
    { name: 'Oct', val: 9.0 },
    { name: 'Nov', val: 9.2 },
    { name: 'Dec', val: 9.4 },
];

const PerformanceChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Evoluția Performantei</h3>
                <select className="text-sm bg-slate-50 border-none rounded-lg p-1 text-slate-600 outline-none">
                    <option>Semestrul 1</option>
                </select>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis domain={[7.0, 9.5]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceChart;